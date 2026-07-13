import { NavLink } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/blog', label: 'Blog' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Header() {
  return (
    <header className="border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-3xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
        <NavLink to="/" className="text-lg font-bold">
          Data Analyst Blog
        </NavLink>
        <nav className="flex gap-4">
          {navLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                isActive
                  ? 'font-semibold underline'
                  : 'text-gray-600 dark:text-gray-300 hover:underline'
              }
            >
              {label}
            </NavLink>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
