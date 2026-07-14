import { Link } from 'react-router-dom'
import { TrendingUp } from 'lucide-react'
import { getPlaceholderImage } from '../lib/placeholderImage'

export default function ProjectCard({ slug, title, excerpt, result, tools = [] }) {
  return (
    <article className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
      <Link to={`/portfolio/${slug}`} className="group block">
        <div className="overflow-hidden rounded-lg mb-3">
          <img
            src={getPlaceholderImage(slug, 800, 400)}
            alt={title}
            loading="lazy"
            className="w-full h-40 object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <h2 className="text-xl font-semibold group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
          {title}
        </h2>
        {excerpt && <p className="mt-2 text-gray-600 dark:text-gray-300">{excerpt}</p>}
        {result && (
          <p className="flex items-center gap-1.5 text-sm text-purple-600 dark:text-purple-400 mt-2">
            <TrendingUp size={14} />
            {result}
          </p>
        )}
      </Link>
      {tools.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {tools.map((tool) => (
            <span
              key={tool}
              className="text-xs bg-gray-100 dark:bg-gray-800 rounded-full px-2.5 py-1"
            >
              {tool}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}
