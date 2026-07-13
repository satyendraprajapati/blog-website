import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import { getPostBySlug } from '../lib/posts'
import { useSEO } from '../lib/useSEO'

export default function Post() {
  const { slug } = useParams()
  const post = getPostBySlug(slug)

  useSEO(post ? post.title : 'Post not found', post ? post.excerpt : undefined)

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Post not found</h1>
        <Link to="/blog" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to blog
        </Link>
      </div>
    )
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p className="text-sm text-gray-500 mt-1">
        {post.date} · {post.readingTime} min read
      </p>
      <div className="flex gap-2 mt-2">
        {post.tags.map((tag) => (
          <Link
            key={tag}
            to={`/tags/${tag}`}
            className="text-xs bg-gray-100 dark:bg-gray-800 rounded px-2 py-1 hover:underline"
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
