import { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Edges } from '@react-three/drei'
import * as THREE from 'three'
import { useMouse } from '../hooks/useMouse'

// Seeded random for deterministic generation
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

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
  const mouse = useMouse()

  useFrame((state) => {
    if (!gridRef.current) return
    gridRef.current.position.z = (state.clock.elapsedTime * 0.3) % 2
    // Subtle tilt based on mouse
    gridRef.current.rotation.x = -Math.PI / 2 + mouse.normalizedY * 0.05
  })

  return (
    <group position={[0, -3, 0]}>
      <gridHelper
        ref={gridRef}
        args={[60, 60, '#00d9ff', '#141414']}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      {/* Gradient fade overlay */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshBasicMaterial 
          transparent 
          opacity={0.8}
          color="#0a0a0a"
          depthWrite={false}
        >
        </meshBasicMaterial>
      </mesh>
    </group>
  )
}

// Multi-layer particle system
const PARTICLE_LAYERS = [
  { count: 300, size: 0.015, color: '#00d9ff', speed: 0.02, spread: 15 },
  { count: 200, size: 0.025, color: '#ffffff', speed: 0.01, spread: 20 },
  { count: 100, size: 0.04, color: '#00d9ff', speed: 0.005, spread: 25 },
]

function ParticleLayer({ 
  count, 
  size, 
  color, 
  speed, 
  spread, 
  seed = 0 
}: { 
  count: number
  size: number
  color: string
  speed: number
  spread: number
  seed?: number
}) {
  const particlesRef = useRef<THREE.Points>(null)
  const mouse = useMouse()
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (seededRandom(seed + i * 3) - 0.5) * spread
      pos[i * 3 + 1] = (seededRandom(seed + i * 3 + 1) - 0.5) * spread
      pos[i * 3 + 2] = (seededRandom(seed + i * 3 + 2) - 0.5) * spread
    }
    return pos
  }, [count, spread, seed])

  useFrame((state) => {
    if (!particlesRef.current) return
    particlesRef.current.rotation.y = state.clock.elapsedTime * speed
    particlesRef.current.rotation.x = state.clock.elapsedTime * speed * 0.5
    
    // Mouse influence
    particlesRef.current.rotation.y += mouse.normalizedX * 0.01
    particlesRef.current.rotation.x += mouse.normalizedY * 0.01
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function Particles() {
  return (
    <group>
      {PARTICLE_LAYERS.map((layer, i) => (
        <ParticleLayer key={i} {...layer} seed={i * 1000} />
      ))}
    </group>
  )
}

// Dynamic ring effect
function PulsingRings() {
  const ringsRef = useRef<THREE.Group>(null)
  const ringCount = 3

  useFrame((state) => {
    if (!ringsRef.current) return
    ringsRef.current.children.forEach((ring, i) => {
      const offset = i * (Math.PI * 2 / ringCount)
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5 + offset) * 0.2
      ring.scale.setScalar(scale)
      const mesh = ring as THREE.Mesh
      if (mesh.material instanceof THREE.MeshBasicMaterial) {
        mesh.material.opacity = 0.3 - Math.sin(state.clock.elapsedTime * 0.5 + offset) * 0.15
      }
    })
  })

  return (
    <group ref={ringsRef}>
      {Array.from({ length: ringCount }).map((_, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2 + i * 0.8, 2.05 + i * 0.8, 64]} />
          <meshBasicMaterial 
            color="#00d9ff" 
            transparent 
            opacity={0.3} 
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  )
}

// Floating lines decoration
function FloatingLines() {
  const linesRef = useRef<THREE.Group>(null)
  
  const lineData = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      start: new THREE.Vector3(
        (seededRandom(i * 10) - 0.5) * 10,
        (seededRandom(i * 10 + 1) - 0.5) * 6,
        (seededRandom(i * 10 + 2) - 0.5) * 10
      ),
      end: new THREE.Vector3(
        (seededRandom(i * 10 + 3) - 0.5) * 10,
        (seededRandom(i * 10 + 4) - 0.5) * 6,
        (seededRandom(i * 10 + 5) - 0.5) * 10
      ),
    }))
  }, [])

  useFrame((state) => {
    if (!linesRef.current) return
    linesRef.current.rotation.y = state.clock.elapsedTime * 0.03
  })

  return (
    <group ref={linesRef}>
      {lineData.map((line, i) => {
        const points = [line.start, line.end]
        const geometry = new THREE.BufferGeometry().setFromPoints(points)
        return (
          <line key={i}>
            <bufferGeometry attach="geometry" {...geometry} />
            <lineBasicMaterial 
              color="#00d9ff" 
              transparent 
              opacity={0.2}
            />
          </line>
        )
      })}
    </group>
  )
}

