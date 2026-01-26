import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useStore } from '../store/useStore'

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const hasMovedRef = useRef(false)
  const { cursorVariant, isLoading } = useStore()

  useEffect(() => {
    const cursor = cursorRef.current
    const cursorDot = cursorDotRef.current
    if (!cursor || !cursorDot) return

    // Initially hide cursors
    gsap.set(cursor, { xPercent: -50, yPercent: -50, opacity: 0 })
    gsap.set(cursorDot, { xPercent: -50, yPercent: -50, opacity: 0 })

    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX
      const mouseY = e.clientY

      // Show and position cursor on first move
      if (!hasMovedRef.current) {
        hasMovedRef.current = true
        gsap.set(cursor, { x: mouseX, y: mouseY, opacity: 1 })
        gsap.set(cursorDot, { x: mouseX, y: mouseY, opacity: 1 })
      }

      // Instant follow for dot
      gsap.to(cursorDot, {
        x: mouseX,
        y: mouseY,
        duration: 0.1,
        ease: 'power2.out',
      })

      // Smooth follow for outer ring
      gsap.to(cursor, {
        x: mouseX,
        y: mouseY,
        duration: 0.5,
        ease: 'power3.out',
      })
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  // Cursor variant animations
  useEffect(() => {
    const cursor = cursorRef.current
    const cursorDot = cursorDotRef.current
    if (!cursor || !cursorDot || !hasMovedRef.current) return

    switch (cursorVariant) {
      case 'hover':
        gsap.to(cursor, {
          scale: 2.5,
          borderColor: 'var(--electric-blue)',
          duration: 0.3,
          ease: 'power2.out',
        })
        gsap.to(cursorDot, {
          scale: 0,
          duration: 0.3,
          ease: 'power2.out',
        })
        break
      case 'text':
        gsap.to(cursor, {
          scale: 4,
          borderColor: 'var(--pure-white)',
          opacity: 0.3,
          duration: 0.3,
          ease: 'power2.out',
        })
        gsap.to(cursorDot, {
          scale: 0,
          duration: 0.3,
          ease: 'power2.out',
        })
        break
      case 'hidden':
        gsap.to(cursor, {
          scale: 0,
          duration: 0.3,
          ease: 'power2.out',
        })
        gsap.to(cursorDot, {
          scale: 0,
          duration: 0.3,
          ease: 'power2.out',
        })
        break
      default:
        gsap.to(cursor, {
          scale: 1,
          borderColor: 'var(--pure-white)',
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        })
        gsap.to(cursorDot, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
        })
    }
  }, [cursorVariant])

  if (isLoading) return null

  return (
    <>
      {/* Outer ring cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-10 h-10 pointer-events-none z-[10001]"
        style={{
          border: '2px solid var(--pure-white)',
          borderRadius: '50%',
          boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)',
        }}
      />
      {/* Inner dot cursor */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2 h-2 pointer-events-none z-[10002]"
        style={{
          backgroundColor: 'var(--electric-blue)',
          borderRadius: '50%',
          boxShadow: '0 0 15px var(--electric-blue), 0 0 30px var(--electric-blue)',
        }}
      />
    </>
  )
}
