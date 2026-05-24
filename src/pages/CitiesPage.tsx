import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Train } from 'lucide-react'
import { GlassCard, MonoLabel, Badge } from '@/components/ui'
import { IndiaMap } from '@/components/map/IndiaMap'
import { formatLPA, formatNumber, cn } from '@/utils'
import type { City } from '@/types'
import { useCities } from '@/hooks'

export function CitiesPage() {
  const navigate = useNavigate()
  const { data: cities = [] } = useCities()
  const [sortBy, setSortBy] = useState<'salary' | 'entries' | 'rank'>('salary')

  const sorted = [...cities].sort((a, b) => {
    if (sortBy === 'salary') return b.avg_salary_lpa - a.avg_salary_lpa
    if (sortBy === 'entries') return b.total_entries - a.total_entries
    return (a.tech_hub_rank || 99) - (b.tech_hub_rank || 99)
  })

  return (
    <div className="min-h-screen pt-24 pb-16 max-w-[1440px] mx-auto px-6 md:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <MapPin size={20} className="text-secondary" />
          <MonoLabel color="secondary">CITY INTELLIGENCE</MonoLabel>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          India Salary Heatmap
        </h1>
        <p className="text-on-surface-variant text-body-lg">
          Interactive geographic salary intelligence across {cities.length} cities
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 relative z-10">
        {/* Map */}
        <div className="lg:col-span-7">
          <GlassCard className="p-2 h-[480px]">
            <IndiaMap
              onCityClick={(city) => navigate(`/cities/${city.slug}`)}
            />
          </GlassCard>
        </div>

        <div className="lg:col-span-5 relative z-10">
          <GlassCard className="p-4 h-[480px] flex flex-col">
            <MonoLabel className="mb-3 block" color="secondary">TOP SALARY CITIES</MonoLabel>
            <div className="flex-1 space-y-2 overflow-y-auto pr-1">
              {[...cities].sort((a, b) => b.avg_salary_lpa - a.avg_salary_lpa).slice(0, 4).map((city, i) => (
                <button
                  key={city.id}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-surface-container transition-colors text-left"
                  onClick={() => navigate(`/cities/${city.slug}`)}
                >
                  <span className="font-mono text-label-md text-on-surface-variant w-4">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-body-md text-on-surface font-medium truncate">{city.name}</div>
                  </div>
                  <div className="font-mono text-label-md text-secondary shrink-0">{formatLPA(city.avg_salary_lpa)}</div>
                  {city.metro_available && <Train size={11} className="text-on-surface-variant shrink-0" />}
                </button>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Sort controls */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <MonoLabel color="muted">SORT BY:</MonoLabel>
        {(['salary', 'entries', 'rank'] as const).map(s => (
          <button
            key={s}
            onClick={() => setSortBy(s)}
            className={cn(
              'px-3 py-1.5 rounded-lg font-mono text-label-md transition-colors',
              sortBy === s
                ? 'bg-primary/15 text-primary'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
            )}
          >
            {s === 'salary' ? 'AVG SALARY' : s === 'entries' ? 'DATA POINTS' : 'TECH RANK'}
          </button>
        ))}
      </div>

      {/* Cities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map((city, i) => (
          <motion.div
            key={city.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <GlassCard
              className="p-5 cursor-pointer hover:border-secondary/20 transition-all duration-200"
              hover
              accent="secondary"
              onClick={() => navigate(`/cities/${city.slug}`)}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="min-w-0">
                  <h3 className="font-bold text-on-surface text-lg break-words">{city.name}</h3>
                  <div className="font-mono text-label-md text-on-surface-variant">{city.state}</div>
                </div>
                <div className="flex flex-col gap-1.5 items-end">
                  {city.tech_hub_rank && (
                    <Badge variant="secondary" size="sm">#{city.tech_hub_rank}</Badge>
                  )}
                  {city.metro_available && (
                    <div className="flex items-center gap-1 font-mono text-[9px] text-on-surface-variant">
                      <Train size={10} />
                      METRO
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center p-2 bg-surface-container/50 rounded-lg">
                  <div className="text-lg font-bold text-secondary">{formatLPA(city.avg_salary_lpa)}</div>
                  <div className="font-mono text-[8px] text-on-surface-variant">AVG SALARY</div>
                </div>
                <div className="text-center p-2 bg-surface-container/50 rounded-lg">
                  <div className="text-lg font-bold text-primary">{city.cost_of_living_index}</div>
                  <div className="font-mono text-[8px] text-on-surface-variant">COST IDX</div>
                </div>
                <div className="text-center p-2 bg-surface-container/50 rounded-lg">
                  <div className="text-lg font-bold text-on-surface">{formatNumber(city.total_entries)}</div>
                  <div className="font-mono text-[8px] text-on-surface-variant">DATA PTS</div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
