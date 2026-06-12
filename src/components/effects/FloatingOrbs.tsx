import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

function Orb({
  position,
  color,
  scale,
  speed,
}: {
  position: [number, number, number]
  color: string
  scale: number
  speed: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.3
    meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.2
  })

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={1.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.35}
          speed={2}
          roughness={0.15}
          metalness={0.6}
          transparent
          opacity={0.5}
        />
      </mesh>
    </Float>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1.4} color="#ffd166" />
      <pointLight position={[-10, -5, -5]} intensity={0.9} color="#ff8c69" />
      <Orb position={[2.8, 0.5, -3]} color="#f5a623" scale={0.85} speed={0.8} />
      <Orb position={[4.2, -1.2, -4]} color="#ff8c69" scale={0.65} speed={1.1} />
      <Orb position={[3.5, 2, -5]} color="#5bb5e8" scale={0.45} speed={0.6} />
    </>
  )
}

export default function FloatingOrbs() {
  return (
    <div className="floating-orbs floating-orbs--side" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
