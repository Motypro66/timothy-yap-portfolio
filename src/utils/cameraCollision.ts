import * as THREE from 'three'
import type { RoomLayout, RoomShot } from './roomScene'

const WALKABLE = ['floor', 'rug', 'carpet', 'entrance']
const IGNORE = ['ceiling', 'wallback', 'wallleft', 'wallright', 'window', 'glass', 'monitorscreen']

/** Treat furnished meshes as obstacles; skip thin screen glass and room shell. */
export function collectObstacleBoxes(root: THREE.Object3D, padding = 0.14): THREE.Box3[] {
  const boxes: THREE.Box3[] = []
  root.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return
    const name = child.name.toLowerCase()
    if (WALKABLE.some((token) => name.includes(token))) return
    if (IGNORE.some((token) => name.includes(token))) return

    child.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(child)
    const size = box.getSize(new THREE.Vector3())
    if (size.x < 0.02 && size.y < 0.02 && size.z < 0.02) return

    box.expandByScalar(padding)
    boxes.push(box)
  })
  return boxes
}

export function buildWalkVolume(layout: RoomLayout, margin = 0.28): THREE.Box3 {
  const { box, floor, ceiling } = layout
  return new THREE.Box3(
    new THREE.Vector3(box.min.x + margin, floor + 0.05, box.min.z + margin),
    new THREE.Vector3(box.max.x - margin, ceiling - 0.12, box.max.z - margin),
  )
}

function clampToWalkVolume(pos: THREE.Vector3, walk: THREE.Box3, eyeMin: number, eyeMax: number) {
  pos.x = THREE.MathUtils.clamp(pos.x, walk.min.x, walk.max.x)
  pos.y = THREE.MathUtils.clamp(pos.y, eyeMin, eyeMax)
  pos.z = THREE.MathUtils.clamp(pos.z, walk.min.z, walk.max.z)
}

function isInsideAny(pos: THREE.Vector3, obstacles: THREE.Box3[]) {
  return obstacles.some((box) => box.containsPoint(pos))
}

function minDistanceToBoxes(pos: THREE.Vector3, obstacles: THREE.Box3[]): number {
  let min = Infinity
  for (const box of obstacles) {
    const closest = new THREE.Vector3(
      THREE.MathUtils.clamp(pos.x, box.min.x, box.max.x),
      THREE.MathUtils.clamp(pos.y, box.min.y, box.max.y),
      THREE.MathUtils.clamp(pos.z, box.min.z, box.max.z),
    )
    min = Math.min(min, pos.distanceTo(closest))
  }
  return min
}

function pushOutsideBoxes(pos: THREE.Vector3, obstacles: THREE.Box3[], layout: RoomLayout) {
  const eyeMin = layout.floor + (layout.ceiling - layout.floor) * 0.48
  const eyeMax = layout.ceiling - 0.1

  for (let pass = 0; pass < 6; pass += 1) {
    let moved = false
    for (const box of obstacles) {
      if (!box.containsPoint(pos)) continue
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())
      const dx = pos.x - center.x
      const dz = pos.z - center.z
      const overlapX = size.x * 0.5 + 0.04 - Math.abs(dx)
      const overlapZ = size.z * 0.5 + 0.04 - Math.abs(dz)

      if (overlapX > 0 && overlapZ > 0) {
        if (overlapX < overlapZ) {
          pos.x = center.x + Math.sign(dx || 1) * (size.x * 0.5 + 0.28)
        } else {
          pos.z = center.z + Math.sign(dz || 1) * (size.z * 0.5 + 0.28)
        }
        moved = true
      }

      if (pos.y < box.max.y + 0.14) {
        pos.y = Math.max(pos.y, box.max.y + 0.14)
        moved = true
      }
    }
    if (!moved) break
  }

  pos.y = THREE.MathUtils.clamp(pos.y, eyeMin, eyeMax)
}

/** Step camera away from subject along view axis when furniture blocks the shot. */
function retreatAlongView(pos: THREE.Vector3, target: THREE.Vector3, obstacles: THREE.Box3[], minClear = 0.52) {
  const view = pos.clone().sub(target)
  if (view.lengthSq() < 1e-4) view.set(0, 0, 1)
  view.normalize()

  for (let i = 0; i < 28; i += 1) {
    if (!isInsideAny(pos, obstacles) && minDistanceToBoxes(pos, obstacles) >= minClear) return
    pos.addScaledVector(view, 0.1)
  }
}

function pushAwayFromTarget(
  pos: THREE.Vector3,
  target: THREE.Vector3,
  obstacles: THREE.Box3[],
  minClear: number,
) {
  if (minDistanceToBoxes(pos, obstacles) >= minClear && !isInsideAny(pos, obstacles)) return
  retreatAlongView(pos, target, obstacles, minClear)

  const away = pos.clone().sub(target)
  if (away.lengthSq() < 1e-4) away.set(0, 0, 1)
  away.normalize()
  for (let i = 0; i < 16; i += 1) {
    if (minDistanceToBoxes(pos, obstacles) >= minClear && !isInsideAny(pos, obstacles)) break
    pos.addScaledVector(away, 0.1)
  }
}

export function sanitizeCameraPath(
  shots: RoomShot[],
  layout: RoomLayout,
  obstacles: THREE.Box3[],
): RoomShot[] {
  const walk = buildWalkVolume(layout)
  const eyeMin = layout.floor + (layout.ceiling - layout.floor) * 0.48
  const eyeMax = layout.ceiling - 0.1

  return shots.map(({ pos, target, fov }) => {
    const p = new THREE.Vector3(...pos)
    const t = new THREE.Vector3(...target)

    clampToWalkVolume(p, walk, eyeMin, eyeMax)
    pushOutsideBoxes(p, obstacles, layout)
    retreatAlongView(p, t, obstacles, 0.52)
    pushAwayFromTarget(p, t, obstacles, 0.52)
    clampToWalkVolume(p, walk, eyeMin, eyeMax)

    clampToWalkVolume(t, walk, layout.floor + 0.2, eyeMax)
    return { pos: [p.x, p.y, p.z], target: [t.x, t.y, t.z], fov }
  })
}
