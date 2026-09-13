import { useState, useEffect, useMemo, useRef, useCallback, memo } from 'react'
import { Link } from 'react-router-dom'
import { useMagnetic } from '../hooks/useScrollAnimation'
import './Hero.css'

const Hero = memo(function Hero() {
  const [isVisible, setIsVisible] = useState(false)
  const [typedText, setTypedText] = useState('')
  const eclipseRef = useRef(null)
  const fullText = 'Full Stack Developer'

  const heroRef = useRef(null)
  const mesh1Ref = useRef(null)
  const mesh2Ref = useRef(null)
  const mesh3Ref = useRef(null)

  // Magnetic — CTA buttons pull toward cursor
  const ctaPrimaryRef = useMagnetic(0.35)
  const ctaGhostRef = useMagnetic(0.25)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isVisible) return
    let i = 0
    const typeTimer = setInterval(() => {
      if (i <= fullText.length) {
        setTypedText(fullText.slice(0, i))
        i++
      } else {
        clearInterval(typeTimer)
      }
    }, 80)
    return () => clearInterval(typeTimer)
  }, [isVisible])

  const handleMouseMove = useCallback((e) => {
    const el = eclipseRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    // Direct CSS var writes — the mouse never triggers a React render
    el.style.setProperty('--mx', `${x}%`)
    el.style.setProperty('--my', `${y}%`)
  }, [])

  // Unified scroll & mouse listener for maximum performance (bypasses React render)
  useEffect(() => {
    let raf = null
    const onMove = (e) => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = null
        const el = eclipseRef.current
        if (!el) return
        if (window.matchMedia && window.matchMedia('(pointer: fine)').matches) {
          const dx = (e.clientX / window.innerWidth - 0.5) * 20 * 0.4
          const dy = (e.clientY / window.innerHeight - 0.5) * 20 * 0.4
          el.style.setProperty('--eclipse-tx', `${dx}px`)
          el.style.setProperty('--eclipse-ty', `${dy}px`)
        }
      })
    }
    
    let scrollRaf = null
    const onScroll = () => {
      if (scrollRaf) return
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = null
        
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        const sp = docHeight > 0 ? Math.min(window.scrollY / docHeight, 1) : 0
        
        // Hero container parallax
        if (heroRef.current) {
          heroRef.current.style.opacity = 1 - sp * 0.7
          heroRef.current.style.transform = `translateY(${sp * -100}px)`
        }
        
        // Eclipse effects
        if (eclipseRef.current) {
          const scale = Math.max(0.3, 1 - sp * 0.7)
          const blur = Math.min(sp * 8, 6)
          eclipseRef.current.style.transform = `translate(var(--eclipse-tx, 0px), var(--eclipse-ty, 0px)) scale(${scale})`
          eclipseRef.current.style.filter = `blur(${blur}px)`
          eclipseRef.current.style.opacity = 1 - sp * 0.7
        }
        
        // Mesh Parallax
        const vh = window.innerHeight;
        const applyParallax = (ref, speed) => {
          if (!ref.current) return;
          const rect = ref.current.getBoundingClientRect()
          const center = rect.top + rect.height / 2
          const delta = center - vh / 2
          ref.current.style.transform = `translateY(${delta * speed * -0.1}px)`
        }
        
        applyParallax(mesh1Ref, 0.3)
        applyParallax(mesh2Ref, -0.2)
        applyParallax(mesh3Ref, 0.15)
      })
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll() // Init

    return () => {
      if (raf) cancelAnimationFrame(raf)
      if (scrollRaf) cancelAnimationFrame(scrollRaf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  // Generate 20 random particles — halved from 40, cuts compositor workload by 50%.
  const particles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 4,
      opacity: Math.random() * 0.4 + 0.1,
    })), [])



  return (
    <section id="hero" ref={heroRef} className="hero">
      {/* Background mesh gradients — parallax drift */}
      <div ref={mesh1Ref} className="hero-mesh-1"></div>
      <div ref={mesh2Ref} className="hero-mesh-2"></div>
      <div ref={mesh3Ref} className="hero-mesh-3"></div>

      {/* Floating particles */}
      <div className="hero-particles">
        {particles.map((p) => (
          <div
            key={p.id}
            className="hero-particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Central Eclipse */}
      <div className="hero-eclipse-stage">
        <div
          ref={eclipseRef}
          className="hero-eclipse"
          onMouseMove={handleMouseMove}
        >
          {/* Orbital rings */}
          <div className="orbital-ring orbital-ring-1"></div>
          <div className="orbital-ring orbital-ring-2"></div>
          <div className="orbital-ring orbital-ring-3"></div>

          {/* Orbital dots */}
          <div className="orbital-dot orbital-dot-1"></div>
          <div className="orbital-dot orbital-dot-2"></div>
          <div className="orbital-dot orbital-dot-3"></div>

          {/* Glow layers */}
          <div className="e-glow-outer"></div>
          <div className="e-glow-mid"></div>
          <div className="e-glow-inner"></div>

          {/* Mouse spotlight — vars written directly by handleMouseMove */}
          <div className="e-spotlight"></div>

          {/* Corona SVG */}
          <svg className="e-corona" viewBox="0 0 800 800">
            <defs>
              <radialGradient id="cGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                <stop offset="30%" stopColor="rgba(255,255,255,0)" />
                <stop offset="42%" stopColor="rgba(255,255,255,0.6)" />
                <stop offset="48%" stopColor="rgba(255,255,255,0.9)" />
                <stop offset="55%" stopColor="rgba(255,255,255,0.5)" />
                <stop offset="65%" stopColor="rgba(255,255,255,0.15)" />
                <stop offset="80%" stopColor="rgba(255,255,255,0.03)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </radialGradient>
              <filter id="cGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" result="b"/>
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="cSoft" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="16" result="b"/>
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>
            <circle cx="400" cy="400" r="380" fill="url(#cGrad)" filter="url(#cSoft)" />
            <g className="corona-streams" filter="url(#cGlow)">
              <ellipse cx="400" cy="400" rx="320" ry="370" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="50" opacity="0.4" />
              <ellipse cx="400" cy="400" rx="370" ry="320" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="50" opacity="0.35" />
              <ellipse cx="400" cy="400" rx="290" ry="350" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="40" opacity="0.3" transform="rotate(25 400 400)" />
              <ellipse cx="400" cy="400" rx="350" ry="290" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="40" opacity="0.25" transform="rotate(50 400 400)" />
              <ellipse cx="400" cy="400" rx="300" ry="340" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="35" opacity="0.2" transform="rotate(12 400 400)" />
              <ellipse cx="400" cy="400" rx="340" ry="300" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="35" opacity="0.18" transform="rotate(38 400 400)" />
            </g>
            <circle cx="400" cy="400" r="155" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" opacity="0.5" filter="url(#cGlow)" />
          </svg>

          {/* Black disc */}
          <div className="e-disc"></div>

          {/* Bright border ring */}
          <div className="e-border-ring"></div>

          {/* Hover ring pulse */}
          <div className="e-hover-ring"></div>
          <div className="e-hover-ring-2"></div>

          {/* Edge rim light */}
          <div className="e-edge"></div>
        </div>

        {/* Hero text overlaid on eclipse */}
        <div className={`hero-center-text ${isVisible ? 'visible' : ''}`}>
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-dot"></span>
            Available for projects
          </div>
          <h1 className="hero-name-center">
            <span className="hero-name-line">ABDULLAH</span>
          </h1>
          <p className="hero-role-center">
            <span className="typed-text">{typedText}</span>
            <span className="typed-cursor">|</span>
          </p>
          <div className="hero-actions-center">
            <Link ref={ctaPrimaryRef} to="/projects" className="cta-primary">
              <span>Explore work</span>
              <span className="cta-icon-circle">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </Link>
            <Link ref={ctaGhostRef} to="/contact" className="cta-ghost">
              Let's talk
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={`hero-scroll ${isVisible ? 'visible' : ''}`}>
        <div className="scroll-line"></div>
        <span className="scroll-text">Scroll</span>
      </div>
    </section>
  )
})

export default Hero
