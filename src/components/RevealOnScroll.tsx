import { useRef, useEffect, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type AnimationType = 
  | 'fade-up' 
  | 'fade-down' 
  | 'fade-left' 
  | 'fade-right'
  | 'scale-up'
  | 'rotate-in'
  | 'blur-in'
  | 'split-reveal'
  | 'mask-reveal'

interface RevealOnScrollProps {
  children: ReactNode
  animation?: AnimationType
  delay?: number
  duration?: number
  stagger?: number
  threshold?: number
  className?: string
  once?: boolean
}

export function RevealOnScroll({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 1,
  stagger = 0.1,
  threshold = 0.2,
  className = '',
  once = true,
}: RevealOnScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // Initial state based on animation type
    const getInitialState = () => {
      switch (animation) {
        case 'fade-up':
          return { opacity: 0, y: 80 }
        case 'fade-down':
          return { opacity: 0, y: -80 }
        case 'fade-left':
          return { opacity: 0, x: 80 }
        case 'fade-right':
          return { opacity: 0, x: -80 }
        case 'scale-up':
          return { opacity: 0, scale: 0.8 }
        case 'rotate-in':
          return { opacity: 0, rotate: -10, scale: 0.9 }
        case 'blur-in':
          return { opacity: 0, filter: 'blur(20px)' }
        case 'split-reveal':
          return { clipPath: 'inset(0 100% 0 0)' }
        case 'mask-reveal':
          return { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' }
        default:
          return { opacity: 0, y: 50 }
      }
    }

    // Final state
    const getFinalState = () => {
      switch (animation) {
        case 'fade-up':
        case 'fade-down':
          return { opacity: 1, y: 0 }
        case 'fade-left':
        case 'fade-right':
          return { opacity: 1, x: 0 }
        case 'scale-up':
          return { opacity: 1, scale: 1 }
        case 'rotate-in':
          return { opacity: 1, rotate: 0, scale: 1 }
        case 'blur-in':
          return { opacity: 1, filter: 'blur(0px)' }
        case 'split-reveal':
          return { clipPath: 'inset(0 0% 0 0)' }
        case 'mask-reveal':
          return { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }
        default:
          return { opacity: 1, y: 0 }
      }
    }

    // Set initial state
    gsap.set(el, getInitialState())

    // Create animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: `top ${100 - threshold * 100}%`,
        toggleActions: once ? 'play none none none' : 'play reverse play reverse',
        onEnter: () => {
          if (once && hasAnimated.current) return
          hasAnimated.current = true
        },
      },
    })

    tl.to(el, {
      ...getFinalState(),
      duration,
      delay,
      ease: 'power3.out',
    })

    // Staggered children animation
    const children = el.querySelectorAll('[data-reveal-child]')
    if (children.length > 0) {
      gsap.set(children, { opacity: 0, y: 30 })
      tl.to(children, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger,
        ease: 'power2.out',
      }, `-=${duration * 0.5}`)
    }

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [animation, delay, duration, stagger, threshold, once])

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}

// Staggered list component
interface StaggeredListProps {
  children: ReactNode[]
  className?: string
  itemClassName?: string
  delay?: number
  stagger?: number
}

export function StaggeredList({
  children,
  className = '',
  itemClassName = '',
  delay = 0,
  stagger = 0.1,
}: StaggeredListProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const items = el.children

    gsap.set(items, { 
      opacity: 0, 
      y: 60,
      rotateX: -15,
      transformPerspective: 1000,
    })

    gsap.to(items, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: 0.8,
      stagger,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [delay, stagger])

  return (
    <div ref={containerRef} className={className}>
      {children.map((child, index) => (
        <div key={index} className={itemClassName}>
          {child}
        </div>
      ))}
    </div>
  )
}

// Parallax wrapper component
interface ParallaxProps {
  children: ReactNode
  speed?: number
  className?: string
}

export function Parallax({
  children,
  speed = 0.5,
  className = '',
}: ParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    gsap.to(el, {
      y: () => speed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [speed])

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}

// Text line reveal animation
interface TextRevealProps {
  children: string
  className?: string
  delay?: number
}

export function TextReveal({ children, className = '', delay = 0 }: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const lines = el.querySelectorAll('.line')

    gsap.set(lines, { 
      y: '100%',
    })

    gsap.to(lines, {
      y: '0%',
      duration: 1,
      stagger: 0.1,
      delay,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [delay])

  const lines = children.split('\n')

  return (
    <div ref={containerRef} className={className}>
      {lines.map((line, index) => (
        <div key={index} className="overflow-hidden">
          <span className="line block">{line}</span>
        </div>
      ))}
    </div>
  )
}
