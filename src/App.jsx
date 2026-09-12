import { useState, useEffect, useRef, lazy, Suspense, memo, useCallback } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import Loading from './components/Loading'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SideNav from './components/SideNav'
import PageTransition from './components/PageTransition'
import AIAssistantChat from './components/AIAssistantChat'
import './App.css'

const AIAssistantIcon = memo(({ onClick, hasOpenedChat }) => {
  return (
    <div className="ai-assistant-fab-container">
      {!hasOpenedChat && (
        <div className="ai-click-prompt-wrapper">
          <div className="ai-click-prompt">Click me</div>
        </div>
      )}
      <div 
        className="ai-assistant-fab" 
        aria-label="AI Assistant" 
        role="button" 
        tabIndex={0}
        onClick={onClick}
      >
        <svg viewBox="0 0 100 100" className="ai-assistant-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="aiGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          <filter id="aiGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* The main bubble body with a tail */}
        <path 
          d="M 20 50 
             C 20 25, 30 15, 50 15 
             C 70 15, 80 25, 80 50 
             C 80 65, 75 75, 60 75
             L 70 85 
             L 50 80
             C 30 80, 20 70, 20 50 Z" 
          fill="url(#aiGlow)" 
          filter="url(#aiGlowFilter)"
        />
        
        {/* Two vertical pills (eyes) */}
        <rect className="ai-eye" x="38" y="38" width="8" height="20" rx="4" fill="#ffffff" />
        <rect className="ai-eye" x="54" y="38" width="8" height="20" rx="4" fill="#ffffff" />
      </svg>
      </div>
    </div>
  )
})

// ── Lazy-load every page so each becomes its own async chunk.
const Home = lazy(() => import('./pages/Home'))
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'))
const ProductsPage = lazy(() => import('./pages/ProductsPage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const OpenSourcePage = lazy(() => import('./pages/OpenSourcePage'))
const LinksPage = lazy(() => import('./pages/LinksPage'))
const ResumePage = lazy(() => import('./pages/ResumePage'))
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
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [hasOpenedChat, setHasOpenedChat] = useState(false)
  const lenisRef = useRef(null)
  const rafIdRef = useRef(null)

  const toggleChat = useCallback(() => {
    setIsChatOpen(prev => !prev)
    setHasOpenedChat(true)
  }, [])

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
      // You can dispatch custom events or set CSS variables here if needed
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

  const location = useLocation();
  const isLinksPage = location.pathname === '/links';

  return (
    <>
      <div className="grain-overlay" aria-hidden="true"></div>

      <a href="#main-content" className="skip-link">Skip to content</a>

      <ScrollToTop lenisRef={lenisRef} />
      {!isLinksPage && <Navbar />}
      <PageTransition>
        <main id="main-content">
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/open-source" element={<OpenSourcePage />} />
              <Route path="/links" element={<LinksPage />} />
              <Route path="/resume" element={<ResumePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
      </PageTransition>
      {!isLinksPage && <SideNav />}
      {!isLinksPage && <Footer />}
      {!isLinksPage && <AIAssistantIcon onClick={toggleChat} hasOpenedChat={hasOpenedChat} />}
      <AIAssistantChat isOpen={isChatOpen} onClose={useCallback(() => setIsChatOpen(false), [])} />
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
