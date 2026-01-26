import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { useStore } from '../store/useStore'

export function Navbar() {
  const navRef = useRef<HTMLElement>(null)
  const { setCursorVariant, isLoading } = useStore()

  useEffect(() => {
    if (isLoading) return

    gsap.fromTo(
      navRef.current,
      { y: -100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        delay: 0.5,
        ease: 'power3.out',
      }
    )
  }, [isLoading])

  const navItems = [
    { label: 'Work', href: '#work' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex justify-between items-center mix-blend-difference"
      style={{ opacity: 0 }}
    >
      {/* Logo */}
      <a
        href="#"
        className="relative group"
        onMouseEnter={() => setCursorVariant('hover')}
        onMouseLeave={() => setCursorVariant('default')}
      >
        <span className="font-mono text-sm tracking-[0.3em] uppercase text-white">
          Void<span className="text-[var(--electric-blue)]">.</span>
        </span>
        <span
          className="absolute -bottom-1 left-0 w-0 h-px bg-[var(--electric-blue)] transition-all duration-300 group-hover:w-full"
        />
      </a>

      {/* Nav links */}
      <ul className="hidden md:flex items-center gap-12">
        {navItems.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              className="relative group font-mono text-xs tracking-[0.2em] uppercase text-white"
              onMouseEnter={() => setCursorVariant('hover')}
              onMouseLeave={() => setCursorVariant('default')}
            >
              <span className="relative">
                {item.label}
                <span
                  className="absolute -bottom-1 left-0 w-0 h-px bg-[var(--electric-blue)] transition-all duration-300 group-hover:w-full"
                />
              </span>
            </a>
          </li>
        ))}
      </ul>

      {/* Menu button (mobile) */}
      <button
        className="md:hidden flex flex-col gap-1.5 p-2"
        onMouseEnter={() => setCursorVariant('hover')}
        onMouseLeave={() => setCursorVariant('default')}
      >
        <span className="w-6 h-px bg-white" />
        <span className="w-4 h-px bg-[var(--electric-blue)]" />
      </button>

      {/* Time indicator */}
      <div className="hidden lg:flex items-center gap-4 font-mono text-xs text-[var(--gray-muted)]">
        <span className="uppercase tracking-wider">
          {new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
          })}
        </span>
        <span className="w-2 h-2 rounded-full bg-[var(--electric-blue)] animate-pulse" />
      </div>
    </nav>
  )
}
