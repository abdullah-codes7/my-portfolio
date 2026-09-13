# Agent Speed Spec: Abdullah's Portfolio

This document contains a comprehensive analysis, code scans, and technical architecture of **Abdullah's Portfolio** project. It is structured to allow any AI agent to get up to speed with the codebase instantly, understand the patterns, files, states, and styles, and implement improvements.

---

## 🚀 Tech Stack & Core Libraries

- **Framework**: React 18.2 (Vite, ECMAScript modules)
- **Routing**: `react-router-dom` v7.18.0
- **Animations**:
  - `gsap` (GreenSock Animation Platform v3.15.0) - used for timeline manipulation, pinning, and particle animation.
  - `gsap/ScrollTrigger` - used for scroll-driven page horizontal layout pinning.
- **Scroll Physics**: `lenis` v1.3.24 (Smooth scrolling wrapper)
- **Contact Forms**: Integrated with `Web3Forms` API (or simulated delay in development when no API key is specified).

---

## 📁 Directory Structure

```text
d:/my protfolio/
├── .claude/
│   └── settings.local.json      # Local agent settings
├── .env.example                 # Dev environment template (VITE_WEB3FORMS_KEY)
├── .gitignore                   # Standard build/package git ignores
├── index.html                   # HTML Entry, loads fonts (Orbitron, Space Grotesk, Plus Jakarta)
├── package.json                 # Project dependencies & script entrypoints
├── public/                      # Static assets (logos, project thumbnails)
├── vercel.json                  # Single-page application router rewrites for Vercel deployment
├── vite.config.js               # Vite configurator with React plugin
└── src/
    ├── main.jsx                 # Entry mounting
    ├── App.jsx                  # Main router, Lenis init, Page transition wrapper
    ├── App.css                  # Global utility classes & scroll styles
    ├── index.css                # Style tokens, colors, custom fonts, grain overlays
    ├── components/              # Interactive UI blocks
    │   ├── About.jsx            # Bento, local time, terminal card
    │   ├── About.css
    │   ├── AnimatedTitle.jsx    # Split-line scroll trigger headings
    │   ├── AnimatedTitle.css
    │   ├── BorderGlow.jsx       # Card element that reacts to cursor proximity
    │   ├── BorderGlow.css
    │   ├── Contact.jsx          # Interactive terminal & dispatch form
    │   ├── Contact.css
    │   ├── Footer.jsx           # Marquee, site details directory, local clock
    │   ├── Footer.css
    │   ├── Hero.jsx             # 3D interactive Eclipse, particles, magnetic buttons
    │   ├── Hero.css
    │   ├── Loading.jsx          # Splash screen loading sequence (curtain split)
    │   ├── Loading.css
    │   ├── Navbar.jsx           # Desktop floating pill / mobile slide-out panel
    │   ├── Navbar.css
    │   ├── PageTransition.jsx   # Route changing wipe overlays
    │   ├── PageTransition.css
    │   ├── Process.jsx          # Progress line tracker
    │   ├── Process.css
    │   ├── Projects.jsx         # Home featured project gallery (3D tilts)
    │   ├── Projects.css
    │   ├── SplashCursor.jsx     # Canvas fluid interaction logic
    │   ├── Stack.jsx            # Skills percentage scales & categorizations
    │   └── Stack.css
    ├── data/
    │   └── projects.js          # Project dataset configuration
    ├── hooks/
    │   └── useScrollAnimation.js# Custom hooks for scroll events & cursors
    ├── lib/
    │   └── contact.js           # API submission to Web3Forms
    └── pages/                   # Main page screens
        ├── AboutPage.jsx        # Horizontal pinning journey timeline
        ├── AboutPage.css
        ├── ContactPage.jsx      # Detailed terminal details, forms & cards
        ├── ContactPage.css
        ├── Home.jsx             # Home page section aggregation
        ├── NotFound.jsx         # Not found redirection wrapper
        ├── NotFound.css
        ├── ProjectDetail.jsx    # Dedicated detail layout page
        ├── ProjectDetail.css
        ├── ProjectsPage.jsx     # Dynamic gallery with category filtering
        └── ProjectsPage.css
```

---

## 🎨 Global Styling Tokens (`src/index.css`)

The design uses dark mode aesthetics (`#050505`) with futuristic accents and a subtle noise grain overlay:

```css
:root {
  --bg-primary: #050505;
  --bg-secondary: #0a0a0a;
  --bg-elevated: #111111;
  --bg-card: rgba(255, 255, 255, 0.02);
  --border-subtle: rgba(255, 255, 255, 0.06);
  --border-hover: rgba(255, 255, 255, 0.12);
  --border-active: rgba(255, 255, 255, 0.2);
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.6);
  --text-tertiary: rgba(255, 255, 255, 0.35);
  --font-display: 'Space Grotesk', sans-serif;
  --font-body: 'Plus Jakarta Sans', sans-serif;
  --font-futuristic: 'Orbitron', sans-serif;
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
  --ease-spring: cubic-bezier(0.32, 0.72, 0, 1);
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-xl: 28px;
  --radius-pill: 100px;
}
```

