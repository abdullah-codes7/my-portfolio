import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { allProjects } from '../data/projects'
import './ProjectDetail.css'

function ProjectDetail() {
  const { id } = useParams()
  const [project, setProject] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const found = allProjects.find((p) => p.id === parseInt(id))
    setProject(found)
  }, [id])

  if (!project) {
    return (
      <section className="pd-page">
        <div className="pd-container">
          <h1 className="pd-not-found">Project not found</h1>
          <Link to="/projects" className="pd-back">Back to Projects</Link>
        </div>
      </section>
    )
  }

  return (
    <section className="pd-page">
      <div className="pd-container">

        {/* Back */}
        <Link to="/projects" className="pd-back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          All Projects
        </Link>

        {/* Hero Image */}
        <div className="pd-hero">
          <div className="pd-hero-placeholder">
            <span className="pd-hero-text">{project.title}</span>
          </div>
        </div>

        {/* Meta */}
        <div className="pd-meta">
          <span className="pd-category">{project.category}</span>
          <span className={`pd-status ${project.status.toLowerCase()}`}>{project.status}</span>
          <span className="pd-year">{project.year}</span>
        </div>

        {/* Title */}
        <h1 className="pd-title">{project.title}</h1>
        <p className="pd-role">{project.role}</p>

        {/* Description */}
        <div className="pd-section">
          <h2 className="pd-section-label">About</h2>
          <p className="pd-description">{project.longDescription}</p>
        </div>

        {/* Features */}
        <div className="pd-section">
          <h2 className="pd-section-label">Key Features</h2>
          <ul className="pd-features">
            {project.features.map((feature, i) => (
              <li key={i} className="pd-feature">
                <span className="pd-feature-dot"></span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Tech Stack */}
        <div className="pd-section">
          <h2 className="pd-section-label">Tech Stack</h2>
          <div className="pd-tech">
            {project.tech.map((tech) => (
              <span key={tech} className="pd-tech-tag">{tech}</span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="pd-cta">
          {project.link && (
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="pd-btn pd-btn-primary">
              Visit Site
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7M17 7H7M17 7V17"/>
              </svg>
            </a>
          )}
          <Link to="/projects" className="pd-btn pd-btn-secondary">
            All Projects
          </Link>
        </div>

      </div>
    </section>
  )
}

export default ProjectDetail
