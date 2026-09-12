import { memo, useEffect, useMemo, useState } from 'react'
import { useScrollAnimation, useStaggerAnimation, useTilt } from '../hooks/useScrollAnimation'
import AnimatedTitle from '../components/AnimatedTitle'
import SEO from '../components/SEO'
import BorderGlow from '../components/BorderGlow'
import { allProducts } from '../data/products'
import './ProductsPage.css'

// Type filters are derived from the data — adding a product with a new
// `type` value automatically gives it its own filter button.
function getProductTypes() {
  return ['All', ...Array.from(new Set(allProducts.map((p) => p.type)))]
}

function ExternalArrow() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17L17 7M17 7H7M17 7V17" />
    </svg>
  )
}

const ProductCard = memo(function ProductCard({ product, index, setRef, visible }) {
  // No scale on tilt — any scale > 1 makes the card overflow its glow
  // wrapper, which crops the edges. Rotation alone keeps it clean.
  const tiltRef = useTilt({ max: 3, scale: 1 })
  const hasLink = Boolean(product.link)
  const monogram = product.name.trim().charAt(0).toUpperCase() || '·'

  return (
    <div
      ref={(el) => setRef(index)(el)}
      className={`product-shell anim-scale-in ${visible ? 'visible' : ''}`}
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      <BorderGlow className="product-glow" glowColor="40 80 70" glowRadius={24} glowIntensity={0.9}>
        <article ref={tiltRef} className="product-card tilt-card">
          <span className="tilt-glare" aria-hidden="true"></span>
          <span className={`product-status ${product.status.toLowerCase()}`}>{product.status}</span>

          <header className="product-head">
            <span className="product-monogram" aria-hidden="true">{monogram}</span>
          </header>

          <div className="product-body">
            <h3 className="product-name">{product.name}</h3>
            <p className="product-tagline">{product.tagline}</p>
            {product.description && <p className="product-desc">{product.description}</p>}
          </div>

          {product.metrics?.length > 0 && (
            <div className="product-metrics">
              {product.metrics.map((metric) => (
                <div key={metric.label} className="product-metric">
                  <span className="product-metric-value">{metric.value}</span>
                  <span className="product-metric-label">{metric.label}</span>
                </div>
              ))}
            </div>
          )}

          <footer className="product-foot">
            <div className="product-stack">
              {product.stack.map((tech) => (
                <span key={tech} className="tech-tag">{tech}</span>
              ))}
            </div>
            {hasLink ? (
              <a href={product.link} target="_blank" rel="noopener noreferrer" className="product-visit">
                <span>Visit</span>
                <span className="product-visit-icon"><ExternalArrow /></span>
              </a>
            ) : (
              <span className="product-visit product-visit-soon">Not public yet</span>
            )}
          </footer>
        </article>
      </BorderGlow>
    </div>
  )
})

function ProductsPage() {
  const [activeType, setActiveType] = useState('All')
  const [titleRef, titleVisible] = useScrollAnimation(0.2)
  const [setRef, visibleItems] = useStaggerAnimation(allProducts.length, 0.1)
  const types = useMemo(getProductTypes, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const filteredProducts = activeType === 'All'
    ? allProducts
    : allProducts.filter((p) => p.type === activeType)

  return (
    <main className="products-page">
      <SEO
        title="Products | Abdullah Portfolio"
        description="Products, SaaS and tools built and owned by Abdullah — independent software shipped outside of client work."
        url="https://imabdullah.xyz/products"
      />
      <div className="products-page-container">
        <div
          ref={titleRef}
          className={`products-page-header anim-slide-right ${titleVisible ? 'visible' : ''}`}
        >
          <div className="eyebrow">
            <span className="eyebrow-dot"></span>
            Products
          </div>
          <AnimatedTitle line1="Things I" line2="OWN" delay={0.3} className="at-page" />
          <p className="page-subtitle">Independent products and SaaS — built, shipped and maintained by me</p>
        </div>

        <div className="products-filters">
          {types.map((type) => (
            <button
              key={type}
              className={`product-filter-btn ${activeType === type ? 'active' : ''}`}
              onClick={() => setActiveType(type)}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="products-list">
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              setRef={setRef}
              visible={visibleItems.has(index)}
            />
          ))}
          {filteredProducts.length === 0 && (
            <p className="products-empty">Nothing in this category yet — new products are on the way.</p>
          )}
        </div>
      </div>
    </main>
  )
}

export default ProductsPage
