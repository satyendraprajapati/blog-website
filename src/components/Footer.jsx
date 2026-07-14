import { Link } from 'react-router-dom'
import { BarChart3, Mail, Code2, Rss, Heart } from 'lucide-react'
import NewsletterSignup from './NewsletterSignup'

const CONTACT_EMAIL = 'satya15793@gmail.com'
const GITHUB_URL = 'https://github.com/satyendraprajapati'
const LINKEDIN_URL = 'https://www.linkedin.com/in/satyendra-prajapati-621927215/'

function LinkedinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  )
}

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/blog', label: 'Blog' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-3xl mx-auto px-4 py-10 grid gap-8 sm:grid-cols-3 text-center sm:text-left">
        <div>
          <div className="flex items-center justify-center sm:justify-start gap-2 font-bold">
            <BarChart3 size={20} className="text-purple-600 dark:text-purple-400" />
            Data Analyst Blog
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Notes on data analysis, dashboards, and the tools behind them.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Quick links</h3>
          <ul className="mt-2 space-y-1.5">
            {quickLinks.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="text-sm text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Connect</h3>
          <div className="mt-2 flex items-center justify-center sm:justify-start gap-3">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              aria-label="Email"
              className="text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <Mail size={18} />
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <Code2 size={18} />
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <LinkedinIcon className="w-[18px] h-[18px]" />
            </a>
            <a
              href="/rss.xml"
              aria-label="RSS feed"
              className="text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <Rss size={18} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <NewsletterSignup />
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-3xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <span>© {new Date().getFullYear()} Satyendra Prajapati. All rights reserved.</span>
          <span className="flex items-center gap-1.5">
            Built with <Heart size={12} className="text-purple-500 fill-purple-500" /> using React
            &amp; Tailwind
          </span>
        </div>
      </div>
    </footer>
  )
}
