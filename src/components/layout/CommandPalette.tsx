import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Building2, MapPin, Briefcase, ArrowRight, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils'
import { useUIStore } from '@/store'
import { useCities, useCompanies, useRoles } from '@/hooks'
import type { SearchResult } from '@/types'

const QUICK_LINKS = [
  { label: 'Bangalore', type: 'city', href: '/cities/bangalore' },
  { label: 'Senior Software Engineer', type: 'role', href: '/roles/senior-software-engineer' },
  { label: 'CRED', type: 'company', href: '/companies/cred' },
  { label: 'Razorpay', type: 'company', href: '/companies/razorpay' },
]

const FOCUS_DELAY_MS = 60

function buildSearchIndex(
  companies: Array<{ id: string; name: string; industry: string; headquarters: string; avg_salary_lpa: number; slug: string }>,
  cities: Array<{ id: string; name: string; state: string; avg_salary_lpa: number; total_entries: number; slug: string }>,
  roles: Array<{ id: string; title: string; category: string; avg_salary_lpa: number; yoy_growth_pct: number; slug: string }>
): SearchResult[] {
  const results: SearchResult[] = []

  companies.forEach(c => {
    results.push({
      id: c.id,
      type: 'company',
      name: c.name,
      subtitle: `${c.industry} · ${c.headquarters} · ₹${c.avg_salary_lpa}L avg`,
      slug: c.slug,
    })
  })

  cities.forEach(c => {
    results.push({
      id: c.id,
      type: 'city',
      name: c.name,
      subtitle: `${c.state} · ₹${c.avg_salary_lpa}L avg · ${c.total_entries.toLocaleString()} data points`,
      slug: c.slug,
    })
  })

  roles.forEach(r => {
    results.push({
      id: r.id,
      type: 'role',
      name: r.title,
      subtitle: `${r.category} · ₹${r.avg_salary_lpa}L avg · +${r.yoy_growth_pct}% YoY`,
      slug: r.slug,
    })
  })

  return results
}
const typeConfig = {
  company: {
    icon: Building2,
    color: 'text-primary',
    bg: 'bg-primary/10',
    label: 'COMPANY',
    href: (slug: string) => `/companies/${slug}`,
  },
  city: {
    icon: MapPin,
    color: 'text-secondary',
    bg: 'bg-secondary/10',
    label: 'CITY',
    href: (slug: string) => `/cities/${slug}`,
  },
  role: {
    icon: Briefcase,
    color: 'text-tertiary',
    bg: 'bg-tertiary/10',
    label: 'ROLE',
    href: (slug: string) => `/roles/${slug}`,
  },
}

export function CommandPalette() {
  const { commandPaletteOpen, toggleCommandPalette } = useUIStore()
  const { data: companies = [] } = useCompanies()
  const { data: cities = [] } = useCities()
  const { data: roles = [] } = useRoles()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  const allResults = useMemo(
    () => buildSearchIndex(companies, cities, roles),
    [companies, cities, roles]
  )

  const results = query.length > 1
    ? allResults.filter(r =>
        r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.subtitle.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : []

  useEffect(() => {
    if (commandPaletteOpen) {
      // Delay focus slightly so the overlay transition renders first and screen readers can announce context.
      const timeoutId = window.setTimeout(() => inputRef.current?.focus(), FOCUS_DELAY_MS)
      return () => window.clearTimeout(timeoutId)
    }
  }, [commandPaletteOpen])

  const handleSelect = (result: SearchResult) => {
    const config = typeConfig[result.type]
    navigate(config.href(result.slug))
    toggleCommandPalette()
    setQuery('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') toggleCommandPalette()
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelected(s => Math.min(s + 1, results.length - 1))
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelected(s => Math.max(s - 1, 0))
    }
    if (e.key === 'Enter' && results[selected]) {
      handleSelect(results[selected])
    }
  }

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={toggleCommandPalette}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="fixed top-[15vh] left-1/2 -translate-x-1/2 w-full max-w-2xl z-[101] px-4"
          >
            <div className="glass-card border border-white/10 shadow-2xl overflow-hidden">
              {/* Input */}
              <div className="flex items-center gap-3 px-4 py-4 border-b border-white/5">
                <Search size={18} className="text-outline shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => {
                    setQuery(e.target.value)
                    setSelected(0)
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search company, role, or city..."
                  className="flex-1 bg-transparent text-on-surface placeholder:text-outline outline-none text-body-lg"
                />
                {query && (
                  <button onClick={() => setQuery('')} className="text-outline hover:text-on-surface">
                    <X size={16} />
                  </button>
                )}
                <kbd className="hidden md:block px-2 py-1 rounded bg-surface-container-high border border-outline-variant font-mono text-[10px] text-outline">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              {results.length > 0 ? (
                <ul className="py-2 max-h-[360px] overflow-y-auto">
                  {results.map((result, i) => {
                    const config = typeConfig[result.type]
                    const Icon = config.icon

                    return (
                      <li key={result.id}>
                        <button
                          className={cn(
                            'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
                            i === selected
                              ? 'bg-surface-container-high'
                              : 'hover:bg-surface-container'
                          )}
                          onClick={() => handleSelect(result)}
                          onMouseEnter={() => setSelected(i)}
                        >
                          <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', config.bg)}>
                            <Icon size={15} className={config.color} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-body-md text-on-surface font-medium truncate">
                              {result.name}
                            </div>
                            <div className="text-body-md text-on-surface-variant truncate font-mono text-[11px]">
                              {result.subtitle}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={cn('font-mono text-[9px] tracking-widest', config.color)}>
                              {config.label}
                            </span>
                            {i === selected && <ArrowRight size={14} className="text-outline" />}
                          </div>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              ) : query.length > 1 ? (
                <div className="py-8 text-center text-on-surface-variant text-body-md">
                  No results for "{query}"
                </div>
              ) : (
                /* Quick links */
                <div className="py-3">
                  <div className="px-4 py-2">
                    <span className="mono-label text-on-surface-variant">QUICK ACCESS</span>
                  </div>
                  {QUICK_LINKS.map((link) => {
                    const config = typeConfig[link.type as keyof typeof typeConfig]
                    const Icon = config.icon
                    return (
                      <button
                        key={link.href}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-container transition-colors"
                        onClick={() => {
                          navigate(link.href)
                          toggleCommandPalette()
                        }}
                      >
                        <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', config.bg)}>
                          <Icon size={13} className={config.color} />
                        </div>
                        <span className="text-body-md text-on-surface-variant">{link.label}</span>
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Footer */}
              <div className="border-t border-white/5 px-4 py-2.5 flex items-center gap-4">
                <div className="flex items-center gap-1 text-[11px] text-outline font-mono">
                  <kbd className="px-1 py-0.5 rounded border border-outline-variant bg-surface-container text-[9px]">↑↓</kbd>
                  navigate
                </div>
                <div className="flex items-center gap-1 text-[11px] text-outline font-mono">
                  <kbd className="px-1 py-0.5 rounded border border-outline-variant bg-surface-container text-[9px]">↵</kbd>
                  select
                </div>
                <div className="flex items-center gap-1 text-[11px] text-outline font-mono">
                  <kbd className="px-1.5 py-0.5 rounded border border-outline-variant bg-surface-container text-[9px]">ESC</kbd>
                  close
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
