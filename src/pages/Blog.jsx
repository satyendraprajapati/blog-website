import { getAllPosts } from '../lib/posts'
import PostCard from '../components/PostCard'
import { useSEO } from '../lib/useSEO'

export default function Blog() {
  const posts = getAllPosts()

  useSEO('Blog', 'All posts on data analysis, dashboards, and the tools behind them.')

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>
      <div className="space-y-6">
        {posts.map((post) => (
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
