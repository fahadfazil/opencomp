import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  TrendingUp, Award, Activity, GitBranch, BookOpen, Star, Users, FileText,
  ChevronRight, Zap, PlusCircle
} from 'lucide-react'
import { IndiaMap } from '@/components/map/IndiaMap'
import { SalaryTrendChart } from '@/components/charts'
import { GlassCard, MonoLabel, Badge, LiveIndicator, Button } from '@/components/ui'
import { TRENDING_INSIGHTS, SALARY_TREND_DATA } from '@/data/mockData'
import { formatNumber } from '@/utils'
import { useUIStore } from '@/store'
import { cn } from '@/utils'
import { useCompanies, useGlobalStats } from '@/hooks'

// Animated counter hook
function useCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0)
  const ref = useRef<boolean>(false)

  useEffect(() => {
    if (ref.current) return
    ref.current = true
    const startTime = Date.now()
    const tick = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    setTimeout(() => requestAnimationFrame(tick), 400)
  }, [target, duration])

  return count
}

export function HomePage() {
  const navigate = useNavigate()
  const { toggleCommandPalette, setContributeModalOpen } = useUIStore()
  const { data: globalStats } = useGlobalStats()
  const { data: companiesData } = useCompanies()

  const stats = globalStats ?? {
    total_contributors: 0,
    total_data_points: 0,
    companies_tracked: 0,
  }
  const companies = companiesData ?? []

  const contributorsCount = useCounter(stats.total_contributors)
  const dataPointsCount = useCounter(stats.total_data_points)
  const companiesCount = useCounter(stats.companies_tracked)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col">
        {/* Map Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <IndiaMap compact />
          </div>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-32 pb-16 max-w-[1440px] mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center max-w-4xl"
          >
            <LiveIndicator label="LIVE DATA FEED ACTIVE" />

            <h1 className="mt-8 text-5xl md:text-7xl font-bold tracking-tighter leading-[1.05] text-on-surface">
              Community-owned{' '}
              <span className="gradient-text">
                workplace intelligence
              </span>
            </h1>

            <p className="mt-6 text-body-lg text-on-surface-variant max-w-2xl text-balance">
              Decentralized salary benchmarks, real-time culture analytics, and verified
              workplace data powered by {formatNumber(stats.total_contributors)} anonymous contributors
              across India.
            </p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-10 w-full max-w-2xl"
            >
              <button
                onClick={toggleCommandPalette}
                className="w-full glass-panel rounded-xl border border-white/10 p-2 hover:border-primary/30 transition-all group shadow-2xl hover:shadow-glow-primary"
              >
                <div className="flex items-center gap-3 px-4 py-2.5 bg-background/60 rounded-lg">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-outline" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                  </svg>
                  <span className="text-outline text-body-lg flex-1 text-left">
                    Search company, role, or city...
                  </span>
                  <kbd className="hidden md:block px-2 py-1 rounded bg-surface-container-highest border border-outline-variant font-mono text-[10px] text-outline">
                    ⌘K
                  </kbd>
                  <button className="gradient-btn px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                    Analyze
                  </button>
                </div>
              </button>
            </motion.div>

            {/* Quick search tags */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {['Bangalore', 'SDE-2 at CRED', 'Remote ML Engineer', 'Senior PM Mumbai'].map(q => (
                <button
                  key={q}
                  onClick={toggleCommandPalette}
                  className="px-3 py-1 rounded-full bg-surface-container border border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all font-mono text-label-md"
                >
                  {q}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="relative z-10 flex justify-center pb-8">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex flex-col items-center gap-1 text-on-surface-variant"
          >
            <span className="font-mono text-label-md">EXPLORE</span>
            <ChevronRight size={16} className="rotate-90" />
          </motion.div>
        </div>
      </section>

      {/* Analytics Bento Grid */}
      <section className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

          {/* Trending Insight - Large */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-6"
          >
            <GlassCard
              className="p-6 h-full flex flex-col justify-between"
              hover
              accent="primary"
              onClick={() => navigate('/roles/senior-software-engineer')}
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <MonoLabel>TRENDING INSIGHT</MonoLabel>
                  <TrendingUp size={18} className="text-primary" />
                </div>
                <h3 className="text-headline-md font-semibold text-on-surface mb-2">
                  Remote-first companies are offering ₹8L more in equity grants this year.
                </h3>
                <p className="text-body-md text-on-surface-variant">
                  ML Engineers saw 28% YoY growth — highest of any tech role in FY2024
                </p>
              </div>
              <div className="mt-6 h-24">
                <SalaryTrendChart
                  data={SALARY_TREND_DATA.slice(-6)}
                  height={96}
                  showAxis={false}
                />
              </div>
            </GlassCard>
          </motion.div>

          {/* Salary Snapshot */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="md:col-span-3"
          >
            <GlassCard className="p-6 h-full flex flex-col" hover accent="secondary">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={14} className="text-secondary" />
                <MonoLabel color="secondary">SALARY TRENDS</MonoLabel>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className="text-4xl font-bold text-on-surface mb-1 tracking-tight">
                  ₹42.5L
                </div>
                <div className="font-mono text-label-md text-on-surface-variant mb-4">
                  Sr. Frontend (Remote)
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" dot size="sm">+12% YoY</Badge>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                {[
                  { role: 'ML Engineer', salary: '₹48L' },
                  { role: 'EM', salary: '₹62L' },
                  { role: 'Sr. PM', salary: '₹38L' },
                ].map(item => (
                  <div key={item.role} className="flex justify-between items-center">
                    <span className="text-body-md text-on-surface-variant">{item.role}</span>
                    <span className="font-mono text-body-md text-on-surface">{item.salary}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Top WLB Companies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-3"
          >
            <GlassCard className="p-6 h-full" hover accent="tertiary">
              <div className="flex items-center gap-2 mb-4">
                <Award size={14} className="text-tertiary" />
                <MonoLabel color="tertiary">TOP COMP SCORE</MonoLabel>
              </div>
              <div className="space-y-3">
                {[...companies].sort((a, b) => b.opencomp_score - a.opencomp_score)
                  .slice(0, 5)
                  .map((company, i) => (
                    <div
                      key={company.id}
                      className="flex items-center justify-between cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => navigate(`/companies/${company.slug}`)}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-label-md text-on-surface-variant w-4">
                          {i + 1}
                        </span>
                        <div>
                          <div className="text-body-md text-on-surface font-medium">{company.name}</div>
                          <div className="font-mono text-[10px] text-on-surface-variant">{company.industry}</div>
                        </div>
                      </div>
                      <span className="font-mono text-label-md px-2 py-0.5 rounded bg-tertiary/10 text-tertiary">
                        {company.opencomp_score}
                      </span>
                    </div>
                  ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Trending City Intelligence */}
          {TRENDING_INSIGHTS.map((insight, i) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (i + 3) }}
              className="md:col-span-3"
            >
              <GlassCard
                className="p-5 h-full"
                hover
                accent={insight.accent as 'primary' | 'secondary' | 'tertiary'}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <MonoLabel color={insight.accent as 'primary' | 'secondary' | 'tertiary'} className="mb-2 block">
                      {insight.category}
                    </MonoLabel>
                    <div className={cn(
                      'text-2xl font-bold font-mono mb-2',
                      {
                        'text-primary': insight.accent === 'primary',
                        'text-secondary': insight.accent === 'secondary',
                        'text-tertiary': insight.accent === 'tertiary',
                      }
                    )}>
                      {insight.value}
                    </div>
                    <p className="text-body-md text-on-surface leading-snug font-medium">
                      {insight.title}
                    </p>
                    <p className="text-body-md text-on-surface-variant mt-1 leading-snug">
                      {insight.subtitle}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Live Stats Section */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-8 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-8 md:p-12 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
            <div className="text-center md:text-left">
              <div className="text-5xl md:text-6xl font-bold text-primary tracking-tight mb-2">
                {formatNumber(contributorsCount)}
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 font-mono text-label-md text-on-surface-variant">
                <span className="w-1.5 h-1.5 bg-secondary rounded-full" />
                Contributors Across India
              </div>
            </div>
            <div className="text-center md:text-left border-y md:border-y-0 md:border-x border-white/8 py-8 md:py-0 md:px-10">
              <div className="text-5xl md:text-6xl font-bold text-secondary tracking-tight mb-2">
                {formatNumber(dataPointsCount)}+
              </div>
              <div className="font-mono text-label-md text-on-surface-variant">
                Verified Salary & Culture Data Points
              </div>
            </div>
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <span className="text-5xl md:text-6xl font-bold text-tertiary tracking-tight">
                  {formatNumber(companiesCount)}
                </span>
                <Activity size={28} className="text-error live-indicator" />
              </div>
              <div className="font-mono text-label-md text-on-surface-variant">
                Companies Tracked in Real-time
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Open Source Section */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <h2 className="text-4xl font-bold tracking-tight">
            Transparency is our{' '}
            <span className="gradient-text">primary directive.</span>
          </h2>
          <p className="text-body-lg text-on-surface-variant">
            We believe workplace data should be a public good. All underlying salary aggregates
            and market indices are published daily to our open data repository.
            No ads. No dark patterns. Community-owned forever.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="lg"
              icon={<GitBranch size={18} />}
              onClick={() => window.open('https://github.com', '_blank')}
            >
              View on GitHub
            </Button>
            <Button
              variant="ghost"
              size="lg"
              icon={<BookOpen size={18} />}
            >
              Documentation
            </Button>
          </div>
          <div className="flex gap-6 pt-2">
            {[
              { label: 'GitHub Stars', value: '4.2k', icon: Star },
              { label: 'Contributors', value: '218', icon: Users },
              { label: 'License', value: 'MIT', icon: FileText },
            ].map(item => (
              <div key={item.label}>
                <div className="font-bold text-on-surface flex items-center gap-1.5">
                  <item.icon size={14} className="text-on-surface-variant" />
                  {item.value}
                </div>
                <div className="font-mono text-label-md text-on-surface-variant">{item.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6 font-mono text-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-error/60" />
              <div className="w-3 h-3 rounded-full bg-tertiary/60" />
              <div className="w-3 h-3 rounded-full bg-secondary/60" />
            </div>
            <span className="text-on-surface-variant text-label-md">opencomp-api</span>
          </div>
          <pre className="text-[13px] leading-relaxed overflow-auto">
            <span className="text-on-surface-variant"># Get salary percentiles for a role in a city</span>
            {'\n'}
            <span className="text-secondary">GET</span>{' '}
            <span className="text-primary">/api/v1/salaries/percentiles</span>
            {'\n  '}
            <span className="text-tertiary">?role</span>=senior-software-engineer
            {'\n  '}
            <span className="text-tertiary">&city</span>=bangalore
            {'\n  '}
            <span className="text-tertiary">&experience_min</span>=3
            {'\n'}
            {'\n'}
            <span className="text-on-surface-variant">{"{"}</span>
            {'\n  '}
            <span className="text-primary">"p50"</span>: <span className="text-secondary">36.0</span>,
            {'\n  '}
            <span className="text-primary">"p75"</span>: <span className="text-secondary">48.2</span>,
            {'\n  '}
            <span className="text-primary">"p90"</span>: <span className="text-secondary">58.4</span>,
            {'\n  '}
            <span className="text-primary">"sample_size"</span>: <span className="text-secondary">2841</span>
            {'\n'}
            <span className="text-on-surface-variant">{"}"}</span>
          </pre>
        </motion.div>
      </section>

      {/* CTA: Contribute */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-8 py-16">
        <GlassCard className="p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-secondary/5 pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <Badge variant="secondary" dot className="mb-4">YOUR DATA HELPS EVERYONE</Badge>
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              Add your salary data.{' '}
              <span className="gradient-text">Help the community.</span>
            </h2>
            <p className="text-body-lg text-on-surface-variant mb-8">
              Takes 3 minutes. Completely anonymous. Your contribution helps thousands of
              job seekers negotiate better salaries.
            </p>
            <Button
              variant="primary"
              size="lg"
              icon={<PlusCircle size={18} />}
              onClick={() => setContributeModalOpen(true)}
            >
              Contribute Salary Data
            </Button>
          </div>
        </GlassCard>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-6 md:px-8 max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-[8px] font-bold text-on-primary">OC</span>
            </div>
            <span className="font-bold text-on-surface">OpenComp</span>
            <span className="text-on-surface-variant text-body-md">· Open-source workplace intelligence for India</span>
          </div>
          <div className="flex items-center gap-6">
            {['About', 'Privacy', 'Open Data', 'API', 'GitHub'].map(item => (
              <a
                key={item}
                href="#"
                className="font-mono text-label-md text-on-surface-variant hover:text-primary transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
