import { useScrollAnimation, useStaggerAnimation, useTilt } from '../hooks/useScrollAnimation'
import './Projects.css'

const projects = [
  {
    id: 1,
    title: 'Aether Protocol',
    category: 'Web3 / Full Stack',
    description: 'Decentralized identity platform with wallet authentication, on-chain verifiable credentials, and a unified dashboard.',
    tech: ['Next.js', 'Solidity', 'wagmi', 'PostgreSQL', 'TypeScript'],
    year: '2024'
  },
  {
    id: 2,
    title: 'Synth Dashboard',
    category: 'Full Stack',
    description: 'Real-time analytics platform with WebSocket data streams, interactive charts, and team collaboration tools.',
    tech: ['React', 'Node.js', 'D3.js', 'Redis', 'WebSocket'],
    year: '2024'
  },
  {
    id: 3,
    title: 'Lattice Commerce',
    category: 'Web App',
    description: 'Headless e-commerce platform with product management, Stripe integration, and a custom admin panel.',
    tech: ['Next.js', 'TypeScript', 'Prisma', 'Stripe', 'PostgreSQL'],
    year: '2023'
  },
  {
    id: 4,
    title: 'Helios Chain',
    category: 'Web3',
    description: 'NFT marketplace with lazy minting, batch auctions, and real-time floor price tracking across multiple chains.',
    tech: ['Solidity', 'ERC-721', 'The Graph', 'React', 'IPFS'],
    year: '2023'
  }
]

function ProjectCard({ project, index, setRef, visible }) {
  // One useTilt per card instance (rules-of-hooks safe).
  const tiltRef = useTilt({ max: 8, scale: 1.03 })

  return (
    <div
      ref={setRef(index)}
      className={`project-shell anim-scale-in ${visible ? 'visible' : ''}`}
      style={{ transitionDelay: `${index * 0.12}s` }}
    >
      {/* Attach tilt to the inner article so the bezel stays anchored. */}
      <article
        ref={tiltRef}
        className="project-core tilt-card spotlight-card"
      >
        {/* Glare overlay tracks the cursor */}
        <span className="tilt-glare" aria-hidden="true"></span>

        <div className="project-image">
          <div className="project-image-inner">
            <div className="project-grid-overlay"></div>
          </div>
          <span className="project-year">{project.year}</span>
        </div>

        <div className="project-content">
          <div className="project-category">{project.category}</div>
          <h3 className="project-title">{project.title}</h3>
          <p className="project-description">{project.description}</p>
          <div className="project-tech">
            {project.tech.map((tech) => (
              <span key={tech} className="tech-tag">{tech}</span>
            ))}
          </div>
          <div className="project-link">
            <span>View Project</span>
            <span className="project-link-icon">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7M17 7H7M17 7V17"/>
              </svg>
            </span>
          </div>
        </div>
      </article>
    </div>
  )
}

function Projects() {
  const [titleRef, titleVisible] = useScrollAnimation(0.2)
  const [setRef, visibleItems] = useStaggerAnimation(projects.length, 0.1)

  return (
    <section className="projects" id="projects">
      <div className="projects-container">
        <div
          ref={titleRef}
          className={`projects-header anim-slide-right ${titleVisible ? 'visible' : ''}`}
        >
          <div className="eyebrow">
            <span className="eyebrow-dot"></span>
            02 — Work
          </div>
          <h2 className="section-title">
            <span className="section-title-line">Selected</span>
            <span className="section-title-future">WORK</span>
          </h2>
          <p className="section-subtitle">Featured projects I've built</p>
        </div>

        <div className="projects-grid">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              setRef={setRef}
              visible={visibleItems.has(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects
