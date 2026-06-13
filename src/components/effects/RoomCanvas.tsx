import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { sampleJourneyPath } from '../../data/journeyPath'
import { useCommand } from '../../context/CommandContext'
import { useTerrainQuality } from '../../hooks/useTerrainQuality'
import { normalizeRoom, polishRoomMaterials } from '../../utils/roomScene'

const MODEL_URL = `${import.meta.env.BASE_URL}models/sunny-room.glb`

function CameraRig() {
  const { journeyProgress, pointer, bootComplete, scrollVelocity } = useCommand()
  const lookAt = useRef(new THREE.Vector3())
  const desired = useRef(new THREE.Vector3())
  const lookTarget = useRef(new THREE.Vector3())
  const initialized = useRef(false)

  useFrame((state, delta) => {
    const progress = bootComplete ? journeyProgress : 0
    const sample = sampleJourneyPath(progress)
    desired.current.copy(sample.position)
    desired.current.x += pointer.x * 0.18
    desired.current.y += pointer.y * 0.08

    const shake = Math.min(0.04, scrollVelocity * 0.00006)
    desired.current.x += (Math.random() - 0.5) * shake

    lookTarget.current.copy(sample.target)
    lookTarget.current.x += pointer.x * 0.06
    lookTarget.current.y += pointer.y * 0.03

    const scrolling = scrollVelocity > 40
    const follow = Math.min(1, delta * (scrolling ? 16 : 9))

    if (!initialized.current) {
      state.camera.position.copy(desired.current)
      lookAt.current.copy(lookTarget.current)
      state.camera.lookAt(lookAt.current)
      initialized.current = true
    } else {
      state.camera.position.lerp(desired.current, follow)
      lookAt.current.lerp(lookTarget.current, follow)
      state.camera.lookAt(lookAt.current)
    }

    const cam = state.camera as THREE.PerspectiveCamera
    cam.fov = THREE.MathUtils.lerp(cam.fov, sample.fov, Math.min(1, delta * 10))
    cam.updateProjectionMatrix()
  })

  return null
}

function SunnyRoomModel() {
  const { scene } = useGLTF(MODEL_URL)
  const room = useMemo(() => {
    const cloned = scene.clone(true)
    normalizeRoom(cloned)
    polishRoomMaterials(cloned)
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
      <fog attach="fog" args={['#e8dfd4', 24, 48]} />
      <ambientLight intensity={0.42} color="#fff8ef" />
      <hemisphereLight args={['#fff8ef', '#a88462', 0.48]} />
      <directionalLight
        position={[4.5, 6.5, 3.5]}
        intensity={1.65}
        color="#fff0d0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={18}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
      />
      <directionalLight position={[2.8, 3.2, -1.2]} intensity={0.75} color="#d8ecff" />
      <pointLight position={[0, 1.15, -1.55]} intensity={0.35} color="#7ec8f0" distance={4} />
      {fallback ? <FallbackRoom /> : <SunnyRoomModel />}
      <CameraRig />
    </>
  )
}

type CanvasBoundaryState = { failed: boolean }

class CanvasErrorBoundary extends Component<{ children: ReactNode }, CanvasBoundaryState> {
  state: CanvasBoundaryState = { failed: false }

  static getDerivedStateFromError(): CanvasBoundaryState {
    return { failed: true }
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="room-canvas room-canvas--loading">
          <div className="room-canvas__warm-vignette" />
        </div>
      )
    }
    return this.props.children
  }
}

function RoomScene() {
  return (
    <Suspense fallback={<SceneContent fallback />}>
      <SceneContent />
    </Suspense>
  )
}

function WebGLCanvas({ dpr, quality }: { dpr: number; quality: ReturnType<typeof useTerrainQuality> }) {
  const webglOk = useStateWebGL()

  if (!webglOk) {
    return (
      <div className="room-canvas room-canvas--loading">
        <div className="room-canvas__warm-vignette" />
      </div>
    )
  }

  return (
    <Canvas
      style={{ width: '100%', height: '100%', display: 'block' }}
      shadows={quality !== 'low'}
      dpr={dpr}
      camera={{ fov: 58, near: 0.05, far: 40, position: [0, 1.62, 2.35] }}
      gl={{ antialias: quality !== 'low', powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.setClearColor('#e8dfd4')
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.12
      }}
    >
      <RoomScene />
    </Canvas>
  )
}

function useStateWebGL() {
  const [ok, setOk] = useState(true)
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
      setOk(Boolean(gl))
    } catch {
      setOk(false)
    }
  }, [])
  return ok
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

  useEffect(() => {
    useGLTF.preload(MODEL_URL)
  }, [])

  return (
    <CanvasErrorBoundary>
      <div className="room-canvas room-canvas--live" aria-hidden="true">
        <WebGLCanvas dpr={dpr} quality={quality} />
        <div className="room-canvas__warm-vignette" />
      </div>
    </CanvasErrorBoundary>
  )
}

