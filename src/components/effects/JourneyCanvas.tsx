import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Cloud, Line, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { campaignNodes } from '../../data/campaigns'
import { sampleJourneyPath } from '../../data/journeyPath'
import {
  campaignWorldPositions,
  getNearestNodeIndices,
  mountainSpecs,
} from '../../data/terrain'
import { useCommand } from '../../context/CommandContext'
import { terrainCounts, useTerrainQuality } from '../../hooks/useTerrainQuality'
import type { CampaignNode } from '../../data/campaigns'

function CameraRig() {
  const { journeyProgress, pointer, bootComplete, scrollVelocity } = useCommand()
  const lookAt = useRef(new THREE.Vector3())
  const desired = useRef(new THREE.Vector3())
  const fogColor = useRef(new THREE.Color('#070b12'))

  useFrame((state, delta) => {
    if (!bootComplete) return
    const sample = sampleJourneyPath(journeyProgress)
    desired.current.copy(sample.position)
    desired.current.x += pointer.x * 2
    desired.current.y += pointer.y * 1

    const velShake = Math.min(0.4, scrollVelocity * 0.0009)
    desired.current.x += (Math.random() - 0.5) * velShake
    desired.current.y += (Math.random() - 0.5) * velShake * 0.5

    state.camera.position.lerp(desired.current, 1 - Math.pow(0.0006, delta))
    lookAt.current.copy(sample.target)
    lookAt.current.x += pointer.x * 0.6
    state.camera.lookAt(lookAt.current)

    const cam = state.camera as THREE.PerspectiveCamera
    const targetFov = sample.fov + scrollVelocity * 0.003
    cam.fov = THREE.MathUtils.lerp(cam.fov, targetFov, 1 - Math.pow(0.01, delta))
    cam.updateProjectionMatrix()

    if (state.scene.fog && state.scene.fog instanceof THREE.Fog) {
      fogColor.current.set('#070b12')
      state.scene.fog.color.lerp(fogColor.current, 1 - Math.pow(0.02, delta))
      state.scene.fog.near = THREE.MathUtils.lerp(state.scene.fog.near, 14, 0.08)
      state.scene.fog.far = THREE.MathUtils.lerp(state.scene.fog.far, 42, 0.08)
    }
  })

  return null
}

function DataParticles({ count }: { count: number }) {
  const { journeyProgress, bootComplete } = useCommand()
  const ref = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i += 1) {
      arr[i * 3] = (Math.random() - 0.5) * 28
      arr[i * 3 + 1] = Math.random() * 12
      arr[i * 3 + 2] = -Math.random() * 34
    }
    return arr
  }, [count])

  useFrame((state) => {
    if (!ref.current || !bootComplete) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.02
    ref.current.position.z = journeyProgress * 8
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

function Mountains({ count }: { count: number }) {
  const specs = useMemo(() => mountainSpecs.slice(0, count), [count])
  return (
    <>
      {specs.map((m, i) => (
        <mesh key={i} position={[m.x, m.height / 2 - 1.2, m.z]} receiveShadow>
          <coneGeometry args={[m.radius, m.height, 5]} />
          <meshStandardMaterial color={m.color} flatShading roughness={0.85} metalness={0.05} />
        </mesh>
      ))}
    </>
  )
}

function CampaignNodeMesh({
  node,
  index,
  position,
  segments,
}: {
  node: CampaignNode
  index: number
  position: [number, number, number]
  segments: number
}) {
  const {
    setSelectedCampaign,
    highlightCampaigns,
    bootComplete,
    hoveredCampaignId,
    setHoveredCampaignId,
    selectedCampaign,
  } = useCommand()
  const meshRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const isActive =
    hovered ||
    hoveredCampaignId === node.id ||
    selectedCampaign?.id === node.id ||
    highlightCampaigns

  useFrame((state) => {
    if (!meshRef.current) return
    const pulse = node.isPrimary ? 1 + Math.sin(state.clock.elapsedTime * 2.2) * 0.18 : 1
    const scale = (isActive ? 1.45 : 1) * pulse * (node.isPrimary ? 1.25 : 0.78)
    meshRef.current.scale.setScalar(scale)
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.8
      ringRef.current.visible = isActive
    }
  })

  if (!bootComplete) return null

  return (
    <group position={position}>
      {selectedCampaign?.id === node.id && (
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.35, 0.42, 24]} />
          <meshBasicMaterial color="#f5a623" transparent opacity={0.75} side={THREE.DoubleSide} />
        </mesh>
      )}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation()
          setSelectedCampaign(node)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          setHoveredCampaignId(node.id)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          setHoveredCampaignId(null)
          document.body.style.cursor = ''
        }}
      >
        <sphereGeometry args={[0.22, segments, segments]} />
        <meshStandardMaterial
          color={node.isPrimary ? '#f5a623' : '#5bb5e8'}
          emissive={node.isPrimary ? '#f5a623' : '#5bb5e8'}
          emissiveIntensity={isActive ? 1.6 : node.isPrimary ? 1 : 0.5}
          toneMapped={false}
        />
      </mesh>
      <NodeConnections index={index} active={isActive} />
    </group>
  )
}

