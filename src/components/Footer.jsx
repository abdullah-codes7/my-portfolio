import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useMagnetic } from '../hooks/useScrollAnimation'
import './Footer.css'

function Footer() {
  const logoRef = useMagnetic(0.2)
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'Asia/Karachi',
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      timeZone: 'Asia/Karachi',
    })
  }

  return (
    <footer className="footer">
      {/* Scrolling Marquee */}
      <div className="footer-marquee">
        <div className="marquee-track">
          <span className="marquee-item">FULL STACK DEVELOPER</span>
          <span className="marquee-dot"></span>
          <span className="marquee-item">WEB3</span>
          <span className="marquee-dot"></span>
          <span className="marquee-item">REACT</span>
          <span className="marquee-dot"></span>
          <span className="marquee-item">NODE.JS</span>
          <span className="marquee-dot"></span>
          <span className="marquee-item">SOLIDITY</span>
          <span className="marquee-dot"></span>
          <span className="marquee-item">TYPESCRIPT</span>
          <span className="marquee-dot"></span>
          <span className="marquee-item">POSTGRESQL</span>
          <span className="marquee-dot"></span>
          <span className="marquee-item">FULL STACK DEVELOPER</span>
          <span className="marquee-dot"></span>
          <span className="marquee-item">WEB3</span>
          <span className="marquee-dot"></span>
          <span className="marquee-item">REACT</span>
          <span className="marquee-dot"></span>
          <span className="marquee-item">NODE.JS</span>
          <span className="marquee-dot"></span>
          <span className="marquee-item">SOLIDITY</span>
          <span className="marquee-dot"></span>
          <span className="marquee-item">TYPESCRIPT</span>
          <span className="marquee-dot"></span>
          <span className="marquee-item">POSTGRESQL</span>
          <span className="marquee-dot"></span>
        </div>
      </div>

      {/* Glowing Separator */}
      <div className="footer-glow-line">
        <div className="glow-line"></div>
        <div className="glow-dot"></div>
      </div>

      {/* Main Footer Content */}
      <div className="footer-main">
        {/* Giant CTA */}
        <div className="footer-cta">
          <p className="footer-cta-label">Let's build something</p>
          <h2 className="footer-giant-text">
            <span ref={logoRef} className="footer-name">ABDULLAH</span>
          </h2>
          <a href="https://github.com/abdullah-codes7" target="_blank" rel="noopener noreferrer" className="footer-cta-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span>View GitHub</span>
          </a>
        </div>

        {/* Info Grid */}
        <div className="footer-grid">
          {/* Navigation */}
          <div className="footer-col">
            <h4 className="footer-col-title">Navigate</h4>
            <nav className="footer-nav">
              <Link to="/" className="footer-nav-link">Home</Link>
              <Link to="/about" className="footer-nav-link">About</Link>
              <Link to="/projects" className="footer-nav-link">Projects</Link>
              <Link to="/contact" className="footer-nav-link">Contact</Link>
            </nav>
          </div>

          {/* Social */}
          <div className="footer-col">
            <h4 className="footer-col-title">Connect</h4>
            <nav className="footer-nav">
              <a href="https://github.com/abdullah-codes7" target="_blank" rel="noopener noreferrer" className="footer-nav-link">GitHub</a>
              <a href="https://linkedin.com/in/imabdullah" target="_blank" rel="noopener noreferrer" className="footer-nav-link">LinkedIn</a>
              <a href="https://twitter.com/abdullah_codes7" target="_blank" rel="noopener noreferrer" className="footer-nav-link">Twitter</a>
              <a href="mailto:contact@imabdullah.xyz" className="footer-nav-link">Email</a>
            </nav>
          </div>

          {/* Time */}
          <div className="footer-col footer-time-col">
            <h4 className="footer-col-title">Local Time (PKT)</h4>
            <div className="footer-clock">
              <span className="clock-time">{formatTime(time)}</span>
              <span className="clock-date">{formatDate(time)}</span>
            </div>
            <div className="footer-status">
              <span className="status-dot"></span>
              <span className="status-text">Available for work</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p className="copyright">&copy; {new Date().getFullYear()} ABDULLAH. All rights reserved.</p>
        <button className="back-to-top" onClick={scrollToTop} aria-label="Back to top">
          <span>Back to top</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7"/>
          </svg>
        </button>
      </div>
    </footer>
  )
}

export default Footer
