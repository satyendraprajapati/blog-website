import { Award, Layers, MessageSquare, UserCheck } from 'lucide-react'

const reasons = [
  {
    icon: Award,
    title: '16+ Years Experience',
    description: 'Nearly two decades working across data analysis, automation, and web projects.',
  },
  {
    icon: Layers,
    title: 'Four Core Skills',
    description: 'Power BI, Excel automation, website development, and PowerPoint design — under one roof.',
  },
  {
    icon: MessageSquare,
    title: 'Direct Communication',
    description: 'No agency layers — you work directly with the person building your project.',
  },
  {
    icon: UserCheck,
    title: 'End-to-End Delivery',
    description: 'One point of contact from the first conversation to the finished project.',
  },
]

export default function WhyWorkWithMe() {
  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold text-center">Why Work With Me</h2>

      <div className="grid gap-6 sm:grid-cols-2 mt-6">
        {reasons.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 text-left"
          >
            <Icon size={22} className="text-purple-500" />
            <h3 className="font-semibold mt-3">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
