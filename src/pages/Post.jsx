import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import { ArrowLeft, Calendar, Clock, SearchX, Tag as TagIcon } from 'lucide-react'
import { getPostBySlug } from '../lib/posts'
import { useSEO } from '../lib/useSEO'
import { getPlaceholderImage } from '../lib/placeholderImage'

export default function Post() {
  const { slug } = useParams()
  const post = getPostBySlug(slug)

  useSEO(post ? post.title : 'Post not found', post ? post.excerpt : undefined)

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <SearchX size={40} className="mx-auto text-gray-400" />
        <h1 className="text-2xl font-bold mt-4">Post not found</h1>
        <Link
          to="/blog"
          className="flex items-center justify-center gap-1 text-purple-600 dark:text-purple-400 hover:underline mt-4"
        >
          <ArrowLeft size={16} />
          Back to blog
        </Link>
      </div>
    )
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <img
        src={getPlaceholderImage(post.slug, 1200, 500)}
        alt=""
        className="w-full h-64 object-cover rounded-2xl mb-6"
      />
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p className="flex items-center justify-center gap-4 text-sm text-gray-500 mt-2">
        <span className="flex items-center gap-1.5">
          <Calendar size={14} />
          {post.date}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock size={14} />
          {post.readingTime} min read
        </span>
      </p>
      <div className="flex items-center justify-center gap-2 mt-3">
        <TagIcon size={14} className="text-gray-400" />
        {post.tags.map((tag) => (
          <Link
            key={tag}
            to={`/tags/${tag}`}
            className="text-xs bg-gray-100 dark:bg-gray-800 rounded-full px-2.5 py-1 hover:bg-purple-100 dark:hover:bg-purple-500/20 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
          >
            {tag}
          </Link>
        ))}
      </div>
      <div className="mt-6 leading-relaxed [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:mt-6 [&>p]:mt-4">
        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{post.content}</ReactMarkdown>
      </div>
    </article>
  )
}
