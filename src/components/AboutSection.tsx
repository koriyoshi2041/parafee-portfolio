import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useStore } from '../store/useStore'

gsap.registerPlugin(ScrollTrigger)

// Typewriter code token type
interface CodeToken {
  text: string
  color?: string
}

// Pre-tokenized code with colors (moved outside component to avoid re-creation)
const CODE_LINES: CodeToken[][] = [
  [
    { text: 'const', color: 'var(--electric-blue)' },
    { text: ' developer = {' },
  ],
  [
    { text: '  ' },
    { text: 'passion', color: '#ff79c6' },
    { text: ': ' },
    { text: '"infinite"', color: '#f1fa8c' },
    { text: ',' },
  ],
  [
    { text: '  ' },
    { text: 'coffee', color: '#ff79c6' },
    { text: ': ' },
    { text: 'true', color: '#bd93f9' },
    { text: ',' },
  ],
  [
    { text: '  ' },
    { text: 'creativity', color: '#ff79c6' },
    { text: ': ' },
    { text: '() =>', color: '#50fa7b' },
    { text: ' ' },
    { text: '"always"', color: '#f1fa8c' },
  ],
  [{ text: '};' }],
]

// Typewriter effect component
function TypewriterCode() {
  const [displayedTokens, setDisplayedTokens] = useState<CodeToken[][]>([])
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { setCursorVariant } = useStore()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isTyping) {
          setIsTyping(true)
        }
      },
      { threshold: 0.5 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [isTyping])

  useEffect(() => {
    if (!isTyping) return
    if (currentLineIndex >= CODE_LINES.length) return

    // Calculate total chars in current line
    const currentLine = CODE_LINES[currentLineIndex]
    const totalChars = currentLine.reduce((sum: number, token: CodeToken) => sum + token.text.length, 0)

    if (currentCharIndex < totalChars) {
      const timeout = setTimeout(() => {
        // Build partial tokens up to currentCharIndex
        let charCount = 0
        const partialTokens: CodeToken[] = []

        for (const token of currentLine) {
          if (charCount + token.text.length <= currentCharIndex + 1) {
            partialTokens.push(token)
            charCount += token.text.length
          } else {
            const remaining = currentCharIndex + 1 - charCount
            if (remaining > 0) {
              partialTokens.push({
                text: token.text.slice(0, remaining),
                color: token.color,
              })
            }
            break
          }
        }

        setDisplayedTokens((prev) => {
          const newTokens = [...prev]
          newTokens[currentLineIndex] = partialTokens
          return newTokens
        })
        setCurrentCharIndex((prev) => prev + 1)
      }, 30 + Math.random() * 40)

      return () => clearTimeout(timeout)
    } else {
      const timeout = setTimeout(() => {
        setCurrentLineIndex((prev) => prev + 1)
        setCurrentCharIndex(0)
      }, 150)

      return () => clearTimeout(timeout)
    }
  }, [isTyping, currentLineIndex, currentCharIndex])

  return (
    <div
      ref={containerRef}
      className="mt-12 p-6 bg-[var(--void-deep)] rounded-lg border border-[var(--gray-subtle)] font-mono text-sm overflow-hidden relative"
      onMouseEnter={() => setCursorVariant('hover')}
      onMouseLeave={() => setCursorVariant('default')}
    >
      <div className="flex gap-2 mb-4">
        <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
        <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
        <span className="w-3 h-3 rounded-full bg-[#27ca40]" />
      </div>
      <pre className="text-[var(--gray-muted)] min-h-[120px]">
        {displayedTokens.map((line, lineIdx) => (
          <div key={lineIdx}>
            {line.map((token, tokenIdx) => (
              <span key={tokenIdx} style={{ color: token.color }}>
                {token.text}
              </span>
            ))}
          </div>
        ))}
        {currentLineIndex < CODE_LINES.length && (
          <span className="inline-block w-2 h-4 bg-[var(--electric-blue)] animate-blink ml-0.5 align-middle" />
        )}
      </pre>
      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
      `}</style>
    </div>
  )
}

const skills = [
  { name: 'AI / Machine Learning', level: 92 },
  { name: 'React / Next.js', level: 88 },
  { name: 'Python / FastAPI', level: 90 },
  { name: 'TypeScript', level: 85 },
  { name: 'Full-Stack Dev', level: 87 },
  { name: 'Creative Coding', level: 85 },
]

function AnimatedText({ text, delay = 0 }: { text: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const chars = ref.current?.querySelectorAll('.about-char')
    if (!chars) return

    gsap.fromTo(
      chars,
      { opacity: 0, y: 50, rotateX: -90 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.8,
        stagger: 0.02,
        ease: 'back.out(1.7)',
        delay,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 80%',
        },
      }
    )
  }, [delay])

  return (
    <span ref={ref} className="inline-block">
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="about-char inline-block"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  )
}

function SkillBar({ skill, index }: { skill: typeof skills[0]; index: number }) {
  const barRef = useRef<HTMLDivElement>(null)
  const { setCursorVariant } = useStore()

  useEffect(() => {
    gsap.fromTo(
      barRef.current,
      { scaleX: 0 },
      {
        scaleX: skill.level / 100,
        duration: 1.2,
        ease: 'power3.out',
        delay: index * 0.1,
        scrollTrigger: {
          trigger: barRef.current,
          start: 'top 90%',
        },
      }
    )
  }, [skill.level, index])

  return (
    <div
      className="group"
      onMouseEnter={() => setCursorVariant('hover')}
      onMouseLeave={() => setCursorVariant('default')}
    >
      <div className="flex justify-between mb-2">
        <span className="font-mono text-sm text-[var(--gray-muted)] group-hover:text-[var(--electric-blue)] transition-colors">
          {skill.name}
        </span>
        <span className="font-mono text-sm text-[var(--electric-blue)]">
          {skill.level}%
        </span>
      </div>
      <div className="h-1 bg-[var(--gray-subtle)] rounded-full overflow-hidden">
        <div
          ref={barRef}
          className="h-full rounded-full origin-left"
          style={{
            background: 'linear-gradient(90deg, var(--electric-blue), var(--pure-white))',
            boxShadow: '0 0 20px var(--electric-blue)',
          }}
        />
      </div>
    </div>
  )
}

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const { setCursorVariant } = useStore()

  useEffect(() => {
    // Parallax effect on the decorative element
    gsap.to(imageRef.current, {
      y: -100,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    })
  }, [])

  return (
    <section
      ref={sectionRef}
      id="about"
      className="min-h-screen py-32 px-8 md:px-16 lg:px-24 flex items-center relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating orb */}
        <div
          ref={imageRef}
          className="absolute top-1/4 right-10 w-64 h-64 md:w-96 md:h-96 opacity-30"
          style={{
            background: 'radial-gradient(circle, var(--electric-blue) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        {/* Grid lines */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%">
            <pattern id="about-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="var(--electric-blue)" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#about-grid)" />
          </svg>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
        {/* Left column - Text */}
        <div>
          <h2
            className="text-6xl md:text-8xl font-light mb-8 overflow-hidden"
            onMouseEnter={() => setCursorVariant('text')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            <AnimatedText text="About" />
          </h2>

          <div className="space-y-6">
            <p className="text-xl md:text-2xl text-[var(--gray-muted)] leading-relaxed">
              <AnimatedText text="AI builder exploring " delay={0.3} />
              <span className="text-[var(--electric-blue)]">
                <AnimatedText text="knowledge systems" delay={0.5} />
              </span>
              <AnimatedText text=" and " delay={0.6} />
              <span className="text-white">
                <AnimatedText text="information flow" delay={0.7} />
              </span>
              <AnimatedText text="." delay={0.8} />
            </p>

            <p className="text-lg text-[var(--gray-muted)] leading-relaxed">
              Sophomore at HIT, AI major. Building tools that transform how we learn and understand.
              7 months startup experience, shipping products end-to-end.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-[var(--gray-subtle)]">
            {[
              { value: '2nd', label: 'Year @ HIT' },
              { value: '7+', label: 'Months Startup' },
              { value: '∞', label: 'Ideas' },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="text-center group"
                onMouseEnter={() => setCursorVariant('hover')}
                onMouseLeave={() => setCursorVariant('default')}
              >
                <div
                  className="text-4xl md:text-5xl font-light mb-2 transition-all duration-500 group-hover:text-[var(--electric-blue)] group-hover:scale-110"
                  style={{
                    transitionDelay: `${i * 100}ms`,
                  }}
                >
                  {stat.value}
                </div>
                <div className="font-mono text-xs text-[var(--gray-muted)] uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column - Skills */}
        <div className="space-y-8">
          <h3 className="font-mono text-sm text-[var(--electric-blue)] uppercase tracking-wider mb-8">
            Skills & Expertise
          </h3>

          <div className="space-y-6">
            {skills.map((skill, i) => (
              <SkillBar key={skill.name} skill={skill} index={i} />
            ))}
          </div>

          {/* Typewriter code block */}
          <TypewriterCode />
        </div>
      </div>
    </section>
  )
}
