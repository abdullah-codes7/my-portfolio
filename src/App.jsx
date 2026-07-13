import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import Loading from './components/Loading'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PageTransition from './components/PageTransition'
import SplashCursor from './components/SplashCursor'
import './App.css'

// ── Lazy-load every page so each becomes its own async chunk.
const Home = lazy(() => import('./pages/Home'))
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const OpenSourcePage = lazy(() => import('./pages/OpenSourcePage'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Minimal spinner shown while a lazy chunk loads.
function PageFallback() {
  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--bg-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        width: 32,
        height: 32,
        border: '1.5px solid rgba(255,255,255,0.15)',
        borderTopColor: 'rgba(255,255,255,0.7)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
    </div>
  )
}

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

function AppContent({ cursorReady }) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const lenisRef = useRef(null)
  const rafIdRef = useRef(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      syncTouch: false,
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
      rafIdRef.current = requestAnimationFrame(raf)
    }
    rafIdRef.current = requestAnimationFrame(raf)

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
      lenis.destroy()
    }
  }, [])

  return (
    <>
      <div className="grain-overlay" aria-hidden="true"></div>

      {/* SplashCursor only mounts AFTER the loading screen completes.
          This defers WebGL context creation (the TBT culprit) until the
          user is already seeing content — eliminates the 320ms main-thread
          block during First Contentful Paint. */}
      {cursorReady && (
        <SplashCursor
          SIM_RESOLUTION={64}
          DYE_RESOLUTION={512}
          DENSITY_DISSIPATION={4}
          VELOCITY_DISSIPATION={3}
          PRESSURE={0.08}
          PRESSURE_ITERATIONS={10}
          CURL={2}
          SPLAT_RADIUS={0.15}
          SPLAT_FORCE={3000}
          SHADING={true}
          RAINBOW_MODE={false}
          COLOR="#ffffff"
        />
      )}

      <a href="#main-content" className="skip-link">Skip to content</a>

      <ScrollToTop lenisRef={lenisRef} />
      <Navbar />
      <PageTransition>
        <main id="main-content">
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Home scrollProgress={scrollProgress} />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/open-source" element={<OpenSourcePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
      </PageTransition>
      <Footer />
    </>
  )
}

function App() {
  // ── Skip the loading screen on repeat visits within the same session.
  // On first visit, sessionStorage has no '_pv' key → show loading.
  // After the first load completes, Loading.jsx sets '_pv' → all subsequent
  // navigations/refreshes within the tab skip straight to content.
  const hasVisited = (() => {
    try { return !!sessionStorage.getItem('_pv') } catch (_) { return false }
  })()

  const [loading, setLoading] = useState(!hasVisited)
  // SplashCursor only activates after loading finishes to eliminate TBT.
  const [cursorReady, setCursorReady] = useState(hasVisited)

  const handleLoadComplete = () => {
    setLoading(false)
    // Small delay so the curtain fully closes before WebGL starts up.
    setTimeout(() => setCursorReady(true), 200)
  }

  return (
    <BrowserRouter>
      <div className="app">
        {loading && <Loading onComplete={handleLoadComplete} />}
        <AppContent cursorReady={cursorReady} />
      </div>
    </BrowserRouter>
  )
}

export default App
