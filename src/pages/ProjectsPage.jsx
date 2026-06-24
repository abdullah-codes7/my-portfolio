import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useScrollAnimation, useStaggerAnimation, useTilt, useScrollTilt } from '../hooks/useScrollAnimation'
import AnimatedTitle from '../components/AnimatedTitle'
import { allProjects } from '../data/projects'
import './ProjectsPage.css'

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
      <Link to={`/projects/${project.id}`} style={{ textDecoration: 'none' }}>
        <article ref={tiltRef} className="project-page-core tilt-card spotlight-card">
          <span className="tilt-glare" aria-hidden="true"></span>
          {project.image && <img src={project.image} alt={project.title} className="project-page-img" />}
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

          <div className="project-page-tech">
            {project.tech.map((tech) => (
              <span key={tech} className="tech-tag">{tech}</span>
          ))}
        </div>

        <div className="project-page-footer">
          <span className="project-page-role">{project.role}</span>
          <span className="project-page-link">
            <span>View Details</span>
            <span className="project-link-icon">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7M17 7H7M17 7V17"/>
              </svg>
            </span>
          </span>
        </div>
        </article>
      </Link>
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
