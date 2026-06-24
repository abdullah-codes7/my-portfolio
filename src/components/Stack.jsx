import { useRef, useEffect } from 'react'
import { useScrollAnimation, useStaggerAnimation, useMouseParallax, useTilt, useCountUp, useScrollTilt } from '../hooks/useScrollAnimation'
import AnimatedTitle from './AnimatedTitle'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Stack.css'

gsap.registerPlugin(ScrollTrigger)

const expertise = [
  { name: 'React / Next.js', level: 95, suffix: '%', years: '3+' },
  { name: 'Node.js', level: 90, suffix: '%', years: '3+' },
  { name: 'Solidity', level: 88, suffix: '%', years: '2+' },
  { name: 'TypeScript', level: 92, suffix: '%', years: '3+' },
]

const technologies = [
  { name: 'React / Next.js', level: 95 },
  { name: 'Node.js / Express', level: 90 },
  { name: 'TypeScript', level: 92 },
  { name: 'Solidity', level: 88 },
  { name: 'PostgreSQL / MongoDB', level: 85 },
  { name: 'Python', level: 80 },
  { name: 'Tailwind CSS', level: 90 },
  { name: 'Docker', level: 75 },
  { name: 'AWS / Vercel', level: 78 },
  { name: 'Git / CI/CD', level: 85 },
]

const categories = [
  {
    title: 'Frontend',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <path d="M8 21h8M12 17v4"/>
      </svg>
    ),
    items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion']
  },
  {
    title: 'Backend',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="8" rx="2"/>
        <rect x="2" y="14" width="20" height="8" rx="2"/>
        <circle cx="6" cy="6" r="1"/>
        <circle cx="6" cy="18" r="1"/>
      </svg>
    ),
    items: ['Node.js', 'Python', 'Express', 'FastAPI', 'PostgreSQL']
  },
  {
    title: 'Web3',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    items: ['Solidity', 'Hardhat', 'Foundry', 'Ethers.js', 'wagmi', 'OpenZeppelin']
  },
  {
    title: 'Tools & Infra',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
    items: ['The Graph', 'Chainlink', 'IPFS', 'Docker', 'Git']
  }
]

function ExpertiseCard({ item, index, visible, setRef }) {
  const { target, suffix } = { target: item.level, suffix: '%' }
  const current = useCountUp(target, visible, { duration: 1600, decimals: 0 })

  return (
    <div
      ref={setRef(index)}
      className={`expertise-card anim-scale-in ${visible ? 'visible' : ''}`}
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      <div className="expertise-top">
        <span className="expertise-name">{item.name}</span>
        <span className="expertise-years">{item.years} yrs</span>
      </div>
      <div className="expertise-number">
        {visible ? current : 0}<span className="expertise-suffix">{suffix}</span>
      </div>
      <div className="expertise-bar">
        <div
          className="expertise-bar-fill"
          style={{
            width: visible ? `${item.level}%` : '0%',
            transitionDelay: `${index * 0.1 + 0.3}s`,
          }}
        ></div>
        <div className="expertise-bar-scan"></div>
      </div>
    </div>
  )
}

