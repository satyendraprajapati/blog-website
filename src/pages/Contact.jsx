import { useSEO } from '../lib/useSEO'

const CONTACT_EMAIL = 'satya15793@gmail.com'

export default function Contact() {
  useSEO('Contact', 'Get in touch with questions, feedback, or topic requests.')

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Contact</h1>
      <p className="mt-4 text-gray-600 dark:text-gray-300">
        Have a question, feedback, or a topic you'd like to see covered? Send me an email.
      </p>
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className="mt-6 inline-block bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
      >
        Email {CONTACT_EMAIL}
      </a>
    </div>
  )
}
