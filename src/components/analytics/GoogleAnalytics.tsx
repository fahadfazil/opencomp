import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const GOOGLE_TAG_SCRIPT_ID = 'opencomp-google-tag'

function setupGoogleTag(measurementId: string) {
  if (!document.getElementById(GOOGLE_TAG_SCRIPT_ID)) {
    const script = document.createElement('script')
    script.id = GOOGLE_TAG_SCRIPT_ID
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
    document.head.appendChild(script)
  }

  window.dataLayer = window.dataLayer || []
  window.gtag =
    window.gtag ||
    function gtag(...args: unknown[]) {
      window.dataLayer.push(args)
    }

  window.gtag('js', new Date())
  window.gtag('config', measurementId, { send_page_view: false })
}

export function GoogleAnalytics() {
  const location = useLocation()
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim()

  useEffect(() => {
    if (!measurementId) return
    setupGoogleTag(measurementId)
  }, [measurementId])

  useEffect(() => {
    if (!measurementId || !window.gtag) return

    window.gtag('event', 'page_view', {
      page_path: `${location.pathname}${location.search}${location.hash}`,
      page_location: window.location.href,
      page_title: document.title,
    })
  }, [location.hash, location.pathname, location.search, measurementId])

  return null
}
