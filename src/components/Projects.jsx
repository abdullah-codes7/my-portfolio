import { useScrollAnimation, useStaggerAnimation, useTilt, useScrollTilt } from '../hooks/useScrollAnimation'
import { Link } from 'react-router-dom'
import { allProjects } from '../data/projects'
import AnimatedTitle from './AnimatedTitle'
import './Projects.css'

const projects = allProjects.slice(0, 5)

function ProjectCard({ project, index, setRef, visible }) {
  const tiltRef = useTilt({ max: 8, scale: 1.03 })
  const scrollRef = useScrollTilt({ maxTilt: 6, axis: 'y' })

  return (
    <div
      ref={(el) => { setRef(index)(el); scrollRef.current = el }}
      className={`project-shell anim-scale-in ${visible ? 'visible' : ''}`}
      style={{ transitionDelay: `${index * 0.12}s` }}
    >
      <Link to={`/projects/${project.id}`} style={{ textDecoration: 'none' }}>
        <article
          ref={tiltRef}
          className="project-core tilt-card spotlight-card"
        >
          <span className="tilt-glare" aria-hidden="true"></span>

          <span className="project-year">{project.year}</span>

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
              <span>View Details</span>
              <span className="project-link-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7M17 7H7M17 7V17"/>
                </svg>
              </span>
            </div>
          </div>
        </article>
      </Link>
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
          <AnimatedTitle line1="Selected" line2="WORK" delay={0.1} />
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
