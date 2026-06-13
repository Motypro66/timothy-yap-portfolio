import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Center, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { sampleJourneyPath } from '../../data/journeyPath'
import { useCommand } from '../../context/CommandContext'
import { useTerrainQuality } from '../../hooks/useTerrainQuality'

const MODEL_URL = `${import.meta.env.BASE_URL}models/sunny-room.glb`
useGLTF.preload(MODEL_URL)

function CameraRig() {
  const { journeyProgress, pointer, bootComplete, scrollVelocity } = useCommand()
  const lookAt = useRef(new THREE.Vector3())
  const desired = useRef(new THREE.Vector3())

  useFrame((state, delta) => {
    if (!bootComplete) return
    const sample = sampleJourneyPath(journeyProgress)
    desired.current.copy(sample.position)
    desired.current.x += pointer.x * 0.35
    desired.current.y += pointer.y * 0.18

    const shake = Math.min(0.08, scrollVelocity * 0.00015)
    desired.current.x += (Math.random() - 0.5) * shake

    state.camera.position.lerp(desired.current, 1 - Math.pow(0.0005, delta))
    lookAt.current.copy(sample.target)
    lookAt.current.x += pointer.x * 0.12
    state.camera.lookAt(lookAt.current)

    const cam = state.camera as THREE.PerspectiveCamera
    cam.fov = THREE.MathUtils.lerp(cam.fov, sample.fov, 1 - Math.pow(0.015, delta))
    cam.updateProjectionMatrix()
  })

  return null
}

function SunnyRoomModel() {
  const { scene } = useGLTF(MODEL_URL)
  const cloned = useMemo(() => scene.clone(true), [scene])

  useEffect(() => {
    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh && child.name.includes('Screen')) {
        const mat = child.material as THREE.MeshStandardMaterial
        mat.emissive?.set('#5bb5e8')
        mat.emissiveIntensity = 1.8
      }
    })
  }, [cloned])

  return (
    <Center disableY>
      <primitive object={cloned} />
    </Center>
  )
}

function FallbackRoom() {
  const wall = useMemo(() => new THREE.MeshStandardMaterial({ color: '#f5ebe0', roughness: 0.75 }), [])
  const floor = useMemo(() => new THREE.MeshStandardMaterial({ color: '#c49a6c', roughness: 0.45 }), [])
  const wood = useMemo(() => new THREE.MeshStandardMaterial({ color: '#9f6b3f', roughness: 0.4 }), [])
  const screen = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#5bb5e8',
        emissive: '#5bb5e8',
        emissiveIntensity: 1.5,
      }),
    [],
  )

  return (
    <group rotation={[0, Math.PI, 0]}>
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <boxGeometry args={[5.2, 0.08, 4.2]} />
        <primitive object={floor} attach="material" />
      </mesh>
      <mesh position={[0, 1.42, -2.06]}>
        <boxGeometry args={[5.2, 2.84, 0.12]} />
        <primitive object={wall} attach="material" />
      </mesh>
      <mesh position={[-2.54, 1.42, -1.05]}>
        <boxGeometry args={[0.12, 2.84, 4.2]} />
        <primitive object={wall} attach="material" />
      </mesh>
      <mesh position={[2.54, 1.42, -1.05]}>
        <boxGeometry args={[0.12, 2.84, 4.2]} />
        <primitive object={wall} attach="material" />
      </mesh>
      <mesh position={[0, 0.78, -1.55]} castShadow>
        <boxGeometry args={[2.1, 0.08, 1.1]} />
        <primitive object={wood} attach="material" />
      </mesh>
      <mesh position={[0, 1.18, -1.6]}>
        <boxGeometry args={[1.24, 0.76, 0.1]} />
        <meshStandardMaterial color="#efefef" roughness={0.35} />
      </mesh>
      <mesh position={[0, 1.18, -1.66]}>
        <boxGeometry args={[1.08, 0.62, 0.04]} />
        <primitive object={screen} attach="material" />
      </mesh>
      <mesh position={[-2.05, 1.05, -2.35]}>
        <boxGeometry args={[0.7, 2.1, 1.1]} />
        <primitive object={wood} attach="material" />
      </mesh>
    </group>
  )
}

function SceneLights() {
  return (
    <>
      <color attach="background" args={['#e8dfd4']} />
      <fog attach="fog" args={['#e8dfd4', 8, 22]} />
      <ambientLight intensity={0.55} color="#fff5e8" />
      <directionalLight position={[4, 6, 3]} intensity={1.35} color="#fff0d0" castShadow />
      <directionalLight position={[-3, 4, -2]} intensity={0.35} color="#c8e8ff" />
    </>
  )
}

function RoomContent({ useFallback }: { useFallback: boolean }) {
  return (
    <>
      <SceneLights />
      {useFallback ? <FallbackRoom /> : <SunnyRoomModel />}
      <CameraRig />
    </>
  )
}

export default function RoomCanvas() {
  const quality = useTerrainQuality()
  const { bootComplete } = useCommand()
  const [hasGlb, setHasGlb] = useState<boolean | null>(null)

  useEffect(() => {
    fetch(MODEL_URL, { method: 'HEAD' })
      .then((r) => setHasGlb(r.ok))
      .catch(() => setHasGlb(false))
  }, [])

  const dpr =
    typeof window === 'undefined'
      ? 1
      : quality === 'low'
        ? 0.9
        : quality === 'medium'
          ? 1
          : Math.min(window.devicePixelRatio, 1.25)

  if (hasGlb === null) {
    return <div className="room-canvas room-canvas--loading" aria-hidden="true" />
  }

  return (
    <div className={`room-canvas ${bootComplete ? 'room-canvas--live' : ''}`} aria-hidden="true">
      <Canvas
        shadows={quality !== 'low'}
        dpr={dpr}
        camera={{ fov: 54, near: 0.05, far: 40, position: [0, 1.68, 3.6] }}
        gl={{ antialias: quality !== 'low', powerPreference: 'high-performance' }}
      >
        <Suspense fallback={<RoomContent useFallback />}>
          <RoomContent useFallback={!hasGlb} />
        </Suspense>
      </Canvas>
      <div className="room-canvas__warm-vignette" />
    </div>
  )
}
