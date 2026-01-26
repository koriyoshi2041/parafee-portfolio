import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useStore } from '../store/useStore'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  { id: 1, title: 'NewsDiver', category: 'AI Knowledge System', color: '#00d9ff', url: 'https://github.com/koriyoshi2041/MVPnewsdiver' },
  { id: 2, title: 'Private MLaaS', category: 'FHE + Machine Learning', color: '#ff00d9', url: 'https://github.com/koriyoshi2041/Private-MLaaS-FHE' },
  { id: 3, title: 'BB84 Visualizer', category: 'Quantum Cryptography', color: '#00ff88', url: 'https://github.com/koriyoshi2041/BB84-Visualizer' },
  { id: 4, title: 'Lenia Vivarium', category: 'Artificial Life', color: '#ffcc00', url: 'https://github.com/koriyoshi2041/LeniaVivarium' },
  { id: 5, title: '@kigland/studio', category: '3D Component Library', color: '#ff4444', url: 'https://github.com/kigland' },
  { id: 6, title: 'KnowledgeOS', category: 'Knowledge Management', color: '#8844ff', url: 'https://github.com/kigland' },
]

function ProjectCard({
  project,
  index
}: {
  project: typeof projects[0]
  index: number
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const { setCursorVariant } = useStore()
  const [isHovered, setIsHovered] = useState(false)

  // 3D tilt effect on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = (y - centerY) / 20
    const rotateY = (centerX - x) / 20

    gsap.to(cardRef.current, {
      rotateX: rotateX,
      rotateY: rotateY,
      duration: 0.5,
      ease: 'power2.out',
    })

    // Parallax effect on inner image
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        x: (x - centerX) / 10,
        y: (y - centerY) / 10,
        duration: 0.5,
        ease: 'power2.out',
      })
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setCursorVariant('default')

    if (cardRef.current) {
      gsap.to(cardRef.current, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: 'power2.out',
      })
    }

    if (imageRef.current) {
      gsap.to(imageRef.current, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
      })
    }
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
    setCursorVariant('hover')
  }

  return (
    <div
      ref={cardRef}
      className="project-card aspect-[4/5] rounded-lg overflow-hidden relative"
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {/* Animated background */}
      <div
        ref={imageRef}
        className="absolute inset-[-20px] transition-transform duration-700"
        style={{
          background: `
            radial-gradient(circle at 30% 30%, ${project.color}22 0%, transparent 50%),
            radial-gradient(circle at 70% 70%, ${project.color}11 0%, transparent 50%),
            linear-gradient(135deg, var(--gray-subtle) 0%, var(--void-deep) 100%)
          `,
        }}
      />

      {/* Animated grid pattern */}
      <div
        className="absolute inset-0 opacity-30 transition-opacity duration-500"
        style={{
          backgroundImage: `
            linear-gradient(${project.color}15 1px, transparent 1px),
            linear-gradient(90deg, ${project.color}15 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px',
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.7s ease-out',
        }}
      />

      {/* Glow effect on hover */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${project.color}33 0%, transparent 70%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Border glow */}
      <div
        className="absolute inset-0 rounded-lg transition-all duration-500"
        style={{
          border: `1px solid ${isHovered ? project.color : 'var(--gray-subtle)'}`,
          boxShadow: isHovered ? `0 0 30px ${project.color}44, inset 0 0 30px ${project.color}11` : 'none',
        }}
      />

      {/* Project number */}
      <div
        className="absolute top-6 left-6 font-mono text-6xl font-bold transition-all duration-500"
        style={{
          color: isHovered ? project.color : 'var(--gray-subtle)',
          textShadow: isHovered ? `0 0 30px ${project.color}` : 'none',
          transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        }}
      >
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* Content */}
      <div
        className="absolute bottom-0 left-0 right-0 p-6 transition-all duration-500"
        style={{
          transform: isHovered ? 'translateY(0)' : 'translateY(20px)',
          opacity: isHovered ? 1 : 0.7,
        }}
      >
        <h3
          className="text-2xl font-medium mb-2 transition-all duration-500"
          style={{
            color: isHovered ? project.color : 'var(--pure-white)',
          }}
        >
          {project.title}
        </h3>
        <p className="text-[var(--gray-muted)] text-sm font-mono uppercase tracking-wider">
          {project.category}
        </p>

        {/* Animated line */}
        <div
          className="h-px mt-4 transition-all duration-700 ease-out"
          style={{
            background: `linear-gradient(90deg, ${project.color}, transparent)`,
            transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'left',
          }}
        />
      </div>

      {/* Particle burst effect */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Burst particles from center */}
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30) * (Math.PI / 180)
            // Use deterministic pseudo-random based on index
            const distance = 80 + ((i * 17) % 40)
            return (
              <div
                key={`burst-${i}`}
                className="absolute w-2 h-2 rounded-full particle-burst"
                style={{
                  backgroundColor: project.color,
                  left: '50%',
                  top: '50%',
                  boxShadow: `0 0 10px ${project.color}, 0 0 20px ${project.color}`,
                  '--tx': `${Math.cos(angle) * distance}px`,
                  '--ty': `${Math.sin(angle) * distance}px`,
                  animationDelay: `${i * 0.03}s`,
                } as React.CSSProperties}
              />
            )
          })}
          {/* Sparkle particles */}
          {[...Array(8)].map((_, i) => {
            // Deterministic positions based on index using golden ratio distribution
            const phi = 1.618033988749
            const left = ((i * phi * 80) % 80) + 10
            const top = ((i * phi * 50 + 30) % 80) + 10
            return (
              <div
                key={`sparkle-${i}`}
                className="absolute w-1 h-1 rounded-full particle-sparkle"
                style={{
                  backgroundColor: '#fff',
                  left: `${left}%`,
                  top: `${top}%`,
                  boxShadow: `0 0 6px ${project.color}`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export function SelectedWorks() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const { setCursorVariant } = useStore()

  useEffect(() => {
    // Title animation on scroll
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 100, skewY: 5 },
      {
        opacity: 1,
        y: 0,
        skewY: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      }
    )

    // Staggered card animations
    const cards = gridRef.current?.querySelectorAll('.project-card')
    if (cards) {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 100, rotateX: -15 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 70%',
          },
        }
      )
    }

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill())
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="work"
      className="min-h-screen py-32 px-8 md:px-16 lg:px-24 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
        <div
          className="absolute top-1/4 right-0 w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, var(--electric-blue) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-end justify-between mb-16">
          <h2
            ref={titleRef}
            className="text-6xl md:text-8xl font-light gradient-text"
            onMouseEnter={() => setCursorVariant('text')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            Selected Works
          </h2>
          <span className="hidden md:block font-mono text-sm text-[var(--gray-muted)]">
            {String(projects.length).padStart(2, '0')} Projects
          </span>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes particle-burst {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0);
            opacity: 0;
          }
        }
        .particle-burst {
          animation: particle-burst 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        @keyframes particle-sparkle {
          0%, 100% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.5);
            opacity: 1;
          }
        }
        .particle-sparkle {
          animation: particle-sparkle 1.2s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}
