import { useEffect, useState } from 'react'
import { useScrollAnimation, useStaggerAnimation, useTilt, useScrollTilt } from '../hooks/useScrollAnimation'
import AnimatedTitle from '../components/AnimatedTitle'
import './ProjectsPage.css'

const allProjects = [
  {
    id: 1,
    title: 'Aether Protocol',
    category: 'Web3 / Full Stack',
    description: 'Decentralized identity platform with wallet authentication, on-chain verifiable credentials, and a unified dashboard for managing digital identities across chains.',
    longDescription: 'Built from the ground up to solve the fragmented identity problem in Web3. Users can connect their wallet, verify credentials on-chain, and use a single identity across multiple dApps.',
    tech: ['Next.js', 'Solidity', 'wagmi', 'PostgreSQL', 'TypeScript'],
    year: '2024',
    status: 'Live',
    role: 'Full Stack Developer'
  },
  {
    id: 2,
    title: 'Synth Dashboard',
    category: 'Full Stack',
    description: 'Real-time analytics platform with WebSocket data streams, interactive charts, and team collaboration tools for monitoring system performance.',
    longDescription: 'Designed for DevOps teams that need real-time visibility into their systems. Features live metric streaming via WebSockets, customizable chart layouts, and alert configurations.',
    tech: ['React', 'Node.js', 'D3.js', 'Redis', 'WebSocket'],
    year: '2024',
    status: 'Live',
    role: 'Full Stack Developer'
  },
  {
    id: 3,
    title: 'Lattice Commerce',
    category: 'Web App',
    description: 'Headless e-commerce platform with product management, Stripe integration, and a custom admin panel for small businesses.',
    longDescription: 'A headless commerce solution built for small businesses that want full control over their storefront. Includes inventory management, Stripe checkout, and order tracking.',
    tech: ['Next.js', 'TypeScript', 'Prisma', 'Stripe', 'PostgreSQL'],
    year: '2023',
    status: 'Live',
    role: 'Full Stack Developer'
  },
  {
    id: 4,
    title: 'Helios Chain',
    category: 'Web3',
    description: 'NFT marketplace with lazy minting, batch auctions, and real-time floor price tracking across multiple chains.',
    longDescription: 'A gas-efficient NFT marketplace that supports lazy minting, batch auctions, and real-time floor price tracking with multi-chain support.',
    tech: ['Solidity', 'ERC-721', 'The Graph', 'React', 'IPFS'],
    year: '2023',
    status: 'Live',
    role: 'Smart Contract + Frontend'
  },
  {
    id: 5,
    title: 'Pulse API',
    category: 'Backend',
    description: 'RESTful API gateway with rate limiting, auth middleware, and real-time webhook delivery for third-party integrations.',
    longDescription: 'A robust API gateway built to handle millions of requests daily. Features JWT authentication, rate limiting per tier, and automatic retry logic.',
    tech: ['Node.js', 'Express', 'Redis', 'PostgreSQL', 'Docker'],
    year: '2023',
    status: 'Live',
    role: 'Backend Developer'
  },
  {
    id: 6,
    title: 'Verde Finance',
    category: 'DeFi',
    description: 'Yield optimization protocol that auto-compounds across multiple liquidity pools with minimal gas and maximum returns.',
    longDescription: 'A DeFi yield aggregator that automatically moves funds between lending protocols to capture the highest APY using flash loans.',
    tech: ['Solidity', 'Aave', 'Uniswap V3', 'Next.js', 'Ethers.js'],
    year: '2024',
    status: 'Beta',
    role: 'Smart Contract + Frontend'
  }
]

const filters = ['All', 'Full Stack', 'Web3', 'DeFi', 'Backend']

function ProjectCard({ project, index, setRef, visible }) {
  const tiltRef = useTilt({ max: 8, scale: 1.02 })
  const scrollRef = useScrollTilt({ maxTilt: 5, axis: 'y' })

  return (
    <div
      key={project.id}
      ref={(el) => { setRef(index)(el); scrollRef.current = el }}
      className={`project-page-shell anim-scale-in ${visible ? 'visible' : ''}`}
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      <article ref={tiltRef} className="project-page-core tilt-card spotlight-card">
        <span className="tilt-glare" aria-hidden="true"></span>
        <div className="project-page-content-overlay"></div>

        <div className="project-page-top">
          <div className="project-page-meta">
            <span className="project-page-category">{project.category}</span>
            <span className={`project-page-status ${project.status.toLowerCase()}`}>{project.status}</span>
          </div>
          <span className="project-page-year">{project.year}</span>
        </div>

        <h3 className="project-page-title">{project.title}</h3>
        <p className="project-page-desc">{project.description}</p>
        <p className="project-page-long">{project.longDescription}</p>

        <div className="project-page-tech">
          {project.tech.map((tech) => (
            <span key={tech} className="tech-tag">{tech}</span>
          ))}
        </div>

        <div className="project-page-footer">
          <span className="project-page-role">{project.role}</span>
          <div className="project-page-link">
            <span>View Details</span>
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

function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [titleRef, titleVisible] = useScrollAnimation(0.2)
  const [setRef, visibleItems] = useStaggerAnimation(6, 0.1)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const filteredProjects = activeFilter === 'All'
    ? allProjects
    : allProjects.filter(p => p.category.includes(activeFilter))

  return (
    <section className="projects-page">
      <div className="projects-page-container">
        <div
          ref={titleRef}
          className={`projects-page-header anim-slide-right ${titleVisible ? 'visible' : ''}`}
        >
          <div className="eyebrow">
            <span className="eyebrow-dot"></span>
            Projects
          </div>
          <AnimatedTitle line1="All" line2="PROJECTS" delay={0.3} className="at-page" />
          <p className="page-subtitle">A collection of work across full stack and Web3</p>
        </div>

        <div className="projects-filters">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="projects-page-grid">
          {filteredProjects.map((project, index) => (
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

export default ProjectsPage
