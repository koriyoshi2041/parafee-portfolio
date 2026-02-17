import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { VoidScene } from './VoidScene'
import { useStore } from '../store/useStore'

gsap.registerPlugin(ScrollTrigger)

// Enhanced SplitText with stagger-ready chars
function SplitText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {text.split('').map((char, i) => (
        <span 
          key={i} 
          className="char inline-block" 
          style={{ 
            opacity: 0, 
            transform: 'translateY(120%) rotateX(-80deg)',
            transformOrigin: 'center bottom',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  )
}

// Animated counter component
function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [current, setCurrent] = useState(0)
  
  useEffect(() => {
    const duration = 2000
    const start = Date.now()
    const animate = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.floor(eased * value))
      if (progress < 1) requestAnimationFrame(animate)
    }
    const timer = setTimeout(animate, 1500)
    return () => clearTimeout(timer)
  }, [value])
  
  return <span>{current}{suffix}</span>
}

// Noise overlay component
function NoiseOverlay() {
  return (
    <div 
      className="pointer-events-none absolute inset-0 z-20 opacity-[0.03]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
      }}
    />
  )
}

// Floating orbs for depth
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large gradient orb */}
      <div 
        className="absolute w-[800px] h-[800px] rounded-full blur-[120px] opacity-20"
        style={{
          background: 'radial-gradient(circle, var(--electric-blue) 0%, transparent 70%)',
          top: '-20%',
          right: '-10%',
          animation: 'floatOrb 20s ease-in-out infinite',
        }}
      />
      {/* Secondary orb */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full blur-[100px] opacity-10"
        style={{
          background: 'radial-gradient(circle, #fff 0%, transparent 70%)',
          bottom: '-10%',
          left: '-5%',
          animation: 'floatOrb 15s ease-in-out infinite reverse',
        }}
      />
    </div>
  )
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subheadRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const { setCursorVariant, isLoading } = useStore()

  useEffect(() => {
    if (isLoading) return

    const tl = gsap.timeline({ delay: 0.5 })

    // Badge entrance with bounce
    tl.fromTo(
      badgeRef.current,
      { opacity: 0, scale: 0.8, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)' }
    )

    // Animate chars with elastic effect
    const chars = headlineRef.current?.querySelectorAll('.char')
    if (chars) {
      tl.to(chars, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 1,
        stagger: {
          each: 0.04,
          from: 'start',
        },
        ease: 'elastic.out(1, 0.5)',
      }, '-=0.3')
    }

    // Subhead with word reveal
    tl.fromTo(
      subheadRef.current,
      { opacity: 0, y: 40, filter: 'blur(10px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' },
      '-=0.6'
    )

    // Stats counter entrance
    tl.fromTo(
      statsRef.current?.children || [],
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' },
      '-=0.4'
    )

    // CTA with stagger
    tl.fromTo(
      ctaRef.current?.children || [],
      { opacity: 0, y: 30, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.15, ease: 'back.out(1.4)' },
      '-=0.3'
    )

    // Scroll indicator
    tl.fromTo(
      scrollIndicatorRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.2'
    )

    // Multi-layer parallax on scroll
    const section = sectionRef.current
    if (section) {
      // Headline parallax - moves up faster
      gsap.to(headlineRef.current, {
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
        y: -150,
        opacity: 0,
        scale: 0.95,
      })

      // Subhead - moves slower
      gsap.to(subheadRef.current, {
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 2,
        },
        y: -80,
        opacity: 0,
      })

      // Badge - moves fastest
      gsap.to(badgeRef.current, {
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '50% top',
          scrub: 1,
        },
        y: -200,
        opacity: 0,
      })

      // Stats parallax
      gsap.to(statsRef.current, {
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.8,
        },
        y: -60,
        opacity: 0,
      })

      // CTA parallax
      gsap.to(ctaRef.current, {
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 2.2,
        },
        y: -40,
        opacity: 0,
      })
    }

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach((st) => st.kill())
    }
  }, [isLoading])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* 3D Background */}
      <VoidScene />

      {/* Noise texture overlay */}
      <NoiseOverlay />

      {/* Floating gradient orbs */}
      <FloatingOrbs />

      {/* Vignette effect */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(10,10,10,0.4) 100%)',
        }}
      />

      {/* Content overlay */}
      <div className="relative z-10 text-center px-8 max-w-5xl">
        {/* Badge */}
        <div 
          ref={badgeRef}
          className="inline-flex items-center gap-3 mb-8 px-5 py-2.5 border border-[var(--gray-subtle)] rounded-full backdrop-blur-sm bg-white/[0.02]"
          style={{ opacity: 0 }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--electric-blue)] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--electric-blue)]" />
          </span>
          <span className="font-mono text-xs tracking-wider text-[var(--gray-muted)] uppercase">
            Available for projects
          </span>
        </div>

        {/* Main headline */}
        <h1
          ref={headlineRef}
          className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight mb-6 overflow-hidden perspective-1000"
          onMouseEnter={() => setCursorVariant('text')}
          onMouseLeave={() => setCursorVariant('default')}
        >
          <SplitText text="Designing the " />
          <span className="gradient-text relative">
            <SplitText text="void" />
            {/* Glowing underline */}
            <span 
              className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--electric-blue)] to-transparent"
              style={{ 
                boxShadow: '0 0 20px var(--electric-blue)',
                animation: 'pulseGlow 2s ease-in-out infinite',
              }}
            />
          </span>
        </h1>

        {/* Subheadline */}
        <p
          ref={subheadRef}
          className="text-lg md:text-xl text-[var(--gray-muted)] max-w-2xl mx-auto mb-10 font-light leading-relaxed"
          style={{ opacity: 0 }}
        >
          Crafting immersive digital experiences where geometry meets the infinite.
          <br />
          <span className="text-white font-normal">Building from the void.</span>
        </p>

        {/* Stats row */}
        <div 
          ref={statsRef}
          className="flex items-center justify-center gap-12 mb-12"
        >
          <div className="text-center">
            <div className="text-3xl font-light text-white mb-1">
              <AnimatedNumber value={50} suffix="+" />
            </div>
            <div className="text-xs font-mono tracking-wider text-[var(--gray-muted)] uppercase">
              Projects
            </div>
          </div>
          <div className="w-px h-10 bg-[var(--gray-subtle)]" />
          <div className="text-center">
            <div className="text-3xl font-light text-white mb-1">
              <AnimatedNumber value={8} suffix="+" />
            </div>
            <div className="text-xs font-mono tracking-wider text-[var(--gray-muted)] uppercase">
              Years
            </div>
          </div>
          <div className="w-px h-10 bg-[var(--gray-subtle)]" />
          <div className="text-center">
            <div className="text-3xl font-light text-white mb-1">
              <AnimatedNumber value={100} suffix="%" />
            </div>
            <div className="text-xs font-mono tracking-wider text-[var(--gray-muted)] uppercase">
              Passion
            </div>
          </div>
        </div>

        {/* CTA */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <a
            href="#work"
            className="group relative px-8 py-4 bg-transparent border border-white text-white font-mono text-sm tracking-wider uppercase overflow-hidden magnetic-btn"
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            <span className="relative z-10 transition-colors duration-300 group-hover:text-[var(--void-black)]">
              View Work
            </span>
            <span className="absolute inset-0 bg-white transform scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100" />
            {/* Shine effect */}
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"
              />
            </span>
          </a>

          <a
            href="#contact"
            className="group flex items-center gap-3 px-8 py-4 text-[var(--electric-blue)] font-mono text-sm tracking-wider uppercase"
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            <span className="relative">
              Get in Touch
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[var(--electric-blue)] transition-all duration-300 group-hover:w-full" />
            </span>
            <span className="transform transition-transform duration-300 group-hover:translate-x-2">
              →
            </span>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        style={{ opacity: 0 }}
      >
        <span className="font-mono text-xs tracking-wider text-[var(--gray-muted)] uppercase">
          Scroll to explore
        </span>
        <div className="relative w-6 h-10 border border-[var(--gray-subtle)] rounded-full overflow-hidden">
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-3 bg-[var(--electric-blue)] rounded-full scroll-dot"
          />
        </div>
      </div>

      {/* Side decorations */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4 hero-side-decoration">
        <div className="w-px h-20 bg-gradient-to-b from-transparent via-[var(--electric-blue)] to-transparent" />
        <span className="font-mono text-xs tracking-wider text-[var(--gray-muted)] writing-vertical">
          2024
        </span>
        <div className="w-px h-20 bg-gradient-to-b from-transparent via-[var(--electric-blue)] to-transparent" />
      </div>

      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4 hero-side-decoration">
        <div className="w-px h-20 bg-gradient-to-b from-transparent via-[var(--gray-subtle)] to-transparent" />
        <span className="font-mono text-xs tracking-wider text-[var(--gray-muted)] writing-vertical">
          Portfolio
        </span>
        <div className="w-px h-20 bg-gradient-to-b from-transparent via-[var(--gray-subtle)] to-transparent" />
      </div>

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l border-t border-[var(--gray-subtle)] opacity-30" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r border-t border-[var(--gray-subtle)] opacity-30" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l border-b border-[var(--gray-subtle)] opacity-30" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r border-b border-[var(--gray-subtle)] opacity-30" />

      <style>{`
        @keyframes scrollPulse {
          0%, 100% { transform: translateX(-50%) translateY(0); opacity: 1; }
          50% { transform: translateX(-50%) translateY(16px); opacity: 0; }
        }
        
        .scroll-dot {
          animation: scrollPulse 2s ease-in-out infinite;
        }
        
        @keyframes floatOrb {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        .writing-vertical {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .hero-side-decoration {
          animation: fadeSlideIn 1s ease-out 1.5s both;
        }
        
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(-50%) translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(-50%) translateX(0);
          }
        }
        
        .hero-side-decoration:last-of-type {
          animation-name: fadeSlideInRight;
        }
        
        @keyframes fadeSlideInRight {
          from {
            opacity: 0;
            transform: translateY(-50%) translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateY(-50%) translateX(0);
          }
        }
      `}</style>
    </section>
  )
}
