import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { searchPosts } from '../lib/search'

export default function SearchModal() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const navigate = useNavigate()

  const results = query.trim() ? searchPosts(query).slice(0, 8) : []

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
    } else {
      setQuery('')
    }
  }, [open])

  function handleSelect(slug) {
    setOpen(false)
    navigate(`/blog/${slug}`)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Search posts"
        className="flex items-center gap-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-full px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <Search size={16} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center pt-24 px-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-[#16171d] rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <Search size={18} className="text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search posts…"
                className="flex-1 bg-transparent outline-none text-sm"
              />
              <button onClick={() => setOpen(false)} aria-label="Close search">
                <X size={18} className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {query.trim() && results.length === 0 && (
                <p className="px-4 py-6 text-sm text-gray-500 text-center">No posts found.</p>
              )}
              {results.map((post) => (
                <button
                  key={post.slug}
                  onClick={() => handleSelect(post.slug)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0"
                >
                  <p className="font-medium text-sm">{post.title}</p>
                  {post.excerpt && (
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{post.excerpt}</p>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
