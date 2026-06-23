import { useScrollAnimation, useStaggerAnimation, useTilt } from '../hooks/useScrollAnimation'
import './Process.css'

const steps = [
  {
    number: '01',
    title: 'Discover',
    subtitle: 'Analysis & Strategy',
    description: 'Deep-dive into requirements, map system architecture, and define the technical blueprint before a single line of code is written.',
    tags: ['Research', 'Architecture', 'Planning'],
  },
  {
    number: '02',
    title: 'Design',
    subtitle: 'Prototype & System',
    description: 'Build interactive prototypes and design scalable system schemas — from database models to API contracts and component systems.',
    tags: ['Prototype', 'Schema', 'UI System'],
  },
  {
    number: '03',
    title: 'Build',
    subtitle: 'Develop & Test',
    description: 'Ship clean, modular code across the full stack. Every feature is tested, every edge case handled, every performance bottleneck eliminated.',
    tags: ['Code', 'Test', 'Optimize'],
  },
  {
    number: '04',
    title: 'Launch',
    subtitle: 'Deploy & Evolve',
    description: 'Deploy with confidence, monitor in production, and iterate based on real data. The launch is just the beginning of the cycle.',
    tags: ['Deploy', 'Monitor', 'Iterate'],
  },
]

function StepCard({ step, index, setRef, visible }) {
  const tiltRef = useTilt({ max: 9, scale: 1.03 })

  return (
    <div
      key={step.number}
      ref={setRef(index)}
      className={`process-step anim-fade-up ${visible ? 'visible' : ''}`}
      style={{ transitionDelay: `${index * 0.12}s` }}
    >
      {/* Step number */}
      <div className="step-number-wrap">
        <span className="step-number">{step.number}</span>
        <div className="step-number-glow"></div>
      </div>

      {/* Connector dot */}
      <div className="step-dot">
        <div className="step-dot-inner"></div>
        <div className="step-dot-ring"></div>
      </div>

      {/* Card */}
      <div ref={tiltRef} className="step-card tilt-card spotlight-card">
        <span className="tilt-glare" aria-hidden="true"></span>
        <div className="step-card-inner">
          <div className="step-card-accent"></div>
          <h3 className="step-title">{step.title}</h3>
          <p className="step-subtitle">{step.subtitle}</p>
          <p className="step-desc">{step.description}</p>
          <div className="step-tags">
            {step.tags.map((tag) => (
              <span key={tag} className="step-tag">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Process() {
  const [titleRef, titleVisible] = useScrollAnimation(0.2)
  const [setRef, stepsVisible] = useStaggerAnimation(steps.length, 0.15)

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
          <h2 className="section-title">
            <span className="section-title-line">How I</span>
            <span className="section-title-future">WORK</span>
          </h2>
          <p className="process-subtitle">
            A systematic approach to building software — from first principles to production-ready systems.
          </p>
        </div>

        {/* Timeline */}
        <div className="process-timeline">
          <div className="timeline-line"></div>
          <div className="timeline-glow"></div>
        </div>

        {/* Steps Grid */}
        <div className="process-grid">
          {steps.map((step, i) => (
            <StepCard
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
          <p className="process-cta-text">
            Ready to start your project?
          </p>
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
