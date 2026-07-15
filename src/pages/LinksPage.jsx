import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import SEO from '../components/SEO';
import { useMagnetic } from '../hooks/useScrollAnimation';
import './LinksPage.css';

const links = [
  {
    title: 'Portfolio Website',
    url: '/',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    )
  },
  {
    title: 'GitHub',
    url: 'https://github.com/abdullah-codes7',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    )
  },
  {
    title: 'Twitter / X',
    url: 'https://twitter.com/abdullah_codes7',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
      </svg>
    )
  },
  {
    title: 'LinkedIn',
    url: 'https://linkedin.com/in/imabdullah',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    )
  },
  {
    title: 'Instagram',
    url: '#',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    )
  },
  {
    title: 'Contact Email',
    url: 'mailto:contact@imabdullah.xyz',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    )
  }
];

const MagneticLink = ({ link, index }) => {
  const linkRef = useMagnetic(0.2);
  
  return (
    <a 
      href={link.url} 
      className="links-card" 
      target={link.url.startsWith('http') ? '_blank' : '_self'}
      rel="noopener noreferrer"
      ref={linkRef}
      style={{ '--i': index }}
    >
      <div className="links-card-bg"></div>
      <div className="links-card-content">
        <div className="links-icon-wrapper">
          {link.icon}
        </div>
        <span className="links-title">{link.title}</span>
        <div className="links-arrow">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </div>
      </div>
    </a>
  );
};

export default function LinksPage() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Entrance animations
    const ctx = gsap.context(() => {
      gsap.from('.links-avatar', {
        scale: 0.5,
        opacity: 0,
        duration: 1,
        ease: 'elastic.out(1, 0.5)',
        delay: 0.2
      });
      
      gsap.from('.links-header h1', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.4
      });
      
      gsap.from('.links-header p', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.5
      });

      gsap.from('.links-card', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.6
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <SEO 
        title="Abdullah | Links" 
        description="Connect with Abdullah on GitHub, Twitter, LinkedIn, and more."
        url="https://imabdullah.xyz/links"
      />
      <div className="links-page-wrapper" ref={containerRef}>
        
        {/* Background Effects */}
        <div className="links-bg-gradient"></div>
        <div className="links-bg-mesh"></div>

        <div className="links-container">
          <header className="links-header">
            <div className="links-avatar-container">
              <img src="https://github.com/abdullah-codes7.png" alt="Abdullah" className="links-avatar" />
              <div className="links-avatar-glow"></div>
            </div>
            <h1>Abdullah</h1>
            <p>Full Stack Developer & Creative Engineer</p>
          </header>

          <main className="links-list">
            {links.map((link, idx) => (
              <MagneticLink key={link.title} link={link} index={idx} />
            ))}
          </main>
          
          <footer className="links-footer">
            <p>© {new Date().getFullYear()} Abdullah. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </>
  );
}
