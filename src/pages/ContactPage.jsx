import { useEffect, useState } from 'react'
import { useScrollAnimation, useStaggerAnimation, useMagnetic, useTilt, useScrollTilt } from '../hooks/useScrollAnimation'
import AnimatedTitle from '../components/AnimatedTitle'
import './ContactPage.css'

const contactMethods = [
  {
    title: 'Email',
    value: 'hello@valtrix.dev',
    href: 'mailto:hello@valtrix.dev',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  },
  {
    title: 'GitHub',
    value: '@valtrix7',
    href: 'https://github.com/valtrix7',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
  },
  {
    title: 'Twitter',
    value: '@valtrix7',
    href: '#',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
      </svg>
    ),
  },
  {
    title: 'LinkedIn',
    value: '/in/valtrix',
    href: '#',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
]

function ContactPage() {
  const [titleRef, titleVisible] = useScrollAnimation(0.2)
  const [formRef, formVisible] = useScrollAnimation(0.1)
  const [methodsRef, methodsVisible] = useScrollAnimation(0.1)
  const [setMethodsRef, visibleMethods] = useStaggerAnimation(contactMethods.length, 0.1)
  const submitRef = useMagnetic(0.3)
  const [time, setTime] = useState(new Date())
  const [formData, setFormData] = useState({
    name: '', email: '', subject: '', message: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    window.scrollTo(0, 0)
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email'
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required'
    if (!formData.message.trim()) newErrors.message = 'Message is required'
    return newErrors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (errors[name]) setErrors({ ...errors, [name]: '' })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: true, timeZone: 'Asia/Karachi',
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
timeZone: 'Asia/Karachi',
    })
  }

  return (
    <section className="contact-page">
      <div className="contact-page-container">

        {/* Header */}
        <div
          ref={titleRef}
          className={`contact-page-header anim-slide-right ${titleVisible ? 'visible' : ''}`}
        >
          <div className="eyebrow">
            <span className="eyebrow-dot"></span>
            Contact
          </div>
          <AnimatedTitle line1="Get In" line2="TOUCH" delay={0.3} className="at-page" />
        </div>

        {/* Terminal Hero */}
        <div
          className={`cp-terminal-hero anim-fade-up ${titleVisible ? 'visible' : ''}`}
          style={{ transitionDelay: '0.2s' }}
        >
          <div className="cp-terminal">
            <div className="cp-terminal-header">
              <div className="terminal-dots">
                <span className="dot dot-close"></span>
                <span className="dot dot-min"></span>
                <span className="dot dot-max"></span>
              </div>
              <span className="cp-terminal-title">valtrix@contact ~ </span>
              <span className="cp-terminal-time">{formatTime(time)} PKT</span>
            </div>
            <div className="cp-terminal-body">
              <div className="cp-t-line">
                <span className="cp-t-prompt">$</span>
                <span className="cp-t-cmd">cat availability.json</span>
              </div>
              <pre className="cp-t-json">{`{
  "status": "available",
  "type": ["freelance", "collaboration", "full-time"],
  "response": "< 24 hours",
  "timezone": "PKT (UTC+5)",
  "favorite_quote": "Build. Ship. Iterate."
}`}</pre>
              <div className="cp-t-line">
                <span className="cp-t-prompt">$</span>
                <span className="cp-t-cursor">_</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="cp-main-grid">

          {/* Form */}
          <div
            ref={formRef}
            className={`cp-form-wrap anim-fade-up ${formVisible ? 'visible' : ''}`}
          >
            <div className="cp-form-header">
              <h3 className="cp-form-title">Send a Message</h3>
              <p className="cp-form-sub">I'll get back to you within 24 hours</p>
            </div>
            <form className="cp-form" onSubmit={handleSubmit} noValidate>
              <div className="cp-form-row">
                <div className={`form-shell ${errors.name ? 'error' : ''}`}>
                  <div className="form-core">
                    <label className="form-label" htmlFor="cp-name">Name</label>
                    <input
                      id="cp-name"
                      type="text"
                      name="name"
                      className="form-input"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    {errors.name && <span className="form-error">{errors.name}</span>}
                  </div>
                </div>
                <div className={`form-shell ${errors.email ? 'error' : ''}`}>
                  <div className="form-core">
                    <label className="form-label" htmlFor="cp-email">Email</label>
                    <input
                      id="cp-email"
                      type="email"
                      name="email"
                      className="form-input"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {errors.email && <span className="form-error">{errors.email}</span>}
                  </div>
                </div>
              </div>

              <div className={`form-shell ${errors.subject ? 'error' : ''}`}>
                <div className="form-core">
                  <label className="form-label" htmlFor="cp-subject">Subject</label>
                  <input
                    id="cp-subject"
                    type="text"
                    name="subject"
                    className="form-input"
                    placeholder="Project inquiry, collaboration, etc."
                    value={formData.subject}
                    onChange={handleChange}
                  />
                  {errors.subject && <span className="form-error">{errors.subject}</span>}
                </div>
              </div>

              <div className={`form-shell ${errors.message ? 'error' : ''}`}>
                <div className="form-core">
                  <label className="form-label" htmlFor="cp-message">Message</label>
                  <textarea
                    id="cp-message"
                    name="message"
                    className="form-input form-textarea"
                    rows="6"
                    placeholder="Tell me about your project..."
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                  {errors.message && <span className="form-error">{errors.message}</span>}
                </div>
              </div>

              <button ref={submitRef} type="submit" className="submit-btn">
                <span>Send Message</span>
                <span className="submit-btn-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                  </svg>
                </span>
              </button>
            </form>
          </div>

          {/* Info Sidebar */}
          <div
            ref={methodsRef}
            className={`cp-info-sidebar anim-fade-up ${methodsVisible ? 'visible' : ''}`}
          >
            {/* Contact Methods */}
            <div className="cp-methods">
              {contactMethods.map((method, i) => (
                <ContactMethod
                  key={i}
                  method={method}
                  index={i}
                  visible={(idx) => visibleMethods.has(idx)}
                  setRef={setMethodsRef}
                />
              ))}
            </div>

            {/* Availability Card */}
            <div className="cp-availability">
              <div className="cp-avail-dot"></div>
              <div className="cp-avail-text">
                <span className="cp-avail-title">Currently Available</span>
                <span className="cp-avail-sub">Open to freelance & collab</span>
              </div>
            </div>

            {/* Live Clock */}
            <div className="cp-clock">
              <span className="cp-clock-label">Local Time</span>
              <span className="cp-clock-time">{formatTime(time)}</span>
              <span className="cp-clock-date">{formatDate(time)}</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

function ContactMethod({ method, index, visible, setRef }) {
  const tiltRef = useTilt({ max: 6, scale: 1.02 })
  const scrollRef = useScrollTilt({ maxTilt: 4, axis: 'y' })

  return (
    <a
      ref={(el) => { setRef(index)(el); scrollRef.current = el }}
      href={method.href}
      target={method.href.startsWith('http') ? '_blank' : undefined}
      rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
      className={`cp-method-shell anim-fade-up ${visible(index) ? 'visible' : ''}`}
      style={{ transitionDelay: `${index * 0.08}s` }}
    >
      <div ref={tiltRef} className="cp-method-core tilt-card spotlight-card">
        <span className="tilt-glare" aria-hidden="true"></span>
        <div className="cp-method-icon">{method.icon}</div>
        <div className="cp-method-info">
          <span className="cp-method-title">{method.title}</span>
          <span className="cp-method-value">{method.value}</span>
        </div>
        <svg className="cp-method-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="7" y1="17" x2="17" y2="7"/>
          <polyline points="7 7 17 7 17 17"/>
        </svg>
      </div>
    </a>
  )
}

export default ContactPage