Key features:
1. **Grain Overlay**: `.grain-overlay` is a fixed, pointer-events-none noise overlay that adds a premium organic texture.
2. **Body setup**: `overflow-x: clip` prevents horizontal breaks while maintaining compatibility with CSS `position: sticky`.

---

## ⚡ Custom Hooks (`src/hooks/useScrollAnimation.js`)

All interactions are modularized into a set of custom performance-tuned hooks:

1. **`useScrollAnimation(threshold = 0.1)`**
   - Reveals an element using `IntersectionObserver`.
   - Automatically bypasses animation if the user prefers reduced motion.
2. **`useStaggerAnimation(count, threshold = 0.1)`**
   - Staggers the entry of multiple child elements. Returns a `setRef` function and a `Set` of visible element indices.
3. **`useScrollProgress(offset = 0)`**
   - Tracks relative scroll position ($0 \rightarrow 1$) of an element as it enters and leaves the viewport.
4. **`useParallax(speed = 0.5)`**
   - Returns a `ref` and an `offset` pixel value representing vertical movement offset based on scroll position.
5. **`useMouseParallax(intensity = 0.02)`**
   - Returns `{x, y}` coordinates mapping mouse offset from screen center.
6. **`useTilt({ max = 10, scale = 1.02 })`**
   - Sets CSS custom variables `--rx` (rotation x), `--ry` (rotation y), `--mx` (mouse x percentage), and `--my` (mouse y percentage) on hover, producing a 3D glare tilt.
7. **`useCountUp(target, isActive, options)`**
   - Linearly animates a numeric value up to a target number using RequestAnimationFrame.
8. **`useMagnetic(strength = 0.3)`**
   - Pulls elements (like buttons) slightly towards the cursor within their bounding box.
9. **`useScrollScale({ min, max, offset })`**
   - Sets scale variable based on scroll depth.
10. **`useScrollRotate(maxDeg)`**
    - Returns a rotation value between $0$ and `maxDeg` matching viewport scroll depth.
11. **`useScrollTilt({ maxTilt, axis })`**
    - Tilts an element as it enters the viewport and straightens it out as it aligns in the center.

---

## 🔬 Component Level Scans

### 🌀 1. App Level Wrapper (`src/App.jsx` & `src/App.css`)
- **App Configuration**: Integrates Lenis smooth scroll overlay and runs `requestAnimationFrame` loop on mount.
- **Scroll Bar Tracker**: Updates `scrollProgress` to render the floating top progress indicator.
- **Interactive Cursor**: Renders `<SplashCursor>` globally.
- **Router Navigation**: Mounts routes inside `<PageTransition>` and updates a global `<Navbar />` and `<Footer />`.

### 🌌 2. Hero Section (`src/components/Hero.jsx` & `src/components/Hero.css`)
- **Moon Video Background**: Full-bleed `<video>` (muted, looped, `playsInline` — no sound) of crescent moon footage from Abdullah's public Vercel Blob bucket (`VIDEO_SRC` constant), `object-fit: cover`.
- **Video Lifecycle**: Autoplays only while the hero is in the viewport **and** the tab is visible (IntersectionObserver + `visibilitychange`); paused static frame for `prefers-reduced-motion`; static moon-glow fallback layer shows while buffering or on error (`videoOk` state unmounts the video).
- **Editorial Layout** (modeled on a reference design): giant ghost "01" watermark behind the headline, two-line masked-reveal title ("Full Stack / Developer"), aside column with intro blurb + accent "More about me" link, numbered CTA items (`01 Explore projects → /projects`, `02 Start a project → /contact`) with accent-hover top borders, vertical "PORTFOLIO"/"SCROLL DOWN" rails on the edges, GitHub/X social icons bottom-left.
- **Legibility Scrims**: `.hero-scrim` layers a left-side darkening gradient + top/bottom vignette over the footage.
- **Magnetic Links**: Editorial links use `useMagnetic` (aside link 0.2, index items 0.3).
- **Scroll Parallax**: One passive listener writes a `--sp` (0→1) custom property on `.hero`; CSS `calc()` fades/translates the content and zooms the video layer — zero per-frame layout reads.
- **Entrance Reveals**: Pure-CSS masked line reveals + staggered opacity/translate transitions triggered by a `.visible` class (no JS animation).

### 🍱 3. About Section (`src/components/About.jsx` & `src/components/About.css`)
- **Terminal Element**: Displays a custom environment output (`whoami`) alongside a synchronized digital clock matching Pakistan Standard Time (`Asia/Karachi`).
- **Magic Bento Grid**:
  - GSAP cursor tracker appends a `.mb-spotlight` to `document.body`.
  - Listens to global mouse moves; calculates proximity from card centers.
  - Spawns GSAP-animated floating dust dots (`.mb-particle`) on cards when hover intensity exceeds `0.3`, deleting them dynamically when the cursor moves away.
  - Uses `useCountUp` to animate stats.

