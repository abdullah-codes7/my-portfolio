import { useState, useEffect, useRef } from 'react'
import { useScrollAnimation, useMagnetic, useTilt } from '../hooks/useScrollAnimation'
import AnimatedTitle from './AnimatedTitle'
import BorderGlow from './BorderGlow'
import './Contact.css'

const typingTexts = [
  'building web apps',
  'shipping smart contracts',
  'crafting interfaces',
  'writing clean code',
]

function Contact() {
  const [titleRef, titleVisible] = useScrollAnimation(0.2)
  const [gridRef, gridVisible] = useScrollAnimation(0.1)
  const [formRef, formVisible] = useScrollAnimation(0.1)
  const submitRef = useMagnetic(0.3)
  const [typedText, setTypedText] = useState('')
  const [textIndex, setTextIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [time, setTime] = useState(new Date())
  const [focusedField, setFocusedField] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const currentText = typingTexts[textIndex]
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < currentText.length) {
          setTypedText(currentText.slice(0, charIndex + 1))
          setCharIndex(charIndex + 1)
        } else {
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        if (charIndex > 0) {
          setTypedText(currentText.slice(0, charIndex - 1))
          setCharIndex(charIndex - 1)
        } else {
          setIsDeleting(false)
          setTextIndex((textIndex + 1) % typingTexts.length)
        }
      }
    }, isDeleting ? 40 : 80)
    return () => clearTimeout(timeout)
  }, [charIndex, isDeleting, textIndex])

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Required'
    if (!formData.email.trim()) {
      newErrors.email = 'Required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid'
    }
    if (!formData.message.trim()) newErrors.message = 'Required'
    return newErrors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (errors[name]) setErrors({ ...errors, [name]: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setIsSubmitting(true)
    await new Promise(r => setTimeout(r, 1500))
    setIsSubmitting(false)
    setFormData({ name: '', email: '', message: '' })
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: true, timeZone: 'Asia/Karachi',
    })
  }

  return (
    <section className="contact" id="contact">
      <div className="contact-container">

        {/* Hero */}
        <div
          ref={titleRef}
          className={`contact-hero anim-fade-up ${titleVisible ? 'visible' : ''}`}
        >
          <div className="eyebrow">
            <span className="eyebrow-dot"></span>
            04 — Contact
          </div>
          <AnimatedTitle line1="Get In" line2="TOUCH" delay={0.1} />
        </div>

        {/* Statement */}
        <div className={`contact-statement anim-fade-up ${titleVisible ? 'visible' : ''}`}>
          <span className="statement-line"></span>
          <p className="statement-text">
            Have a project in mind? Let's build something <span className="statement-accent">extraordinary</span> together.
          </p>
          <span className="statement-line"></span>
        </div>

        {/* Main Grid */}
        <div
          ref={gridRef}
          className={`contact-main-grid anim-fade-up ${gridVisible ? 'visible' : ''}`}
        >

          {/* Left: Terminal + Social */}
          <div className="contact-left">

            {/* Terminal */}
            <div className="contact-terminal">
              <div className="ct-terminal-header">
                <div className="terminal-dots">
                  <span className="dot dot-close"></span>
                  <span className="dot dot-min"></span>
                  <span className="dot dot-max"></span>
                </div>
                <span className="ct-terminal-title">contact.sh</span>
                <span className="ct-terminal-time">{formatTime(time)} PKT</span>
              </div>
              <div className="ct-terminal-body">
                <div className="ct-line">
                  <span className="ct-prompt">$</span>
                  <span className="ct-cmd">echo $STATUS</span>
                </div>
                <div className="ct-output">Available for work</div>
                <div className="ct-line">
                  <span className="ct-prompt">$</span>
                  <span className="ct-cmd">echo $CURRENTLY</span>
                </div>
                <div className="ct-output ct-typing">
                  {typedText}<span className="ct-cursor">|</span>
                </div>
                <div className="ct-line">
                  <span className="ct-prompt">$</span>
                  <span className="ct-cursor">_</span>
                </div>
              </div>
            </div>

            {/* Social Bento */}
            <div className="contact-social-bento">
              <SocialBentoCard
                title="GitHub"
                subtitle="Open Source"
                href="https://github.com/valtrix7"
                icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>}
              />
              <SocialBentoCard
                title="LinkedIn"
                subtitle="Professional"
                href="#"
                icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>}
              />
              <SocialBentoCard
                title="Twitter"
                subtitle="Thoughts"
                href="#"
                icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>}
              />
            </div>
          </div>

          {/* Right: Form */}
          <div
            ref={formRef}
            className={`contact-form-wrap ${formVisible ? 'visible' : ''}`}
          >
            <form className="msg-form" onSubmit={handleSubmit} noValidate>

              {/* Field 01 — Name */}
              <div className={`msg-field ${focusedField === 'name' ? 'focused' : ''} ${errors.name ? 'error' : ''} ${formData.name ? 'filled' : ''}`}>
                <div className="msg-field-head">
                  <span className="msg-num">01</span>
                  <label className="msg-label" htmlFor="c-name">Name</label>
                </div>
                <div className="msg-input-wrap">
                  <input
                    id="c-name"
                    type="text"
                    name="name"
                    className="msg-input"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    autoComplete="name"
                  />
                  <div className="msg-accent-line"></div>
                </div>
                {errors.name && <span className="msg-error">{errors.name}</span>}
              </div>

              {/* Field 02 — Email */}
              <div className={`msg-field ${focusedField === 'email' ? 'focused' : ''} ${errors.email ? 'error' : ''} ${formData.email ? 'filled' : ''}`}>
                <div className="msg-field-head">
                  <span className="msg-num">02</span>
                  <label className="msg-label" htmlFor="c-email">Email</label>
                </div>
                <div className="msg-input-wrap">
                  <input
                    id="c-email"
                    type="email"
                    name="email"
                    className="msg-input"
                    placeholder="you@domain.com"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    autoComplete="email"
                  />
                  <div className="msg-accent-line"></div>
                </div>
                {errors.email && <span className="msg-error">{errors.email}</span>}
              </div>

              {/* Field 03 — Message */}
              <div className={`msg-field ${focusedField === 'message' ? 'focused' : ''} ${errors.message ? 'error' : ''} ${formData.message ? 'filled' : ''}`}>
                <div className="msg-field-head">
                  <span className="msg-num">03</span>
                  <label className="msg-label" htmlFor="c-message">Message</label>
                </div>
                <div className="msg-input-wrap">
                  <textarea
                    id="c-message"
                    name="message"
                    className="msg-input msg-textarea"
                    rows="5"
                    placeholder="Tell me about your project, timeline, and goals..."
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                  ></textarea>
                  <div className="msg-accent-line"></div>
                </div>
                <div className="msg-field-foot">
                  {errors.message && <span className="msg-error">{errors.message}</span>}
                  <span className="msg-char-count">
                    {formData.message.length > 0 && (
                      <span className="msg-chars">{formData.message.length} chars</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Submit */}
              <div className="msg-submit-row">
                <div className="msg-submit-hints">
                  <span className="msg-hint">Tab</span>
                  <span className="msg-hint-sep">·</span>
                  <span className="msg-hint">Enter</span>
                </div>
                <button
                  ref={submitRef}
                  type="submit"
                  className={`msg-send ${isSubmitting ? 'submitting' : ''}`}
                  disabled={isSubmitting || !formData.name || !formData.email || !formData.message}
                >
                  <span className="msg-send-text">
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </span>
                  <span className="msg-send-arrow">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </span>
                  {isSubmitting && <span className="msg-send-spinner"></span>}
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>
    </section>
  )
}

function SocialBentoCard({ title, subtitle, href, icon }) {
  const tiltRef = useTilt({ max: 8, scale: 1.02 })

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="social-bento-shell"
      style={{ textDecoration: 'none' }}
    >
      <BorderGlow
        edgeSensitivity={30}
        glowColor="220 80 70"
        backgroundColor="rgba(255,255,255,0.02)"
        borderRadius={20}
        glowRadius={30}
        glowIntensity={0.8}
        coneSpread={25}
        colors={['#6366f1', '#8b5cf6', '#a78bfa']}
      >
        <div ref={tiltRef} className="social-bento-core">
          <div className="social-bento-icon">{icon}</div>
          <div className="social-bento-text">
            <span className="social-bento-title">{title}</span>
            <span className="social-bento-sub">{subtitle}</span>
          </div>
          <svg className="social-bento-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="7" y1="17" x2="17" y2="7"/>
            <polyline points="7 7 17 7 17 17"/>
          </svg>
        </div>
      </BorderGlow>
    </a>
  )
}

export default Contact
