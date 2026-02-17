import { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Preloader } from './components/Preloader'
import { CustomCursor } from './components/CustomCursor'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { SelectedWorks } from './components/SelectedWorks'
import { AboutSection } from './components/AboutSection'
import { ContactSection } from './components/ContactSection'
import { Footer } from './components/Footer'
import { ScrollProgress } from './components/ScrollProgress'
import { useLenis } from './hooks/useLenis'
import { useStore } from './store/useStore'
import './index.css'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const { isLoading } = useStore()
  const [showContent, setShowContent] = useState(false)
  const mainRef = useRef<HTMLElement>(null)

  // Initialize Lenis smooth scroll
  useLenis()

  // Show content after preloader finishes with staggered reveal
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setShowContent(true), 100)
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  // Global scroll-based effects
  useEffect(() => {
    if (!showContent || !mainRef.current) return

    // Smooth color transitions between sections
    const sections = mainRef.current.querySelectorAll('section')
    
    sections.forEach((section, index) => {
      // Add entrance animation for each section
      gsap.fromTo(section,
        { 
          opacity: 0.3,
        },
        {
          opacity: 1,
          duration: 0.5,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 0.5,
          },
        }
      )

      // Add exit animation (subtle scale and fade)
      if (index < sections.length - 1) {
        gsap.to(section, {
          scale: 0.98,
          opacity: 0.8,
          scrollTrigger: {
            trigger: section,
            start: 'bottom 50%',
            end: 'bottom top',
            scrub: true,
          },
        })
      }
    })

    // Background gradient shift based on scroll
    gsap.to('body', {
      '--scroll-progress': 1,
      ease: 'none',
      scrollTrigger: {
        trigger: mainRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [showContent])

  return (
    <div className="noise scroll-container">
      <CustomCursor />
      <Preloader />

      {showContent && (
        <>
          <ScrollProgress />
          <main ref={mainRef} className="main-content">
            <Navbar />
            <Hero />
            <SelectedWorks />
            <AboutSection />
            <ContactSection />
            <Footer />
          </main>
        </>
      )}
    </div>
  )
}

export default App
