import { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Cloud, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { campaignNodes } from '../../data/campaigns'
import { campaignWorldPositions, mountainSpecs } from '../../data/terrain'
import { useCommand } from '../../context/CommandContext'
import type { CampaignNode } from '../../data/campaigns'

const PATH = [
  { t: 0, pos: new THREE.Vector3(0, 20, 38), target: new THREE.Vector3(0, 3, 4) },
  { t: 0.14, pos: new THREE.Vector3(7, 14, 24), target: new THREE.Vector3(3, 1.5, -6) },
  { t: 0.28, pos: new THREE.Vector3(-5, 9, 16), target: new THREE.Vector3(-2, 0.8, -12) },
  { t: 0.42, pos: new THREE.Vector3(4, 6, 10), target: new THREE.Vector3(1, 0.4, -16) },
  { t: 0.58, pos: new THREE.Vector3(-2, 4, 6), target: new THREE.Vector3(0, 0, -20) },
  { t: 0.74, pos: new THREE.Vector3(1.5, 2.5, 3.5), target: new THREE.Vector3(0, 0, -24) },
  { t: 1, pos: new THREE.Vector3(0, 1.4, 0.5), target: new THREE.Vector3(0, 0, -30) },
]

function samplePath(progress: number) {
  const p = Math.max(0, Math.min(1, progress))
  let i = 0
  while (i < PATH.length - 1 && PATH[i + 1].t < p) i += 1
  const a = PATH[i]
  const b = PATH[Math.min(i + 1, PATH.length - 1)]
  const local = b.t === a.t ? 0 : (p - a.t) / (b.t - a.t)
  const ease = local * local * (3 - 2 * local)
  return {
    position: a.pos.clone().lerp(b.pos, ease),
    target: a.target.clone().lerp(b.target, ease),
  }
}

function CameraRig() {
  const { journeyProgress, pointer, bootComplete, scrollVelocity } = useCommand()
  const lookAt = useRef(new THREE.Vector3())
  const desired = useRef(new THREE.Vector3())

  useFrame((state, delta) => {
    if (!bootComplete) return
    const { position, target } = samplePath(journeyProgress)
    desired.current.copy(position)
    desired.current.x += pointer.x * 1.8
    desired.current.y += pointer.y * 0.9

    const velShake = Math.min(0.35, scrollVelocity * 0.0008)
    desired.current.x += (Math.random() - 0.5) * velShake
    desired.current.y += (Math.random() - 0.5) * velShake * 0.5

    state.camera.position.lerp(desired.current, 1 - Math.pow(0.0008, delta))
    lookAt.current.copy(target)
    lookAt.current.x += pointer.x * 0.55
    state.camera.lookAt(lookAt.current)

    const cam = state.camera as THREE.PerspectiveCamera
    const targetFov = THREE.MathUtils.lerp(62, 38, journeyProgress) + scrollVelocity * 0.004
    cam.fov = THREE.MathUtils.lerp(cam.fov, targetFov, 1 - Math.pow(0.01, delta))
    cam.updateProjectionMatrix()
  })

  return null
}

function DataParticles() {
  const { journeyProgress, bootComplete } = useCommand()
  const ref = useRef<THREE.Points>(null)
  const count = 180

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i += 1) {
      arr[i * 3] = (Math.random() - 0.5) * 28
      arr[i * 3 + 1] = Math.random() * 12
      arr[i * 3 + 2] = -Math.random() * 34
    }
    return arr
  }, [])

  useFrame((state) => {
    if (!ref.current || !bootComplete) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.02
    ref.current.position.z = journeyProgress * 6
  })

  if (!bootComplete) return null

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#5bb5e8"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}
function Mountains() {
  return (
    <>
      {mountainSpecs.map((m, i) => (
        <mesh key={i} position={[m.x, m.height / 2 - 1.2, m.z]} castShadow receiveShadow>
          <coneGeometry args={[m.radius, m.height, 5]} />
          <meshStandardMaterial color={m.color} flatShading roughness={0.85} metalness={0.05} />
        </mesh>
      ))}
    </>
  )
}

function CampaignNodeMesh({
  node,
  position,
}: {
  node: CampaignNode
  position: [number, number, number]
}) {
  const { setSelectedCampaign, highlightCampaigns, bootComplete } = useCommand()
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (!meshRef.current) return
    const pulse = node.isPrimary ? 1 + Math.sin(state.clock.elapsedTime * 2.2) * 0.15 : 1
    const scale = (hovered || highlightCampaigns ? 1.35 : 1) * pulse * (node.isPrimary ? 1.2 : 0.75)
    meshRef.current.scale.setScalar(scale)
  })

  if (!bootComplete) return null

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation()
        setSelectedCampaign(node)
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = ''
      }}
    >
      <sphereGeometry args={[0.22, 16, 16]} />
      <meshStandardMaterial
        color={node.isPrimary ? '#f5a623' : '#5bb5e8'}
        emissive={node.isPrimary ? '#f5a623' : '#5bb5e8'}
        emissiveIntensity={hovered || highlightCampaigns ? 1.4 : node.isPrimary ? 1 : 0.55}
        toneMapped={false}
      />
    </mesh>
  )
}

function CampaignNodes() {
  return (
    <>
      {campaignNodes.map((node, i) => {
        const p = campaignWorldPositions[i]
        return (
          <CampaignNodeMesh
            key={node.id}
            node={node}
            position={[p.x, p.y, p.z]}
          />
        )
      })}
    </>
  )
}

function Scene() {
  return (
    <>
      <color attach="background" args={['#070b12']} />
      <fog attach="fog" args={['#070b12', 14, 42]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[8, 14, 6]} intensity={1.1} color="#ffd89b" />
      <directionalLight position={[-6, 4, -4]} intensity={0.45} color="#5bb5e8" />
      <hemisphereLight args={['#8eb4bc', '#1a1208', 0.35]} />
      <Stars radius={80} depth={40} count={1200} factor={3} saturation={0.2} fade speed={0.4} />
      <Cloud opacity={0.08} speed={0.15} bounds={[14, 2, 14]} volume={8} color="#5bb5e8" />
      <DataParticles />
      <Mountains />
      <CampaignNodes />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, -14]} receiveShadow>
        <planeGeometry args={[80, 60, 1, 1]} />
        <meshStandardMaterial color="#0a1018" roughness={1} />
      </mesh>
      <CameraRig />
    </>
  )
}

export default function JourneyCanvas() {
  const dpr = useMemo(() => {
    if (typeof window === 'undefined') return 1
    return window.innerWidth < 900 ? 1 : Math.min(window.devicePixelRatio, 1.5)
  }, [])

  return (
    <div className="journey-canvas" aria-hidden="true">
      <Canvas
        shadows
        dpr={dpr}
        camera={{ fov: 62, near: 0.1, far: 120, position: [0, 20, 38] }}
        gl={{ antialias: true, alpha: false }}
      >
        <Scene />
      </Canvas>
      <div className="journey-canvas__vignette" />
    </div>
  )
}
