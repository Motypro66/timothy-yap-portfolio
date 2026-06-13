import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { sampleJourneyPath } from '../../data/journeyPath'
import { useCommand } from '../../context/CommandContext'
import { useTerrainQuality } from '../../hooks/useTerrainQuality'
import { normalizeRoom } from '../../utils/roomScene'

const MODEL_URL = `${import.meta.env.BASE_URL}models/sunny-room.glb`
useGLTF.preload(MODEL_URL)

function CameraRig() {
  const { journeyProgress, pointer, bootComplete, scrollVelocity } = useCommand()
  const lookAt = useRef(new THREE.Vector3())
  const desired = useRef(new THREE.Vector3())
  const initialized = useRef(false)

  useFrame((state, delta) => {
    const progress = bootComplete ? journeyProgress : 0
    const sample = sampleJourneyPath(progress)
    desired.current.copy(sample.position)
    desired.current.x += pointer.x * 0.22
    desired.current.y += pointer.y * 0.1

    const shake = Math.min(0.05, scrollVelocity * 0.00008)
    desired.current.x += (Math.random() - 0.5) * shake

    if (!initialized.current) {
      state.camera.position.copy(desired.current)
      lookAt.current.copy(sample.target)
      state.camera.lookAt(lookAt.current)
      initialized.current = true
    } else {
      state.camera.position.lerp(desired.current, 1 - Math.pow(0.0004, delta))
      lookAt.current.copy(sample.target)
      lookAt.current.x += pointer.x * 0.08
      state.camera.lookAt(lookAt.current)
    }

    const cam = state.camera as THREE.PerspectiveCamera
    cam.fov = THREE.MathUtils.lerp(cam.fov, sample.fov, 1 - Math.pow(0.012, delta))
    cam.updateProjectionMatrix()
  })

  return null
}

function SunnyRoomModel() {
  const { scene } = useGLTF(MODEL_URL)
  const room = useMemo(() => {
    const cloned = scene.clone(true)
    normalizeRoom(cloned)
    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh && child.name.includes('Screen')) {
        const mat = child.material as THREE.MeshStandardMaterial
        mat.emissive?.set('#5bb5e8')
        mat.emissiveIntensity = 1.6
      }
    })
    return cloned
  }, [scene])

  return <primitive object={room} />
}

function FallbackRoom() {
  const group = useMemo(() => {
    const g = new THREE.Group()
    const wall = new THREE.MeshStandardMaterial({ color: '#f5ebe0', roughness: 0.75 })
    const floor = new THREE.MeshStandardMaterial({ color: '#c49a6c', roughness: 0.45 })
    const wood = new THREE.MeshStandardMaterial({ color: '#9f6b3f', roughness: 0.4 })
    const screen = new THREE.MeshStandardMaterial({
      color: '#5bb5e8',
      emissive: '#5bb5e8',
      emissiveIntensity: 1.4,
    })

    const addBox = (pos: [number, number, number], size: [number, number, number], mat: THREE.Material) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(...size), mat)
      m.position.set(...pos)
      g.add(m)
    }

    addBox([0, 0.04, 0], [5.2, 0.08, 4.2], floor)
    addBox([0, 1.42, -2.06], [5.2, 2.84, 0.12], wall)
    addBox([-2.54, 1.42, -1.05], [0.12, 2.84, 4.2], wall)
    addBox([2.54, 1.42, -1.05], [0.12, 2.84, 4.2], wall)
    addBox([0, 0.78, -1.55], [2.1, 0.08, 1.1], wood)
    addBox([0, 1.18, -1.6], [1.24, 0.76, 0.1], new THREE.MeshStandardMaterial({ color: '#efefef' }))
    addBox([0, 1.18, -1.66], [1.08, 0.62, 0.04], screen)
    addBox([-2.05, 1.05, -2.35], [0.7, 2.1, 1.1], wood)
    normalizeRoom(g)
    return g
  }, [])

  return <primitive object={group} />
}

function SceneContent({ fallback }: { fallback?: boolean }) {
  return (
    <>
      <color attach="background" args={['#e8dfd4']} />
      <fog attach="fog" args={['#e8dfd4', 12, 28]} />
      <ambientLight intensity={0.65} color="#fff8ef" />
      <directionalLight position={[5, 8, 4]} intensity={1.25} color="#fff0d0" castShadow />
      <directionalLight position={[-4, 5, -3]} intensity={0.4} color="#d4ecff" />
      <hemisphereLight args={['#fff8ef', '#c4a882', 0.35]} />
      {fallback ? <FallbackRoom /> : <SunnyRoomModel />}
      <CameraRig />
    </>
  )
}

function RoomScene() {
  return (
    <Suspense fallback={<SceneContent fallback />}>
      <SceneContent />
    </Suspense>
  )
}

export default function RoomCanvas() {
  const quality = useTerrainQuality()

  const dpr =
    typeof window === 'undefined'
      ? 1
      : quality === 'low'
        ? 0.9
        : quality === 'medium'
          ? 1
          : Math.min(window.devicePixelRatio, 1.25)

  return (
    <div className="room-canvas room-canvas--live" aria-hidden="true">
      <Canvas
        shadows={quality !== 'low'}
        dpr={dpr}
        camera={{ fov: 52, near: 0.05, far: 40, position: [0, 1.72, 5.4] }}
        gl={{ antialias: quality !== 'low', powerPreference: 'high-performance' }}
      >
        <RoomScene />
      </Canvas>
      <div className="room-canvas__warm-vignette" />
    </div>
  )
}
