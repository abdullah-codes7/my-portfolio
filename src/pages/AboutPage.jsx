import { useEffect, useState } from 'react'
import { useScrollAnimation, useStaggerAnimation, useCountUp, useTilt, useScrollTilt } from '../hooks/useScrollAnimation'
import AnimatedTitle from '../components/AnimatedTitle'
import './AboutPage.css'

const timeline = [
  {
    year: '2025',
    title: 'Scaling & Shipping',
    description: 'Building and deploying production systems at scale. Focus on performance, monitoring, and reliable architecture.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
  },
  {
    year: '2024',
    title: 'Web3 & Smart Contracts',
    description: 'Diving deep into Solidity, DeFi protocols, and building decentralized applications with real-world utility.',
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
    description: 'Mastering the full stack — React, Node.js, databases, and cloud infrastructure. Shipping production apps.',
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
    description: 'Contributing to open source projects, building in public, and learning from the developer community.',
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
    description: 'Started coding, building small projects, and falling in love with the craft of software engineering.',
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
    description: 'Code should be readable, maintainable, and elegant. If a human can\'t understand it, it\'s not done.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
  },
  {
    title: 'Security First',
    description: 'Every line is a potential vulnerability. I write code with security as a first-class concern, not an afterthought.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
  {
    title: 'Performance',
    description: 'Every millisecond matters. I optimize for speed, efficiency, and resource usage — on-chain and off-chain.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
  {
    title: 'User Experience',
    description: 'Technology should feel invisible. I build interfaces that are intuitive, fast, and delightful to use.',
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

function ValueCard({ value, index, visible, setRef }) {
  const tiltRef = useTilt({ max: 10, scale: 1.02 })
  const scrollRef = useScrollTilt({ maxTilt: 5, axis: 'y' })

  return (
    <div
      ref={(el) => { setRef(index)(el); scrollRef.current = el }}
      className={`value-shell anim-scale-in ${visible(index) ? 'visible' : ''}`}
      style={{ transitionDelay: `${index * 0.12}s` }}
    >
      <div ref={tiltRef} className="value-core tilt-card spotlight-card">
        <span className="tilt-glare" aria-hidden="true"></span>
        <div className="value-icon">{value.icon}</div>
        <h3 className="value-title">{value.title}</h3>
        <p className="value-desc">{value.description}</p>
      </div>
    </div>
  )
}

function BioStat({ stat, visible, index }) {
  const { target, suffix } = parseStat(stat.number)
  const decimals = Number.isInteger(target) ? 0 : 1
  const current = useCountUp(target, visible, { duration: 1600, decimals })

  return (
    <div className="about-bio-stat anim-scale-in" style={{ transitionDelay: `${index * 0.1}s` }}>
      <div className="about-bio-stat-value">
        {current}{visible ? suffix : ''}
      </div>
      <div className="about-bio-stat-label">{stat.label}</div>
      <div className="about-bio-stat-sub">{stat.sublabel}</div>
    </div>
  )
}

function AboutPage() {
  const [titleRef, titleVisible] = useScrollAnimation(0.2)
  const [bioRef, bioVisible] = useScrollAnimation(0.1)
  const [timelineRef, timelineVisible] = useScrollAnimation(0.1)
  const [valuesRef, valuesVisible] = useScrollAnimation(0.1)
  const [setValuesRef, visibleValues] = useStaggerAnimation(values.length, 0.1)
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    window.scrollTo(0, 0)
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
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
      <div className="about-page-container">

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

        {/* Bio + Terminal */}
        <div
          ref={bioRef}
          className={`about-page-bio-section anim-fade-up ${bioVisible ? 'visible' : ''}`}
        >
          <div className="about-page-bio-text">
            <p className="bio-lead">
              I'm Valtrix — a full stack developer who builds web applications
              and decentralized systems. I care about clean architecture,
              security, and creating things that actually work well.
            </p>
            <p className="bio-regular">
              My work spans the full stack: from React frontends and Node.js APIs
              to Solidity smart contracts and on-chain protocols. I've shipped
              production apps, contributed to open source, and built DeFi tools
              used by real people.
            </p>
            <p className="bio-regular">
              When I'm not coding, I'm exploring new protocols, experimenting
              with zero-knowledge proofs, or designing interfaces that make
              complex systems feel simple.
            </p>
          </div>

          <div className="about-page-terminal">
            <div className="about-terminal-header">
              <div className="terminal-dots">
                <span className="dot dot-close"></span>
                <span className="dot dot-min"></span>
                <span className="dot dot-max"></span>
              </div>
              <span className="terminal-title">identity.sh</span>
              <span className="terminal-time">{formatTime(time)} PKT</span>
            </div>
            <div className="about-terminal-body">
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

        {/* Stats */}
        <div className="about-page-stats">
          {stats.map((stat, i) => (
            <BioStat key={i} stat={stat} index={i} visible={bioVisible} />
          ))}
        </div>

        {/* Horizontal Timeline */}
        <div
          ref={timelineRef}
          className={`about-page-timeline anim-blur-in ${timelineVisible ? 'visible' : ''}`}
        >
          <h2 className="about-section-heading">
            <span className="heading-line"></span>
            <span>Journey</span>
            <span className="heading-line"></span>
          </h2>
          <div className="journey-timeline">
            <div className="journey-track">
              <div className="journey-track-line"></div>
              <div className="journey-track-scan"></div>
            </div>
            <div className="journey-items">
              {timeline.map((item, i) => (
                <div
                  key={i}
                  className={`journey-item anim-fade-up ${timelineVisible ? 'visible' : ''}`}
                  style={{ transitionDelay: `${i * 0.12}s` }}
                >
                  <div className="journey-dot">
                    <div className="journey-dot-pulse"></div>
                    <div className="journey-dot-core"></div>
                  </div>
                  <div className="journey-card tilt-card spotlight-card">
                    <span className="journey-icon">{item.icon}</span>
                    <span className="journey-year">{item.year}</span>
                    <h3 className="journey-title">{item.title}</h3>
                    <p className="journey-desc">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Values */}
        <div
          ref={valuesRef}
          className={`about-page-values ${valuesVisible ? 'visible' : ''}`}
        >
          <h2 className="about-section-heading">
            <span className="heading-line"></span>
            <span>Philosophy</span>
            <span className="heading-line"></span>
          </h2>
          <div className="values-grid">
            {values.map((value, i) => (
              <ValueCard
                key={i}
                value={value}
                index={i}
                visible={(idx) => visibleValues.has(idx)}
                setRef={setValuesRef}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

export default AboutPage
