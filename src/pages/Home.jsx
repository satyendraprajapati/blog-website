import { Link } from 'react-router-dom'
import { getAllPosts } from '../lib/posts'
import PostCard from '../components/PostCard'
import { useSEO } from '../lib/useSEO'

const LATEST_POSTS_COUNT = 3

export default function Home() {
  const latestPosts = getAllPosts().slice(0, LATEST_POSTS_COUNT)

  useSEO(null, 'Notes on data analysis, dashboards, and the tools behind them.')

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Data Analyst Blog</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-300">
        Notes on data analysis, dashboards, and the tools behind them.
      </p>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Latest Posts</h2>
        <Link to="/blog" className="text-sm text-blue-600 hover:underline">
          View all posts
        </Link>
      </div>

      <div className="mt-4 space-y-6">
        {latestPosts.map((post) => (
          <PostCard
            key={post.slug}
            slug={post.slug}
            title={post.title}
            date={post.date}
            excerpt={post.excerpt}
            tags={post.tags}
          />
        ))}
      </div>
    </div>
  )
}
