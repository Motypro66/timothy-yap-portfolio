import * as THREE from 'three'

/** Fit exported Blender room into a consistent world space for camera paths. */
export function normalizeRoom(root: THREE.Object3D, targetSize = 5.2) {
  root.updateMatrixWorld(true)

  root.traverse((child) => {
    if (child instanceof THREE.Light) {
      child.parent?.remove(child)
    }
  })

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

export function roomCameraPath(): {
  pos: [number, number, number]
  target: [number, number, number]
  fov: number
}[] {
  return [
    { pos: [0, 1.72, 5.4], target: [0, 1.35, -0.6], fov: 52 },
    { pos: [0, 1.62, 3.4], target: [0, 1.28, -1.0], fov: 48 },
    { pos: [0.9, 1.48, 2.0], target: [0, 1.15, -1.35], fov: 44 },
    { pos: [1.35, 1.42, 1.2], target: [0, 1.12, -1.45], fov: 42 },
    { pos: [-1.55, 1.5, 0.4], target: [-1.9, 1.55, -1.6], fov: 40 },
    { pos: [-1.35, 1.44, -0.2], target: [-1.85, 1.52, -1.75], fov: 38 },
    { pos: [0.35, 1.32, 0.85], target: [0, 1.08, -1.25], fov: 38 },
    { pos: [0.55, 1.28, 0.35], target: [0, 1.05, -1.35], fov: 36 },
    { pos: [1.85, 1.48, -0.35], target: [2.15, 1.65, -1.55], fov: 34 },
    { pos: [0.25, 1.52, 1.15], target: [0, 1.18, -0.85], fov: 34 },
  ]
}
