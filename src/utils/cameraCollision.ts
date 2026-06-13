import * as THREE from 'three'
import type { RoomLayout, RoomShot } from './roomScene'

const WALKABLE = ['floor', 'rug', 'carpet']
const IGNORE = ['ceiling', 'wallback', 'wallleft', 'wallright', 'window', 'glass']

/** Treat all furnished meshes as obstacles except floor, walls, ceiling, and window. */
export function collectObstacleBoxes(root: THREE.Object3D, padding = 0.12): THREE.Box3[] {
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

export function buildWalkVolume(layout: RoomLayout, margin = 0.22): THREE.Box3 {
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

function pushOutsideBoxes(pos: THREE.Vector3, obstacles: THREE.Box3[], layout: RoomLayout) {
  const eyeMin = layout.floor + (layout.ceiling - layout.floor) * 0.48
  const eyeMax = layout.ceiling - 0.1

  for (let pass = 0; pass < 4; pass += 1) {
    let moved = false
    for (const box of obstacles) {
      if (!box.containsPoint(pos)) continue
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())
      const dx = pos.x - center.x
      const dz = pos.z - center.z
      const overlapX = size.x * 0.5 + 0.02 - Math.abs(dx)
      const overlapZ = size.z * 0.5 + 0.02 - Math.abs(dz)

      if (overlapX > 0 && overlapZ > 0) {
        if (overlapX < overlapZ) {
          pos.x = center.x + Math.sign(dx || 1) * (size.x * 0.5 + 0.22)
        } else {
          pos.z = center.z + Math.sign(dz || 1) * (size.z * 0.5 + 0.22)
        }
        moved = true
      }

      if (pos.y < box.max.y + 0.12) {
        pos.y = Math.max(pos.y, box.max.y + 0.12)
        moved = true
      }
    }
    if (!moved) break
  }

  pos.y = THREE.MathUtils.clamp(pos.y, eyeMin, eyeMax)
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

function pushAwayFromTarget(
  pos: THREE.Vector3,
  target: THREE.Vector3,
  obstacles: THREE.Box3[],
  minClear: number,
) {
  if (minDistanceToBoxes(pos, obstacles) >= minClear) return
  const away = pos.clone().sub(target)
  if (away.lengthSq() < 1e-4) away.set(0, 0, 1)
  away.normalize()
  for (let i = 0; i < 12; i += 1) {
    pos.addScaledVector(away, 0.12)
    if (minDistanceToBoxes(pos, obstacles) >= minClear) break
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
    pushAwayFromTarget(p, t, obstacles, 0.48)
    clampToWalkVolume(p, walk, eyeMin, eyeMax)

    clampToWalkVolume(t, walk, layout.floor + 0.2, eyeMax)
    return { pos: [p.x, p.y, p.z], target: [t.x, t.y, t.z], fov }
  })
}
