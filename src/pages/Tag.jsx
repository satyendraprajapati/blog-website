import { useParams, Link } from 'react-router-dom'
import { getAllPosts } from '../lib/posts'
import PostCard from '../components/PostCard'
import { useSEO } from '../lib/useSEO'

export default function Tag() {
  const { tag } = useParams()
  const posts = getAllPosts().filter((post) => post.tags.includes(tag))

  useSEO(`Posts tagged "${tag}"`, `All posts tagged "${tag}".`)

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Posts tagged &ldquo;{tag}&rdquo;
      </h1>

      {posts.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">
          No posts found for this tag.{' '}
          <Link to="/blog" className="text-blue-600 hover:underline">
            Back to blog
          </Link>
        </p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard
              key={post.slug}
              slug={post.slug}
              title={post.title}
              date={post.date}
              excerpt={post.excerpt}
            />
          ))}
        </div>
      )}
    </div>
  )
}
