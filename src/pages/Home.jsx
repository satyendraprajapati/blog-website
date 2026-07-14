import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Briefcase } from 'lucide-react'
import { getAllPosts } from '../lib/posts'
import PostCard from '../components/PostCard'
import Testimonials from '../components/Testimonials'
import { useSEO } from '../lib/useSEO'
import { getPlaceholderImage } from '../lib/placeholderImage'

const LATEST_POSTS_COUNT = 3

export default function Home() {
  const latestPosts = getAllPosts().slice(0, LATEST_POSTS_COUNT)

  useSEO(null, 'Notes on data analysis, dashboards, and the tools behind them.')

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="relative rounded-2xl overflow-hidden mb-10">
        <img
          src={getPlaceholderImage('home-hero', 1200, 450)}
          alt=""
          className="w-full h-56 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 text-left">
          <h1 className="text-3xl font-bold text-white">Data Analyst Blog</h1>
          <p className="mt-2 text-white/90">
            Notes on data analysis, dashboards, and the tools behind them.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="flex items-center gap-1.5 bg-purple-600 text-white rounded-full px-4 py-2 text-sm font-semibold hover:bg-purple-700 transition-colors"
            >
              <Briefcase size={14} />
              Hire Me
            </Link>
            <Link
              to="/services"
              className="flex items-center gap-1.5 bg-white/90 text-gray-900 rounded-full px-4 py-2 text-sm font-semibold hover:bg-white transition-colors"
            >
              View Services
            </Link>
          </div>
        </div>
      </div>

      <Testimonials />

      <div className="flex items-center justify-between mt-12">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Sparkles size={18} className="text-purple-500" />
          Latest Posts
        </h2>
        <Link
          to="/blog"
          className="flex items-center gap-1 text-sm text-purple-600 dark:text-purple-400 hover:underline"
        >
          View all posts
          <ArrowRight size={14} />
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
