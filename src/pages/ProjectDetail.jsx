import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { ArrowLeft, TrendingUp, SearchX, Wrench } from 'lucide-react'
import { getProjectBySlug } from '../lib/projects'
import { useSEO } from '../lib/useSEO'
import { getPlaceholderImage } from '../lib/placeholderImage'

export default function ProjectDetail() {
  const { slug } = useParams()
  const project = getProjectBySlug(slug)

  useSEO(project ? project.title : 'Project not found', project ? project.excerpt : undefined)

  if (!project) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <SearchX size={40} className="mx-auto text-gray-400" />
        <h1 className="text-2xl font-bold mt-4">Project not found</h1>
        <Link
          to="/portfolio"
          className="flex items-center justify-center gap-1 text-purple-600 dark:text-purple-400 hover:underline mt-4"
        >
          <ArrowLeft size={16} />
          Back to portfolio
        </Link>
      </div>
    )
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <img
        src={getPlaceholderImage(project.slug, 1200, 500)}
        alt={project.title}
        className="w-full h-64 object-cover rounded-2xl mb-6"
      />
      <h1 className="text-3xl font-bold">{project.title}</h1>

      {project.result && (
        <p className="flex items-center justify-center gap-1.5 text-purple-600 dark:text-purple-400 mt-3">
          <TrendingUp size={16} />
          {project.result}
        </p>
      )}

      <div className="flex items-center justify-center gap-2 mt-3">
        <Wrench size={14} className="text-gray-400" />
        {project.tools.map((tool) => (
          <span
            key={tool}
            className="text-xs bg-gray-100 dark:bg-gray-800 rounded-full px-2.5 py-1"
          >
            {tool}
          </span>
        ))}
      </div>

      <div className="mt-6 leading-relaxed [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:mt-6 [&>p]:mt-4">
        <ReactMarkdown>{project.content}</ReactMarkdown>
      </div>

      <Link
        to="/contact"
        className="mt-8 inline-flex items-center gap-2 bg-purple-600 text-white rounded-full px-5 py-2.5 hover:bg-purple-700 transition-colors"
      >
        Get a quote for a project like this
      </Link>
    </article>
  )
}
