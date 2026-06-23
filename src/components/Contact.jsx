import { useState } from 'react'
import { useScrollAnimation, useMagnetic } from '../hooks/useScrollAnimation'
import './Contact.css'

function Contact() {
  const [titleRef, titleVisible] = useScrollAnimation(0.2)
  const [formRef, formVisible] = useScrollAnimation(0.1)
  const submitRef = useMagnetic(0.3)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required'
    return newErrors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
  }

  return (
    <section className="contact" id="contact">
      <div className="contact-container">
        <div
          ref={titleRef}
          className={`contact-header anim-slide-right ${titleVisible ? 'visible' : ''}`}
        >
          <div className="eyebrow">
            <span className="eyebrow-dot"></span>
            04 — Contact
          </div>
          <h2 className="section-title">
            <span className="section-title-line">Get In</span>
            <span className="section-title-future">TOUCH</span>
          </h2>
          <p className="section-subtitle">Let's build something together</p>
        </div>

        <div className="contact-grid">
          <div
            ref={formRef}
            className={`contact-form-container anim-fade-up ${formVisible ? 'visible' : ''}`}
          >
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className={`form-shell ${errors.name ? 'error' : ''}`}>
                <div className="form-core">
                  <label className="form-label" htmlFor="contact-name">Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    className="form-input"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && <span className="form-error">{errors.name}</span>}
                </div>
              </div>

              <div className={`form-shell ${errors.email ? 'error' : ''}`}>
                <div className="form-core">
                  <label className="form-label" htmlFor="contact-email">Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    className="form-input"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <span className="form-error">{errors.email}</span>}
                </div>
              </div>

              <div className={`form-shell ${errors.message ? 'error' : ''}`}>
                <div className="form-core">
                  <label className="form-label" htmlFor="contact-message">Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    className="form-input form-textarea"
                    rows="5"
                    placeholder="Your message..."
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

          <div className={`contact-info anim-slide-left ${formVisible ? 'visible' : ''}`}>
            <div className="info-block">
              <h4>Email</h4>
              <a href="mailto:hello@valtrix.dev">hello@valtrix.dev</a>
            </div>
            <div className="info-block">
              <h4>Location</h4>
              <p>Available Worldwide</p>
            </div>
            <div className="info-block">
              <h4>Social</h4>
              <div className="social-links">
                <a href="#" className="social-link">GitHub</a>
                <a href="#" className="social-link">LinkedIn</a>
                <a href="#" className="social-link">Twitter</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
