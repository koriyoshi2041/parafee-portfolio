import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useStore } from '../store/useStore'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  { id: 1, title: 'VibeCoder Learn', category: 'AI Education / Interactive App', color: '#00d9ff', url: 'https://github.com/koriyoshi2041/vibecoder-app' },
  { id: 2, title: 'LearnSaaS', category: 'Next.js / Stripe / Auth.js', color: '#ff00d9', url: 'https://github.com/koriyoshi2041/learnsaas' },
  { id: 3, title: 'CC Learning Hooks', category: 'Claude Code / Dev Tools', color: '#ff6b35', url: 'https://github.com/koriyoshi2041/cc-learning-hooks' },
  { id: 4, title: 'Forward-Forward PyTorch', category: 'Deep Learning / Research', color: '#00ff88', url: 'https://github.com/koriyoshi2041/forward-forward-pytorch' },
  { id: 5, title: 'This Portfolio', category: 'React / GSAP / Creative Dev', color: '#8b5cf6', url: 'https://github.com/koriyoshi2041/parafee-portfolio' },
  { id: 6, title: 'Agent TipJar', category: 'Crypto / USDC on Base', color: '#ffcc00', url: 'https://github.com/koriyoshi2041/agent-tipjar' },
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

  const handleClick = () => {
    if (project.url) {
      window.open(project.url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div
      ref={cardRef}
      className="project-card aspect-[4/5] rounded-lg overflow-hidden relative cursor-pointer"
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
    >
      {/* Animated background with vibrant gradients */}
      <div
        ref={imageRef}
        className="absolute inset-[-20px] transition-transform duration-700"
        style={{
          background: `
            radial-gradient(ellipse at 20% 20%, ${project.color}55 0%, transparent 40%),
            radial-gradient(ellipse at 80% 80%, ${project.color}44 0%, transparent 40%),
            radial-gradient(ellipse at 50% 50%, ${project.color}22 0%, transparent 60%),
            linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 50%, var(--void-deep) 100%)
          `,
        }}
      />

      {/* Animated mesh grid pattern */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{
          backgroundImage: `
            linear-gradient(${project.color}30 1px, transparent 1px),
            linear-gradient(90deg, ${project.color}30 1px, transparent 1px)
          `,
          backgroundSize: isHovered ? '25px 25px' : '40px 40px',
          opacity: isHovered ? 0.5 : 0.25,
          transform: isHovered ? 'perspective(500px) rotateX(10deg)' : 'none',
        }}
      />

      {/* Floating orbs decoration */}
      <div
        className="absolute w-20 h-20 rounded-full transition-all duration-1000"
        style={{
          background: `radial-gradient(circle, ${project.color}66 0%, transparent 70%)`,
          top: '15%',
          right: '10%',
          filter: 'blur(20px)',
          transform: isHovered ? 'scale(1.5) translate(-10px, 10px)' : 'scale(1)',
        }}
      />
      <div
        className="absolute w-12 h-12 rounded-full transition-all duration-1000 delay-100"
        style={{
          background: `radial-gradient(circle, ${project.color}55 0%, transparent 70%)`,
          bottom: '30%',
          left: '15%',
          filter: 'blur(15px)',
          transform: isHovered ? 'scale(1.8) translate(10px, -10px)' : 'scale(1)',
        }}
      />

      {/* Diagonal accent lines */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ opacity: isHovered ? 0.4 : 0.15 }}
      >
        <div
          className="absolute h-px transition-all duration-700"
          style={{
            background: `linear-gradient(90deg, transparent, ${project.color}, transparent)`,
            width: '200%',
            top: '25%',
            left: '-50%',
            transform: `rotate(-15deg) translateX(${isHovered ? '10%' : '0'})`,
          }}
        />
        <div
          className="absolute h-px transition-all duration-700 delay-100"
          style={{
            background: `linear-gradient(90deg, transparent, ${project.color}88, transparent)`,
            width: '200%',
            top: '60%',
            left: '-50%',
            transform: `rotate(-15deg) translateX(${isHovered ? '-10%' : '0'})`,
          }}
        />
      </div>

      {/* Center glow effect on hover */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${project.color}55 0%, transparent 50%)`,
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

    // Enhanced staggered card animations with more dramatic entrance
    const cards = gridRef.current?.querySelectorAll('.project-card')
    if (cards) {
      // Set initial state
      gsap.set(cards, {
        opacity: 0,
        y: 120,
        scale: 0.8,
        rotateX: -20,
        rotateY: 15,
        filter: 'blur(10px)',
        transformPerspective: 1000,
      })

      // Create staggered entrance animation
      cards.forEach((card, index) => {
        // Alternate direction for visual interest
        const isEven = index % 2 === 0
        const xOffset = isEven ? -50 : 50
        const rotateDirection = isEven ? 15 : -15

        gsap.set(card, {
          x: xOffset,
          rotateY: rotateDirection,
        })

        gsap.to(card, {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          rotateX: 0,
          rotateY: 0,
          filter: 'blur(0px)',
          duration: 1.2,
          delay: index * 0.15,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        })

        // Add a subtle bounce effect at the end
        gsap.to(card, {
          y: -10,
          duration: 0.3,
          delay: index * 0.15 + 1.0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        })

        gsap.to(card, {
          y: 0,
          duration: 0.4,
          delay: index * 0.15 + 1.3,
          ease: 'bounce.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        })
      })
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
