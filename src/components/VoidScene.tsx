import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Edges } from '@react-three/drei'
import * as THREE from 'three'
import { useMouse } from '../hooks/useMouse'

function FloatingGeometry({
  position,
  geometry,
  scale = 1,
  color = '#00d9ff',
  rotationSpeed = 0.3,
  distort = 0.2,
}: {
  position: [number, number, number]
  geometry: 'icosahedron' | 'octahedron' | 'tetrahedron' | 'dodecahedron' | 'box' | 'torus'
  scale?: number
  color?: string
  rotationSpeed?: number
  distort?: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const mouse = useMouse()

  useFrame((state) => {
    if (!meshRef.current) return

    // Subtle rotation
    meshRef.current.rotation.x += 0.002 * rotationSpeed
    meshRef.current.rotation.y += 0.003 * rotationSpeed

    // Mouse influence
    const targetRotationX = mouse.normalizedY * 0.3
    const targetRotationY = mouse.normalizedX * 0.3

    meshRef.current.rotation.x += (targetRotationX - meshRef.current.rotation.x) * 0.02
    meshRef.current.rotation.y += (targetRotationY - meshRef.current.rotation.y) * 0.02

    // Floating effect
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.1
  })

  const GeometryComponent = useMemo(() => {
    switch (geometry) {
      case 'icosahedron':
        return <icosahedronGeometry args={[1, 0]} />
      case 'octahedron':
        return <octahedronGeometry args={[1, 0]} />
      case 'tetrahedron':
        return <tetrahedronGeometry args={[1, 0]} />
      case 'dodecahedron':
        return <dodecahedronGeometry args={[1, 0]} />
      case 'box':
        return <boxGeometry args={[1, 1, 1]} />
      case 'torus':
        return <torusGeometry args={[1, 0.3, 16, 32]} />
      default:
        return <icosahedronGeometry args={[1, 0]} />
    }
  }, [geometry])

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        {GeometryComponent}
        <MeshDistortMaterial
          color={color}
          wireframe
          distort={distort}
          speed={2}
          transparent
          opacity={0.6}
        />
        <Edges scale={1.01} threshold={15} color={color} />
      </mesh>
    </Float>
  )
}

function GridFloor() {
  const gridRef = useRef<THREE.GridHelper>(null)

  useFrame((state) => {
    if (!gridRef.current) return
    gridRef.current.position.z = (state.clock.elapsedTime * 0.5) % 2
  })

  return (
    <group position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <gridHelper
        ref={gridRef}
        args={[50, 50, '#00d9ff', '#1a1a1a']}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
  )
}

// Seeded random number generator for deterministic particle positions
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// Pre-generate particle positions outside component to avoid impure render
const PARTICLE_COUNT = 500
const PARTICLE_POSITIONS = (() => {
  const pos = new Float32Array(PARTICLE_COUNT * 3)
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    pos[i * 3] = (seededRandom(i * 3) - 0.5) * 20
    pos[i * 3 + 1] = (seededRandom(i * 3 + 1) - 0.5) * 20
    pos[i * 3 + 2] = (seededRandom(i * 3 + 2) - 0.5) * 20
  }
  return pos
})()

function Particles() {
  const particlesRef = useRef<THREE.Points>(null)

  useFrame((state) => {
    if (!particlesRef.current) return
    particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02
    particlesRef.current.rotation.x = state.clock.elapsedTime * 0.01
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[PARTICLE_POSITIONS, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#00d9ff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

function CentralStructure() {
  const groupRef = useRef<THREE.Group>(null)
  const mouse = useMouse()

  useFrame((state) => {
    if (!groupRef.current) return

    // Slow rotation
    groupRef.current.rotation.y += 0.002

    // Mouse influence on the whole structure
    const targetRotationX = mouse.normalizedY * 0.2
    const targetRotationZ = mouse.normalizedX * 0.2

    groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.01
    groupRef.current.rotation.z += (targetRotationZ - groupRef.current.rotation.z) * 0.01

    // Pulse effect
    const pulse = Math.sin(state.clock.elapsedTime * 0.5) * 0.05 + 1
    groupRef.current.scale.setScalar(pulse)
  })

  return (
    <group ref={groupRef}>
      {/* Central icosahedron */}
      <FloatingGeometry
        position={[0, 0, 0]}
        geometry="icosahedron"
        scale={1.5}
        color="#00d9ff"
        rotationSpeed={0.5}
        distort={0.1}
      />

      {/* Orbiting geometries */}
      <FloatingGeometry
        position={[3, 1, 0]}
        geometry="octahedron"
        scale={0.5}
        color="#ffffff"
        rotationSpeed={1}
        distort={0}
      />
      <FloatingGeometry
        position={[-3, -0.5, 1]}
        geometry="tetrahedron"
        scale={0.6}
        color="#00d9ff"
        rotationSpeed={0.8}
        distort={0}
      />
      <FloatingGeometry
        position={[2, -1.5, -2]}
        geometry="dodecahedron"
        scale={0.4}
        color="#ffffff"
        rotationSpeed={1.2}
        distort={0}
      />
      <FloatingGeometry
        position={[-2, 2, -1]}
        geometry="box"
        scale={0.4}
        color="#00d9ff"
        rotationSpeed={0.6}
        distort={0}
      />
    </group>
  )
}

export function VoidScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#0a0a0a']} />
        <fog attach="fog" args={['#0a0a0a', 5, 20]} />

        {/* Lighting */}
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#00d9ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#ffffff" />
        <spotLight
          position={[0, 10, 0]}
          angle={0.3}
          penumbra={1}
          intensity={0.5}
          color="#00d9ff"
        />

        {/* Main structure */}
        <CentralStructure />

        {/* Background particles */}
        <Particles />

        {/* Grid floor */}
        <GridFloor />
      </Canvas>
    </div>
  )
}
