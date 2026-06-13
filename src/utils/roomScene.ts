import * as THREE from 'three'

/** Fit exported Blender room into a consistent world space for camera paths. */
export function normalizeRoom(root: THREE.Object3D, targetSize = 6.2) {
  root.updateMatrixWorld(true)

  const lights: THREE.Light[] = []
  root.traverse((child) => {
    if (child instanceof THREE.Light) lights.push(child)
  })
  for (const light of lights) {
    light.parent?.remove(light)
  }

  const box = new THREE.Box3().setFromObject(root)
  if (box.isEmpty()) return

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
}

/** Interior / threshold shots — same orientation as exported GLB (Y rotated π). */
export function roomCameraPath(): {
  pos: [number, number, number]
  target: [number, number, number]
  fov: number
}[] {
  return [
    { pos: [0, 1.72, 3.55], target: [0, 1.35, -0.55], fov: 56 },
    { pos: [0, 1.62, 2.45], target: [0, 1.28, -0.95], fov: 50 },
    { pos: [0.95, 1.5, 1.55], target: [0, 1.14, -1.32], fov: 46 },
    { pos: [1.38, 1.44, 0.95], target: [-0.15, 1.1, -1.42], fov: 44 },
    { pos: [0.45, 1.34, 0.75], target: [0, 1.02, -1.58], fov: 40 },
    { pos: [0.12, 1.24, 0.35], target: [0, 0.98, -1.65], fov: 36 },
    { pos: [-1.05, 1.38, 0.55], target: [-2.05, 1.32, -2.35], fov: 38 },
    { pos: [-1.32, 1.34, 0.05], target: [-2.05, 1.36, -2.42], fov: 34 },
    { pos: [1.72, 1.46, 0.25], target: [2.12, 1.58, -1.45], fov: 36 },
    { pos: [0.28, 1.54, 1.35], target: [0, 1.16, -0.75], fov: 32 },
  ]
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

      if (name.includes('screen') && name.includes('monitor')) {
        material.emissive.set('#5bb5e8')
        material.emissiveIntensity = 2
        material.roughness = 0.15
        continue
      }

      if (name.includes('window') || name.includes('glass')) {
        material.emissive.set('#c8e4ff')
        material.emissiveIntensity = 0.45
        material.roughness = 0.08
        material.metalness = 0.05
        material.transparent = true
        material.opacity = 0.82
        continue
      }

      if (name.includes('floor') || name.includes('rug')) {
        material.roughness = 0.62
        material.metalness = 0
        continue
      }

      if (name.includes('wood') || name.includes('desk') || name.includes('shelf')) {
        material.roughness = 0.42
        material.metalness = 0.02
        continue
      }

      if (name.includes('wall') || name.includes('ceil')) {
        material.roughness = 0.88
        material.metalness = 0
      }
    }
  })
}
