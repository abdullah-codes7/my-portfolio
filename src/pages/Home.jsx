import { useEffect } from 'react'
import Hero from '../components/Hero'
import About from '../components/About'
import Projects from '../components/Projects'
import Process from '../components/Process'
import Stack from '../components/Stack'
import Contact from '../components/Contact'
import SEO from '../components/SEO'

const homeSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://imabdullah.xyz/#website",
      "url": "https://imabdullah.xyz",
      "name": "Abdullah Portfolio",
      "description": "Building scalable web applications and decentralized systems.",
      "publisher": {
        "@id": "https://imabdullah.xyz/#person"
      }
    },
    {
      "@type": "Person",
      "@id": "https://imabdullah.xyz/#person",
      "name": "Abdullah",
      "url": "https://imabdullah.xyz",
      "jobTitle": "Full Stack Developer",
      "image": "https://imabdullah.xyz/og.png",
      "sameAs": [
        "https://github.com/abdullah-codes7",
        "https://twitter.com/abdullah_codes7"
      ]
    }
  ]
};
function Home() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <main>
      <SEO schema={homeSchema} />
      <Hero />
      <About />
      <Projects />
      <Process />
      <Stack />
      <Contact />
    </main>
  )
}

export default Home
