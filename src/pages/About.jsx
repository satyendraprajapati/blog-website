import { useSEO } from '../lib/useSEO'

export default function About() {
  useSEO('About', 'About this data analysis blog and who writes it.')

  return <h1>About Page</h1>
}
