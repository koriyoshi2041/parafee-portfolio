import { useState, useEffect, useCallback } from 'react'

interface MousePosition {
  x: number
  y: number
  normalizedX: number
  normalizedY: number
}

export function useMouse() {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  })

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const normalizedX = (e.clientX / window.innerWidth) * 2 - 1
    const normalizedY = -(e.clientY / window.innerHeight) * 2 + 1

    setMousePosition({
      x: e.clientX,
      y: e.clientY,
      normalizedX,
      normalizedY,
    })
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  return mousePosition
}
