import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Building2 } from 'lucide-react'
import { GlassCard, MonoLabel, Badge, ScoreGauge, Button } from '@/components/ui'
import { formatLPA, formatNumber, cn } from '@/utils'
import { useCompanies } from '@/hooks'

const INDUSTRIES = ['All', 'Fintech', 'E-Commerce', 'Food-Tech', 'Quick Commerce', 'Social Commerce']

export function CompaniesPage() {
  const navigate = useNavigate()
  const { data: companies = [] } = useCompanies()
  const [search, setSearch] = useState('')
  const [industry, setIndustry] = useState('All')
  const [sortBy, setSortBy] = useState<'score' | 'salary' | 'reviews'>('score')

  const filtered = companies
    .filter(c => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false
      if (industry !== 'All' && c.industry !== industry) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'score') return b.opencomp_score - a.opencomp_score
      if (sortBy === 'salary') return b.avg_salary_lpa - a.avg_salary_lpa
      return b.total_reviews - a.total_reviews
    })

  return (
    <div className="min-h-screen pt-24 pb-16 max-w-[1440px] mx-auto px-6 md:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Building2 size={20} className="text-primary" />
          <MonoLabel>COMPANY INTELLIGENCE</MonoLabel>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          {companies.length} companies tracked
        </h1>
        <p className="text-on-surface-variant text-body-lg">
          Anonymous salary & culture data from verified contributors
        </p>
      </div>

      {/* Filters */}
      <GlassCard className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-2 flex-1 px-3 py-2 bg-background/60 rounded-lg border border-outline-variant/50 focus-within:border-primary/40 transition-colors">
            <Search size={15} className="text-outline" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search companies..."
              className="bg-transparent text-on-surface placeholder:text-outline outline-none flex-1 text-body-md"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {['score', 'salary', 'reviews'].map(sort => (
              <button
                key={sort}
                onClick={() => setSortBy(sort as 'score' | 'salary' | 'reviews')}
                className={cn(
                  'px-3 py-1.5 rounded-lg font-mono text-label-md whitespace-nowrap transition-colors',
                  sortBy === sort
                    ? 'bg-primary/15 text-primary'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                )}
              >
                {sort === 'score' ? 'OPENCOMP SCORE' : sort === 'salary' ? 'AVG SALARY' : 'REVIEWS'}
              </button>
            ))}
          </div>
        </div>

        {/* Industry filter */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
          {INDUSTRIES.map(ind => (
            <button
              key={ind}
              onClick={() => setIndustry(ind)}
              className={cn(
                'px-3 py-1 rounded-full font-mono text-label-md whitespace-nowrap transition-colors border',
                industry === ind
                  ? 'bg-secondary/10 text-secondary border-secondary/20'
                  : 'text-on-surface-variant border-outline-variant/40 hover:border-primary/30 hover:text-primary'
              )}
            >
              {ind.toUpperCase()}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Company Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((company, i) => (
          <motion.div
            key={company.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <GlassCard
              className="p-5 cursor-pointer hover:border-primary/20 transition-all duration-200"
              hover
              accent="primary"
              onClick={() => navigate(`/companies/${company.slug}`)}
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-surface-container-high border border-white/10 flex items-center justify-center font-bold text-primary text-base shrink-0">
                  {company.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-on-surface truncate">{company.name}</div>
                  <div className="font-mono text-label-md text-on-surface-variant">
                    {company.industry} · {company.company_type.replace('_', ' ')}
                  </div>
                </div>
                <ScoreGauge score={company.opencomp_score} size="sm" />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-2.5 bg-surface-container/60 rounded-lg">
                  <div className="font-mono text-[9px] text-on-surface-variant mb-1">AVG SALARY</div>
                  <div className="font-bold text-primary">{formatLPA(company.avg_salary_lpa)}</div>
                </div>
                <div className="p-2.5 bg-surface-container/60 rounded-lg">
                  <div className="font-mono text-[9px] text-on-surface-variant mb-1">REVIEWS</div>
                  <div className="font-bold text-on-surface">{formatNumber(company.total_reviews)}</div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  {company.opencomp_score >= 85 && <Badge variant="secondary" size="sm" dot>TOP COMP</Badge>}
                  {company.company_type === 'startup' && <Badge variant="primary" size="sm">STARTUP</Badge>}
                </div>
                <span className="font-mono text-label-md text-on-surface-variant">
                  {company.headquarters}
                </span>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-on-surface-variant">
          <Building2 size={40} className="mx-auto mb-4 opacity-30" />
          <p>No companies match your filters</p>
          <Button variant="ghost" onClick={() => { setSearch(''); setIndustry('All') }} className="mt-3">
            Clear filters
          </Button>
        </div>
      )}
    </div>
  )
}
