import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Building2, Globe, Users, TrendingUp, Star, MapPin,
  ArrowLeft, Award, Shield, Clock, Coffee
} from 'lucide-react'
import {
  GlassCard, MonoLabel, Badge, StatCard, ScoreGauge,
  RatingBar, Button, Divider
} from '@/components/ui'
import { CultureRadar, SalaryDistributionChart, SalaryTrendChart } from '@/components/charts'
import { SALARY_TREND_DATA } from '@/data/mockData'
import { formatLPA, formatNumber } from '@/utils'
import { useCompany } from '@/hooks'

const CULTURE_RADAR_DATA = [
  { subject: 'WLB', value: 4.2, fullMark: 5 },
  { subject: 'Engineering', value: 4.6, fullMark: 5 },
  { subject: 'Management', value: 3.9, fullMark: 5 },
  { subject: 'Growth', value: 4.4, fullMark: 5 },
  { subject: 'Comp', value: 4.7, fullMark: 5 },
  { subject: 'Politics', value: 3.4, fullMark: 5 },
]

const DEPT_DATA = [
  { dept: 'Engineering', avg: 48.2, count: 1240, culture: 4.5 },
  { dept: 'Product', avg: 42.6, count: 380, culture: 4.3 },
  { dept: 'Data / AI', avg: 52.1, count: 220, culture: 4.6 },
  { dept: 'Design', avg: 36.4, count: 180, culture: 4.2 },
  { dept: 'Sales', avg: 28.8, count: 440, culture: 3.8 },
  { dept: 'Marketing', avg: 24.6, count: 320, culture: 3.9 },
]

const PERKS = [
  { label: 'Health Insurance', detail: 'Family covered, ₹5L sum assured', icon: Shield },
  { label: 'Work from Anywhere', detail: '30 days/year WFA policy', icon: Globe },
  { label: 'Learning Budget', detail: '₹1L/year for courses & conferences', icon: Award },
  { label: 'Meals & Snacks', detail: 'Free breakfast, lunch, dinner', icon: Coffee },
  { label: 'Flexible Hours', detail: 'Core hours 11am–4pm only', icon: Clock },
]

const ANONYMOUS_REVIEWS = [
  {
    id: '1',
    role: 'Senior Software Engineer',
    tenure: '2 years',
    pros: 'Excellent engineering culture, fast career growth, smart colleagues. The tech stack is modern and we have real autonomy.',
    cons: 'Compensation benchmarking lags behind competitors by ~20%. Equity refreshes are inconsistent.',
    rating: 4.2,
    period: '2024',
  },
  {
    id: '2',
    role: 'Product Manager',
    tenure: '1.5 years',
    pros: 'Great product ownership, very customer-focused. Cross-functional collaboration is real here.',
    cons: 'High pressure to deliver without always adequate resourcing. Work-life balance variable by team.',
    rating: 3.8,
    period: '2024',
  },
]

