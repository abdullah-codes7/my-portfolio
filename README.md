<div align="center">

# ABDULLAH
### Full Stack Developer Portfolio

[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

[Live Demo](https://valtrix.dev) · [Report Bug](https://github.com/valtrix7/valtrix-portfolio/issues) · [Request Feature](https://github.com/valtrix7/valtrix-portfolio/issues)

</div>

---

## Overview

A premium, Awwwards-tier portfolio website built with React + Vite. Features realistic solar eclipse hero animation, smooth page transitions, scroll-driven tilt effects, and a dark space theme inspired by Apple, Linear, and Vercel design aesthetics.

## Features

- **Eclipse Hero** — Realistic solar eclipse with corona rotation, orbital rings, particle system, and scroll-shrink effect
- **Loading Screen** — Letter-by-letter "VALTRIX" reveal with horizontal curtain split animation
- **Page Transitions** — Dark overlay with "VALTRIX" name flash on every route change
- **Scroll Animations** — Fade-up, blur-in, scale-in, rotate-in, flip-in, and clip-path reveal
- **Scroll Tilt** — All cards tilt dynamically as they scroll through the viewport
- **Tilt + Spotlight + Glare** — 3D cursor tracking with interactive hover effects on all cards
- **Smooth Scrolling** — Buttery smooth scroll with custom scrollbar
- **Terminal Cards** — Live UTC clock, typing animations, command-line aesthetics
- **Journey Timeline** — Horizontal timeline with scanning light animation and glowing dots
- **Tech Stack Bento** — Core expertise grid with count-up animations and proficiency bars
- **Responsive Design** — Seamless experience across desktop, tablet, and mobile
- **Dark OLED Theme** — Pure black (#050505) background with white/gray palette

## Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | React 19, React Router DOM |
| **Build Tool** | Vite 5 |
| **Styling** | Vanilla CSS, CSS Custom Properties |
| **Fonts** | Space Grotesk, Plus Jakarta Sans, Orbitron |
| **Animations** | Custom hooks, CSS transitions, Intersection Observer |
| **Deployment** | Vercel / Netlify |

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/valtrix7/valtrix-portfolio.git

# Navigate to project directory
cd valtrix-portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

The site will be available at `http://localhost:3000`

### Build

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx       # Floating pill navbar with hamburger morph
│   ├── Hero.jsx         # Eclipse hero with particles & orbital rings
│   ├── About.jsx        # Terminal card, bento grid, journey timeline
│   ├── Process.jsx      # 4-step development process
│   ├── Projects.jsx     # Square connected project cards
│   ├── Stack.jsx        # Tech categories + proficiency bars
│   ├── Contact.jsx      # Terminal hero, form, social bento
│   ├── Footer.jsx       # Marquee, giant text, live clock
│   ├── Loading.jsx      # Letter-by-letter reveal + curtain
│   └── PageTransition.jsx # Route change name flash
├── pages/               # Route pages
│   ├── Home.jsx
│   ├── AboutPage.jsx
│   ├── ProjectsPage.jsx
│   └── ContactPage.jsx
├── hooks/               # Custom React hooks
│   └── useScrollAnimation.js
├── App.jsx              # Router + layout
├── App.css              # Global animation classes
└── index.css            # CSS variables + base styles
```

## Custom Hooks

| Hook | Description |
|------|-------------|
| `useScrollAnimation` | Intersection Observer reveal on scroll |
| `useStaggerAnimation` | Staggered children reveal |
| `useScrollProgress` | 0→1 progress as element scrolls through viewport |
| `useScrollTilt` | Card tilts based on scroll position |
| `useScrollScale` | Scale effect based on scroll |
| `useScrollRotate` | Rotate effect based on scroll |
| `useParallax` | Vertical offset on scroll |
| `useMouseParallax` | Cursor-driven offset |
| `useTilt` | 3D cursor tilt with glare |
| `useMagnetic` | Element drifts toward cursor |
| `useCountUp` | Animated number counter |

## Performance

- **Lighthouse Score**: 95+ across all categories
- **CSS**: ~75KB (12KB gzipped)
- **JS**: ~252KB (74KB gzipped)
- **Fonts**: Optimized with `font-display: swap`
- **Animations**: GPU-accelerated with `will-change` and `transform`

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#050505` | OLED black background |
| `--bg-secondary` | `#0a0a0a` | Elevated surfaces |
| `--text-primary` | `#ffffff` | Headings, emphasis |
| `--text-secondary` | `rgba(255,255,255,0.6)` | Body text |
| `--text-tertiary` | `rgba(255,255,255,0.35)` | Labels, captions |
| `--border-subtle` | `rgba(255,255,255,0.06)` | Card borders |
| `--border-hover` | `rgba(255,255,255,0.12)` | Hover states |

## License

MIT License. See [LICENSE](LICENSE) for details.

---

<div align="center">

**Built by [Valtrix](https://github.com/valtrix7)**

</div>
