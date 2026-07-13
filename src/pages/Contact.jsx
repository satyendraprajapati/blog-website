import { useState } from 'react'
import { Mail, Send } from 'lucide-react'
import { useSEO } from '../lib/useSEO'

const CONTACT_EMAIL = 'satya15793@gmail.com'

const projectTypes = [
  'Power BI Dashboard',
  'Excel Automation',
  'Website Development',
  'PowerPoint Design',
  'Other',
]

const budgetRanges = ['Under $500', '$500 - $1,500', '$1,500 - $5,000', '$5,000+', 'Not sure yet']

const initialForm = {
  name: '',
  email: '',
  projectType: projectTypes[0],
  budget: budgetRanges[0],
  message: '',
}

export default function Contact() {
  useSEO(
    'Contact',
    'Get in touch to discuss a Power BI, Excel automation, website, or presentation project.'
  )

  const [form, setForm] = useState(initialForm)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const subject = `Project inquiry: ${form.projectType}`
    const body = `Name: ${form.name}\nEmail: ${form.email}\nProject type: ${form.projectType}\nBudget: ${form.budget}\n\n${form.message}`
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Mail size={40} className="mx-auto text-purple-500" />
      <h1 className="text-3xl font-bold mt-4 text-center">Contact</h1>
      <p className="mt-4 text-gray-600 dark:text-gray-300 text-center">
        Tell me a bit about your project and I'll get back to you.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 text-left space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="projectType" className="block text-sm font-medium mb-1">
              Project type
            </label>
            <select
              id="projectType"
              name="projectType"
              value={form.projectType}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {projectTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="budget" className="block text-sm font-medium mb-1">
              Budget range
            </label>
            <select
              id="budget"
              name="budget"
              value={form.budget}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {budgetRanges.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            required
            value={form.message}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 bg-purple-600 text-white rounded-full px-5 py-2.5 hover:bg-purple-700 transition-colors"
        >
          <Send size={16} />
          Send Inquiry
        </button>
      </form>

      <p className="mt-6 text-sm text-gray-500 text-center">
        Or email me directly at{' '}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="text-purple-600 dark:text-purple-400 hover:underline"
        >
          {CONTACT_EMAIL}
        </a>
      </p>
    </div>
  )
}
