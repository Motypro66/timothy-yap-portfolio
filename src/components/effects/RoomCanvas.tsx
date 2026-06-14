import { Component, Suspense, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { getCameraPathVersion, sampleJourneyPath, setRuntimeJourneyKeyframes } from '../../data/journeyPath'
import { useCommand } from '../../context/CommandContext'
import { useTerrainQuality } from '../../hooks/useTerrainQuality'
import {
  buildSafeCameraPath,
  defaultCameraPath,
  normalizeRoom,
  polishRoomMaterials,
} from '../../utils/roomScene'

const MODEL_URL = `${import.meta.env.BASE_URL}models/sunny-room.glb`

function CameraRig() {
  const { journeyProgress, pointer, bootComplete } = useCommand()
  const lookAt = useRef(new THREE.Vector3())
  const desired = useRef(new THREE.Vector3())
  const lookTarget = useRef(new THREE.Vector3())
  const initialized = useRef(false)
  const pathVersion = useRef(getCameraPathVersion())

  useFrame((state, delta) => {
    const version = getCameraPathVersion()
    if (version !== pathVersion.current) {
      pathVersion.current = version
      initialized.current = false
    }
    const progress = bootComplete ? journeyProgress : 0
    const sample = sampleJourneyPath(progress)
    desired.current.copy(sample.position)
    desired.current.x += pointer.x * 0.035
    desired.current.y += pointer.y * 0.018
    lookTarget.current.copy(sample.target)
    lookTarget.current.x += pointer.x * 0.018
    lookTarget.current.y += pointer.y * 0.01

    const cam = state.camera as THREE.PerspectiveCamera
    state.camera.position.copy(desired.current)
    lookAt.current.copy(lookTarget.current)
    state.camera.lookAt(lookAt.current)
    initialized.current = true

    cam.fov = THREE.MathUtils.lerp(cam.fov, sample.fov, Math.min(1, delta * 10))
    cam.updateProjectionMatrix()
  })

  return null
}

function SunnyRoomModel({ onReady }: { onReady: (box: THREE.Box3) => void }) {
  const { scene } = useGLTF(MODEL_URL)
  const room = useMemo(() => {
    const cloned = scene.clone(true)
    const bounds = normalizeRoom(cloned)
    polishRoomMaterials(cloned)
    return { object: cloned, bounds }
  }, [scene])

  useEffect(() => {
    const shots = room.bounds.isEmpty()
      ? defaultCameraPath()
      : buildSafeCameraPath(room.object, room.bounds)
    setRuntimeJourneyKeyframes(shots)
    onReady(room.bounds)
  }, [room, onReady])

  return <primitive object={room.object} />
}

function FallbackRoom({ onReady }: { onReady: (box: THREE.Box3) => void }) {
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

    const addBox = (
      name: string,
      pos: [number, number, number],
      size: [number, number, number],
      mat: THREE.Material,
    ) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(...size), mat)
      m.name = name
      m.position.set(...pos)
      g.add(m)
    }

    addBox('Floor', [0, 0.04, 0], [5.2, 0.08, 4.2], floor)
    addBox('Ceiling', [0, 2.81, -2.06], [5.2, 0.08, 4.2], wall)
    addBox('WallBack', [0, 1.42, -2.06], [5.2, 0.08, 4.2], wall)
    addBox('WallLeft', [-2.54, 1.42, -1.05], [0.12, 2.84, 4.2], wall)
    addBox('WallRight', [2.54, 1.42, -1.05], [0.12, 2.84, 4.2], wall)
    addBox('DeskTop', [0, 0.78, -1.55], [2.1, 0.08, 1.1], wood)
    addBox('Monitor', [0, 1.18, -1.6], [1.24, 0.76, 0.1], new THREE.MeshStandardMaterial({ color: '#efefef' }))
    addBox('MonitorScreen', [0, 1.18, -1.66], [1.08, 0.62, 0.04], screen)
    addBox('Shelf', [-2.05, 1.05, -2.35], [0.7, 2.1, 1.1], wood)
    addBox('WindowGlass', [2.45, 1.42, -1.35], [0.04, 1.5, 1.35], new THREE.MeshStandardMaterial({ color: '#d4ecff' }))
    const bounds = normalizeRoom(g)
    return { object: g, bounds }
  }, [])

  useEffect(() => {
    const shots = buildSafeCameraPath(group.object, group.bounds)
    setRuntimeJourneyKeyframes(shots)
    onReady(group.bounds)
  }, [group, onReady])

  return <primitive object={group.object} />
}

