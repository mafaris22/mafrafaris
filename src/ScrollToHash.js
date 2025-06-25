import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToHash() {
  const { hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) {
        // Give React time to render before scrolling
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' })
        }, 0)
      }
    }
  }, [hash])

  return null
}
