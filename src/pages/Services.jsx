import { Link } from 'react-router-dom'
import { LayoutDashboard, FileSpreadsheet, Globe, Presentation, CheckCircle2 } from 'lucide-react'
import { useSEO } from '../lib/useSEO'

const services = [
  {
    icon: LayoutDashboard,
    title: 'Power BI Dashboards',
    description:
      'Interactive dashboards that turn scattered spreadsheets into a single, live source of truth.',
    deliverables: [
      'Data model & DAX measures',
      'Interactive drill-through reports',
      'Scheduled refresh setup',
    ],
  },
  {
    icon: FileSpreadsheet,
    title: 'Excel Automation',
    description:
      'Power Query and VBA workflows that remove the manual, repetitive parts of your reporting.',
    deliverables: ['Automated data pipelines', 'Macro-driven workbooks', 'Reusable templates'],
  },
  {
    icon: Globe,
    title: 'Website Development',
    description: 'Fast, modern websites built with React — easy to maintain and update yourself.',
    deliverables: ['Responsive design', 'Content you can edit', 'Deployment & hosting setup'],
  },
  {
    icon: Presentation,
    title: 'PowerPoint Decks',
    description: 'Clear, well-designed presentations for reports, pitches, and client meetings.',
    deliverables: ['Custom slide templates', 'Data visualizations', 'Brand-consistent design'],
  },
]

export default function Services() {
  useSEO('Services', 'Power BI dashboards, Excel automation, website development, and PowerPoint design services.')

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Services</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        16 years of experience across data analysis, automation, and web development. Here's how
        I can help.
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        {services.map(({ icon: Icon, title, description, deliverables }) => (
          <div
            key={title}
            className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 text-left flex flex-col"
          >
            <Icon size={24} className="text-purple-500" />
            <h2 className="text-lg font-semibold mt-3">{title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{description}</p>
            <ul className="mt-3 space-y-1.5 flex-1">
              {deliverables.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-500">
                  <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-purple-500" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              to="/contact"
              className="mt-4 inline-block text-center bg-purple-600 text-white rounded-full px-4 py-2 text-sm hover:bg-purple-700 transition-colors"
            >
              Get a Quote
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
