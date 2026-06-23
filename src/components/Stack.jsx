import { useScrollAnimation, useStaggerAnimation, useMouseParallax, useTilt } from '../hooks/useScrollAnimation'
import './Stack.css'

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
  { name: 'Git / CI/CD', level: 85 }
]

const categories = [
  {
    title: 'Web3',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    items: ['Solidity', 'Hardhat', 'Foundry', 'Ethers.js', 'wagmi', 'OpenZeppelin']
  },
  {
    title: 'Frontend',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <path d="M8 21h8M12 17v4"/>
      </svg>
    ),
    items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion']
  },
  {
    title: 'Backend',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="8" rx="2"/>
        <rect x="2" y="14" width="20" height="8" rx="2"/>
        <circle cx="6" cy="6" r="1"/>
        <circle cx="6" cy="18" r="1"/>
      </svg>
    ),
    items: ['Node.js', 'Python', 'Express', 'FastAPI', 'PostgreSQL']
  },
  {
    title: 'Tools & Infra',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
    items: ['The Graph', 'Chainlink', 'IPFS', 'Docker', 'Git']
  }
]

function CategoryCard({ category, index, setCatRef, visible, mousePos }) {
  const tiltRef = useTilt({ max: 12, scale: 1.04 })

  return (
    <div
      key={category.title}
      ref={setCatRef(index)}
      className={`category-shell anim-fade-up ${visible ? 'visible' : ''}`}
      style={{
        transitionDelay: `${index * 0.1}s`,
        transform: `translate(${mousePos.x * (index % 2 === 0 ? 0.3 : -0.3)}px, ${mousePos.y * 0.2}px)`
      }}
    >
      <div ref={tiltRef} className="category-core tilt-card spotlight-card">
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
  const [setCatRef, visibleCats] = useStaggerAnimation(categories.length, 0.1)
  const [skillsRef, skillsVisible] = useScrollAnimation(0.1)
  const mousePos = useMouseParallax(0.015)

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
          <h2 className="section-title">
            <span className="section-title-line">Tech</span>
            <span className="section-title-future">STACK</span>
          </h2>
          <p className="section-subtitle">Technologies I work with</p>
        </div>

        <div className="stack-categories">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.title}
              category={category}
              index={index}
              setCatRef={setCatRef}
              visible={visibleCats.has(index)}
              mousePos={mousePos}
            />
          ))}
        </div>

        <div
          ref={skillsRef}
          className={`skills-section anim-blur-in ${skillsVisible ? 'visible' : ''}`}
        >
          <h3 className="skills-title">Proficiency</h3>
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
                    style={{
                      width: skillsVisible ? `${tech.level}%` : '0%',
                      transitionDelay: `${i * 0.08}s`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Stack
