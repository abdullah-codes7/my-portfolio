import { useEffect } from 'react'
import Hero from '../components/Hero'
import About from '../components/About'
import Projects from '../components/Projects'
import Stack from '../components/Stack'
import Contact from '../components/Contact'

function Home({ mousePosition, scrollProgress }) {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Hero mousePosition={mousePosition} scrollProgress={scrollProgress} />
      <About />
      <Projects />
      <Stack />
      <Contact />
    </>
  )
}

export default Home
