import * as THREE from 'three'
import { collectObstacleBoxes, sanitizeCameraPath } from './cameraCollision'

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
  entrance: THREE.Vector3
  entranceZ: number
  frontZ: number
  backZ: number
  depthDir: number
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

function objectCenter(root: THREE.Object3D, name: string, fallback: THREE.Vector3): THREE.Vector3 {
  const hit = root.getObjectByName(name)
  if (!hit) return fallback.clone()
  hit.updateMatrixWorld(true)
  return new THREE.Box3().setFromObject(hit).getCenter(new THREE.Vector3())
}

function meshCenter(root: THREE.Object3D, name: string, fallback: THREE.Vector3): THREE.Vector3 {
  const mesh = findMesh(root, name)
  if (!mesh) return objectCenter(root, name, fallback)
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
  const depthDir = desk.z >= center.z ? 1 : -1
  const frontZ = depthDir > 0 ? box.min.z : box.max.z
  const backZ = depthDir > 0 ? box.max.z : box.min.z
  const entrance = new THREE.Vector3(center.x, floor, frontZ)

  const eye = floor + interiorHeight * 0.56
  const look = floor + interiorHeight * 0.4
  const entranceZ = frontZ

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
    entrance,
    entranceZ,
    frontZ,
    backZ,
    depthDir,
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

/**
 * Five cinematic beats — matches scroll sections and user storyboard:
 * doorway → desk side → monitor → shelf → window / contact
 */
export function buildCameraPathFromLayout(layout: RoomLayout): RoomShot[] {
  const { box, eye, look, desk, monitor, window, shelf, center, depthDir, frontZ } = layout
  const size = box.getSize(new THREE.Vector3())
  const h = layout.ceiling - layout.floor
  const lookDesk = look + h * 0.04
  const lookScreen = look + h * 0.1
  const inward = (t: number) => frontZ + depthDir * size.z * t

  return [
    shot(
      layout,
      [center.x, eye, inward(0.14)],
      [center.x, lookDesk + h * 0.08, desk.z - depthDir * size.z * 0.08],
      56,
    ),
    shot(
      layout,
      [desk.x - size.x * 0.32, eye - h * 0.02, frontZ + depthDir * size.z * 0.34],
      [desk.x + size.x * 0.04, lookDesk, monitor.z],
      46,
    ),
    shot(
      layout,
      [desk.x + size.x * 0.1, eye + h * 0.01, frontZ + depthDir * size.z * 0.38],
      [monitor.x, lookScreen, monitor.z],
      42,
    ),
    shot(
      layout,
      [shelf.x + size.x * 0.26, eye, shelf.z + depthDir * size.z * 0.04],
      [shelf.x, lookDesk + h * 0.1, shelf.z],
      40,
    ),
    shot(
      layout,
      [window.x - size.x * 0.26, eye, window.z + depthDir * size.z * 0.02],
      [window.x, lookDesk + h * 0.14, window.z],
      38,
    ),
  ]
}

export function buildSafeCameraPath(root: THREE.Object3D, box: THREE.Box3): RoomShot[] {
  if (box.isEmpty()) return defaultCameraPath()
  const layout = analyzeRoomLayout(root, box)
  const raw = buildCameraPathFromLayout(layout)
  return sanitizeCameraPath(raw, layout, collectObstacleBoxes(root))
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
    entrance: new THREE.Vector3(center.x, floor, box.min.z),
    entranceZ: box.min.z + size.z * 0.14,
    frontZ: box.min.z,
    backZ: box.max.z,
    depthDir: 1,
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

      material.envMapIntensity = 1.05

      if (name.includes('floor') || name.includes('rug')) {
        material.roughness = Math.min(material.roughness, 0.62)
        material.metalness = 0
        continue
      }

      if (name.includes('wood') || name.includes('desk') || name.includes('shelf')) {
        material.roughness = Math.min(material.roughness, 0.42)
        material.metalness = 0.04
        continue
      }

      if (name.includes('wall') || name.includes('ceil')) {
        material.roughness = Math.max(material.roughness, 0.82)
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
