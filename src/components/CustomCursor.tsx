import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useStore } from '../store/useStore'

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const { cursorVariant, isLoading } = useStore()

  useEffect(() => {
    const cursor = cursorRef.current
    const cursorDot = cursorDotRef.current
    if (!cursor || !cursorDot) return

    let mouseX = 0
    let mouseY = 0

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY

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
    if (!cursor || !cursorDot) return

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
        className="fixed top-0 left-0 w-10 h-10 pointer-events-none z-[9998] mix-blend-difference"
        style={{
          transform: 'translate(-50%, -50%)',
          border: '1px solid var(--pure-white)',
          borderRadius: '50%',
        }}
      />
      {/* Inner dot cursor */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 pointer-events-none z-[9999]"
        style={{
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'var(--electric-blue)',
          borderRadius: '50%',
          boxShadow: '0 0 10px var(--electric-blue)',
        }}
      />
    </>
  )
}
