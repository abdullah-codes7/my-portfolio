import { useRef, useCallback } from 'react'
import { useScrollAnimation, useStaggerAnimation, useTilt, useParallax } from '../hooks/useScrollAnimation'
import AnimatedTitle from './AnimatedTitle'
import BorderGlow from './BorderGlow'
import './Process.css'

const steps = [
  {
    number: '01',
    title: 'Discover',
    description: 'Deep-dive into requirements, map system architecture, and define the technical blueprint before a single line of code is written.',
    tags: ['Research', 'Architecture', 'Planning'],
  },
  {
    number: '02',
    title: 'Build',
    description: 'Ship clean, modular code across the full stack. Every feature is tested, every edge case handled, every performance bottleneck eliminated.',
    tags: ['Code', 'Test', 'Optimize'],
  },
  {
    number: '03',
    title: 'Launch',
    description: 'Deploy with confidence to production. Set up CI/CD pipelines, configure monitoring, and ensure everything runs smoothly at scale.',
    tags: ['Deploy', 'CI/CD', 'Monitoring'],
  },
]

function ProcessBlock({ step, index, setRef, visible }) {
  const tiltRef = useTilt({ max: 6, scale: 1.02 })
  const [parallaxRef, offset] = useParallax(0.3)
  const cardRef = useRef(null)

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    card.style.setProperty('--mx', `${x}%`)
    card.style.setProperty('--my', `${y}%`)
  }, [])

  return (
    <div
      ref={(el) => { setRef(index)(el); parallaxRef.current = el }}
      className={`process-block anim-fade-up ${visible ? 'visible' : ''} ${index % 2 === 0 ? 'align-left' : 'align-right'}`}
      style={{ transitionDelay: `${index * 0.15}s` }}
    >
      {/* Watermark number — parallax */}
      <span
        ref={(el) => { if (el) el.style.transform = `translateY(${offset}px)` }}
        className="process-watermark"
      >
        {step.number}
      </span>

      {/* Content card — BorderGlow + tilt + spotlight */}
      <BorderGlow
        edgeSensitivity={30}
        glowColor="40 80 80"
        backgroundColor="rgba(255,255,255,0.02)"
        borderRadius={16}
        glowRadius={40}
        glowIntensity={0.8}
        coneSpread={25}
        colors={['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.03)', 'rgba(255,255,255,0.06)']}
        className="process-glow-wrap"
      >
        <div
          ref={(el) => { tiltRef.current = el; cardRef.current = el }}
          className="process-card tilt-card"
          onMouseMove={handleMouseMove}
        >
          <span className="tilt-glare" aria-hidden="true"></span>
          <div className="process-card-inner">
            <div className="process-card-top">
              <span className="process-card-num">{step.number}</span>
              <div className="process-card-line"></div>
              <h3 className="process-card-title">{step.title}</h3>
            </div>
            <p className="process-card-desc">{step.description}</p>
            <div className="process-card-tags">
              {step.tags.map((tag, j) => (
                <span
                  key={tag}
                  className="process-card-tag"
                  style={{ transitionDelay: `${index * 0.15 + j * 0.05 + 0.3}s` }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </BorderGlow>

      {/* Step dot */}
      <div className="process-step-dot">
        <span className="process-step-dot-ring"></span>
        <span className="process-step-dot-core"></span>
      </div>
    </div>
  )
}

function Process() {
  const [titleRef, titleVisible] = useScrollAnimation(0.2)
  const [setRef, stepsVisible] = useStaggerAnimation(steps.length, 0.15)

  // Progress driven by visible steps
  const visibleCount = stepsVisible.size
  const progress = visibleCount / steps.length

  return (
    <section className="process" id="process">
      <div className="process-container">

        {/* Header */}
        <div
          ref={titleRef}
          className={`process-header anim-fade-up ${titleVisible ? 'visible' : ''}`}
        >
          <div className="eyebrow">
            <span className="eyebrow-dot"></span>
            02 — Process
          </div>
          <AnimatedTitle line1="How I" line2="WORK" delay={0.1} />
          <p className="process-subtitle">
            A systematic approach to building software — from first principles to production-ready systems.
          </p>
        </div>

        {/* Steps */}
        <div className="process-steps">

          {/* Progress bar between dots */}
          <div className="process-progress-track">
            <div
              className="process-progress-fill"
              style={{ height: `${progress * 100}%` }}
            ></div>
          </div>

          {steps.map((step, i) => (
            <ProcessBlock
              key={step.number}
              step={step}
              index={i}
              setRef={setRef}
              visible={stepsVisible.has(i)}
            />
          ))}

        </div>

        {/* Bottom CTA */}
        <div className={`process-cta anim-fade-up ${stepsVisible.has(steps.length - 1) ? 'visible' : ''}`}>
          <div className="process-cta-line"></div>
          <p className="process-cta-text">Ready to start your project?</p>
          <div className="process-cta-arrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        </div>

      </div>
    </section>
  )
}

export default Process
