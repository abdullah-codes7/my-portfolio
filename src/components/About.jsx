import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { useScrollAnimation, useStaggerAnimation, useCountUp, useMagnetic } from '../hooks/useScrollAnimation'
import AnimatedTitle from './AnimatedTitle'
import './About.css'

function parseStat(value) {
  const match = String(value).match(/(\d+(?:\.\d+)?)/)
  if (!match) return { target: 0, suffix: '' }
  return {
    target: parseFloat(match[1]),
    suffix: String(value).slice(match[1].length),
  }
}

function About() {
  const [titleRef, titleVisible] = useScrollAnimation(0.2)
  const [bioRef, bioVisible] = useScrollAnimation(0.1)
  const [terminalRef, terminalVisible] = useScrollAnimation(0.1)
  const [bentoRef, bentoVisible] = useScrollAnimation(0.1)
  const [setBentoRef, visibleBento] = useStaggerAnimation(5, 0.1)
  const [ctaRef, ctaVisible] = useScrollAnimation(0.1)
  const [time, setTime] = useState(new Date())
  const magneticRef = useMagnetic(0.3)

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // MagicBento: spotlight + particles
  useEffect(() => {
    const bentoEl = document.querySelector('.about-bento')
    if (!bentoEl) return

    // Create spotlight element
    const spotlight = document.createElement('div')
    spotlight.className = 'mb-spotlight'
    document.body.appendChild(spotlight)

    const cards = bentoEl.querySelectorAll('.about-bento-card')
    const particlesMap = new Map()

    const createParticle = (card, x, y) => {
      const el = document.createElement('div')
      el.className = 'mb-particle'
      el.style.left = `${x}px`
      el.style.top = `${y}px`
      card.appendChild(el)

      gsap.fromTo(el, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' })
      gsap.to(el, {
        x: (Math.random() - 0.5) * 80,
        y: (Math.random() - 0.5) * 80,
        duration: 2 + Math.random() * 2,
        ease: 'none',
        repeat: -1,
        yoyo: true
      })
      gsap.to(el, {
        opacity: 0.2,
        duration: 1.5,
        ease: 'power2.inOut',
        repeat: -1,
        yoyo: true
      })

      return el
    }

    const clearParticles = (card) => {
      const pts = particlesMap.get(card) || []
      pts.forEach(p => {
        gsap.to(p, {
          scale: 0, opacity: 0, duration: 0.3, ease: 'back.in(1.7)',
          onComplete: () => p.parentNode?.removeChild(p)
        })
      })
      particlesMap.set(card, [])
    }

    const handleMouseMove = (e) => {
      const bentoRect = bentoEl.getBoundingClientRect()
      const inside = e.clientX >= bentoRect.left && e.clientX <= bentoRect.right &&
                     e.clientY >= bentoRect.top && e.clientY <= bentoRect.bottom

      if (!inside) {
        gsap.to(spotlight, { opacity: 0, duration: 0.3 })
        cards.forEach(c => c.style.setProperty('--glow-intensity', '0'))
        return
      }

      // Move spotlight
      gsap.to(spotlight, { left: e.clientX, top: e.clientY, duration: 0.1, opacity: 0.5 })

      // Update each card
      cards.forEach(card => {
        const rect = card.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dist = Math.hypot(e.clientX - cx, e.clientY - cy) - Math.max(rect.width, rect.height) / 2
        const maxDist = 300
        const intensity = Math.max(0, 1 - Math.max(0, dist) / maxDist)

        const relX = ((e.clientX - rect.left) / rect.width) * 100
        const relY = ((e.clientY - rect.top) / rect.height) * 100
        card.style.setProperty('--glow-x', `${relX}%`)
        card.style.setProperty('--glow-y', `${relY}%`)
        card.style.setProperty('--glow-intensity', intensity.toString())

        // Spawn particles on hover
        if (intensity > 0.3) {
          if (!particlesMap.has(card)) particlesMap.set(card, [])
          const pts = particlesMap.get(card)
          if (pts.length < 6) {
            const px = e.clientX - rect.left
            const py = e.clientY - rect.top
            pts.push(createParticle(card, px, py))
          }
        } else {
          clearParticles(card)
        }
      })
    }

    const handleMouseLeave = () => {
      gsap.to(spotlight, { opacity: 0, duration: 0.3 })
      cards.forEach(c => {
        c.style.setProperty('--glow-intensity', '0')
        clearParticles(c)
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      spotlight.parentNode?.removeChild(spotlight)
      cards.forEach(c => clearParticles(c))
    }
  }, [])

  const stats = [
    { number: '4+', label: 'Years Experience' },
    { number: '25+', label: 'Projects Shipped' },
    { number: '6+', label: 'Open Source Contributions' },
  ]

  const techStack = [
    'React', 'Next.js', 'TypeScript', 'Node.js', 'Solidity',
    'PostgreSQL', 'MongoDB', 'Docker', 'AWS', 'Vercel'
  ]

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: true, timeZone: 'Asia/Karachi',
    })
  }

  return (
    <section className="about" id="about">
      <div className="about-container">

        {/* Top Section: Title + Bio */}
        <div className="about-top">
          <div
            ref={titleRef}
            className={`about-title-col anim-slide-right ${titleVisible ? 'visible' : ''}`}
          >
            <div className="eyebrow">
              <span className="eyebrow-dot"></span>
              01 — About
            </div>
            <AnimatedTitle line1="About" line2="ME" delay={3.8} />
            <div className="about-title-accent"></div>
          </div>

          <div
            ref={bioRef}
            className={`about-bio-col anim-fade-up ${bioVisible ? 'visible' : ''}`}
          >
            <ul className="about-bio-list">
              <li>I'm Abdullah — a full stack developer building web applications and decentralized systems that push the boundary of what's possible.</li>
              <li>I work across the full stack — from React and Node.js to Solidity and smart contract architectures.</li>
              <li>Clean code, solid architecture, and security-first thinking drive everything I build.</li>
            </ul>
          </div>
        </div>

        {/* Terminal Card */}
        <div
          ref={terminalRef}
          className={`about-terminal anim-blur-in ${terminalVisible ? 'visible' : ''}`}
        >
          <div className="terminal-header">
            <div className="terminal-dots">
              <span className="dot dot-close"></span>
              <span className="dot dot-min"></span>
              <span className="dot dot-max"></span>
            </div>
            <span className="terminal-title">whoami</span>
            <div className="terminal-time">{formatTime(time)} PKT</div>
          </div>
          <div className="terminal-body">
            <div className="terminal-line">
              <span className="terminal-prompt">$</span>
              <span className="terminal-cmd">whoami</span>
            </div>
            <div className="terminal-output">
              <p><span className="t-key">name:</span> Abdullah</p>
              <p><span className="t-key">role:</span> Full Stack Developer</p>
              <p><span className="t-key">focus:</span> Full Stack, System Architecture</p>
              <p><span className="t-key">stack:</span> React / Node.js / Solidity / PostgreSQL</p>
              <p><span className="t-key">status:</span> <span className="t-green">available for work</span></p>
            </div>
            <div className="terminal-line">
              <span className="terminal-prompt">$</span>
              <span className="terminal-cursor">_</span>
            </div>
          </div>
        </div>

        {/* Bento Grid */}
        <div ref={bentoRef} className="about-bento">
          {/* Stat Cards */}
          {stats.map((stat, i) => {
            const { target, suffix } = parseStat(stat.number)
            return (
              <div
                key={i}
                ref={setBentoRef(i)}
                className={`about-bento-card about-stat-card magic-bento-card anim-scale-in ${visibleBento.has(i) ? 'visible' : ''}`}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <BentoStat stat={stat} target={target} suffix={suffix} visible={visibleBento.has(i)} />
              </div>
            )
          })}

          {/* Tech Stack Card */}
          <div
            ref={setBentoRef(3)}
            className={`about-bento-card about-tech-card magic-bento-card anim-scale-in ${visibleBento.has(3) ? 'visible' : ''}`}
            style={{ transitionDelay: '0.3s' }}
          >
            <h4 className="bento-card-title">Tech Stack</h4>
            <div className="tech-pills">
              {techStack.map((tech) => (
                <span key={tech} className="tech-pill">{tech}</span>
              ))}
            </div>
          </div>

          {/* Location Card */}
          <div
            ref={setBentoRef(4)}
            className={`about-bento-card about-location-card magic-bento-card anim-scale-in ${visibleBento.has(4) ? 'visible' : ''}`}
            style={{ transitionDelay: '0.4s' }}
          >
            <h4 className="bento-card-title">Location</h4>
            <p className="bento-card-value">Available Worldwide</p>
            <div className="bento-card-status">
              <span className="status-dot"></span>
              <span>Remote & On-site</span>
            </div>
          </div>
        </div>

        {/* View More CTA */}
        <div
          ref={ctaRef}
          className={`about-cta anim-fade-up ${ctaVisible ? 'visible' : ''}`}
        >
          <Link to="/about" ref={magneticRef} className="about-view-more">
            <span className="about-view-more-text">View Full Profile</span>
            <span className="about-view-more-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </span>
            <span className="about-view-more-ring"></span>
            <span className="about-view-more-glow"></span>
          </Link>
        </div>

        {/* Philosophy */}
        <div className={`about-philosophy anim-fade-up ${bentoVisible ? 'visible' : ''}`}>
          <div className="philosophy-line"></div>
          <blockquote className="philosophy-quote">
            "I believe in building software that's clean, secure, and actually works.
            Technology should feel invisible — the best interfaces are the ones you
            never notice."
          </blockquote>
          <div className="philosophy-line"></div>
        </div>

      </div>
    </section>
  )
}

function BentoStat({ stat, target, suffix, visible }) {
  const decimals = Number.isInteger(target) ? 0 : 1
  const current = useCountUp(target, visible, { duration: 1600, decimals })

  return (
    <>
      <div className="stat-value">
        {current}{visible ? suffix : ''}
      </div>
      <div className="stat-label">{stat.label}</div>
    </>
  )
}

export default About
