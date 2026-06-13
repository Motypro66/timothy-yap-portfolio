import * as THREE from 'three'

export type RoomShot = {
  pos: [number, number, number]
  target: [number, number, number]
  fov: number
}

const SECTION_T = [0, 0.18, 0.28, 0.38, 0.48, 0.58, 0.68, 0.76, 0.86, 1] as const

/** Fit exported Blender room into a consistent world space for camera paths. */
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

  const fitted = new THREE.Box3().setFromObject(root)
  const center = fitted.getCenter(new THREE.Vector3())
  root.position.x -= center.x
  root.position.z -= center.z
  root.position.y -= fitted.min.y
  root.rotation.y = Math.PI
  root.updateMatrixWorld(true)

  return new THREE.Box3().setFromObject(root)
}

function clampInside(box: THREE.Box3, x: number, y: number, z: number, margin = 0.12) {
  return {
    x: THREE.MathUtils.clamp(x, box.min.x + margin, box.max.x - margin),
    y: THREE.MathUtils.clamp(y, box.min.y + margin, box.max.y - margin),
    z: THREE.MathUtils.clamp(z, box.min.z + margin, box.max.z - margin),
  }
}

/** Director path derived from the actual room bounds — eye level ~58% height, always inside walls. */
export function buildCameraPathFromBounds(box: THREE.Box3): RoomShot[] {
  const size = box.getSize(new THREE.Vector3())
  const c = box.getCenter(new THREE.Vector3())
  const floor = box.min.y
  const eyeY = floor + size.y * 0.58
  const lookY = floor + size.y * 0.44

  const zEntry = box.max.z - size.z * 0.1
  const zMidFront = box.max.z - size.z * 0.32
  const zCenter = c.z
  const zMidBack = box.min.z + size.z * 0.32
  const zBack = box.min.z + size.z * 0.12

  const xLeft = box.min.x + size.x * 0.22
  const xRight = box.max.x - size.x * 0.22

  const shots: RoomShot[] = [
    { pos: [c.x, eyeY, zEntry], target: [c.x, lookY, zCenter], fov: 64 },
    { pos: [c.x, eyeY, zMidFront], target: [c.x, lookY, zMidBack], fov: 58 },
    { pos: [xRight, eyeY, zCenter], target: [xLeft, lookY, zBack], fov: 52 },
    { pos: [xRight, eyeY, zMidBack], target: [c.x, lookY, zBack], fov: 48 },
    { pos: [c.x + size.x * 0.06, eyeY - size.y * 0.04, zCenter], target: [c.x, lookY - size.y * 0.02, zBack], fov: 44 },
    { pos: [c.x, eyeY - size.y * 0.05, zMidBack], target: [c.x, lookY - size.y * 0.03, zBack], fov: 40 },
    { pos: [xLeft, eyeY, zCenter], target: [xLeft + size.x * 0.08, lookY, zBack], fov: 42 },
    { pos: [xLeft, eyeY - size.y * 0.03, zMidBack], target: [xLeft, lookY + size.y * 0.02, zBack], fov: 38 },
    { pos: [xRight, eyeY, zMidBack], target: [xRight, lookY + size.y * 0.03, zBack], fov: 36 },
    { pos: [c.x, eyeY, zMidFront], target: [c.x, lookY + size.y * 0.02, zCenter], fov: 34 },
  ]

  return shots.map(({ pos, target, fov }) => {
    const p = clampInside(box, pos[0], pos[1], pos[2])
    const t = clampInside(box, target[0], target[1], target[2], 0.08)
    return { pos: [p.x, p.y, p.z], target: [t.x, t.y, t.z], fov }
  })
}

/** Fallback when bounds are not ready yet. */
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
