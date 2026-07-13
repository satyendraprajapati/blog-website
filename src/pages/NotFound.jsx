import { Link } from 'react-router-dom'
import { Compass, ArrowLeft } from 'lucide-react'
import { useSEO } from '../lib/useSEO'

export default function NotFound() {
  useSEO('Page not found', 'The page you are looking for does not exist.')

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Compass size={40} className="mx-auto text-purple-500" />
      <h1 className="text-3xl font-bold mt-4">404</h1>
      <p className="mt-4 text-gray-600 dark:text-gray-300">
        The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="flex items-center justify-center gap-1 text-purple-600 dark:text-purple-400 hover:underline mt-6"
      >
        <ArrowLeft size={16} />
        Back to home
      </Link>
    </div>
  )
}
