import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Briefcase, TrendingUp, Wifi, ArrowLeft } from 'lucide-react'
import {
  GlassCard, MonoLabel, Badge, StatCard, Button
} from '@/components/ui'
import { SalaryDistributionChart, SalaryTrendChart, CityComparisonChart } from '@/components/charts'
import { SALARY_TREND_DATA } from '@/data/mockData'
import { formatLPA, cn } from '@/utils'
import { useCities, useRole, useRoles } from '@/hooks'

// Baseline city salary (LPA) used to normalize cross-city role estimates.
const CITY_BASELINE_SALARY = 22
// Conservative city adjustment multiplier to avoid over-estimating city-transformed salaries.
const ROLE_CITY_SALARY_MULTIPLIER = 0.9

export function RolesPage() {
  const navigate = useNavigate()
  const { data: roles = [] } = useRoles()
  const [category, setCategory] = useState('All')

  const categories = ['All', ...Array.from(new Set(roles.map(r => r.category)))]

  const filtered = roles.filter(r => category === 'All' || r.category === category)
    .sort((a, b) => b.avg_salary_lpa - a.avg_salary_lpa)

  return (
    <div className="min-h-screen pt-24 pb-16 max-w-[1440px] mx-auto px-6 md:px-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Briefcase size={20} className="text-tertiary" />
          <MonoLabel color="tertiary">ROLE INTELLIGENCE</MonoLabel>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Salary data for {roles.length} tech roles
        </h1>
        <p className="text-on-surface-variant text-body-lg">
          Percentile breakdowns, YoY growth, and remote premium analysis
        </p>
      </div>

      {/* Category filters */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              'px-3 py-1.5 rounded-full font-mono text-label-md whitespace-nowrap transition-colors border',
              category === cat
                ? 'bg-tertiary/10 text-tertiary border-tertiary/20'
                : 'text-on-surface-variant border-outline-variant/40 hover:border-primary/30 hover:text-primary'
            )}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((role, i) => (
          <motion.div
            key={role.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <GlassCard
              className="p-5 cursor-pointer hover:border-tertiary/20"
              hover
              accent="tertiary"
              onClick={() => navigate(`/roles/${role.slug}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-on-surface text-lg">{role.title}</h3>
                  <div className="font-mono text-label-md text-on-surface-variant">{role.category}</div>
                </div>
                <Badge variant="tertiary" size="sm" dot>+{role.yoy_growth_pct}% YoY</Badge>
              </div>

              {/* Percentile bar */}
              <div className="mb-4">
                <div className="flex justify-between font-mono text-[10px] text-on-surface-variant mb-2">
                  <span>P25: {formatLPA(role.p25_salary_lpa)}</span>
                  <span>Median: {formatLPA(role.median_salary_lpa)}</span>
                  <span>P75: {formatLPA(role.p75_salary_lpa)}</span>
                </div>
                <div className="relative h-2 bg-surface-container-high rounded-full overflow-hidden">
                  {/* P25-P75 range */}
                  <div
                    className="absolute h-full bg-primary/40 rounded-full"
                    style={{
                      left: `${((role.p25_salary_lpa - 5) / 80) * 100}%`,
                      width: `${((role.p75_salary_lpa - role.p25_salary_lpa) / 80) * 100}%`,
                    }}
                  />
                  {/* Median marker */}
                  <div
                    className="absolute h-full w-0.5 bg-primary"
                    style={{ left: `${((role.median_salary_lpa - 5) / 80) * 100}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 bg-surface-container/50 rounded-lg text-center">
                  <div className="font-bold text-primary text-sm">{formatLPA(role.avg_salary_lpa)}</div>
                  <div className="font-mono text-[8px] text-on-surface-variant">AVG</div>
                </div>
                <div className="p-2 bg-surface-container/50 rounded-lg text-center">
                  <div className="font-bold text-secondary text-sm">+{role.remote_premium_pct}%</div>
                  <div className="font-mono text-[8px] text-on-surface-variant">REMOTE+</div>
                </div>
                <div className="p-2 bg-surface-container/50 rounded-lg text-center">
                  <div className="font-bold text-on-surface text-sm">{role.total_entries.toLocaleString()}</div>
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

// ============================================================
// Role Detail Page
// ============================================================
export function RolePage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { data: role } = useRole(slug ?? '')
  const { data: cities = [] } = useCities()

  if (!role) {
    return (
      <div className="pt-24 px-8 text-center">
        <div className="text-on-surface-variant">Role not found</div>
        <Button variant="ghost" onClick={() => navigate('/roles')} className="mt-4">
          Browse all roles
        </Button>
      </div>
    )
  }

  const cityData = cities.slice(0, 6).map(c => {
    const citySalary = Math.max(c.avg_salary_lpa, 1)
    return {
      id: c.id,
      name: c.name,
      value: Math.round(
        role.avg_salary_lpa * (citySalary / CITY_BASELINE_SALARY) * ROLE_CITY_SALARY_MULTIPLIER
      ),
    }
  }).sort((a, b) => b.value - a.value)

  return (
    <div className="min-h-screen pt-24 pb-16 max-w-[1440px] mx-auto px-6 md:px-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-8 font-mono text-label-md"
      >
        <ArrowLeft size={16} />
        BACK
      </button>

      {/* Role Header */}
      <div className="glass-card p-6 md:p-8 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-tertiary/5 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold tracking-tight">{role.title}</h1>
              <Badge variant="tertiary" dot>+{role.yoy_growth_pct}% YoY</Badge>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-on-surface-variant font-mono text-label-md">
              <span>{role.category}</span>
              <span>{role.total_entries.toLocaleString()} data points</span>
              <span className="flex items-center gap-1.5 text-secondary">
                <Wifi size={12} />
                +{role.remote_premium_pct}% remote premium
              </span>
            </div>
          </div>
          <div className="flex gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-tertiary tracking-tight">
                {formatLPA(role.avg_salary_lpa)}
              </div>
              <div className="font-mono text-label-md text-on-surface-variant">AVG SALARY</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Salary Distribution */}
        <div className="md:col-span-8">
          <GlassCard className="p-6">
            <MonoLabel className="mb-6 block">SALARY DISTRIBUTION (INDIA)</MonoLabel>
            <SalaryDistributionChart
              p10={role.p25_salary_lpa * 0.75}
              p25={role.p25_salary_lpa}
              p50={role.median_salary_lpa}
              p75={role.p75_salary_lpa}
              p90={role.p75_salary_lpa * 1.3}
              height={200}
            />
            <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-5 gap-2 text-center">
              {[
                ['P10', formatLPA(role.p25_salary_lpa * 0.75)],
                ['P25', formatLPA(role.p25_salary_lpa)],
                ['Median', formatLPA(role.median_salary_lpa)],
                ['P75', formatLPA(role.p75_salary_lpa)],
                ['P90', formatLPA(role.p75_salary_lpa * 1.3)],
              ].map(([label, val]) => (
                <div key={label}>
                  <div className="font-mono text-label-md text-on-surface">{val}</div>
                  <div className="font-mono text-[9px] text-on-surface-variant mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Key Stats */}
        <div className="md:col-span-4 space-y-4">
          <StatCard
            label="YOY GROWTH"
            value={`+${role.yoy_growth_pct}%`}
            subtext="FY2024"
            accentColor="#d1d0ff"
            icon={<TrendingUp size={16} />}
          />
          <StatCard
            label="REMOTE PREMIUM"
            value={`+${role.remote_premium_pct}%`}
            subtext="over onsite"
            accentColor="#9ad2c3"
            icon={<Wifi size={16} />}
          />
          <StatCard
            label="DATA POINTS"
            value={role.total_entries.toLocaleString()}
            subtext="verified entries"
            accentColor="#cbd2ff"
          />
        </div>

        {/* Salary Trend */}
        <div className="md:col-span-6">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <MonoLabel>SALARY TREND</MonoLabel>
              <Badge variant="tertiary" dot size="sm">+{role.yoy_growth_pct}% CAGR</Badge>
            </div>
            <SalaryTrendChart
              data={SALARY_TREND_DATA.map(d => ({
                period: d.period,
                value: Math.round(d.value * (role.avg_salary_lpa / 24))
              }))}
              height={180}
              color="#d1d0ff"
            />
          </GlassCard>
        </div>

        {/* City comparison */}
        <div className="md:col-span-6">
          <GlassCard className="p-6">
            <MonoLabel className="mb-4 block">SALARY BY CITY</MonoLabel>
            <CityComparisonChart
              cities={cityData}
              maxValue={Math.max(...cityData.map(c => c.value)) * 1.15}
              height={220}
            />
          </GlassCard>
        </div>

        {/* Experience vs Salary */}
        <div className="md:col-span-12">
          <GlassCard className="p-6">
            <MonoLabel className="mb-4 block">EXPERIENCE vs SALARY</MonoLabel>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { exp: '0-1 yr', pct: 0.45 },
                { exp: '1-3 yr', pct: 0.65 },
                { exp: '3-5 yr', pct: 0.88 },
                { exp: '5-8 yr', pct: 1.1 },
                { exp: '8+ yr', pct: 1.45 },
              ].map(item => (
                <div key={item.exp} className="p-4 bg-surface-container/50 rounded-xl text-center">
                  <div className="font-mono text-label-md text-on-surface-variant mb-2">{item.exp}</div>
                  <div className="text-xl font-bold text-tertiary">
                    {formatLPA(Math.round(role.avg_salary_lpa * item.pct * 10) / 10)}
                  </div>
                  <div className="font-mono text-[9px] text-on-surface-variant mt-1">avg</div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
