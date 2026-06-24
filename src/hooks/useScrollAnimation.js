import { useState, useEffect, useRef, useCallback } from 'react'

/* ------------------------------------------------------------------ */
/* Reduced-motion & pointer helpers                                    */
/* ------------------------------------------------------------------ */

function prefersReducedMotion() {
  return typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function isFinePointer() {
  return typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(pointer: fine)').matches
}

/* ------------------------------------------------------------------ */
/* useScrollAnimation — single element reveal                         */
/* ------------------------------------------------------------------ */

export function useScrollAnimation(threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (prefersReducedMotion()) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold, rootMargin: '0px 0px -60px 0px' }
    )

    observer.observe(el)
    return () => observer.unobserve(el)
  }, [threshold])

  return [ref, isVisible]
}

/* ------------------------------------------------------------------ */
/* useStaggerAnimation — staggered children reveal                    */
/* ------------------------------------------------------------------ */

export function useStaggerAnimation(count, threshold = 0.1) {
  const [visibleItems, setVisibleItems] = useState(new Set())
  const refs = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = refs.current.indexOf(entry.target)
            if (index !== -1) {
              setVisibleItems((prev) => new Set([...prev, index]))
              observer.unobserve(entry.target)
            }
          }
        })
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    )

    refs.current.forEach((ref) => { if (ref) observer.observe(ref) })
    return () => refs.current.forEach((ref) => { if (ref) observer.unobserve(ref) })
  }, [count, threshold])

  const setRef = (index) => (el) => {
    refs.current[index] = el
  }

  return [setRef, visibleItems]
}

/* ------------------------------------------------------------------ */
/* useScrollProgress — 0→1 as element scrolls through viewport        */
/* ------------------------------------------------------------------ */

export function useScrollProgress(offset = 0) {
  const ref = useRef(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const vh = window.innerHeight
      const start = vh - offset
      const end = -rect.height + offset
      const raw = 1 - (rect.top - end) / (start - end)
      setProgress(Math.min(Math.max(raw, 0), 1))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [offset])

  return [ref, progress]
}

/* ------------------------------------------------------------------ */
/* useParallax — vertical offset based on scroll position             */
/* ------------------------------------------------------------------ */

export function useParallax(speed = 0.5) {
  const [offset, setOffset] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const vh = window.innerHeight
      const center = rect.top + rect.height / 2
      const delta = center - vh / 2
      setOffset(delta * speed * -0.1)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return [ref, offset]
}

/* ------------------------------------------------------------------ */
/* useMouseParallax — cursor-driven offset                            */
/* ------------------------------------------------------------------ */

export function useMouseParallax(intensity = 0.02) {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * intensity * 100
      const y = (e.clientY / window.innerHeight - 0.5) * intensity * 100
      setPosition({ x, y })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [intensity])

  return position
}

/* ------------------------------------------------------------------ */
/* useTilt — 3D cursor tilt card                                      */
/* ------------------------------------------------------------------ */

export function useTilt({ max = 10, scale = 1.02 } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!isFinePointer() || prefersReducedMotion()) return

    let raf = null

    const handleMove = (e) => {
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const px = (e.clientX - rect.left) / rect.width
        const py = (e.clientY - rect.top) / rect.height
        el.style.setProperty('--ry', `${(px - 0.5) * 2 * max}deg`)
        el.style.setProperty('--rx', `${(0.5 - py) * 2 * max}deg`)
        el.style.setProperty('--mx', `${px * 100}%`)
        el.style.setProperty('--my', `${py * 100}%`)
      })
    }

    const handleEnter = () => {
      el.style.setProperty('--tilt-scale', String(scale))
      el.dataset.tiltActive = 'true'
    }

    const handleLeave = () => {
      el.style.setProperty('--rx', '0deg')
      el.style.setProperty('--ry', '0deg')
      el.dataset.tiltActive = 'false'
    }

    el.addEventListener('mousemove', handleMove)
    el.addEventListener('mouseenter', handleEnter)
    el.addEventListener('mouseleave', handleLeave)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      el.removeEventListener('mousemove', handleMove)
      el.removeEventListener('mouseenter', handleEnter)
      el.removeEventListener('mouseleave', handleLeave)
    }
  }, [max, scale])

  return ref
}

/* ------------------------------------------------------------------ */
/* useCountUp — animated number                                       */
/* ------------------------------------------------------------------ */

const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))

export function useCountUp(target, isActive, { duration = 1600, decimals = 0 } = {}) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!isActive) return
    if (prefersReducedMotion()) {
      setValue(target)
      return
    }

    let raf
    let start
    const step = (ts) => {
      if (start === undefined) start = ts
      const elapsed = ts - start
      const progress = Math.min(elapsed / duration, 1)
      setValue(target * easeOutExpo(progress))
      if (progress < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, isActive, duration])

  return value.toFixed(decimals)
}

/* ------------------------------------------------------------------ */
/* useMagnetic — element drifts toward cursor                         */
/* ------------------------------------------------------------------ */

export function useMagnetic(strength = 0.3) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!isFinePointer() || prefersReducedMotion()) return

    let raf = null

    const handleMove = (e) => {
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const x = e.clientX - (rect.left + rect.width / 2)
        const y = e.clientY - (rect.top + rect.height / 2)
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`
      })
    }

    const handleLeave = () => {
      el.style.transform = 'translate(0, 0)'
    }

    el.addEventListener('mousemove', handleMove)
    el.addEventListener('mouseleave', handleLeave)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      el.removeEventListener('mousemove', handleMove)
      el.removeEventListener('mouseleave', handleLeave)
    }
  }, [strength])

  return ref
}

/* ------------------------------------------------------------------ */
/* useScrollScale — element scales based on scroll position           */
/* ------------------------------------------------------------------ */

export function useScrollScale({ min = 0.95, max = 1, offset = 200 } = {}) {
  const ref = useRef(null)
  const [scale, setScale] = useState(min)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const vh = window.innerHeight
      const progress = 1 - Math.min(Math.max(rect.top / (vh + offset), 0), 1)
      setScale(min + (max - min) * progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [min, max, offset])

  return [ref, scale]
}

/* ------------------------------------------------------------------ */
/* useScrollRotate — element rotates based on scroll position         */
/* ------------------------------------------------------------------ */

export function useScrollRotate(maxDeg = 15) {
  const ref = useRef(null)
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const vh = window.innerHeight
      const progress = 1 - Math.min(Math.max(rect.top / vh, 0), 1)
      setRotation(progress * maxDeg)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [maxDeg])

  return [ref, rotation]
}

/* ------------------------------------------------------------------ */
/* useScrollTilt — card tilts as it scrolls in, straightens at center */
/* ------------------------------------------------------------------ */

export function useScrollTilt({ maxTilt = 8, axis = 'y' } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) return

    const handleScroll = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const vh = window.innerHeight
      const center = vh / 2
      const elCenter = rect.top + rect.height / 2
      const normalized = (elCenter - center) / center
      const clamped = Math.min(Math.max(normalized, -1), 1)
      const tilt = clamped * maxTilt

      if (axis === 'y') {
        ref.current.style.setProperty('--scroll-tilt', `${tilt}deg`)
      } else {
        ref.current.style.setProperty('--scroll-tilt', `${-tilt}deg`)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [maxTilt, axis])

  return ref
}