function NodeConnections({ index, active }: { index: number; active: boolean }) {
  const neighbors = useMemo(() => (active ? getNearestNodeIndices(index, 4, 10) : []), [index, active])
  if (!active || !neighbors.length) return null

  const from = campaignWorldPositions[index]
  return (
    <>
      {neighbors.map((ni) => {
        const to = campaignWorldPositions[ni]
        const points: [number, number, number][] = [
          [0, 0, 0],
          [(to.x - from.x) * 0.5, (to.y - from.y) * 0.5 + 0.4, (to.z - from.z) * 0.5],
          [to.x - from.x, to.y - from.y, to.z - from.z],
        ]
        return (
          <Line
            key={ni}
            points={points}
            color="#5bb5e8"
            lineWidth={1}
            transparent
            opacity={0.55}
          />
        )
      })}
    </>
  )
}

function CampaignNodes({ segments }: { segments: number }) {
  return (
    <>
      {campaignNodes.map((node, i) => {
        const p = campaignWorldPositions[i]
        return (
          <CampaignNodeMesh
            key={node.id}
            node={node}
            index={i}
            position={[p.x, p.y, p.z]}
            segments={segments}
          />
        )
      })}
    </>
  )
}

function Scene({ quality }: { quality: ReturnType<typeof terrainCounts> }) {
  const { bootComplete } = useCommand()
  const shadows = quality.mountains >= 28

  return (
    <>
      <color attach="background" args={['#070b12']} />
      <fog attach="fog" args={['#070b12', 14, 42]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[8, 14, 6]} intensity={1.1} color="#ffd89b" castShadow={shadows} />
      <directionalLight position={[-6, 4, -4]} intensity={0.45} color="#5bb5e8" />
      <hemisphereLight args={['#8eb4bc', '#1a1208', 0.35]} />
      {bootComplete && (
        <>
          <Stars
            radius={80}
            depth={40}
            count={quality.stars}
            factor={3}
            saturation={0.2}
            fade
            speed={0.4}
          />
          {quality.mountains >= 28 && (
            <Cloud opacity={0.08} speed={0.15} bounds={[14, 2, 14]} volume={8} color="#5bb5e8" />
          )}
          <DataParticles count={quality.particles} />
          <Mountains count={quality.mountains} />
          <CampaignNodes segments={quality.nodeSegments} />
        </>
      )}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, -14]} receiveShadow>
        <planeGeometry args={[80, 60, 1, 1]} />
        <meshStandardMaterial color="#0a1018" roughness={1} />
      </mesh>
      <CameraRig />
    </>
  )
}

function CanvasQualitySync() {
  const quality = useTerrainQuality()
  const { setTerrainQuality } = useCommand()
  useEffect(() => {
    setTerrainQuality(quality)
  }, [quality, setTerrainQuality])
  return null
}

export default function JourneyCanvas() {
  const qualityLevel = useTerrainQuality()
  const counts = terrainCounts(qualityLevel)
  const { introComplete } = useCommand()

  const dpr = useMemo(() => {
    if (typeof window === 'undefined') return 1
    if (qualityLevel === 'low') return 0.85
    if (qualityLevel === 'medium') return 1
    return Math.min(window.devicePixelRatio, 1.5)
  }, [qualityLevel])

  return (
    <div className={`journey-canvas ${introComplete ? 'journey-canvas--live' : ''}`} aria-hidden="true">
      <Canvas
        shadows={counts.mountains >= 28}
        dpr={dpr}
        camera={{ fov: 68, near: 0.1, far: 120, position: [0, 24, 44] }}
        gl={{ antialias: qualityLevel !== 'low', alpha: false, powerPreference: 'high-performance' }}
      >
        <CanvasQualitySync />
        <Scene quality={counts} />
      </Canvas>
      <div className="journey-canvas__vignette" />
    </div>
  )
}
