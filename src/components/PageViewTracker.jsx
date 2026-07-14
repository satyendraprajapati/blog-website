import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function PageViewTracker() {
  const location = useLocation()

  useEffect(() => {
    if (typeof window.plausible === 'function') {
      window.plausible('pageview')
    }
  }, [location.pathname, location.search])

  return null
}
