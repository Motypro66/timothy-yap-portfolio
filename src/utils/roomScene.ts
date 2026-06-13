import * as THREE from 'three'

export type RoomShot = {
  pos: [number, number, number]
  target: [number, number, number]
  fov: number
}

export type RoomLayout = {
  box: THREE.Box3
  floor: number
  ceiling: number
  eye: number
  look: number
  desk: THREE.Vector3
  monitor: THREE.Vector3
  window: THREE.Vector3
  shelf: THREE.Vector3
  entranceZ: number
  backZ: number
  center: THREE.Vector3
}

const SECTION_T = [0, 0.18, 0.28, 0.38, 0.48, 0.58, 0.68, 0.76, 0.86, 1] as const

function findMesh(root: THREE.Object3D, name: string): THREE.Mesh | null {
  let found: THREE.Mesh | null = null
  root.traverse((child) => {
    if (found) return
    if (child instanceof THREE.Mesh && child.name === name) found = child
  })
  return found
}

function meshCenter(root: THREE.Object3D, name: string, fallback: THREE.Vector3): THREE.Vector3 {
  const mesh = findMesh(root, name)
  if (!mesh) return fallback.clone()
  mesh.updateMatrixWorld(true)
  return new THREE.Box3().setFromObject(mesh).getCenter(new THREE.Vector3())
}

function meshFloorY(root: THREE.Object3D, box: THREE.Box3): number {
  const floor = findMesh(root, 'Floor')
  if (!floor) return box.min.y
  floor.updateMatrixWorld(true)
  return new THREE.Box3().setFromObject(floor).max.y
}

function meshCeilingY(root: THREE.Object3D, box: THREE.Box3): number {
  const ceiling = findMesh(root, 'Ceiling')
  if (!ceiling) return box.max.y
  ceiling.updateMatrixWorld(true)
  return new THREE.Box3().setFromObject(ceiling).min.y
}

/** Fit exported Blender room into consistent world space; align real floor to y=0. */
export function normalizeRoom(root: THREE.Object3D, targetSize = 6.4) {
  root.updateMatrixWorld(true)

  const lights: THREE.Light[] = []
  root.traverse((child) => {
    if (child instanceof THREE.Light) lights.push(child)
  })
  for (const light of lights) {
    light.parent?.remove(light)
  }

  const box = new THREE.Box3().setFromObject(root)
  if (box.isEmpty()) return new THREE.Box3()

  const size = box.getSize(new THREE.Vector3())
  const maxDim = Math.max(size.x, size.y, size.z)
  root.scale.setScalar(targetSize / maxDim)
  root.updateMatrixWorld(true)

  const scaled = new THREE.Box3().setFromObject(root)
  const center = scaled.getCenter(new THREE.Vector3())
  root.position.x -= center.x
  root.position.z -= center.z
  root.updateMatrixWorld(true)

  const floorY = meshFloorY(root, scaled)
  root.position.y -= floorY
  root.rotation.y = 0
  root.updateMatrixWorld(true)

  return new THREE.Box3().setFromObject(root)
}

export function analyzeRoomLayout(root: THREE.Object3D, box: THREE.Box3): RoomLayout {
  const center = box.getCenter(new THREE.Vector3())
  const size = box.getSize(new THREE.Vector3())
  const floor = meshFloorY(root, box)
  const ceiling = meshCeilingY(root, box)
  const interiorHeight = Math.max(1.8, ceiling - floor)

  const desk = meshCenter(root, 'DeskTop', new THREE.Vector3(center.x, floor + interiorHeight * 0.28, center.z - size.z * 0.08))
  const monitor = meshCenter(
    root,
    'MonitorScreen',
    new THREE.Vector3(desk.x, desk.y + interiorHeight * 0.18, desk.z - 0.08),
  )
  const window = meshCenter(
    root,
    'WindowGlass',
    new THREE.Vector3(box.max.x - size.x * 0.08, floor + interiorHeight * 0.58, center.z - size.z * 0.18),
  )
  const shelf = meshCenter(
    root,
    'Shelf',
    new THREE.Vector3(box.min.x + size.x * 0.18, floor + interiorHeight * 0.38, box.min.z + size.z * 0.28),
  )

  const eye = floor + interiorHeight * 0.58
  const look = floor + interiorHeight * 0.4
  const entranceZ = box.min.z + size.z * 0.14
  const backZ = box.max.z - size.z * 0.12

  return {
    box,
    floor,
    ceiling,
    eye,
    look,
    desk,
    monitor,
    window,
    shelf,
    entranceZ,
    backZ,
    center,
  }
}

function clampInside(box: THREE.Box3, x: number, y: number, z: number, margin = 0.14) {
  return {
    x: THREE.MathUtils.clamp(x, box.min.x + margin, box.max.x - margin),
    y: THREE.MathUtils.clamp(y, box.min.y + margin, box.max.y - margin),
    z: THREE.MathUtils.clamp(z, box.min.z + margin, box.max.z - margin),
  }
}

function shot(
  layout: RoomLayout,
  pos: [number, number, number],
  target: [number, number, number],
  fov: number,
): RoomShot {
  const p = clampInside(layout.box, pos[0], pos[1], pos[2])
  const t = clampInside(layout.box, target[0], target[1], target[2], 0.1)
  return { pos: [p.x, p.y, p.z], target: [t.x, t.y, t.z], fov }
}

