import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

type MetaConfig = {
  title: string
  description: string
  keywords: string
}

const DEFAULT_META: MetaConfig = {
  title: 'OpenComp — India Workplace Intelligence',
  description: 'OpenComp is an open-source workplace intelligence and salary transparency platform for India with anonymous, community-owned compensation and culture insights.',
  keywords: 'OpenComp, salary transparency India, workplace intelligence, compensation benchmarking, city salary heatmap, role salary intelligence, company culture analytics',
}

const ROUTE_META: Record<string, MetaConfig> = {
  '/': {
    title: 'OpenComp — Community-Owned Workplace Intelligence for India',
    description: 'Explore open salary benchmarks, workplace culture analytics, and map-first compensation intelligence across India.',
    keywords: 'OpenComp, India salary data, compensation transparency, workplace analytics, salary benchmark India',
  },
  '/companies': {
    title: 'Company Intelligence in India | OpenComp',
    description: 'Compare companies using open compensation benchmarks, culture signals, and community-contributed workplace data.',
    keywords: 'company salary comparison India, company culture scores, OpenComp companies',
  },
  '/cities': {
    title: 'City Salary Intelligence & Heatmap | OpenComp',
    description: 'Analyze compensation and workplace signals city-by-city with OpenComp’s interactive India salary map.',
    keywords: 'city salary heatmap India, Bangalore salary benchmark, Mumbai tech salaries, India city compensation',
  },
  '/roles': {
    title: 'Role Salary Benchmarks in India | OpenComp',
    description: 'View salary ranges, growth trends, and remote premium insights for tech roles across India.',
    keywords: 'role salary benchmark India, software engineer salary India, remote premium India',
  },
  '/contribute': {
    title: 'Contribute Anonymous Salary Data | OpenComp',
    description: 'Contribute anonymized compensation and workplace insights to strengthen open salary transparency in India.',
    keywords: 'submit salary anonymously, contribute workplace data, OpenComp contribution',
  },
}

function upsertMeta(selector: string, attrName: 'name' | 'property', attrValue: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(selector)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attrName, attrValue)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function slugToTitleCase(slug?: string) {
  if (!slug) return ''
  let decodedSlug: string
  try {
    decodedSlug = decodeURIComponent(slug)
  } catch {
    decodedSlug = slug
  }

  return decodedSlug
    .split('-')
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function getMetaFromPath(pathname: string): MetaConfig {
  if (ROUTE_META[pathname]) return ROUTE_META[pathname]

  if (pathname.startsWith('/companies/')) {
    const name = slugToTitleCase(pathname.split('/')[2])
    return {
      title: `${name} Company Intelligence | OpenComp`,
      description: `Explore ${name} salary benchmarks, culture trends, and workplace intelligence powered by community submissions on OpenComp.`,
      keywords: `${name} salary India, ${name} compensation benchmark, ${name} culture review, OpenComp`,
    }
  }

  if (pathname.startsWith('/cities/')) {
    const city = slugToTitleCase(pathname.split('/')[2])
    return {
      title: `${city} Salary & Workplace Intelligence | OpenComp`,
      description: `Analyze salary benchmarks, cost signals, and workplace trends for ${city} with OpenComp city intelligence.`,
      keywords: `${city} salary data, ${city} compensation benchmark, ${city} workplace intelligence, OpenComp`,
    }
  }

  if (pathname.startsWith('/roles/')) {
    const role = slugToTitleCase(pathname.split('/')[2])
    return {
      title: `${role} Salary Benchmarks in India | OpenComp`,
      description: `Track ${role} salary ranges, growth, and compensation trends in India with OpenComp’s open data intelligence.`,
      keywords: `${role} salary India, ${role} benchmark, ${role} compensation trend, OpenComp`,
    }
  }

  return DEFAULT_META
}

function getBreadcrumb(pathname: string, origin: string) {
  const segments = pathname.split('/').filter(Boolean)
  const itemListElement = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${origin}/`,
    },
  ]

  segments.forEach((segment, index) => {
    const path = segments.slice(0, index + 1).join('/')
    itemListElement.push({
      '@type': 'ListItem',
      position: index + 2,
      name: slugToTitleCase(segment),
      item: `${origin}/${path}`,
    })
  })

  return {
    '@type': 'BreadcrumbList',
    itemListElement,
  }
}

export function SeoMeta() {
  const { pathname } = useLocation()

  useEffect(() => {
    const origin = window.location.origin
    const url = `${origin}${pathname}`
    const meta = getMetaFromPath(pathname)

    document.title = meta.title

    upsertMeta('meta[name="description"]', 'name', 'description', meta.description)
    upsertMeta('meta[name="keywords"]', 'name', 'keywords', meta.keywords)
    upsertMeta('meta[property="og:title"]', 'property', 'og:title', meta.title)
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', meta.description)
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', url)
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', meta.title)
    upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', meta.description)

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', url)

    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          name: 'OpenComp',
          url: origin,
          inLanguage: 'en-IN',
        },
        {
          '@type': 'WebPage',
          name: meta.title,
          description: meta.description,
          url,
          isPartOf: {
            '@type': 'WebSite',
            name: 'OpenComp',
            url: origin,
          },
          inLanguage: 'en-IN',
          about: {
            '@type': 'Thing',
            name: 'Workplace intelligence and salary transparency in India',
          },
          audience: {
            '@type': 'Audience',
            geographicArea: {
              '@type': 'Country',
              name: 'India',
            },
          },
        },
        getBreadcrumb(pathname, origin),
      ],
    }

    let jsonLdScript = document.getElementById('opencomp-jsonld')
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script')
      jsonLdScript.setAttribute('id', 'opencomp-jsonld')
      jsonLdScript.setAttribute('type', 'application/ld+json')
      document.head.appendChild(jsonLdScript)
    }
    jsonLdScript.textContent = JSON.stringify(jsonLd)
  }, [pathname])

  return null
}
