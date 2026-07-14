import { Link } from 'react-router-dom'
import { Calendar } from 'lucide-react'
import { getPlaceholderImage } from '../lib/placeholderImage'

export default function PostCard({ slug, title, date, excerpt, tags = [] }) {
  return (
    <article className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
      <Link to={`/blog/${slug}`} className="group block">
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
        <p className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
          <Calendar size={14} />
          {date}
        </p>
        {excerpt && <p className="mt-2 text-gray-600 dark:text-gray-300">{excerpt}</p>}
      </Link>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((tag) => (
            <Link
              key={tag}
              to={`/tags/${tag}`}
              className="text-xs bg-gray-100 dark:bg-gray-800 rounded-full px-2.5 py-1 hover:bg-purple-100 dark:hover:bg-purple-500/20 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}
    </article>
  )
}
