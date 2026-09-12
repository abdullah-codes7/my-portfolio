import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { getSortedPosts, getPostBySlug, getReadTime, formatPostDate } from '../data/blog'
import './BlogPostPage.css'

function ContentBlock({ block }) {
  switch (block.type) {
    case 'p':
      return <p className="bp-p">{block.text}</p>
    case 'h2':
      return <h2 className="bp-h2">{block.text}</h2>
    case 'quote':
      return <blockquote className="bp-quote">{block.text}</blockquote>
    case 'list':
      return (
        <ul className="bp-list">
          {block.items.map((item, i) => (
            <li key={i} className="bp-list-item">{item}</li>
          ))}
        </ul>
      )
    case 'code':
      return (
        <div className="bp-code">
          {block.lang && <span className="bp-code-lang">{block.lang}</span>}
          <pre><code>{block.code}</code></pre>
        </div>
      )
    default:
      return null
  }
}

function BlogPostPage() {
  const { slug } = useParams()
  const post = useMemo(() => getPostBySlug(slug), [slug])
  const posts = useMemo(getSortedPosts, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!post) {
    return (
      <main className="bp-page">
        <SEO title="Post Not Found | Abdullah Portfolio" />
        <div className="bp-container">
          <h1 className="bp-not-found">Post not found</h1>
          <Link to="/blog" className="bp-back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            All posts
          </Link>
        </div>
      </main>
    )
  }

  const readTime = getReadTime(post)
  const index = posts.findIndex((p) => p.slug === post.slug)
  const prevPost = posts[index + 1] // older
  const nextPost = posts[index - 1] // newer

  return (
    <main className="bp-page">
      <SEO
        title={`${post.title} | Abdullah Blog`}
        description={post.excerpt}
        url={`https://imabdullah.xyz/blog/${post.slug}`}
        type="article"
      />
      <article className="bp-container">
        {/* Back */}
        <Link to="/blog" className="bp-back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          All posts
        </Link>

        {/* Header */}
        <header className="bp-header">
          <div className="bp-meta">
            <span className="bp-date">{formatPostDate(post.date)}</span>
            <span className="bp-meta-dot" aria-hidden="true"></span>
            <span className="bp-read">{readTime} min read</span>
          </div>
          <h1 className="bp-title">{post.title}</h1>
          <p className="bp-excerpt">{post.excerpt}</p>
          <div className="bp-tags">
            {post.tags.map((tag) => (
              <span key={tag} className="blog-tag">{tag}</span>
            ))}
          </div>
        </header>

        {/* Body */}
        <div className="bp-body">
          {post.content.map((block, i) => (
            <ContentBlock key={i} block={block} />
          ))}
        </div>

        {/* Prev / Next */}
        <nav className="bp-nav" aria-label="More posts">
          <div className="bp-nav-cell">
            {prevPost ? (
              <Link to={`/blog/${prevPost.slug}`} className="bp-nav-link">
                <span className="bp-nav-label">Older</span>
                <span className="bp-nav-title">{prevPost.title}</span>
              </Link>
            ) : <span />}
          </div>
          <div className="bp-nav-cell bp-nav-cell-right">
            {nextPost ? (
              <Link to={`/blog/${nextPost.slug}`} className="bp-nav-link bp-nav-link-next">
                <span className="bp-nav-label">Newer</span>
                <span className="bp-nav-title">{nextPost.title}</span>
              </Link>
            ) : <span />}
          </div>
        </nav>
      </article>
    </main>
  )
}

export default BlogPostPage
