import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useStore } from '../store/useStore'

gsap.registerPlugin(ScrollTrigger)

export function Navbar() {
  const navRef = useRef<HTMLElement>(null)
  const { setCursorVariant, isLoading } = useStore()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const lastScrollY = useRef(0)

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

    // Show/hide navbar on scroll
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Add background blur when scrolled
      setIsScrolled(currentScrollY > 50)
      
      // Hide/show based on scroll direction
      if (currentScrollY > lastScrollY.current && currentScrollY > 200) {
        setIsHidden(true)
      } else {
        setIsHidden(false)
      }
      
      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isLoading])

  // Animate hide/show
  useEffect(() => {
    if (!navRef.current) return
    gsap.to(navRef.current, {
      y: isHidden ? -100 : 0,
      duration: 0.3,
      ease: 'power2.out',
    })
  }, [isHidden])

  const navItems = [
    { label: 'Work', href: '#work' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ]

  // Smooth scroll to section
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 px-8 py-6 flex justify-between items-center transition-all duration-500 ${
        isScrolled 
          ? 'bg-[var(--void-black)]/80 backdrop-blur-lg py-4 border-b border-white/5' 
          : 'bg-transparent'
      }`}
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
        {navItems.map((item, index) => (
          <li key={item.label} style={{ transitionDelay: `${index * 50}ms` }}>
            <a
              href={item.href}
              onClick={(e) => scrollToSection(e, item.href)}
              className="relative group font-mono text-xs tracking-[0.2em] uppercase text-white overflow-hidden"
              onMouseEnter={() => setCursorVariant('hover')}
              onMouseLeave={() => setCursorVariant('default')}
            >
              <span className="relative inline-block transition-transform duration-300 group-hover:-translate-y-full">
                {item.label}
              </span>
              <span className="absolute top-full left-0 text-[var(--electric-blue)] transition-transform duration-300 group-hover:-translate-y-full">
                {item.label}
              </span>
              <span
                className="absolute -bottom-1 left-0 w-0 h-px bg-[var(--electric-blue)] transition-all duration-300 group-hover:w-full"
                style={{ boxShadow: '0 0 8px var(--electric-blue)' }}
              />
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
