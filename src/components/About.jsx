import { useState, useEffect } from 'react'
import { useScrollAnimation, useStaggerAnimation, useCountUp, useTilt } from '../hooks/useScrollAnimation'
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
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const stats = [
    { number: '2+', label: 'Years Experience' },
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
            <p className="about-bio-lead">
              I'm Valtrix — a full stack developer building web applications
              and decentralized systems that push the boundary of what's possible.
            </p>
            <p className="about-bio-text">
              I work across the full stack — from React and Node.js to Solidity
              and smart contract architectures. Clean code, solid architecture,
              and security-first thinking drive everything I build.
            </p>
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
              <p><span className="t-key">name:</span> Valtrix</p>
              <p><span className="t-key">role:</span> Full Stack Developer</p>
              <p><span className="t-key">focus:</span> Web3, DeFi, System Architecture</p>
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
                className={`about-bento-card about-stat-card anim-scale-in ${visibleBento.has(i) ? 'visible' : ''}`}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <BentoStat stat={stat} target={target} suffix={suffix} visible={visibleBento.has(i)} />
              </div>
            )
          })}

          {/* Tech Stack Card */}
          <div
            ref={setBentoRef(3)}
            className={`about-bento-card about-tech-card anim-scale-in ${visibleBento.has(3) ? 'visible' : ''}`}
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
            className={`about-bento-card about-location-card anim-scale-in ${visibleBento.has(4) ? 'visible' : ''}`}
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
