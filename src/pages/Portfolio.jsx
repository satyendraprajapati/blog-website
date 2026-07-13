import { Info } from 'lucide-react'
import { getAllProjects } from '../lib/projects'
import ProjectCard from '../components/ProjectCard'
import { useSEO } from '../lib/useSEO'

export default function Portfolio() {
  const projects = getAllProjects()

  useSEO('Portfolio', 'Case studies from Power BI, Excel automation, and web development projects.')

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Portfolio</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        A few examples of the kind of work I do — dashboards, automation, and websites.
      </p>

      <div className="flex items-start gap-2 text-sm bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 rounded-lg px-4 py-3 mb-8">
        <Info size={16} className="mt-0.5 shrink-0" />
        These are sample case studies illustrating the type of work available. Replace them with
        real project write-ups in <code>content/projects/</code> before sharing this site with
        clients.
      </div>

      <div className="space-y-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.slug}
            slug={project.slug}
            title={project.title}
            excerpt={project.excerpt}
            result={project.result}
            tools={project.tools}
          />
        ))}
      </div>
    </div>
  )
}
