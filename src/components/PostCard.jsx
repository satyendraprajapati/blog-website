import { Link } from 'react-router-dom'

export default function PostCard({ slug, title, date, excerpt, tags = [] }) {
  return (
    <article className="border-b border-gray-200 dark:border-gray-700 pb-6">
      <Link to={`/blog/${slug}`} className="hover:opacity-80">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">{date}</p>
        {excerpt && <p className="mt-2 text-gray-600 dark:text-gray-300">{excerpt}</p>}
      </Link>
      {tags.length > 0 && (
        <div className="flex gap-2 mt-2">
          {tags.map((tag) => (
            <Link
              key={tag}
              to={`/tags/${tag}`}
              className="text-xs bg-gray-100 dark:bg-gray-800 rounded px-2 py-1 hover:underline"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}
    </article>
  )
}
