import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useStore } from '../store/useStore'

gsap.registerPlugin(ScrollTrigger)

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

          {/* Decorative code block */}
          <div
            className="mt-12 p-6 bg-[var(--void-deep)] rounded-lg border border-[var(--gray-subtle)] font-mono text-sm overflow-hidden"
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            <div className="flex gap-2 mb-4">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <span className="w-3 h-3 rounded-full bg-[#27ca40]" />
            </div>
            <pre className="text-[var(--gray-muted)] whitespace-pre-wrap">
              <span className="text-[var(--electric-blue)]">const</span> developer = {'{'}
              {'\n'}  <span className="text-[#ff79c6]">passion</span>: <span className="text-[#f1fa8c]">&quot;infinite&quot;</span>,
              {'\n'}  <span className="text-[#ff79c6]">coffee</span>: <span className="text-[#bd93f9]">true</span>,
              {'\n'}  <span className="text-[#ff79c6]">creativity</span>: <span className="text-[#50fa7b]">() =&gt; &quot;always&quot;</span>
              {'\n'}{'}'};
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}
