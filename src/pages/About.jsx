import { BarChart3, FileSpreadsheet, Globe, Presentation } from 'lucide-react'
import { useSEO } from '../lib/useSEO'
import { getPlaceholderImage } from '../lib/placeholderImage'

const skills = [
  { icon: BarChart3, label: 'Power BI' },
  { icon: FileSpreadsheet, label: 'Excel automation' },
  { icon: Globe, label: 'Website development' },
  { icon: Presentation, label: 'PowerPoint decks' },
]

export default function About() {
  useSEO(
    'About',
    'Satyendra Prajapati is a data analyst with 16 years of experience in data analysis, business automation, and web development.'
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <img
        src={getPlaceholderImage('satyendra-prajapati', 160, 160)}
        alt=""
        className="w-28 h-28 rounded-full object-cover mx-auto"
      />
      <h1 className="text-3xl font-bold mt-4">Satyendra Prajapati</h1>
      <p className="mt-4 text-gray-600 dark:text-gray-300">
        I'm a data analyst with 16 years of experience in the field, working across data analysis,
        business process automation, and web development. I started this blog to share what I've
        learned along the way — from building dashboards to automating repetitive business
        workflows.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {skills.map(({ icon: Icon, label }) => (
          <span
            key={label}
            className="flex items-center gap-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2"
          >
            <Icon size={16} className="text-purple-500" />
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
