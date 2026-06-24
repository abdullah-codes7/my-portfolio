import { useState, useEffect, useCallback } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Loading from './components/Loading'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PageTransition from './components/PageTransition'
import Home from './pages/Home'
import ProjectsPage from './pages/ProjectsPage'
import ProjectDetail from './pages/ProjectDetail'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import './App.css'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function AppContent() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e) => {
    setMousePosition({
      x: (e.clientX / window.innerWidth - 0.5) * 20,
      y: (e.clientY / window.innerHeight - 0.5) * 20
    })
  }, [])

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const progress = docHeight > 0 ? Math.min(currentScrollY / docHeight, 1) : 0
    setScrollProgress(progress)
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleMouseMove, handleScroll])

  return (
    <>
      <div className="grain-overlay"></div>
      <a href="#about" className="skip-link">Skip to content</a>
      <div
        className="scroll-progress"
        style={{ transform: `scaleX(${scrollProgress})` }}
      ></div>

      <ScrollToTop />
      <Navbar />
      <PageTransition>
        <main>
          <Routes>
            <Route path="/" element={<Home mousePosition={mousePosition} scrollProgress={scrollProgress} />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
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
