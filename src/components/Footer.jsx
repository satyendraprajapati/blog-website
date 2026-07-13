import { Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-3xl mx-auto px-4 py-6 text-sm text-gray-500 flex items-center justify-center gap-1.5">
        Built with <Heart size={14} className="text-purple-500 fill-purple-500" /> using React &amp; Tailwind
      </div>
    </footer>
  )
}