function CategoryCard({ category, index, setCatRef, visible, mousePos }) {
  const tiltRef = useTilt({ max: 10, scale: 1.03 })
  const scrollRef = useScrollTilt({ maxTilt: 5, axis: 'y' })

  return (
    <div
      key={category.title}
      ref={(el) => { setCatRef(index)(el); scrollRef.current = el }}
      className={`category-shell anim-fade-up ${visible ? 'visible' : ''}`}
      style={{
        transitionDelay: `${index * 0.1}s`,
      }}
    >
      <div ref={tiltRef} className="category-core tilt-card spotlight-card" style={{
        transform: `translate(${mousePos.x * (index % 2 === 0 ? 0.3 : -0.3)}px, ${mousePos.y * 0.2}px)`
      }}>
        <span className="tilt-glare" aria-hidden="true"></span>
        <div className="category-icon">{category.icon}</div>
        <h3 className="category-title">{category.title}</h3>
        <ul className="category-items">
          {category.items.map((item) => (
            <li key={item} className="category-item">
              <span className="item-dot"></span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function Stack() {
  const [titleRef, titleVisible] = useScrollAnimation(0.2)
  const [expertiseRef, expertiseVisible] = useScrollAnimation(0.1)
  const [setExpertiseRef, visibleExpertise] = useStaggerAnimation(expertise.length, 0.1)
  const mousePos = useMouseParallax(0.015)
  const scrollContainerRef = useRef(null)
  const scrollWrapperRef = useRef(null)
  const proficiencyRef = useRef(null)

  useEffect(() => {
    const container = scrollContainerRef.current
    const wrapper = scrollWrapperRef.current
    if (!container || !wrapper) return

    const mm = gsap.matchMedia()

    mm.add(
      {
        isDesktop: '(min-width: 769px) and (pointer: fine)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (ctx) => {
        if (!ctx.conditions.isDesktop || ctx.conditions.reduceMotion) return

        const setWrapperHeight = () => {
          const scrollWidth = container.scrollWidth - window.innerWidth
          wrapper.style.height = `${scrollWidth + window.innerHeight}px`
        }
        setWrapperHeight()

        const tween = gsap.to(container, {
          x: () => -(container.scrollWidth - window.innerWidth),
          ease: 'none',
          scrollTrigger: {
            trigger: wrapper,
            start: 'top top',
            end: () => `+=${container.scrollWidth - window.innerWidth}`,
            scrub: 1,
            invalidateOnRefresh: true,
            onRefresh: setWrapperHeight,
          },
        })

        // Animate skill bars when proficiency panel enters viewport
        const bars = proficiencyRef.current?.querySelectorAll('.skill-progress')
        if (bars?.length) {
          gsap.set(bars, { width: '0%' })
          gsap.to(bars, {
            width: (i) => `${technologies[i].level}%`,
            stagger: 0.06,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: proficiencyRef.current,
              containerAnimation: tween,
              start: 'left 80%',
              toggleActions: 'play none none none',
            },
          })
        }

        return () => {
          tween.scrollTrigger && tween.scrollTrigger.kill()
          tween.kill()
        }
      }
    )

    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 300)
    const refreshTimer2 = setTimeout(() => ScrollTrigger.refresh(), 1000)
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)

    return () => {
      clearTimeout(refreshTimer)
      clearTimeout(refreshTimer2)
      window.removeEventListener('load', onLoad)
      mm.revert()
    }
  }, [])

  return (
    <section className="stack" id="stack">
      <div className="stack-container">
        <div
          ref={titleRef}
          className={`stack-header anim-slide-right ${titleVisible ? 'visible' : ''}`}
        >
          <div className="eyebrow">
            <span className="eyebrow-dot"></span>
            03 — Stack
          </div>
          <AnimatedTitle line1="Tech" line2="STACK" delay={0.1} />
        </div>

        {/* Core Expertise — vertical */}
        <div className="expertise-bento">
          <h3 className="stack-section-label">
            <span className="label-line"></span>
            Core Expertise
            <span className="label-line"></span>
          </h3>
          <div className="expertise-grid">
            {expertise.map((item, i) => (
              <ExpertiseCard
                key={item.name}
                item={item}
                index={i}
                visible={true}
                setRef={() => () => {}}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Horizontal Scroll — Toolbox + Proficiency */}
      <div className="stack-h-wrapper" ref={scrollWrapperRef}>
        <div className="stack-h-container" ref={scrollContainerRef}>

          {/* Toolbox */}
          <div className="stack-h-panel">
            <div className="stack-h-panel-inner">
              <h3 className="stack-section-label">
                <span className="label-line"></span>
                Toolbox
                <span className="label-line"></span>
              </h3>
              <div className="stack-categories">
                {categories.map((category, index) => (
                  <CategoryCard
                    key={category.title}
                    category={category}
                    index={index}
                    setCatRef={() => () => {}}
                    visible={true}
                    mousePos={mousePos}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Proficiency */}
          <div className="stack-h-panel stack-h-panel-wide" ref={proficiencyRef}>
            <div className="stack-h-panel-inner">
              <h3 className="stack-section-label">
                <span className="label-line"></span>
                Proficiency
                <span className="label-line"></span>
              </h3>
              <div className="skills-grid">
                {technologies.map((tech, i) => (
                  <div key={tech.name} className="skill-item">
                    <div className="skill-header">
                      <span className="skill-name">{tech.name}</span>
                      <span className="skill-level">{tech.level}%</span>
                    </div>
                    <div className="skill-bar">
                      <div
                        className="skill-progress"
                        style={{ width: '0%' }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Stack
