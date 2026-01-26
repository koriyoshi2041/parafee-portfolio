import { useRef, useEffect, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useStore } from '../store/useStore'

gsap.registerPlugin(ScrollTrigger)

// Ripple effect interface
interface Ripple {
  id: number
  x: number
  y: number
}

const socials = [
  { name: 'GitHub', url: 'https://github.com/koriyoshi2041', icon: '◈' },
  { name: 'Twitter', url: 'https://x.com/ShuaizhiC54843', icon: '𝕏' },
]

function MagneticButton({
  children,
  href,
  className = '',
}: {
  children: React.ReactNode
  href: string
  className?: string
}) {
  const buttonRef = useRef<HTMLAnchorElement>(null)
  const { setCursorVariant } = useStore()

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!buttonRef.current) return

    const rect = buttonRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    gsap.to(buttonRef.current, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.3,
      ease: 'power2.out',
    })
  }

  const handleMouseLeave = () => {
    setCursorVariant('default')
    gsap.to(buttonRef.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.3)',
    })
  }

  return (
    <a
      ref={buttonRef}
      href={href}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setCursorVariant('hover')}
    >
      {children}
    </a>
  )
}

function WaveText({ text }: { text: string }) {
  const [isHovered, setIsHovered] = useState(false)
  const containerRef = useRef<HTMLSpanElement>(null)

  return (
    <span
      ref={containerRef}
      className="inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="inline-block transition-transform duration-300"
          style={{
            transform: isHovered
              ? `translateY(${Math.sin(i * 0.5) * 10}px)`
              : 'translateY(0)',
            transitionDelay: `${i * 30}ms`,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  )
}

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const emailRef = useRef<HTMLAnchorElement>(null)
  const socialsRef = useRef<HTMLDivElement>(null)
  const { setCursorVariant } = useStore()
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [ripples, setRipples] = useState<Ripple[]>([])
  const rippleIdRef = useRef(0)

  // Create ripple on click
  const handleClick = useCallback((e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return

    const newRipple: Ripple = {
      id: rippleIdRef.current++,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }

    setRipples((prev) => [...prev, newRipple])

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id))
    }, 1500)
  }, [])

  useEffect(() => {
    // Title animation
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      }
    )

    // Email animation
    gsap.fromTo(
      emailRef.current,
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        delay: 0.3,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      }
    )

    // Socials animation
    const socialLinks = socialsRef.current?.querySelectorAll('a')
    if (socialLinks) {
      gsap.fromTo(
        socialLinks,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      )
    }

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill())
    }
  }, [])

  // Track mouse for gradient effect
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="min-h-screen py-32 px-8 md:px-16 lg:px-24 flex items-center justify-center relative overflow-hidden cursor-pointer"
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      {/* Interactive ripple effects */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute pointer-events-none ripple-effect"
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
        />
      ))}

      {/* Dynamic gradient background following mouse */}
      <div
        className="absolute inset-0 opacity-40 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, var(--electric-blue) 0%, transparent 40%)`,
        }}
      />

      {/* Secondary glow that trails behind */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, var(--electric-blue), transparent 60%)`,
          transition: 'background 0.5s ease-out',
        }}
      />

      {/* Animated circles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-[var(--electric-blue)] opacity-20"
            style={{
              width: `${300 + i * 200}px`,
              height: `${300 + i * 200}px`,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              animation: `pulse-ring ${3 + i}s ease-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(var(--electric-blue) 1px, transparent 1px),
            linear-gradient(90deg, var(--electric-blue) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2
          ref={titleRef}
          className="text-6xl md:text-8xl font-light mb-8"
          onMouseEnter={() => setCursorVariant('text')}
          onMouseLeave={() => setCursorVariant('default')}
        >
          Let&apos;s{' '}
          <span className="gradient-text">
            <WaveText text="Connect" />
          </span>
        </h2>

        <p className="text-xl text-[var(--gray-muted)] mb-12 max-w-xl mx-auto">
          Have a project in mind? Let&apos;s create something extraordinary together.
        </p>

        {/* Email CTA */}
        <MagneticButton
          href="mailto:shuaizhicheng336@gmail.com"
          className="inline-block relative group"
        >
          <span
            ref={emailRef}
            className="relative z-10 inline-block text-2xl md:text-4xl font-mono tracking-tight"
            style={{
              background: 'linear-gradient(135deg, var(--electric-blue) 0%, var(--pure-white) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            shuaizhicheng336@gmail.com
          </span>
          <span
            className="absolute -inset-4 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: 'radial-gradient(circle, var(--electric-blue)22 0%, transparent 70%)',
            }}
          />
        </MagneticButton>

        {/* Social links */}
        <div ref={socialsRef} className="flex justify-center gap-6 mt-16">
          {socials.map((social) => (
            <MagneticButton
              key={social.name}
              href={social.url}
              className="group relative w-16 h-16 flex items-center justify-center"
            >
              {/* Background */}
              <span
                className="absolute inset-0 rounded-full border border-[var(--gray-subtle)] group-hover:border-[var(--electric-blue)] transition-colors duration-300"
                style={{
                  background: 'linear-gradient(135deg, var(--void-deep) 0%, var(--gray-subtle) 100%)',
                }}
              />
              {/* Glow */}
              <span
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  boxShadow: '0 0 30px var(--electric-blue)44, inset 0 0 20px var(--electric-blue)22',
                }}
              />
              {/* Icon */}
              <span className="relative z-10 text-xl text-[var(--gray-muted)] group-hover:text-[var(--electric-blue)] transition-colors duration-300">
                {social.icon}
              </span>
              {/* Tooltip */}
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 font-mono text-xs text-[var(--gray-muted)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                {social.name}
              </span>
            </MagneticButton>
          ))}
        </div>

        {/* Decorative text */}
        <div className="mt-24 font-mono text-xs text-[var(--gray-subtle)] tracking-[0.3em] uppercase">
          <span className="inline-block animate-pulse mr-2">●</span>
          Available for freelance projects
          <span className="inline-block animate-pulse ml-2">●</span>
        </div>
      </div>

      <style>{`
        @keyframes pulse-ring {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0.3;
          }
          50% {
            opacity: 0.1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0;
          }
        }
        @keyframes ripple {
          0% {
            width: 0;
            height: 0;
            opacity: 0.6;
            transform: translate(-50%, -50%);
          }
          100% {
            width: 600px;
            height: 600px;
            opacity: 0;
            transform: translate(-50%, -50%);
          }
        }
        .ripple-effect {
          border-radius: 50%;
          background: radial-gradient(circle, var(--electric-blue) 0%, transparent 70%);
          animation: ripple 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>
    </section>
  )
}
