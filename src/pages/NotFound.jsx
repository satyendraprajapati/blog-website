import { Link } from 'react-router-dom'
import { useSEO } from '../lib/useSEO'

export default function NotFound() {
  useSEO('Page not found', 'The page you are looking for does not exist.')

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">404</h1>
      <p className="mt-4 text-gray-600 dark:text-gray-300">
        The page you're looking for doesn't exist.
      </p>
      <Link to="/" className="mt-6 inline-block text-blue-600 hover:underline">
        Back to home
      </Link>
    </div>
  )
}
