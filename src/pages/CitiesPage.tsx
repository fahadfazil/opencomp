import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, TrendingUp, Train } from 'lucide-react'
import { GlassCard, MonoLabel, Badge, StatCard, Button } from '@/components/ui'
import { IndiaMap } from '@/components/map/IndiaMap'
import { MOCK_CITIES } from '@/data/mockData'
import { formatLPA, formatNumber, cn } from '@/utils'
import type { City } from '@/types'

export function CitiesPage() {
  const navigate = useNavigate()
  const [selectedCity, setSelectedCity] = useState<City | null>(null)
  const [sortBy, setSortBy] = useState<'salary' | 'entries' | 'rank'>('salary')

  const sorted = [...MOCK_CITIES].sort((a, b) => {
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
          Interactive geographic salary intelligence across {MOCK_CITIES.length} cities
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Map */}
        <div className="lg:col-span-7">
          <GlassCard className="p-2 h-[480px]">
            <IndiaMap
              onCityClick={(city) => {
                setSelectedCity(city)
                navigate(`/cities/${city.slug}`)
              }}
              highlightCityId={selectedCity?.id}
            />
          </GlassCard>
        </div>

        {/* City Detail Panel */}
        <div className="lg:col-span-5 space-y-4">
          {selectedCity ? (
            <>
              <GlassCard className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold">{selectedCity.name}</h2>
                    <div className="font-mono text-label-md text-on-surface-variant">{selectedCity.state}</div>
                  </div>
                  {selectedCity.tech_hub_rank && (
                    <Badge variant="secondary" dot>#{selectedCity.tech_hub_rank} TECH HUB</Badge>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 bg-surface-container/60 rounded-lg">
                    <div className="font-mono text-[9px] text-on-surface-variant mb-1">AVG SALARY</div>
                    <div className="text-2xl font-bold text-secondary">{formatLPA(selectedCity.avg_salary_lpa)}</div>
                  </div>
                  <div className="p-3 bg-surface-container/60 rounded-lg">
                    <div className="font-mono text-[9px] text-on-surface-variant mb-1">DATA POINTS</div>
                    <div className="text-2xl font-bold text-primary">{formatNumber(selectedCity.total_entries)}</div>
                  </div>
                  <div className="p-3 bg-surface-container/60 rounded-lg">
                    <div className="font-mono text-[9px] text-on-surface-variant mb-1">COST INDEX</div>
                    <div className="text-xl font-bold text-on-surface">{selectedCity.cost_of_living_index}/100</div>
                  </div>
                  <div className="p-3 bg-surface-container/60 rounded-lg">
                    <div className="font-mono text-[9px] text-on-surface-variant mb-1">METRO</div>
                    <div className={cn('text-xl font-bold', selectedCity.metro_available ? 'text-secondary' : 'text-on-surface-variant')}>
                      {selectedCity.metro_available ? 'YES' : 'NO'}
                    </div>
                  </div>
                </div>
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => navigate(`/cities/${selectedCity.slug}`)}
                >
                  View Full City Dashboard
                </Button>
              </GlassCard>
            </>
          ) : (
            <GlassCard className="p-5 h-full flex items-center justify-center text-center">
              <div>
                <MapPin size={32} className="text-outline mx-auto mb-3" />
                <div className="text-on-surface-variant text-body-md">
                  Click on a city marker<br />to see salary intelligence
                </div>
              </div>
            </GlassCard>
          )}

          {/* Top cities quick stats */}
          <GlassCard className="p-4">
            <MonoLabel className="mb-3 block" color="secondary">TOP SALARY CITIES</MonoLabel>
            <div className="space-y-2">
              {MOCK_CITIES.sort((a, b) => b.avg_salary_lpa - a.avg_salary_lpa).slice(0, 4).map((city, i) => (
                <button
                  key={city.id}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-surface-container transition-colors text-left"
                  onClick={() => navigate(`/cities/${city.slug}`)}
                >
                  <span className="font-mono text-label-md text-on-surface-variant w-4">{i + 1}</span>
                  <div className="flex-1">
                    <div className="text-body-md text-on-surface font-medium">{city.name}</div>
                  </div>
                  <div className="font-mono text-label-md text-secondary">{formatLPA(city.avg_salary_lpa)}</div>
                  {city.metro_available && <Train size={11} className="text-on-surface-variant" />}
                </button>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Sort controls */}
      <div className="flex items-center gap-3 mb-4">
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
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-on-surface text-lg">{city.name}</h3>
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
