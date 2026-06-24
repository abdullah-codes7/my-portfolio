import { useEffect, useState, useRef } from 'react'
import { useScrollAnimation, useCountUp, useTilt, useScrollTilt, useStaggerAnimation } from '../hooks/useScrollAnimation'
import AnimatedTitle from '../components/AnimatedTitle'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './AboutPage.css'

gsap.registerPlugin(ScrollTrigger)

const timeline = [
  {
    year: '2025',
    title: 'Scaling & Shipping',
    description: 'Building and deploying production systems at scale.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
  },
  {
    year: '2024',
    title: 'Web3 & Smart Contracts',
    description: 'Solidity, DeFi protocols, and decentralized applications.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    ),
  },
  {
    year: '2023',
    title: 'Full Stack Specialization',
    description: 'React, Node.js, databases, and cloud infrastructure.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
  },
  {
    year: '2022',
    title: 'Open Source & Community',
    description: 'Contributing to open source and building in public.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    year: '2021',
    title: 'First Steps',
    description: 'Started coding and fell in love with software engineering.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
  },
]

const values = [
  {
    title: 'Clean Code',
    description: 'Readable, maintainable, and elegant. If a human can\'t understand it, it\'s not done.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
  },
  {
    title: 'Security First',
    description: 'Every line is a potential vulnerability. Security is a first-class concern.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
  {
    title: 'Performance',
    description: 'Every millisecond matters. Optimized for speed and efficiency.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
  {
    title: 'User Experience',
    description: 'Technology should feel invisible. Intuitive, fast, and delightful.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
  },
]

function parseStat(value) {
  const match = String(value).match(/(\d+(?:\.\d+)?)/)
  if (!match) return { target: 0, suffix: '' }
  return {
    target: parseFloat(match[1]),
    suffix: String(value).slice(match[1].length),
  }
}

function ValueCard({ value, index }) {
  const tiltRef = useTilt({ max: 10, scale: 1.02 })

  return (
    <div className="h-value-card">
      <div ref={tiltRef} className="h-value-core tilt-card spotlight-card">
        <span className="tilt-glare" aria-hidden="true"></span>
        <div className="h-value-icon">{value.icon}</div>
        <h3 className="h-value-title">{value.title}</h3>
        <p className="h-value-desc">{value.description}</p>
      </div>
    </div>
  )
}

function BioStat({ stat, index }) {
  const { target, suffix } = parseStat(stat.number)
  const decimals = Number.isInteger(target) ? 0 : 1
  const current = useCountUp(target, true, { duration: 1600, decimals })

  return (
    <div className="h-stat-card">
      <div className="h-stat-value">
        {current}{suffix}
      </div>
      <div className="h-stat-label">{stat.label}</div>
      <div className="h-stat-sub">{stat.sublabel}</div>
    </div>
  )
}

function AboutPage() {
  const [titleRef, titleVisible] = useScrollAnimation(0.2)
  const [time, setTime] = useState(new Date())
  const containerRef = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let ctx

    const timer = setTimeout(() => {
      const scrollWidth = container.scrollWidth - window.innerWidth

      ctx = gsap.to(container, {
        x: -scrollWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: container.parentElement,
          scrub: 1,
          start: 'top top',
          end: () => `+=${scrollWidth}`,
          invalidateOnRefresh: true,
        },
      })
    }, 200)

    return () => {
      clearTimeout(timer)
      if (ctx && ctx.scrollTrigger) ctx.scrollTrigger.kill()
      gsap.killTweensOf(container)
    }
  }, [])

  const stats = [
    { number: '2+', label: 'Years', sublabel: 'Experience' },
    { number: '25+', label: 'Projects', sublabel: 'Shipped' },
    { number: '6+', label: 'Open Source', sublabel: 'Contributions' },
  ]

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: true, timeZone: 'Asia/Karachi',
    })
  }

  return (
    <section className="about-page">
      {/* Header */}
      <div
        ref={titleRef}
        className={`about-page-header anim-slide-right ${titleVisible ? 'visible' : ''}`}
      >
        <div className="eyebrow">
          <span className="eyebrow-dot"></span>
          About
        </div>
        <AnimatedTitle line1="About" line2="ME" delay={0.3} className="at-page" />
        <p className="page-subtitle">The person behind the code</p>
      </div>

      {/* Horizontal Scroll */}
      <div className="h-scroll-wrapper">
        <div className="h-scroll-container" ref={containerRef}>

          {/* Bio + Terminal */}
          <div className="h-section">
            <div className="h-section-grid">
              <div className="h-bio-text">
                <p className="h-bio-lead">
                  I'm Valtrix — a full stack developer who builds web applications
                  and decentralized systems. I care about clean architecture,
                  security, and creating things that actually work well.
                </p>
                <p className="h-bio-regular">
                  My work spans the full stack: from React frontends and Node.js APIs
                  to Solidity smart contracts and on-chain protocols.
                </p>
                <p className="h-bio-regular">
                  When I'm not coding, I'm exploring new protocols, experimenting
                  with zero-knowledge proofs, or designing interfaces that make
                  complex systems feel simple.
                </p>
              </div>

              <div className="h-terminal">
                <div className="h-terminal-header">
                  <div className="terminal-dots">
                    <span className="dot dot-close"></span>
                    <span className="dot dot-min"></span>
                    <span className="dot dot-max"></span>
                  </div>
                  <span className="h-terminal-title">identity.sh</span>
                  <span className="h-terminal-time">{formatTime(time)} PKT</span>
                </div>
                <div className="h-terminal-body">
                  <div className="terminal-line">
                    <span className="terminal-prompt">$</span>
                    <span className="terminal-cmd">cat identity.json</span>
                  </div>
                  <pre className="terminal-json">{`{
  "name": "Valtrix",
  "role": "Full Stack Developer",
  "location": "Worldwide",
  "available": true,
  "languages": [
    "JavaScript", "TypeScript",
    "Solidity", "Python"
  ]
}`}</pre>
                  <div className="terminal-line">
                    <span className="terminal-prompt">$</span>
                    <span className="terminal-cursor">_</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="h-section h-section-stats">
            <div className="h-section-label">Stats</div>
            <div className="h-stats-row">
              {stats.map((stat, i) => (
                <BioStat key={i} stat={stat} index={i} />
              ))}
            </div>
          </div>

          {/* Journey */}
          <div className="h-section h-section-journey">
            <div className="h-section-label">Journey</div>
            <div className="h-journey-row">
              {timeline.map((item, i) => (
                <div key={i} className="h-journey-card">
                  <div className="h-journey-year">{item.year}</div>
                  <div className="h-journey-body">
                    <div className="h-journey-icon">{item.icon}</div>
                    <h3 className="h-journey-title">{item.title}</h3>
                    <p className="h-journey-desc">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Values */}
          <div className="h-section h-section-values">
            <div className="h-section-label">Philosophy</div>
            <div className="h-values-row">
              {values.map((value, i) => (
                <ValueCard key={i} value={value} index={i} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default AboutPage
