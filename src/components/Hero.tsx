import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { VoidScene } from './VoidScene'
import { useStore } from '../store/useStore'

gsap.registerPlugin(ScrollTrigger)

function SplitText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {text.split('').map((char, i) => (
        <span key={i} className="char inline-block" style={{ opacity: 0, transform: 'translateY(100%)' }}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  )
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subheadRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)
  const { setCursorVariant, isLoading } = useStore()

  useEffect(() => {
    if (isLoading) return

    const tl = gsap.timeline({ delay: 0.8 })

    // Animate chars
    const chars = headlineRef.current?.querySelectorAll('.char')
    if (chars) {
      tl.to(chars, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.03,
        ease: 'power3.out',
      })
    }

    // Subhead animation
    tl.fromTo(
      subheadRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.4'
    )

    // CTA animation
    tl.fromTo(
      ctaRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.4'
    )

    // Scroll indicator
    tl.fromTo(
      scrollIndicatorRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: 'power2.out' },
      '-=0.2'
    )

    // Parallax on scroll
    gsap.to(headlineRef.current, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
      y: -100,
      opacity: 0,
    })

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

      {/* Content overlay */}
      <div className="relative z-10 text-center px-8 max-w-5xl">
        {/* Badge */}
        <div className="inline-flex items-center gap-3 mb-8 px-4 py-2 border border-[var(--gray-subtle)] rounded-full">
          <span className="w-2 h-2 rounded-full bg-[var(--electric-blue)] animate-pulse" />
          <span className="font-mono text-xs tracking-wider text-[var(--gray-muted)] uppercase">
            Creative Developer
          </span>
        </div>

        {/* Main headline */}
        <h1
          ref={headlineRef}
          className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight mb-6 overflow-hidden"
          onMouseEnter={() => setCursorVariant('text')}
          onMouseLeave={() => setCursorVariant('default')}
        >
          <SplitText text="Designing the " />
          <span className="gradient-text">
            <SplitText text="void" />
          </span>
        </h1>

        {/* Subheadline */}
        <p
          ref={subheadRef}
          className="text-lg md:text-xl text-[var(--gray-muted)] max-w-2xl mx-auto mb-12 font-light leading-relaxed"
          style={{ opacity: 0 }}
        >
          Crafting immersive digital experiences where geometry meets the infinite.
          <br />
          <span className="text-white">Building from the void.</span>
        </p>

        {/* CTA */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-6" style={{ opacity: 0 }}>
          <a
            href="#work"
            className="group relative px-8 py-4 bg-transparent border border-white text-white font-mono text-sm tracking-wider uppercase overflow-hidden"
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            <span className="relative z-10 transition-colors duration-300 group-hover:text-[var(--void-black)]">
              View Work
            </span>
            <span className="absolute inset-0 bg-white transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
          </a>

          <a
            href="#contact"
            className="group flex items-center gap-3 px-8 py-4 text-[var(--electric-blue)] font-mono text-sm tracking-wider uppercase"
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            <span>Get in Touch</span>
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
          Scroll
        </span>
        <div className="relative w-6 h-10 border border-[var(--gray-subtle)] rounded-full">
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-2 bg-[var(--electric-blue)] rounded-full"
            style={{
              animation: 'scrollPulse 2s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      {/* Side decorations */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4">
        <div className="w-px h-20 bg-gradient-to-b from-transparent via-[var(--electric-blue)] to-transparent" />
        <span className="font-mono text-xs tracking-wider text-[var(--gray-muted)] writing-vertical">
          2024
        </span>
        <div className="w-px h-20 bg-gradient-to-b from-transparent via-[var(--electric-blue)] to-transparent" />
      </div>

      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4">
        <div className="w-px h-20 bg-gradient-to-b from-transparent via-[var(--gray-subtle)] to-transparent" />
        <span className="font-mono text-xs tracking-wider text-[var(--gray-muted)] writing-vertical">
          Portfolio
        </span>
        <div className="w-px h-20 bg-gradient-to-b from-transparent via-[var(--gray-subtle)] to-transparent" />
      </div>

      <style>{`
        @keyframes scrollPulse {
          0%, 100% { transform: translateX(-50%) translateY(0); opacity: 1; }
          50% { transform: translateX(-50%) translateY(4px); opacity: 0.5; }
        }
        .writing-vertical {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
    </section>
  )
}