export function CompanyPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { data: company } = useCompany(slug ?? '')

  if (!company) {
    return (
      <div className="pt-24 px-8 text-center">
        <div className="text-on-surface-variant">Company not found</div>
        <Button variant="ghost" onClick={() => navigate('/companies')} className="mt-4">
          Browse all companies
        </Button>
      </div>
    )
  }

  const companyPercentiles = {
    p10: company.avg_salary_lpa * 0.55,
    p25: company.avg_salary_lpa * 0.75,
    p50: company.avg_salary_lpa * 0.95,
    p75: company.avg_salary_lpa * 1.25,
    p90: company.avg_salary_lpa * 1.55,
  }

  return (
    <div className="min-h-screen pt-24 pb-16 max-w-[1440px] mx-auto px-6 md:px-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-8 font-mono text-label-md"
      >
        <ArrowLeft size={16} />
        BACK
      </button>

      {/* Company Header */}
      <div className="glass-card p-6 md:p-8 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center">
          {/* Logo placeholder */}
          <div className="w-16 h-16 rounded-xl bg-surface-container-high border border-white/10 flex items-center justify-center text-2xl font-bold text-primary">
            {company.name[0]}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold tracking-tight">{company.name}</h1>
              <Badge variant="ghost" size="sm">{company.company_type.replace('_', ' ').toUpperCase()}</Badge>
              {company.opencomp_score >= 85 && (
                <Badge variant="secondary" dot size="sm">TOP EMPLOYER</Badge>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-on-surface-variant font-mono text-label-md">
              <span className="flex items-center gap-1.5">
                <Building2 size={12} />
                {company.industry}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={12} />
                {company.headquarters}
              </span>
              <span className="flex items-center gap-1.5">
                <Users size={12} />
                {company.employee_count} employees
              </span>
              {company.founded_year && (
                <span className="flex items-center gap-1.5">
                  Founded {company.founded_year}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="text-center">
              <ScoreGauge score={company.opencomp_score} size="md" label="OPENCOMP" />
            </div>
            <div className="hidden md:block text-right">
              <div className="text-3xl font-bold text-secondary">
                {formatLPA(company.avg_salary_lpa)}
              </div>
              <div className="font-mono text-label-md text-on-surface-variant">AVG COMP</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="AVG SALARY"
          value={formatLPA(company.avg_salary_lpa)}
          trend={12.4}
          accentColor="#cbd2ff"
          icon={<TrendingUp size={16} />}
        />
        <StatCard
          label="TOTAL REVIEWS"
          value={formatNumber(company.total_reviews)}
          subtext="verified"
          accentColor="#9ad2c3"
          icon={<Star size={16} />}
        />
        <StatCard
          label="OPENCOMP SCORE"
          value={`${company.opencomp_score}/100`}
          subtext="industry avg: 74"
          accentColor="#d1d0ff"
        />
        <StatCard
          label="CULTURE RATING"
          value="4.3 / 5.0"
          trend={3.2}
          accentColor="#b0b2ff"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* Salary Distribution */}
        <div className="md:col-span-7">
          <GlassCard className="p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <MonoLabel>SALARY DISTRIBUTION</MonoLabel>
              <Badge variant="ghost" size="sm">ALL ROLES</Badge>
            </div>
            <SalaryDistributionChart {...companyPercentiles} height={200} />
            <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-5 gap-2 text-center">
              {[['P10', companyPercentiles.p10], ['P25', companyPercentiles.p25],
                ['Median', companyPercentiles.p50], ['P75', companyPercentiles.p75],
                ['P90', companyPercentiles.p90]].map(([label, val]) => (
                <div key={label as string}>
                  <div className="font-mono text-label-md text-on-surface">{formatLPA(val as number)}</div>
                  <div className="font-mono text-[9px] text-on-surface-variant mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Culture Radar */}
        <div className="md:col-span-5">
          <GlassCard className="p-6 h-full">
            <MonoLabel className="mb-4 block">CULTURE INTELLIGENCE</MonoLabel>
            <CultureRadar data={CULTURE_RADAR_DATA} height={220} />
            <Divider className="my-4" />
            <div className="space-y-3">
              {[
                { label: 'Work-Life Balance', value: 4.2 },
                { label: 'Manager Friendliness', value: 3.9 },
                { label: 'Career Growth', value: 4.4 },
                { label: 'Comp & Benefits', value: 4.7 },
                { label: 'Politics / Toxicity', value: 3.4 },
              ].map(item => (
                <RatingBar key={item.label} label={item.label} value={item.value} />
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Salary Trend */}
        <div className="md:col-span-8">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <MonoLabel>SALARY TREND (8 QUARTERS)</MonoLabel>
              <Badge variant="secondary" dot size="sm">+14.2% CAGR</Badge>
            </div>
            <SalaryTrendChart data={SALARY_TREND_DATA} height={180} />
          </GlassCard>
        </div>

        {/* Department Breakdown */}
        <div className="md:col-span-4">
          <GlassCard className="p-6 h-full">
            <MonoLabel className="mb-4 block">BY DEPARTMENT</MonoLabel>
            <div className="space-y-3">
              {DEPT_DATA.map(dept => {
                const maxSalary = Math.max(...DEPT_DATA.map(d => d.avg))
                const pct = (dept.avg / maxSalary) * 100
                return (
                  <div key={dept.dept}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-body-md text-on-surface">{dept.dept}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-label-md text-on-surface">
                          {formatLPA(dept.avg)}
                        </span>
                        <span className="font-mono text-[9px] text-on-surface-variant">
                          n={dept.count}
                        </span>
                      </div>
                    </div>
                    <div className="h-1 bg-surface-container-high rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-primary/60 to-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </GlassCard>
        </div>

        {/* Perks */}
        <div className="md:col-span-6">
          <GlassCard className="p-6">
            <MonoLabel className="mb-4 block">PERKS & BENEFITS</MonoLabel>
            <div className="grid grid-cols-1 gap-3">
              {PERKS.map(perk => {
                const Icon = perk.icon
                return (
                  <div key={perk.label} className="flex items-start gap-3 p-3 rounded-lg bg-surface-container/50">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon size={15} className="text-primary" />
                    </div>
                    <div>
                      <div className="text-body-md text-on-surface font-medium">{perk.label}</div>
                      <div className="font-mono text-label-md text-on-surface-variant mt-0.5">{perk.detail}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </GlassCard>
        </div>

        {/* Anonymous Reviews */}
        <div className="md:col-span-6">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <MonoLabel>ANONYMOUS REVIEWS</MonoLabel>
              <Badge variant="ghost" size="sm">VERIFIED CONTRIBUTORS</Badge>
            </div>
            <div className="space-y-4">
              {ANONYMOUS_REVIEWS.map(review => (
                <div key={review.id} className="p-4 bg-surface-container/50 rounded-xl border border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-body-md text-on-surface font-medium">{review.role}</div>
                      <div className="font-mono text-label-md text-on-surface-variant">
                        {review.tenure} · {review.period}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={13} className="text-tertiary fill-tertiary" />
                      <span className="font-mono text-label-md text-tertiary">{review.rating}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="font-mono text-[9px] text-secondary tracking-widest">PROS · </span>
                      <span className="text-body-md text-on-surface-variant">{review.pros}</span>
                    </div>
                    <div>
                      <span className="font-mono text-[9px] text-error tracking-widest">CONS · </span>
                      <span className="text-body-md text-on-surface-variant">{review.cons}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  )
}
