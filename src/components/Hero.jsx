import { memo, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMagnetic } from '../hooks/useScrollAnimation'
import './Hero.css'

/* Moon footage hosted on Abdullah's public Vercel Blob bucket (~4.9MB). */
const VIDEO_SRC =
  'https://ihjnlxtcammfqazs.public.blob.vercel-storage.com/Crescent_moon_with_twinkling_stars_20260913140841.mp4'

const IconGitHub = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
)

const IconX = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.9 1.15h3.68l-8.04 9.19 9.46 12.51h-7.41l-5.8-7.58-6.63 7.58H.48l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.41z" />
  </svg>
)

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/abdullah-codes7', icon: IconGitHub },
  { label: 'X (Twitter)', href: 'https://twitter.com/abdullah_codes7', icon: IconX },
]

const Hero = memo(function Hero() {
  const heroRef = useRef(null)
  const videoRef = useRef(null)

  /* Magnetic — pill CTAs pull toward cursor (same feel as before) */
  const ctaPrimaryRef = useMagnetic(0.35)
  const ctaGhostRef = useMagnetic(0.25)

  const [visible, setVisible] = useState(false)
  const [renderVideo, setRenderVideo] = useState(false)
  const [videoOk, setVideoOk] = useState(true)

  /* Decide whether a <video> should exist AT ALL before first paint:
     - prefers-reduced-motion → static glow, no video download
     - Data Saver on → skip the ~4.9MB fetch entirely
     Otherwise mount it; playback still pauses offscreen / on hidden tabs. */
  useLayoutEffect(() => {
    let skip = false
    try {
      skip =
        window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        Boolean(navigator.connection && navigator.connection.saveData)
    } catch {
      skip = false
    }
    setRenderVideo(!skip)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 250)
    return () => clearTimeout(t)
  }, [])

  /* scroll fade — ONE CSS-var write per frame, zero layout reads */
  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const vh = window.innerHeight || 1
        const sp = Math.min(window.scrollY / vh, 1)
        hero.style.setProperty('--sp', sp.toFixed(4))
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  /* playback lifecycle: only while the hero is on screen and the tab is visible */
  useEffect(() => {
    const video = videoRef.current
    if (!video) return undefined

    let inView = true
    let tabVisible = !document.hidden
    const sync = () => {
      if (inView && tabVisible) video.play().catch(() => {})
      else video.pause()
    }

    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0].isIntersecting
        sync()
      },
      { threshold: 0 }
    )
    io.observe(heroRef.current || video)

    const onVis = () => {
      tabVisible = !document.hidden
      sync()
    }
    document.addEventListener('visibilitychange', onVis)
    sync()

    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [renderVideo])

  return (
    <section id="hero" ref={heroRef} className={`hero${visible ? ' visible' : ''}`}>
      {/* background footage — muted, looped, no sound */}
      <div className="hero-media" aria-hidden="true">
        <div className="hero-media-fallback" />
        {renderVideo && videoOk && (
          <video
            ref={videoRef}
            className="hero-video"
            src={VIDEO_SRC}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            onError={() => setVideoOk(false)}
          />
        )}
        <div className="hero-scrim" />
      </div>

      {/* vertical rails */}
      <div className="hero-rail hero-rail-left" aria-hidden="true">
        <span className="hero-rail-text">Portfolio</span>
        <i className="hero-rail-line" />
      </div>
      <div className="hero-rail hero-rail-right" aria-hidden="true">
        <span className="hero-rail-text">Scroll down</span>
      </div>

      <div className="hero-inner">
        <div className="hero-main">
          <p className="hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            Available for projects
          </p>

          <h1 className="hero-name">
            <span className="hero-name-line">
              <span className="hero-name-text">ABDULLAH</span>
            </span>
          </h1>

          {/* CSS steps() typewriter — zero React re-renders */}
          <p className="hero-role">
            <span className="role-type">Full Stack Developer</span>
          </p>

          <div className="hero-actions">
            <Link ref={ctaPrimaryRef} to="/projects" className="cta-primary">
              <span>Explore work</span>
              <span className="cta-icon-circle">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
            <Link ref={ctaGhostRef} to="/contact" className="cta-ghost">
              Let&apos;s talk
            </Link>
          </div>
        </div>
      </div>

      {/* socials */}
      <div className="hero-socials">
        {SOCIALS.map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
            {s.icon}
          </a>
        ))}
      </div>
    </section>
  )
})

export default Hero

