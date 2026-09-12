// ── Blog ────────────────────────────────────────────────────────────────
// Static, backend-free blog. One entry per post — content is a list of
// typed blocks rendered in order by BlogPostPage.
//
// Block types:
//   { type: 'p',     text }
//   { type: 'h2',    text }
//   { type: 'code',  lang, code }   // rendered as a terminal-style block
//   { type: 'quote', text }
//   { type: 'list',  items: [] }
//
// Reading time is computed automatically — no need to maintain it.
// Set `draft: true` to hide a post from the site without deleting it.
// The three posts below are EXAMPLES — replace them with your own writing.

export const allPosts = [
  // ── EXAMPLE POST — replace me ──
  {
    slug: 'making-lenis-and-scrolltrigger-behave',
    title: 'Making Lenis and ScrollTrigger behave',
    date: '2025-11-18',
    tags: ['React', 'GSAP'],
    draft: false,
    excerpt:
      'Smooth scroll libraries and scroll-driven animations don\u2019t have to fight. The setup that finally stopped the jank.',
    content: [
      { type: 'p', text: 'Lenis hijacks the wheel and animates the page on a requestAnimationFrame loop. ScrollTrigger listens to scroll positions to drive pinned sections and reveals. Each one works fine on its own \u2014 the problems start when you combine them, because pinned elements get positioned against a scroll value that is being eased behind the scenes.' },
      { type: 'h2', text: 'The setup that works' },
      { type: 'p', text: 'Keep it boring: one rAF loop owns the scroll, everything else observes it. Give Lenis a short duration \u2014 1.2s is plenty \u2014 and leave infinite mode off. Modern ScrollTrigger reads window scroll directly, so pinning works out of the box once the loop is stable.' },
      {
        type: 'code',
        lang: 'js',
        code: 'const lenis = new Lenis({ duration: 1.2 })\n\nfunction raf(time) {\n  lenis.raf(time)\n  requestAnimationFrame(raf)\n}\n\nrequestAnimationFrame(raf)',
      },
      { type: 'p', text: 'The real fix for the remaining jank was anticlimactic: call ScrollTrigger.refresh() after custom fonts finish loading, and never animate scroll position with two libraries at once. One thing owns the scroll. Everything else watches.' },
    ],
  },

  // ── EXAMPLE POST — replace me ──
  {
    slug: 'pre-launch-checklist',
    title: 'The boring checklist I run before every launch',
    date: '2025-12-06',
    tags: ['Process'],
    draft: false,
    excerpt:
      'Fifteen minutes of checklist beats two hours of emergency fixes. What I check before anything goes live.',
    content: [
      { type: 'p', text: 'Every embarrassing bug I have shipped came from skipping a line on this list \u2014 not from some clever thing I didn\u2019t know. So now the list runs before every launch, every time, no exceptions for small projects. Especially not for small projects.' },
      { type: 'h2', text: 'The list' },
      {
        type: 'list',
        items: [
          'The og:image URL actually resolves \u2014 tested, not assumed',
          'The meta description reads like a human wrote it',
          'Every route 404s gracefully, including deep links',
          'Images lazy-load and carry alt text',
          'Lighthouse run on a throttled connection, not localhost',
          'A keyboard-only pass through the whole site',
          'Forms submit somewhere real and show a success state',
        ],
      },
      { type: 'p', text: 'None of this is glamorous, and that is the point. The checklist is deliberately boring so that launch day is boring too \u2014 which is exactly what launch day should be.' },
    ],
  },

  // ── EXAMPLE POST — replace me ──
  {
    slug: 'stop-over-engineering-side-projects',
    title: 'Why I stopped over-engineering side projects',
    date: '2026-01-14',
    tags: ['Writing'],
    draft: false,
    excerpt:
      'The stack I pick for fun projects now fits on one line \u2014 and they actually get finished.',
    content: [
      { type: 'p', text: 'I used to start every side project the same way: pick a shiny new stack, design a schema for features that did not exist yet, and spend the first weekend on architecture. Three weeks later the project would be abandoned at 30% complete, architecturally flawless.' },
      { type: 'quote', text: 'A finished project with a boring stack beats an abandoned one with a perfect architecture.' },
      { type: 'p', text: 'These days the rule is simple: the stack must fit on one line, and the first commit must ship something visible. No monorepos, no premature databases, no build pipeline I cannot explain in one sentence. The interesting problems \u2014 the ones worth solving \u2014 always show up later anyway.' },
      { type: 'p', text: 'Shipped beats perfect. Every comparison I make between the two confirms it.' },
    ],
  },
]

// ── Helpers ─────────────────────────────────────────────────────────────

/** Newest first — the array above can be in any order. */
export function getSortedPosts() {
  return [...allPosts].filter((p) => !p.draft).sort((a, b) => new Date(b.date) - new Date(a.date))
}

export function getPostBySlug(slug) {
  return allPosts.find((p) => p.slug === slug && !p.draft)
}

/** ~200 wpm reading speed, computed from the content blocks. */
export function getReadTime(post) {
  const words = post.content.reduce((count, block) => {
    if (block.type === 'p' || block.type === 'h2' || block.type === 'quote') return count + block.text.split(/\s+/).length
    if (block.type === 'list') return count + block.items.join(' ').split(/\s+/).length
    if (block.type === 'code') return count + block.code.split('\n').length * 2
    return count
  }, 0)
  return Math.max(1, Math.round(words / 200))
}

export function formatPostDate(iso) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/** Every tag in use across non-draft posts, alphabetical. */
export function getAllTags() {
  return Array.from(new Set(getSortedPosts().flatMap((p) => p.tags))).sort()
}

