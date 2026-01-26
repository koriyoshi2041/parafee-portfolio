import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useStore } from '../store/useStore'

gsap.registerPlugin(ScrollTrigger)

export function Footer() {
  const footerRef = useRef<HTMLElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const { setCursorVariant } = useStore()

  useEffect(() => {
    // Animate the top border line
    gsap.fromTo(
      lineRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.5,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 90%',
        },
      }
    )
  }, [])

  return (
    <footer ref={footerRef} className="relative py-12 px-8 md:px-16 lg:px-24">
      {/* Animated top border */}
      <div
        ref={lineRef}
        className="absolute top-0 left-8 right-8 md:left-16 md:right-16 lg:left-24 lg:right-24 h-px origin-left"
        style={{
          background: 'linear-gradient(90deg, transparent, var(--electric-blue), transparent)',
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Main footer content */}
        <div className="grid md:grid-cols-3 gap-8 items-center py-8">
          {/* Logo/Brand */}
          <div
            className="text-center md:text-left"
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            <span className="font-mono text-lg tracking-wider">
              <span className="text-[var(--electric-blue)]">void</span>
              <span className="text-[var(--gray-muted)]">.architect</span>
            </span>
          </div>

          {/* Center - Back to top */}
          <div className="text-center">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group inline-flex flex-col items-center gap-2"
              onMouseEnter={() => setCursorVariant('hover')}
              onMouseLeave={() => setCursorVariant('default')}
            >
              <span
                className="w-10 h-10 rounded-full border border-[var(--gray-subtle)] flex items-center justify-center transition-all duration-300 group-hover:border-[var(--electric-blue)] group-hover:scale-110"
                style={{
                  boxShadow: '0 0 0 0 var(--electric-blue)',
                  transition: 'box-shadow 0.3s, border-color 0.3s, transform 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 20px var(--electric-blue)44'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 0 0 var(--electric-blue)'
                }}
              >
                <span className="text-[var(--gray-muted)] group-hover:text-[var(--electric-blue)] transition-all duration-300 transform group-hover:-translate-y-0.5">
                  ↑
                </span>
              </span>
              <span className="font-mono text-xs text-[var(--gray-muted)] uppercase tracking-wider">
                Back to top
              </span>
            </button>
          </div>

          {/* Right - Time */}
          <div className="text-center md:text-right font-mono text-xs text-[var(--gray-muted)]">
            <TimeDisplay />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[var(--gray-subtle)] flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-[var(--gray-muted)] text-sm">
            © {new Date().getFullYear()} Void Architect. All rights reserved.
          </span>

          <span className="text-[var(--gray-muted)] text-sm font-mono flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[var(--electric-blue)] animate-pulse" />
            Crafted with passion
          </span>
        </div>

        {/* Decorative bottom element */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-4">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-[var(--gray-subtle)]" />
            <span className="font-mono text-[10px] text-[var(--gray-subtle)] tracking-[0.5em] uppercase">
              ∞
            </span>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-[var(--gray-subtle)]" />
          </div>
        </div>
      </div>
    </footer>
  )
}

function TimeDisplay() {
  const timeRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const updateTime = () => {
      if (!timeRef.current) return
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, '0')
      const minutes = now.getMinutes().toString().padStart(2, '0')
      const seconds = now.getSeconds().toString().padStart(2, '0')
      timeRef.current.textContent = `${hours}:${minutes}:${seconds}`
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-1">
      <div className="text-[var(--electric-blue)]">Local Time</div>
      <div className="text-lg tracking-wider">
        <span ref={timeRef}>00:00:00</span>
      </div>
    </div>
  )
}