function CentralStructure() {
  const groupRef = useRef<THREE.Group>(null)
  const mouse = useMouse()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (!groupRef.current) return

    // Slow rotation
    groupRef.current.rotation.y += 0.002

    // Mouse influence on the whole structure
    const targetRotationX = mouse.normalizedY * 0.2
    const targetRotationZ = mouse.normalizedX * 0.2

    groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.01
    groupRef.current.rotation.z += (targetRotationZ - groupRef.current.rotation.z) * 0.01

    // Pulse effect - more dramatic when hovered
    const pulseIntensity = hovered ? 0.1 : 0.05
    const pulseSpeed = hovered ? 1 : 0.5
    const pulse = Math.sin(state.clock.elapsedTime * pulseSpeed) * pulseIntensity + 1
    groupRef.current.scale.setScalar(pulse)
  })

  return (
    <group 
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Central icosahedron */}
      <FloatingGeometry
        position={[0, 0, 0]}
        geometry="icosahedron"
        scale={1.5}
        color="#00d9ff"
        rotationSpeed={0.5}
        distort={hovered ? 0.3 : 0.1}
      />

      {/* Pulsing rings around central geometry */}
      <PulsingRings />

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
      <FloatingGeometry
        position={[1.5, 2.5, 1]}
        geometry="torus"
        scale={0.3}
        color="#ffffff"
        rotationSpeed={0.9}
        distort={0}
      />
    </group>
  )
}

// Camera controller for scroll-based movement
function CameraController() {
  const { camera } = useThree()
  const mouse = useMouse()

  useFrame(() => {
    // Subtle camera movement based on mouse
    camera.position.x += (mouse.normalizedX * 0.5 - camera.position.x) * 0.02
    camera.position.y += (mouse.normalizedY * 0.3 - camera.position.y) * 0.02
    camera.lookAt(0, 0, 0)
  })

  return null
}

// Post-processing glow effect (simulated with meshes)
function GlowEffect() {
  const glowRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (!glowRef.current) return
    const material = glowRef.current.material as THREE.MeshBasicMaterial
    material.opacity = 0.03 + Math.sin(state.clock.elapsedTime * 0.5) * 0.02
  })

  return (
    <mesh ref={glowRef} position={[0, 0, -5]}>
      <planeGeometry args={[30, 30]} />
      <meshBasicMaterial
        color="#00d9ff"
        transparent
        opacity={0.03}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

export function VoidScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#0a0a0a']} />
        <fog attach="fog" args={['#0a0a0a', 5, 25]} />

        {/* Camera controller */}
        <CameraController />

        {/* Lighting */}
        <ambientLight intensity={0.15} />
        <pointLight position={[10, 10, 10]} intensity={0.6} color="#00d9ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#ffffff" />
        <pointLight position={[0, 5, 5]} intensity={0.4} color="#00d9ff" />
        <spotLight
          position={[0, 10, 0]}
          angle={0.3}
          penumbra={1}
          intensity={0.5}
          color="#00d9ff"
        />

        {/* Glow background */}
        <GlowEffect />

        {/* Main structure */}
        <CentralStructure />

        {/* Multi-layer particles */}
        <Particles />

        {/* Floating decorative lines */}
        <FloatingLines />

        {/* Grid floor */}
        <GridFloor />
      </Canvas>

      {/* Scan line overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.02]"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        }}
      />
    </div>
  )
}
