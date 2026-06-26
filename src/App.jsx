import { useState, useEffect, useCallback, useRef } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import Loading from './components/Loading'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PageTransition from './components/PageTransition'
import Home from './pages/Home'
import ProjectsPage from './pages/ProjectsPage'
import ProjectDetail from './pages/ProjectDetail'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import NotFound from './pages/NotFound'
import SplashCursor from './components/SplashCursor'
import './App.css'

function ScrollToTop({ lenisRef }) {
  const { pathname } = useLocation()
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, lenisRef])
  return null
}

function AppContent() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const lenisRef = useRef(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    })

    lenisRef.current = lenis

    lenis.on('scroll', (e) => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? Math.min(e.scroll / docHeight, 1) : 0
      setScrollProgress(progress)
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  const handleMouseMove = useCallback((e) => {
    setMousePosition({
      x: (e.clientX / window.innerWidth - 0.5) * 20,
      y: (e.clientY / window.innerHeight - 0.5) * 20
    })
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [handleMouseMove])

  return (
    <>
      <div className="grain-overlay"></div>
      <SplashCursor
        SIM_RESOLUTION={128}
        DYE_RESOLUTION={1024}
        DENSITY_DISSIPATION={4}
        VELOCITY_DISSIPATION={3}
        PRESSURE={0.08}
        CURL={2}
        SPLAT_RADIUS={0.15}
        SPLAT_FORCE={3000}
        SHADING={true}
        RAINBOW_MODE={false}
        COLOR="#ffffff"
      />
      <a href="#about" className="skip-link">Skip to content</a>

      <ScrollToTop lenisRef={lenisRef} />
      <Navbar />
      <PageTransition>
        <main>
          <Routes>
            <Route path="/" element={<Home mousePosition={mousePosition} scrollProgress={scrollProgress} />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </PageTransition>
      <Footer />
    </>
  )
}

function App() {
  const [loading, setLoading] = useState(true)

  return (
    <BrowserRouter>
      <div className="app">
        {loading && <Loading onComplete={() => setLoading(false)} />}
        <AppContent />
      </div>
    </BrowserRouter>
  )
}

export default App
