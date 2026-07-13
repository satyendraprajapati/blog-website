import { Mail } from 'lucide-react'
import { useSEO } from '../lib/useSEO'

const CONTACT_EMAIL = 'satya15793@gmail.com'

export default function Contact() {
  useSEO('Contact', 'Get in touch with questions, feedback, or topic requests.')

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Mail size={40} className="mx-auto text-purple-500" />
      <h1 className="text-3xl font-bold mt-4">Contact</h1>
      <p className="mt-4 text-gray-600 dark:text-gray-300">
        Have a question, feedback, or a topic you'd like to see covered? Send me an email.
      </p>
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className="mt-6 inline-flex items-center gap-2 bg-purple-600 text-white rounded-full px-5 py-2.5 hover:bg-purple-700 transition-colors"
      >
        <Mail size={16} />
        Email {CONTACT_EMAIL}
      </a>
    </div>
  )
}
