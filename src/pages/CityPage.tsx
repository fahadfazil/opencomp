import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, MapPin, Train, Coffee,
  Building2, ShieldCheck, Footprints
} from 'lucide-react'
import {
  GlassCard, MonoLabel, Badge, StatCard, Button
} from '@/components/ui'
import { SalaryTrendChart, CityComparisonChart } from '@/components/charts'
import { formatLPA, formatMonthlyRent } from '@/utils'
import { cn } from '@/utils'
import { useCities, useCity, useCityPageContent, useCompanies, useOfficeAreas } from '@/hooks'
import type { CityPageContent } from '@/types'

const AREA_METRIC_ICONS: Record<string, React.ElementType> = {
  commute: Train,
  food: Coffee,
  safety: ShieldCheck,
  walkability: Footprints,
}

const EMPTY_CITY_PAGE_CONTENT: CityPageContent = {
  stat_trend: 0,
  salary_trend_badge: '0% YOY',
  salary_trend: [],
  affordability_summary: {
    avg_1bhk: '₹0/mo',
    avg_2bhk: '₹0/mo',
    rent_salary_pct: '0%',
  },
  livability_scores: [],
}

export function CityPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { data: city } = useCity(slug ?? '')
  const { data: cities = [] } = useCities()
  const { data: companies = [] } = useCompanies()
  const { data: officeAreas = [] } = useOfficeAreas()
  const { data: pageContent } = useCityPageContent()

  const content = pageContent ?? EMPTY_CITY_PAGE_CONTENT

  if (!city) {
    return (
      <div className="pt-24 px-8 text-center">
        <div className="text-on-surface-variant">City not found</div>
        <Button variant="ghost" onClick={() => navigate('/cities')} className="mt-4">
          Browse all cities
        </Button>
      </div>
    )
  }

  const cityAreas = officeAreas.filter(a => a.city_id === city.id)
  const topCompanies = companies.filter(c => c.headquarters === city.name)
  const citySalaryRanking = [...cities]
    .sort((a, b) => b.avg_salary_lpa - a.avg_salary_lpa)
  const cityRank = citySalaryRanking.findIndex(c => c.id === city.id) + 1
  const livabilityScores = cityAreas.length > 0
    ? [
        {
          label: 'Air Quality Index',
          value: Math.round(cityAreas.reduce((sum, area) => sum + area.avg_aqi, 0) / cityAreas.length),
          max: 200,
          unit: 'AQI',
          invert: true,
        },
        {
          label: 'Walkability',
          value: Math.round(cityAreas.reduce((sum, area) => sum + area.walkability_score, 0) / cityAreas.length),
          max: 100,
          unit: '/100',
        },
        {
          label: 'Food & Dining',
          value: Math.round(cityAreas.reduce((sum, area) => sum + area.food_score, 0) / cityAreas.length),
          max: 100,
          unit: '/100',
        },
        {
          label: 'Safety Score',
          value: Math.round(cityAreas.reduce((sum, area) => sum + area.safety_score, 0) / cityAreas.length),
          max: 100,
          unit: '/100',
        },
      ]
    : content.livability_scores

  const comparisonData = cities.slice(0, 6).map(c => ({
    id: c.id,
    name: c.name,
    value: c.avg_salary_lpa,
  })).sort((a, b) => b.value - a.value)

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(154,210,195,0.14)_0%,rgba(17,20,23,0)_42%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(203,210,255,0.14)_0%,rgba(17,20,23,0)_36%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_75%,rgba(176,178,255,0.1)_0%,rgba(17,20,23,0)_38%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(15,17,19,0.82)_70%,#111417_100%)]" />
        <div className="absolute inset-0 bg-noise opacity-40" />
      </div>

      <div className="relative z-10 pt-24 pb-16 max-w-[1440px] mx-auto px-6 md:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-8 font-mono text-label-md"
        >
          <ArrowLeft size={16} />
          BACK
        </button>

      {/* City Header */}
      <div className="glass-card p-6 md:p-8 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold tracking-tight">{city.name}</h1>
              {city.tech_hub_rank && (
                <Badge variant="secondary" dot>#{city.tech_hub_rank} TECH HUB</Badge>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-on-surface-variant font-mono text-label-md">
              <span className="flex items-center gap-1.5">
                <MapPin size={12} />
                {city.state}
              </span>
              {city.metro_available && (
                <span className="flex items-center gap-1.5 text-secondary">
                  <Train size={12} />
                  METRO CONNECTED
                </span>
              )}
              <span>{city.total_entries.toLocaleString('en-IN')} data points</span>
            </div>
          </div>
          <div className="flex gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-secondary tracking-tight">
                {formatLPA(city.avg_salary_lpa)}
              </div>
              <div className="font-mono text-label-md text-on-surface-variant">AVG SALARY</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary tracking-tight">
                #{cityRank}
              </div>
              <div className="font-mono text-label-md text-on-surface-variant">SALARY RANK</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="AVG SALARY"
          value={formatLPA(city.avg_salary_lpa)}
          trend={content.stat_trend}
          accentColor="#9ad2c3"
        />
        <StatCard
          label="COST OF LIVING"
          value={`${city.cost_of_living_index}/100`}
          subtext="vs Mumbai 100"
          accentColor="#cbd2ff"
        />
        <StatCard
          label="DATA POINTS"
          value={city.total_entries.toLocaleString('en-IN')}
          accentColor="#d1d0ff"
        />
        <StatCard
          label="SALARY RANK"
          value={`#${cityRank} in India`}
          accentColor="#b0b2ff"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* Salary Trend */}
        <div className="md:col-span-8 flex flex-col">
          <GlassCard className="p-6 flex-1">
            <div className="flex items-center justify-between mb-6">
              <MonoLabel>SALARY TREND — {city.name.toUpperCase()}</MonoLabel>
              <Badge variant="secondary" dot size="sm">{content.salary_trend_badge}</Badge>
            </div>
            <SalaryTrendChart data={content.salary_trend} height={180} />
          </GlassCard>
        </div>

        {/* Affordability */}
        <div className="md:col-span-4 flex flex-col">
          <GlassCard className="p-6 h-full">
            <MonoLabel className="mb-4 block">AFFORDABILITY</MonoLabel>
            {cityAreas.length > 0 ? (
              <div className="space-y-4">
                {cityAreas.map(area => (
                  <div key={area.id} className="p-3 bg-surface-container/60 rounded-lg">
                    <div className="font-medium text-on-surface mb-2">{area.name}</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="font-mono text-[10px] text-on-surface-variant">1 BHK</div>
                        <div className="font-mono text-body-md text-primary">
                          {formatMonthlyRent(area.avg_rent_1bhk)}
                        </div>
                      </div>
                      <div>
                        <div className="font-mono text-[10px] text-on-surface-variant">2 BHK</div>
                        <div className="font-mono text-body-md text-secondary">
                          {formatMonthlyRent(area.avg_rent_2bhk)}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="font-mono text-[10px] text-on-surface-variant mb-1">
                        RENT-TO-SALARY RATIO
                      </div>
                      <div className="h-1 bg-surface-container-high rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-secondary to-primary"
                          style={{
                            width: `${Math.min(100, (area.avg_rent_2bhk * 12 / (city.avg_salary_lpa * 100000)) * 100)}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-surface-container/60 rounded-lg">
                  <div className="font-mono text-[10px] text-on-surface-variant mb-1">AVG 1 BHK RENT</div>
                  <div className="font-mono text-xl text-primary">{content.affordability_summary.avg_1bhk}</div>
                </div>
                <div className="p-3 bg-surface-container/60 rounded-lg">
                  <div className="font-mono text-[10px] text-on-surface-variant mb-1">AVG 2 BHK RENT</div>
                  <div className="font-mono text-xl text-secondary">{content.affordability_summary.avg_2bhk}</div>
                </div>
                <div className="p-3 bg-surface-container/60 rounded-lg">
                  <div className="font-mono text-[10px] text-on-surface-variant mb-1">RENT/SALARY %</div>
                  <div className="font-mono text-xl text-tertiary">{content.affordability_summary.rent_salary_pct}</div>
                </div>
              </div>
            )}
          </GlassCard>
        </div>

        {/* City Comparison */}
        <div className={cn('flex flex-col', cityAreas.length > 0 ? 'md:col-span-6' : 'md:col-span-12')}>
          <GlassCard className="p-6 flex-1">
            <MonoLabel className="mb-4 block">CITY SALARY COMPARISON</MonoLabel>
            <CityComparisonChart
              cities={comparisonData}
              maxValue={Math.max(...comparisonData.map(c => c.value)) * 1.1}
              height={220}
            />
          </GlassCard>
        </div>

        {/* Area Intelligence */}
        {cityAreas.length > 0 && (
          <div className="md:col-span-6 flex flex-col">
            <GlassCard className="p-6 flex-1">
              <MonoLabel className="mb-4 block">AREA INTELLIGENCE</MonoLabel>
              <div className="space-y-4">
                {cityAreas.map(area => (
                  <div key={area.id} className="p-4 bg-surface-container/50 rounded-xl border border-white/5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-on-surface">{area.name}</span>
                      <div className="flex items-center gap-1">
                        <Building2 size={12} className="text-primary" />
                        <span className="font-mono text-label-md text-primary">
                          {area.office_density}% DENSITY
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { key: 'commute', label: 'Commute', value: area.commute_score },
                        { key: 'food', label: 'Food', value: area.food_score },
                        { key: 'safety', label: 'Safety', value: area.safety_score },
                        { key: 'walkability', label: 'Walk', value: area.walkability_score },
                      ].map(metric => {
                        const Icon = AREA_METRIC_ICONS[metric.key]
                        return (
                          <div key={metric.key} className="flex items-center gap-2">
                            <Icon size={13} className="text-on-surface-variant shrink-0" />
                            <div className="flex-1">
                              <div className="flex justify-between mb-1">
                                <span className="font-mono text-[9px] text-on-surface-variant">
                                  {metric.label.toUpperCase()}
                                </span>
                                <span className="font-mono text-[9px] text-on-surface">
                                  {metric.value}
                                </span>
                              </div>
                              <div className="h-1 bg-surface-container-high rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full rounded-full bg-gradient-to-r from-primary/70 to-secondary"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${metric.value}%` }}
                                  transition={{ duration: 0.8, ease: 'easeOut' }}
                                />
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    {area.metro_distance_km !== null && (
                      <div className="mt-3 flex items-center gap-2 text-on-surface-variant font-mono text-label-md">
                        <Train size={12} className="text-secondary" />
                        {area.metro_distance_km}km to nearest metro
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}

        {/* Top Employers */}
        {topCompanies.length > 0 && (
          <div className={cn('flex flex-col', livabilityScores.length > 0 ? 'md:col-span-6' : 'md:col-span-12')}>
            <GlassCard className="p-6 flex-1">
              <MonoLabel className="mb-4 block">TOP EMPLOYERS IN {city.name.toUpperCase()}</MonoLabel>
              <div className="space-y-3">
                {topCompanies.slice(0, 6).map((company, i) => (
                  <div
                    key={company.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
                    onClick={() => navigate(`/companies/${company.slug}`)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-label-md text-on-surface-variant w-4">{i + 1}</span>
                      <div>
                        <div className="text-body-md text-on-surface font-medium">{company.name}</div>
                        <div className="font-mono text-label-md text-on-surface-variant">{company.industry}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-body-md text-on-surface">
                        {formatLPA(company.avg_salary_lpa)}
                      </div>
                      <div className="font-mono text-[9px] text-secondary">
                        Score: {company.opencomp_score}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}

        {/* Air Quality & Livability */}
        {livabilityScores.length > 0 && (
          <div className={cn('flex flex-col', topCompanies.length > 0 ? 'md:col-span-6' : 'md:col-span-12')}>
            <GlassCard className="p-6 flex-1">
              <MonoLabel className="mb-4 block">LIVABILITY SCORES</MonoLabel>
              <div className="space-y-4">
                {livabilityScores.map(item => {
                  const displayVal = item.invert
                    ? Math.max(0, 100 - (item.value / item.max) * 100)
                    : (item.value / item.max) * 100

                  return (
                    <div key={item.label}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-body-md text-on-surface-variant">{item.label}</span>
                        <span className="font-mono text-label-md text-on-surface">
                          {item.value}{item.unit}
                        </span>
                      </div>
                      <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                        <motion.div
                          className={cn(
                            'h-full rounded-full',
                            displayVal > 70 ? 'bg-secondary' : displayVal > 40 ? 'bg-primary' : 'bg-error'
                          )}
                          initial={{ width: 0 }}
                          animate={{ width: `${displayVal}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
    </div>
  )
}
