import { useRef, useEffect, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface SectionTransitionProps {
  children: ReactNode
  id?: string
  className?: string
  bgColor?: string
  parallaxIntensity?: number
}

export function SectionTransition({
  children,
  id,
  className = '',
  bgColor = 'transparent',
  parallaxIntensity = 0.3,
}: SectionTransitionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const content = contentRef.current
    const overlay = overlayRef.current
    if (!section || !content) return

    // Content parallax effect
    gsap.to(content, {
      y: () => window.innerHeight * parallaxIntensity,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    })

    // Overlay reveal effect for dramatic transitions
    if (overlay) {
      gsap.fromTo(overlay,
        { scaleY: 1 },
        {
          scaleY: 0,
          duration: 1.5,
          ease: 'power4.inOut',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      )
    }

    // Pin-like sticky effect
    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const progress = self.progress
        // Scale content slightly as you scroll through
        gsap.to(content, {
          scale: 1 - progress * 0.05,
          opacity: 1 - progress * 0.3,
          duration: 0.1,
        })
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [parallaxIntensity])

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`relative ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      {/* Transition overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 origin-bottom pointer-events-none z-20"
        style={{
          background: 'linear-gradient(to bottom, var(--void-deep), var(--void-black))',
        }}
      />
      
      {/* Content wrapper */}
      <div ref={contentRef} className="relative z-10">
        {children}
      </div>
    </section>
  )
}

// Horizontal scroll section
interface HorizontalScrollProps {
  children: ReactNode
  className?: string
}

export function HorizontalScroll({ children, className = '' }: HorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const scroll = scrollRef.current
    if (!container || !scroll) return

    const scrollWidth = scroll.scrollWidth - window.innerWidth

    gsap.to(scroll, {
      x: -scrollWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: () => `+=${scrollWidth}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [])

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <div ref={scrollRef} className="flex">
        {children}
      </div>
    </div>
  )
}

// Smooth section snap
interface SectionSnapProps {
  children: ReactNode[]
  className?: string
}

export function SectionSnap({ children, className = '' }: SectionSnapProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sections = containerRef.current?.children
    if (!sections) return

    Array.from(sections).forEach((section, index) => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          gsap.to(section, {
            opacity: 1,
            scale: 1,
            duration: 0.5,
          })
        },
        onLeave: () => {
          if (index < sections.length - 1) {
            gsap.to(section, {
              opacity: 0.5,
              scale: 0.95,
              duration: 0.5,
            })
          }
        },
        onEnterBack: () => {
          gsap.to(section, {
            opacity: 1,
            scale: 1,
            duration: 0.5,
          })
        },
        onLeaveBack: () => {
          if (index > 0) {
            gsap.to(section, {
              opacity: 0.5,
              scale: 0.95,
              duration: 0.5,
            })
          }
        },
      })
    })

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [])

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}

// Fade between sections
interface CrossfadeSectionProps {
  children: ReactNode
  className?: string
}

export function CrossfadeSection({ children, className = '' }: CrossfadeSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    // Fade in on enter
    gsap.fromTo(section,
      { 
        opacity: 0,
        y: 100,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    )

    // Fade out on leave
    gsap.to(section, {
      opacity: 0,
      y: -50,
      ease: 'power2.in',
      scrollTrigger: {
        trigger: section,
        start: 'bottom 20%',
        end: 'bottom top',
        scrub: true,
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [])

  return (
    <section ref={sectionRef} className={className}>
      {children}
    </section>
  )
}
