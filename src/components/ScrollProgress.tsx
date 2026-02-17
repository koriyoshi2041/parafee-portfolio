import { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sections = [
  { id: 'hero', label: '01' },
  { id: 'work', label: '02' },
  { id: 'about', label: '03' },
  { id: 'contact', label: '04' },
]

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  const [activeSection, setActiveSection] = useState(0)
  const progressRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Update progress on scroll
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollProgress = (scrollTop / docHeight) * 100
      setProgress(scrollProgress)
    }

    // Track active section
    sections.forEach((section, index) => {
      const el = document.getElementById(section.id) || 
                 (index === 0 ? document.querySelector('section') : null)
      if (!el) return

      ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActiveSection(index),
        onEnterBack: () => setActiveSection(index),
      })
    })

    window.addEventListener('scroll', updateProgress, { passive: true })
    updateProgress()

    return () => {
      window.removeEventListener('scroll', updateProgress)
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [])

  // Animate progress bar
  useEffect(() => {
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        scaleY: progress / 100,
        duration: 0.3,
        ease: 'power2.out',
      })
    }
  }, [progress])

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id) || 
               (id === 'hero' ? document.querySelector('section') : null)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div 
      ref={indicatorRef}
      className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center gap-4"
    >
      {/* Progress bar */}
      <div className="relative w-px h-32 bg-[var(--gray-subtle)] overflow-hidden rounded-full">
        <div
          ref={progressRef}
          className="absolute bottom-0 left-0 w-full origin-bottom"
          style={{
            background: 'linear-gradient(to top, var(--electric-blue), var(--electric-blue)88)',
            height: '100%',
            boxShadow: '0 0 10px var(--electric-blue)',
          }}
        />
      </div>

      {/* Section indicators */}
      <div className="flex flex-col gap-3 mt-4">
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className="group relative flex items-center justify-center"
            aria-label={`Go to section ${section.label}`}
          >
            {/* Dot */}
            <span
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                backgroundColor: activeSection === index 
                  ? 'var(--electric-blue)' 
                  : 'var(--gray-subtle)',
                boxShadow: activeSection === index 
                  ? '0 0 10px var(--electric-blue)' 
                  : 'none',
                transform: activeSection === index ? 'scale(1.5)' : 'scale(1)',
              }}
            />
            
            {/* Label on hover */}
            <span 
              className="absolute right-6 font-mono text-xs text-[var(--gray-muted)] opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap"
              style={{
                transform: 'translateX(10px)',
              }}
            >
              {section.label}
            </span>
          </button>
        ))}
      </div>

      {/* Percentage */}
      <div className="font-mono text-xs text-[var(--gray-muted)] mt-4">
        {Math.round(progress)}%
      </div>
    </div>
  )
}