function SceneContent({
  fallback,
  onRoomReady,
  shadows,
}: {
  fallback?: boolean
  onRoomReady: (box: THREE.Box3) => void
  shadows: boolean
}) {
  return (
    <>
      <color attach="background" args={['#e8dfd4']} />
      <fog attach="fog" args={['#e8dfd4', 28, 55]} />
      <Environment preset="apartment" environmentIntensity={1.08} />
      <ambientLight intensity={0.32} color="#fff8ef" />
      <hemisphereLight args={['#fff8ef', '#8a6548', 0.48]} />
      <directionalLight
        position={[4.5, 7, 3.5]}
        intensity={1.68}
        color="#fff0d0"
        castShadow={shadows}
        shadow-mapSize={[1536, 1536]}
        shadow-camera-far={20}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[3.2, 4, -1.5]} intensity={0.82} color="#d8ecff" />
      <pointLight position={[0, 2.55, -1.2]} intensity={0.28} color="#fff4e6" distance={6} decay={2} />
      <pointLight position={[0, 1.35, -1.45]} intensity={0.42} color="#7ec8f0" distance={5} decay={2} />
      {fallback ? (
        <FallbackRoom onReady={onRoomReady} />
      ) : (
        <SunnyRoomModel onReady={onRoomReady} />
      )}
      {shadows && (
        <ContactShadows
          position={[0, 0.02, 0]}
          opacity={0.42}
          scale={14}
          blur={2.6}
          far={4.5}
          color="#5c3f24"
        />
      )}
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

function RoomScene({
  onRoomReady,
  shadows,
}: {
  onRoomReady: (box: THREE.Box3) => void
  shadows: boolean
}) {
  return (
    <Suspense fallback={<SceneContent fallback onRoomReady={onRoomReady} shadows={shadows} />}>
      <SceneContent onRoomReady={onRoomReady} shadows={shadows} />
    </Suspense>
  )
}

function WebGLCanvas({
  dpr,
  quality,
  onRoomReady,
}: {
  dpr: number
  quality: ReturnType<typeof useTerrainQuality>
  onRoomReady: (box: THREE.Box3) => void
}) {
  const webglOk = useStateWebGL()
  const fallback = defaultCameraPath()
  const start = fallback[0]

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
      camera={{ fov: start.fov, near: 0.05, far: 45, position: start.pos }}
      gl={{ antialias: quality !== 'low', powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.setClearColor('#e8dfd4')
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.28
        gl.shadowMap.enabled = quality !== 'low'
        gl.shadowMap.type = THREE.PCFSoftShadowMap
      }}
    >
      <RoomScene onRoomReady={onRoomReady} shadows={quality !== 'low'} />
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
  const handleRoomReady = useCallback((_box: THREE.Box3) => {}, [])

  const dpr =
    typeof window === 'undefined'
      ? 1
      : quality === 'low'
        ? 0.85
        : quality === 'medium'
          ? 1
          : Math.min(window.devicePixelRatio, 1.35)

  useEffect(() => {
    useGLTF.preload(MODEL_URL)
  }, [])

  return (
    <CanvasErrorBoundary>
      <div className="room-canvas room-canvas--live" aria-hidden="true">
        <WebGLCanvas dpr={dpr} quality={quality} onRoomReady={handleRoomReady} />
        <div className="room-canvas__warm-vignette" />
      </div>
    </CanvasErrorBoundary>
  )
}
