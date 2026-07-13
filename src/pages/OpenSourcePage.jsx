import React, { useEffect } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import './OpenSourcePage.css'

const openSourceProjects = [
  {
    id: 1,
    title: 'AEO FLOW',
    description: 'The ultimate framework for autonomous coding agents.\nAdvanced strategies for Artificial Engine Optimization (AEO).\nMaster Generative Engine Optimization (GEO) across any codebase.',
    tech: ['AI Agents', 'AEO', 'GEO'],
    github: '#',
  }
]

function OpenSourceCard({ project }) {
  const [ref, visible] = useScrollAnimation(0.1)

  return (
    <div ref={ref} className={`os-card anim-fade-up ${visible ? 'visible' : ''}`}>
      <div className="os-card-left">
        <h2 className="os-card-title">{project.title}</h2>
        <p className="os-card-desc">{project.description}</p>
        <div className="os-card-tech">
          {project.tech.map((tag, i) => (
            <span key={i} className="os-tech-tag">{tag}</span>
          ))}
        </div>
      </div>
      <div className="os-card-right">
        {project.github === '#' ? (
          <span className="os-github-btn" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
            <span className="os-github-icon" style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'currentColor' }}></span>
            Coming Soon
          </span>
        ) : (
          <a 
            href={project.github} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="os-github-btn"
          >
            <svg className="os-github-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            View Source
          </a>
        )}
      </div>
    </div>
  )
}

function OpenSourcePage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="os-page">
      <div className="os-page-header">
        <div className="os-eyebrow">
          <span className="os-eyebrow-dot"></span>
          Free & Open
        </div>
        <h1 className="os-page-title">Open Source</h1>
        <p className="os-page-subtitle">Tools, libraries, and protocols I've built for the community.</p>
      </div>
      
      <div className="os-page-content">
        {openSourceProjects.map((project) => (
          <OpenSourceCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  )
}

export default OpenSourcePage
