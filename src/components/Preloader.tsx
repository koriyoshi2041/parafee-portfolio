import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useStore } from '../store/useStore'

export function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const numberRef = useRef<HTMLSpanElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const { setLoading, setLoadingProgress } = useStore()

  useEffect(() => {
    const tl = gsap.timeline()
    const counter = { value: 0 }

    // Animate loading progress
    tl.to(counter, {
      value: 100,
      duration: 2.5,
      ease: 'power2.inOut',
      onUpdate: () => {
        const progress = Math.round(counter.value)
        setLoadingProgress(progress)
        if (numberRef.current) {
          numberRef.current.textContent = progress.toString().padStart(3, '0')
        }
        if (progressRef.current) {
          progressRef.current.style.width = `${progress}%`
        }
      },
    })

    // Logo animation
    tl.to(
      logoRef.current,
      {
        scale: 1.2,
        duration: 0.3,
        ease: 'power2.in',
      },
      '-=0.5'
    )

    tl.to(logoRef.current, {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      ease: 'power4.in',
    })

    // Slide out animation
    tl.to(containerRef.current, {
      yPercent: -100,
      duration: 1,
      ease: 'power4.inOut',
      onComplete: () => setLoading(false),
    })

    return () => {
      tl.kill()
    }
  }, [setLoading, setLoadingProgress])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ backgroundColor: 'var(--void-deep)' }}
    >
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-20" />

      {/* Animated geometric lines */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-[var(--electric-blue)] to-transparent"
            style={{
              top: `${20 + i * 15}%`,
              left: 0,
              right: 0,
              animation: `line-expand 2s cubic-bezier(0.77, 0, 0.175, 1) ${i * 0.1}s forwards`,
              opacity: 0.3,
            }}
          />
        ))}
      </div>

      {/* Logo / Brand mark */}
      <div ref={logoRef} className="relative mb-12">
        <div className="relative w-24 h-24">
          {/* Outer rotating ring */}
          <div
            className="absolute inset-0 border border-[var(--electric-blue)] opacity-50"
            style={{
              animation: 'spin 4s linear infinite',
            }}
          />
          {/* Inner geometric shape */}
          <div
            className="absolute inset-4 border border-white"
            style={{
              transform: 'rotate(45deg)',
            }}
          />
          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-[var(--electric-blue)] glow-box" />
          </div>
        </div>
      </div>

      {/* Brand name */}
      <div className="font-mono text-xs tracking-[0.5em] text-[var(--gray-muted)] mb-16 uppercase">
        Void Architect
      </div>

      {/* Progress container */}
      <div className="relative w-64 md:w-96">
        {/* Progress bar background */}
        <div className="h-px bg-[var(--gray-subtle)] w-full">
          {/* Progress bar fill */}
          <div
            ref={progressRef}
            className="h-full bg-[var(--electric-blue)] glow-box"
            style={{ width: '0%', transition: 'width 0.1s linear' }}
          />
        </div>

        {/* Progress number */}
        <div className="flex justify-between items-center mt-4">
          <span className="font-mono text-xs text-[var(--gray-muted)]">LOADING</span>
          <span
            ref={numberRef}
            className="font-mono text-4xl md:text-5xl font-light tracking-wider"
            style={{ color: 'var(--electric-blue)' }}
          >
            000
          </span>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l border-t border-[var(--gray-subtle)]" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r border-t border-[var(--gray-subtle)]" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l border-b border-[var(--gray-subtle)]" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r border-b border-[var(--gray-subtle)]" />

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
