import { memo, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useScrollAnimation, useStaggerAnimation } from '../hooks/useScrollAnimation'
import AnimatedTitle from '../components/AnimatedTitle'
import SEO from '../components/SEO'
import { getSortedPosts, getAllTags, getReadTime, formatPostDate } from '../data/blog'
import './BlogPage.css'

const PostRow = memo(function PostRow({ post, index, setRef, visible }) {
  return (
    <div
      ref={(el) => setRef(index)(el)}
      className={`blog-row-shell anim-fade-up ${visible ? 'visible' : ''}`}
      style={{ transitionDelay: `${index * 0.07}s` }}
    >
      <Link to={`/blog/${post.slug}`} className="blog-row">
        <span className="blog-row-date">{formatPostDate(post.date)}</span>
        <div className="blog-row-main">
          <h2 className="blog-row-title">
            {post.title}
            <svg className="blog-row-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </h2>
          <p className="blog-row-excerpt">{post.excerpt}</p>
          <div className="blog-row-meta">
            <div className="blog-row-tags">
              {post.tags.map((tag) => (
                <span key={tag} className="blog-tag">{tag}</span>
              ))}
            </div>
            <span className="blog-row-read">{getReadTime(post)} min read</span>
          </div>
        </div>
      </Link>
    </div>
  )
})

function BlogPage() {
  const [activeTag, setActiveTag] = useState('All')
  const [titleRef, titleVisible] = useScrollAnimation(0.2)
  const posts = useMemo(getSortedPosts, [])
  const tags = useMemo(getAllTags, [])
  const [setRef, visibleItems] = useStaggerAnimation(posts.length, 0.1)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const filteredPosts = activeTag === 'All'
    ? posts
    : posts.filter((p) => p.tags.includes(activeTag))

  return (
    <main className="blog-page">
      <SEO
        title="Blog | Abdullah Portfolio"
        description="Notes on building, shipping and staying sane — React, GSAP, process and writing by Abdullah."
        url="https://imabdullah.xyz/blog"
      />
      <div className="blog-container">
        <div
          ref={titleRef}
          className={`blog-header anim-slide-right ${titleVisible ? 'visible' : ''}`}
        >
          <div className="eyebrow">
            <span className="eyebrow-dot"></span>
            Blog
          </div>
          <AnimatedTitle line1="NOTES &" line2="WRITING" delay={0.3} className="at-page" />
          <p className="page-subtitle">Occasional notes on building, shipping and staying sane</p>
        </div>

        {tags.length > 0 && (
          <div className="blog-filters">
            {['All', ...tags].map((tag) => (
              <button
                key={tag}
                className={`blog-filter-btn ${activeTag === tag ? 'active' : ''}`}
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        <div className="blog-list">
          {filteredPosts.map((post, index) => (
            <PostRow
              key={post.slug}
              post={post}
              index={index}
              setRef={setRef}
              visible={visibleItems.has(index)}
            />
          ))}
          {filteredPosts.length === 0 && (
            <p className="blog-empty">Nothing filed under this tag yet.</p>
          )}
        </div>
      </div>
    </main>
  )
}

export default BlogPage
