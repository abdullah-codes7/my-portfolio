import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMagnetic } from '../hooks/useScrollAnimation'
import './Hero.css'

/* ================================================================== */
/* ECLIPSE — rewritten as a single WebGL quad.                          */
/* One draw call replaces the old stack of 15+ composited DOM layers    */
/* (SVG gaussian-blur filters, mix-blend-mode, breathe keyframes and    */
/* per-frame blur writes) that made the hero jank.                      */
/* - 30fps render cap (the field animates slowly — 30fps is invisible)  */
/* - DPR-capped backing store, upscaled by CSS (glow hides the scaling) */
/* - Pauses via IntersectionObserver + visibilitychange                 */
/* - Mouse parallax written straight to uniforms — zero React renders   */
/* - Full static CSS fallback for no-WebGL / prefers-reduced-motion     */
/* ================================================================== */

const VERT_SRC = 'attribute vec2 a_pos; void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }'

const FRAG_SRC = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 3; i++) {
    v += amp * noise(p);
    p = p * 2.03 + vec2(1.7, 4.1);
    amp *= 0.5;
  }
  return v;
}

void main() {
  float t = u_time;
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y);
  vec2 p = uv - u_mouse * 0.035;

  float r = length(p);
  float ang = atan(p.y, p.x);

  const float RD = 0.24;        /* black disc radius */
  const float PI2 = 6.28318;

  /* slow breathing of the whole field */
  float breathe = 0.93 + 0.07 * sin(t * 0.45);

  /* corona haze — radial falloff modulated by seamless angular noise */
  float hazeFall = 1.0 - smoothstep(RD, 1.05, r);
  float hazeN = fbm(vec2(cos(ang) * 1.8 + t * 0.05, sin(ang) * 1.8 - t * 0.03));
  float haze = hazeFall * (0.35 + 0.65 * hazeN) * 0.16;

  /* stream filaments — brightest near the rim, fading outward */
  float streakN = fbm(vec2(cos(ang), sin(ang)) * 3.0 + vec2(t * 0.06, -t * 0.035));
  float streaks = pow(streakN, 2.4)
    * (1.0 - smoothstep(RD + 0.02, 0.95, r))
    * smoothstep(RD - 0.05, RD + 0.03, r)
    * 0.34;

  /* bright rim ring + soft inner halo */
  float ring  = (1.0 - smoothstep(0.010, 0.032, abs(r - (RD + 0.012)))) * 0.85;
  float ring2 = (1.0 - smoothstep(0.030, 0.090, abs(r - (RD + 0.050)))) * 0.22;

  /* faint orbital rings — one dashed (rotating), one solid */
  float dash = smoothstep(0.35, 0.65, fract((ang - t * 0.05) * 60.0 / PI2));
  float circA = (1.0 - smoothstep(0.0022, 0.005, abs(r - 0.52))) * dash * 0.30;
  float circB = (1.0 - smoothstep(0.0022, 0.005, abs(r - 0.74))) * 0.14;

  /* orbiting dots */
  vec2 dA = vec2(cos(t * 0.34), sin(t * 0.34)) * 0.52;
  vec2 dB = vec2(cos(-t * 0.21 + 2.1), sin(-t * 0.21 + 2.1)) * 0.74;
  float dotA = exp(-dot(p - dA, p - dA) * 5200.0) * 0.90;
  float dotB = exp(-dot(p - dB, p - dB) * 5200.0) * 0.55;

  float lum = (haze + streaks + ring + ring2 + circA + circB + dotA + dotB) * breathe;

  /* black disc — cuts the field inside the rim */
  lum *= smoothstep(RD - 0.012, RD, r);

  vec3 col = vec3(lum) + haze * vec3(0.04, 0.08, 0.18);
  float a = clamp(lum * 1.35, 0.0, 1.0);

  /* premultiplied-alpha output so the page background shows through */
  gl_FragColor = vec4(col * a, a);
}
`

function EclipseCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    let gl = null
    try {
      gl = canvas.getContext('webgl', {
        alpha: true,
        premultipliedAlpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: 'high-performance',
      })
    } catch {
      gl = null
    }
    if (!gl) return undefined

    const compile = (type, src) => {
      const sh = gl.createShader(type)
      gl.shaderSource(sh, src)
      gl.compileShader(sh)
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        if (import.meta.env.DEV) console.warn('[Hero] shader:', gl.getShaderInfoLog(sh))
        return null
      }
      return sh
    }

    const vs = compile(gl.VERTEX_SHADER, VERT_SRC)
    const fs = compile(gl.FRAGMENT_SHADER, FRAG_SRC)
    if (!vs || !fs) return undefined

    const prog = gl.createProgram()
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return undefined
    gl.useProgram(prog)

    /* fullscreen triangle */
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(prog, 'a_pos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)
    gl.disable(gl.BLEND)

    const uRes = gl.getUniformLocation(prog, 'u_res')
    const uTime = gl.getUniformLocation(prog, 'u_time')
    const uMouse = gl.getUniformLocation(prog, 'u_mouse')

    /* backing store: offsetWidth/Height (transform-proof), DPR ≤1.5, ≤1400px */
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      let w = Math.max(1, Math.round((canvas.offsetWidth || 1) * dpr))
      let h = Math.max(1, Math.round((canvas.offsetHeight || 1) * dpr))
      const s = Math.min(1, 1400 / Math.max(w, h))
      w = Math.round(w * s)
      h = Math.round(h * s)
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
      }
      gl.uniform2f(uRes, w, h)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    /* mouse → uniforms (never React, never DOM) */
    let tx = 0
    let ty = 0
    let mx = 0
    let my = 0
    const fine = window.matchMedia && window.matchMedia('(pointer: fine)').matches
    const onMouse = (e) => {
      if (!fine) return
      tx = e.clientX / window.innerWidth - 0.5
      ty = 0.5 - e.clientY / window.innerHeight
    }
    if (fine) window.addEventListener('mousemove', onMouse, { passive: true })

    /* run only while the hero is on screen and the tab is visible */
    let raf = 0
    let running = false
    let inView = true
    let tabVisible = !document.hidden
    let elapsed = 0
    let prev = 0
    let lastDraw = -1000
    const FRAME = 1000 / 30

    const tick = (now) => {
      raf = requestAnimationFrame(tick)
      if (now - lastDraw < FRAME - 1) return
      lastDraw = now
      const dt = prev ? Math.min((now - prev) / 1000, 0.1) : 0.016
      prev = now
      elapsed += dt
      mx += (tx - mx) * 0.06
      my += (ty - my) * 0.06
      gl.uniform1f(uTime, elapsed)
      gl.uniform2f(uMouse, mx, my)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    const sync = () => {
      const should = inView && tabVisible
      if (should && !running) {
        running = true
        prev = 0
        lastDraw = -1000
        raf = requestAnimationFrame(tick)
      } else if (!should && running) {
        running = false
        cancelAnimationFrame(raf)
      }
    }

    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0].isIntersecting
        sync()
      },
      { threshold: 0 }
    )
    io.observe(canvas)

    const onVis = () => {
      tabVisible = !document.hidden
      sync()
    }
    document.addEventListener('visibilitychange', onVis)

    sync()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      if (fine) window.removeEventListener('mousemove', onMouse)
      document.removeEventListener('visibilitychange', onVis)
      const lose = gl.getExtension('WEBGL_lose_context')
      if (lose) lose.loseContext()
    }
  }, [])

  return <canvas ref={canvasRef} className="eclipse-gl" aria-hidden="true" />
}

const Hero = memo(function Hero() {
  const heroRef = useRef(null)

  /* Magnetic — CTA buttons pull toward cursor */
  const ctaPrimaryRef = useMagnetic(0.35)
  const ctaGhostRef = useMagnetic(0.25)

  const [visible, setVisible] = useState(false)
  const [mode, setMode] = useState(null) // 'gl' | 'static'

  /* pick renderer before first paint — no canvas flash */
  useLayoutEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let hasGL = false
    if (!reduced) {
      try {
        const probe = document.createElement('canvas')
        hasGL = !!(probe.getContext('webgl') || probe.getContext('experimental-webgl'))
      } catch {
        hasGL = false
      }
    }
    setMode(hasGL ? 'gl' : 'static')
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  /* scroll fade — ONE CSS-var write per frame, zero layout reads.
     CSS calc() turns --sp into the parallax transforms. */
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

  const particles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        delay: Math.random() * 6,
        duration: Math.random() * 4 + 5,
        opacity: Math.random() * 0.35 + 0.1,
      })),
    []
  )

  return (
    <section id="hero" ref={heroRef} className="hero">
      <div className="hero-grid" aria-hidden="true" />

      <div className="hero-particles" aria-hidden="true">
        {particles.map((pt) => (
          <div
            key={pt.id}
            className="hero-particle"
            style={{
              left: `${pt.x}%`,
              top: `${pt.y}%`,
              width: `${pt.size}px`,
              height: `${pt.size}px`,
              opacity: pt.opacity,
              '--po': pt.opacity,
              animationDelay: `${pt.delay}s`,
              animationDuration: `${pt.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="hero-stage">
        {mode === 'gl' && <EclipseCanvas />}
        {mode === 'static' && <div className="eclipse-fallback" aria-hidden="true" />}

        <div className={`hero-content${visible ? ' visible' : ''}`}>
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            Available for projects
          </div>

          <h1 className="hero-name">ABDULLAH</h1>

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

      <div className={`hero-scroll${visible ? ' visible' : ''}`}>
        <div className="scroll-line" />
        <span className="scroll-text">Scroll</span>
      </div>
    </section>
  )
})

export default Hero
