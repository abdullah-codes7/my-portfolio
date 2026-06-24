import { useEffect, useRef, useState } from 'react'
import './AnimatedTitle.css'

function AnimatedTitle({ line1, line2, delay = 0, className = '' }) {
  const [inView, setInView] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const timer = setTimeout(() => setInView(true), delay * 1000 + 100)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0, rootMargin: '50px' }
    )

    observer.observe(el)
    return () => {
      observer.unobserve(el)
      clearTimeout(timer)
    }
  }, [delay])

  return (
    <h2 className={`at-title ${className}`} ref={ref}>
      {line1 && (
        <span className="at-line at-line-1">
          {line1.split('').map((char, i) => (
            <span
              key={i}
              className={`at-char ${inView ? 'visible' : ''}`}
              style={{ transitionDelay: `${delay + i * 0.04}s` }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </span>
      )}
      {line2 && (
        <span className="at-line at-line-2">
          {line2.split('').map((char, i) => (
            <span
              key={i}
              className={`at-char at-char-future ${inView ? 'visible' : ''}`}
              style={{ transitionDelay: `${delay + (line1?.length || 0) * 0.04 + i * 0.05}s` }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
          <span className="at-shimmer" aria-hidden="true"></span>
          <span className="at-glow" aria-hidden="true"></span>
        </span>
      )}
    </h2>
  )
}

export default AnimatedTitle