function ensureMinDistance(
  pos: THREE.Vector3,
  target: THREE.Vector3,
  minDist: number,
  fallbackDir: THREE.Vector3,
): THREE.Vector3 {
  if (pos.distanceTo(target) >= minDist) return pos.clone()
  const dir = pos.clone().sub(target)
  if (dir.lengthSq() < 1e-6) {
    dir.copy(fallbackDir)
  }
  return target.clone().add(dir.normalize().multiplyScalar(minDist))
}

/** Director path from room landmarks — standing eye height, always looking at workspace props. */
export function buildCameraPathFromLayout(layout: RoomLayout): RoomShot[] {
  const { box, eye, look, desk, monitor, window, shelf, entranceZ, backZ, center } = layout
  const size = box.getSize(new THREE.Vector3())
  const xL = box.min.x + size.x * 0.2
  const xR = box.max.x - size.x * 0.2
  const zMid = center.z
  const minTravel = Math.max(1.8, size.z * 0.42)
  const intoRoom = new THREE.Vector3(0, 0, 1)

  const heroTarget = new THREE.Vector3(center.x, look, zMid - size.z * 0.06)
  const heroPos = ensureMinDistance(
    new THREE.Vector3(center.x, eye, entranceZ),
    heroTarget,
    minTravel,
    intoRoom,
  )

  const deskSide = ensureMinDistance(
    new THREE.Vector3(desk.x + size.x * 0.14, eye, desk.z + size.z * 0.28),
    monitor,
    minTravel * 0.55,
    intoRoom,
  )

  return [
    shot(layout, [heroPos.x, heroPos.y, heroPos.z], [heroTarget.x, heroTarget.y, heroTarget.z], 64),
    shot(layout, [center.x + size.x * 0.04, eye, entranceZ + size.z * 0.22], [desk.x, look, desk.z], 54),
    shot(layout, [xR, eye, zMid], [desk.x, look, monitor.z], 50),
    shot(layout, [xR, eye, backZ - size.z * 0.08], [shelf.x, look, shelf.z], 46),
    shot(layout, [deskSide.x, eye, deskSide.z], [monitor.x, monitor.y, monitor.z], 44),
    shot(layout, [center.x, eye, zMid], [window.x, look, window.z], 40),
    shot(layout, [xL, eye, zMid], [desk.x, look, monitor.z], 38),
    shot(layout, [xL, eye, backZ - size.z * 0.05], [shelf.x, look + size.y * 0.02, shelf.z], 36),
    shot(layout, [xR, eye, entranceZ + size.z * 0.32], [monitor.x, monitor.y, monitor.z], 34),
    shot(layout, [center.x, eye, entranceZ + size.z * 0.12], [desk.x, look, desk.z], 32),
  ]
}

export function buildCameraPathFromBounds(box: THREE.Box3): RoomShot[] {
  const center = box.getCenter(new THREE.Vector3())
  const size = box.getSize(new THREE.Vector3())
  const floor = box.min.y
  const interiorHeight = Math.max(1.8, size.y * 0.62)
  const layout: RoomLayout = {
    box,
    floor,
    ceiling: floor + interiorHeight,
    eye: floor + interiorHeight * 0.56,
    look: floor + interiorHeight * 0.4,
    desk: new THREE.Vector3(center.x, floor + interiorHeight * 0.28, center.z - size.z * 0.08),
    monitor: new THREE.Vector3(center.x, floor + interiorHeight * 0.46, center.z - size.z * 0.12),
    window: new THREE.Vector3(box.max.x - size.x * 0.08, floor + interiorHeight * 0.58, center.z),
    shelf: new THREE.Vector3(box.min.x + size.x * 0.18, floor + interiorHeight * 0.38, box.min.z + size.z * 0.28),
    entranceZ: box.min.z + size.z * 0.14,
    backZ: box.max.z - size.z * 0.12,
    center,
  }
  return buildCameraPathFromLayout(layout)
}

export function defaultCameraPath(): RoomShot[] {
  return buildCameraPathFromBounds(new THREE.Box3(new THREE.Vector3(-3, 0, -3), new THREE.Vector3(3, 3, 3)))
}

export function sectionTimes() {
  return SECTION_T
}

export function polishRoomMaterials(root: THREE.Object3D) {
  root.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return

    child.castShadow = true
    child.receiveShadow = true

    const materials = Array.isArray(child.material) ? child.material : [child.material]
    const name = child.name.toLowerCase()

    for (const material of materials) {
      if (!(material instanceof THREE.MeshStandardMaterial)) continue

      if (name.includes('screen') || (name.includes('monitor') && !name.includes('stand'))) {
        material.emissive.set('#5bb5e8')
        material.emissiveIntensity = 2.2
        material.roughness = 0.12
        continue
      }

      if (name.includes('window') || name.includes('glass') || name.includes('sunstreak')) {
        material.emissive.set('#d4ecff')
        material.emissiveIntensity = 0.55
        material.roughness = 0.06
        material.metalness = 0.04
        if (name.includes('glass')) {
          material.transparent = true
          material.opacity = 0.78
        }
        continue
      }

      if (name.includes('floor') || name.includes('rug')) {
        material.roughness = 0.58
        material.metalness = 0
        continue
      }

      if (name.includes('wood') || name.includes('desk') || name.includes('shelf')) {
        material.roughness = 0.38
        material.metalness = 0.03
        continue
      }

      if (name.includes('wall') || name.includes('ceil')) {
        material.roughness = 0.9
        material.metalness = 0
      }

      if (name.includes('plant')) {
        material.roughness = 0.72
        material.emissive.set('#1a4020')
        material.emissiveIntensity = 0.08
      }
    }
  })
}
