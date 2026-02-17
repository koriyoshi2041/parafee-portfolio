import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollAnimationOptions {
  animation?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale' | 'blur'
  duration?: number
  delay?: number
  start?: string
  end?: string
  scrub?: boolean | number
  once?: boolean
  stagger?: number
}

export function useScrollAnimation<T extends HTMLElement>(
  options: ScrollAnimationOptions = {}
): RefObject<T> {
  const ref = useRef<T>(null)
  const {
    animation = 'fade-up',
    duration = 1,
    delay = 0,
    start = 'top 80%',
    end = 'bottom 20%',
    scrub = false,
    once = true,
    stagger = 0,
  } = options

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Get animation config
    const getAnimation = () => {
      switch (animation) {
        case 'fade-up':
          return {
            from: { opacity: 0, y: 60 },
            to: { opacity: 1, y: 0 },
          }
        case 'fade-down':
          return {
            from: { opacity: 0, y: -60 },
            to: { opacity: 1, y: 0 },
          }
        case 'fade-left':
          return {
            from: { opacity: 0, x: 60 },
            to: { opacity: 1, x: 0 },
          }
        case 'fade-right':
          return {
            from: { opacity: 0, x: -60 },
            to: { opacity: 1, x: 0 },
          }
        case 'scale':
          return {
            from: { opacity: 0, scale: 0.8 },
            to: { opacity: 1, scale: 1 },
          }
        case 'blur':
          return {
            from: { opacity: 0, filter: 'blur(10px)' },
            to: { opacity: 1, filter: 'blur(0px)' },
          }
        default:
          return {
            from: { opacity: 0, y: 60 },
            to: { opacity: 1, y: 0 },
          }
      }
    }

    const { from, to } = getAnimation()

    // Set initial state
    gsap.set(el, from)

    // Create animation
    const scrollTriggerConfig: ScrollTrigger.Vars = {
      trigger: el,
      start,
      toggleActions: once ? 'play none none none' : 'play reverse play reverse',
    }

    if (scrub) {
      scrollTriggerConfig.end = end
      scrollTriggerConfig.scrub = scrub
    }

    // Check if we should animate children with stagger
    if (stagger > 0 && el.children.length > 0) {
      gsap.set(el.children, from)
      gsap.to(el.children, {
        ...to,
        duration,
        delay,
        stagger,
        ease: 'power3.out',
        scrollTrigger: scrollTriggerConfig,
      })
    } else {
      gsap.to(el, {
        ...to,
        duration,
        delay,
        ease: 'power3.out',
        scrollTrigger: scrollTriggerConfig,
      })
    }

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [animation, duration, delay, start, end, scrub, once, stagger])

  return ref as RefObject<T>
}

// Hook for parallax effect
export function useParallax<T extends HTMLElement>(
  speed: number = 0.5
): RefObject<T> {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
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

  return ref as RefObject<T>
}

// Hook for scroll progress (0-1 value)
export function useScrollProgress(): number {
  const progressRef = useRef(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      progressRef.current = docHeight > 0 ? scrollTop / docHeight : 0
    }

    window.addEventListener('scroll', updateProgress, { passive: true })
    updateProgress()

    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  return progressRef.current
}

// Hook for detecting if element is in viewport
export function useInView<T extends HTMLElement>(
  threshold: number = 0.5
): [RefObject<T>, boolean] {
  const ref = useRef<T>(null)
  const isInView = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInView.current = entry.isIntersecting
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return [ref as RefObject<T>, isInView.current]
}
