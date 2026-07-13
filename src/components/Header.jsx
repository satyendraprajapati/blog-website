import { NavLink } from 'react-router-dom'
import { BarChart3, Briefcase } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/services', label: 'Services' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/blog', label: 'Blog' },
  { to: '/about', label: 'About' },
]

export default function Header() {
  return (
    <header className="border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 bg-white/80 dark:bg-[#16171d]/80 backdrop-blur">
      <div className="max-w-3xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
        <NavLink to="/" className="flex items-center gap-2 text-lg font-bold">
          <BarChart3 size={22} className="text-purple-600 dark:text-purple-400" />
          Data Analyst Blog
        </NavLink>
        <nav className="flex flex-wrap items-center gap-1">
          {navLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-full text-sm transition-colors ${
                  isActive
                    ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 font-semibold'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <NavLink
            to="/contact"
            className="flex items-center gap-1.5 bg-purple-600 text-white rounded-full px-3 py-1.5 text-sm font-semibold hover:bg-purple-700 transition-colors"
          >
            <Briefcase size={14} />
            Hire Me
          </NavLink>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
