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
import { formatLPA, formatNumber } from '@/utils'
import { useCompany, useCompanyPageContent } from '@/hooks'
import type { CompanyPageContent } from '@/types'

const PERK_ICONS = {
  shield: Shield,
  globe: Globe,
  award: Award,
  coffee: Coffee,
  clock: Clock,
} as const

function getPerkIcon(iconKey: string) {
  if (iconKey in PERK_ICONS) {
    return PERK_ICONS[iconKey as keyof typeof PERK_ICONS]
  }

  return Award
}

const EMPTY_COMPANY_PAGE_CONTENT: CompanyPageContent = {
  avg_salary_trend: 0,
  salary_trend_badge: '0% CAGR',
  industry_avg_score: 0,
  culture_rating: 0,
  culture_rating_trend: 0,
  salary_distribution_multipliers: {
    p10: 0.55,
    p25: 0.75,
    p50: 0.95,
    p75: 1.25,
    p90: 1.55,
  },
  culture_radar: [],
  culture_ratings: [],
  salary_trend: [],
  department_breakdown: [],
  perks: [],
  anonymous_reviews: [],
}

export function CompanyPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { data: company } = useCompany(slug ?? '')
  const { data: pageContent } = useCompanyPageContent()

  const content = pageContent ?? EMPTY_COMPANY_PAGE_CONTENT

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

  const salaryDistributionMultipliers = content.salary_distribution_multipliers
  const departmentMaxSalary = content.department_breakdown.length > 0
    ? Math.max(...content.department_breakdown.map((department) => department.avg))
    : 0
  const companyPercentiles = {
    p10: company.avg_salary_lpa * salaryDistributionMultipliers.p10,
    p25: company.avg_salary_lpa * salaryDistributionMultipliers.p25,
    p50: company.avg_salary_lpa * salaryDistributionMultipliers.p50,
    p75: company.avg_salary_lpa * salaryDistributionMultipliers.p75,
    p90: company.avg_salary_lpa * salaryDistributionMultipliers.p90,
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
          trend={content.avg_salary_trend}
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
          subtext={`industry avg: ${content.industry_avg_score}`}
          accentColor="#d1d0ff"
        />
        <StatCard
          label="CULTURE RATING"
          value={`${content.culture_rating.toFixed(1)} / 5.0`}
          trend={content.culture_rating_trend}
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
            <CultureRadar data={content.culture_radar} height={220} />
            <Divider className="my-4" />
            <div className="space-y-3">
              {content.culture_ratings.map(item => (
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
              <Badge variant="secondary" dot size="sm">{content.salary_trend_badge}</Badge>
            </div>
            <SalaryTrendChart data={content.salary_trend} height={180} />
          </GlassCard>
        </div>

        {/* Department Breakdown */}
        <div className="md:col-span-4">
          <GlassCard className="p-6 h-full">
            <MonoLabel className="mb-4 block">BY DEPARTMENT</MonoLabel>
            {departmentMaxSalary > 0 ? (
              <div className="space-y-3">
                {content.department_breakdown.map(dept => {
                  const pct = (dept.avg / departmentMaxSalary) * 100
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
            ) : (
              <div className="text-body-md text-on-surface-variant">Department analytics will appear once data is available.</div>
            )}
          </GlassCard>
        </div>

        {/* Perks */}
        <div className="md:col-span-6">
          <GlassCard className="p-6">
            <MonoLabel className="mb-4 block">PERKS & BENEFITS</MonoLabel>
            <div className="grid grid-cols-1 gap-3">
              {content.perks.map(perk => {
              const Icon = getPerkIcon(perk.icon_key)
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
              {content.anonymous_reviews.map(review => (
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