### 🛠️ 4. Process Roadmap (`src/components/Process.jsx` & `src/components/Process.css`)
- **Steps Sequence**: Discover, Build, Launch.
- **Connecting Visuals**: A vertical timeline line (`.process-progress-fill`) fills dynamically based on how many steps are visible in viewport.
- **Process Cards**: Wrapped in `<BorderGlow />` with cursor tilt triggers. Renders background watermarked digits drifting with scroll parallax.

### ✨ 5. Border Glow wrapper (`src/components/BorderGlow.jsx` & `src/components/BorderGlow.css`)
- **Proximity calculation**: Uses cursor offset against element center to calculate angles (`--cursor-angle`) and proximity ratios (`--edge-proximity`).
- **Dynamic Borders**: Computes gradient weights to produce a sharp neon beam trailing the mouse along card perimeters.
- **Animation trigger**: Can perform a single sweeping loading animation on demand.

### 🧭 6. Navbar (`src/components/Navbar.jsx` & `src/components/Navbar.css`)
- Renders as a floating pill overlay that turns translucent when scrolled (`scrolled` state).
- Contains an interactive top progress bar indicating scroll depth.
- Mobile Layout: Toggles an absolute slide-out overlay menu panel (`.menu-overlay`), dynamically locking body scrolls.

### 🎭 7. Page Transitions (`src/components/PageTransition.jsx` & `src/components/PageTransition.css`)
- Intercepts routes to trigger a full-screen name visual wipe.
- Cycle sequence: `out` (400ms) $\rightarrow$ `name` (flash ABDULLAH, 500ms) $\rightarrow$ `in` (500ms) $\rightarrow$ `idle`.

### 🔄 8. Loading Screen (`src/components/Loading.jsx` & `src/components/Loading.css`)
- Initial overlay before page hydration.
- Sequenced in timed phases: `loading` $\rightarrow$ `split` $\rightarrow$ `reveal` $\rightarrow$ `done`.
- Staggers letter scale-ins and slides out curtain halves.

---

## 📄 Page Level Scans

### 🧬 1. About Page (`src/pages/AboutPage.jsx` & `src/pages/AboutPage.css`)
- **Gsap Horizontal Scroll**:
  - Desktop-only effect using `gsap.matchMedia`.
  - Hooks horizontal movement container `.h-scroll-container` to vertical page scroll triggers via `pin: true` and `scrub: 1`.
  - Automatically handles font-loading or browser resizing shifts by calling `invalidateOnRefresh` and re-calculating dimensions via `ScrollTrigger.refresh()`.
  - Automatically falls back to standard vertical flow on mobile and prefers-reduced-motion profiles.
- **Content Blocks**: Stat increments, Journey timelines (2021-2025), and values.

### 📊 2. Projects Page (`src/pages/ProjectsPage.jsx` & `src/pages/ProjectsPage.css`)
- **Filtering**: Implements localized category filters: `'All'`, `'Full Stack'`, `'Frontend'`, `'Backend'`.
- **Card grid**: Cards display categories, roles, and status tags (`Live` or `Development`).

### ℹ️ 3. Project Detail Page (`src/pages/ProjectDetail.jsx` & `src/pages/ProjectDetail.css`)
- Renders detailed layout containing: large hero image, metadata headers, key feature bullets, full description, technical tooltags, and direct external project link redirection.

### 📨 4. Contact Page (`src/pages/ContactPage.jsx` & `src/pages/ContactPage.css`)
- Combines a digital JSON availability shell (`availability.json`) with a full form.
- Contains sidebar information showing: local PKT clock, availability statuses, and large social link cards wrapped in `<BorderGlow />` overlays.

---

## 📈 Database Specification (`src/data/projects.js`)

Projects data format:

```javascript
export const allProjects = [
  {
    id: 1,
    title: 'WHITE Fintech',
    category: 'Web Development',
    description: '...',
    longDescription: '...',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    year: '2026',
    status: 'Live',
    role: 'Frontend Developer',
    link: 'https://gowhite.xyz',
    image: '/projects/white-fintech.png',
    features: [...]
  },
  ...
]
```

---

## 💡 Recommendations & Future Enhancements

If you are working to build this portfolio and make it nicer:
1. **Interactive Bento Assets**: Integrate custom icons/3D assets or dynamic cards in the Bento grids.
2. **WebGL Enhancements**: Replace static SVGs inside the Hero section with dynamic Three.js or custom shaders.
3. **Transition Overlays**: Improve the routing transition overlay with morphing SVG paths instead of rigid translation panels.
4. **Local Time Enhancements**: Add custom timezone translations showing developer local time vs. visitor local time.
5. **Tailwind Migration**: Standardize components using structured utility styles if layout refactoring is needed.
