import { useEffect, useState } from 'react'
import { Preloader } from './components/Preloader'
import { CustomCursor } from './components/CustomCursor'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { SelectedWorks } from './components/SelectedWorks'
import { AboutSection } from './components/AboutSection'
import { ContactSection } from './components/ContactSection'
import { Footer } from './components/Footer'
import { useLenis } from './hooks/useLenis'
import { useStore } from './store/useStore'
import './index.css'

function App() {
  const { isLoading } = useStore()
  const [showContent, setShowContent] = useState(false)

  // Initialize Lenis smooth scroll
  useLenis()

  // Show content after preloader finishes
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setShowContent(true), 100)
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  return (
    <div className="noise">
      <CustomCursor />
      <Preloader />

      {showContent && (
        <main>
          <Navbar />
          <Hero />
          <SelectedWorks />
          <AboutSection />
          <ContactSection />
          <Footer />
        </main>
      )}
    </div>
  )
}

export default App
