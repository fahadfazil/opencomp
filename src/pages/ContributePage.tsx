import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Building2, Briefcase, DollarSign, Star, MessageSquare, CheckCircle, ChevronRight, ChevronLeft, Shield, Loader2 } from 'lucide-react'
import { GlassCard, Button, MonoLabel, Badge } from '../components/ui'
import { useContributionStore, useAuthStore, useUIStore } from '../store'
import { cn } from '../utils'
import { useCompanies, useRoles } from '@/hooks'
import { submitContribution } from '@/services/contributionsService'

const STEPS = [
  { id: 1, label: 'Company', icon: Building2 },
  { id: 2, label: 'Role', icon: Briefcase },
  { id: 3, label: 'Salary', icon: DollarSign },
  { id: 4, label: 'Culture', icon: Star },
  { id: 5, label: 'Review', icon: MessageSquare },
  { id: 6, label: 'Submit', icon: CheckCircle },
]

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((step, i) => {
        const Icon = step.icon
        const done = current > step.id
        const active = current === step.id
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div className={cn(
                'w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300',
                done ? 'bg-primary text-background' : active ? 'bg-primary/20 border border-primary text-primary' : 'bg-surface-container border border-outline-variant text-on-surface-variant'
              )}>
                <Icon size={15} />
              </div>
              <span className={cn(
                'font-mono text-[9px] uppercase tracking-widest hidden md:block',
                active ? 'text-primary' : done ? 'text-on-surface' : 'text-on-surface-variant'
              )}>{step.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn(
                'w-8 md:w-14 h-px mx-1 mb-4 transition-all duration-300',
                done ? 'bg-primary' : 'bg-outline-variant'
              )} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function RatingStars({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          className="p-0.5 transition-transform hover:scale-110"
        >
          <Star
            size={22}
            className={cn(
              'transition-colors',
              n <= (hover || value) ? 'text-yellow-400 fill-yellow-400' : 'text-outline-variant'
            )}
          />
        </button>
      ))}
    </div>
  )
}

function Step1({ onNext }: { onNext: () => void }) {
  const { formData, updateFormData } = useContributionStore()
  const { data: companies = [] } = useCompanies()
  const [query, setQuery] = useState(formData.company_name || '')
  const filtered = companies.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 6)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-on-surface mb-1">Which company do you work at?</h2>
        <p className="text-on-surface-variant text-sm">Your identity will never be revealed.</p>
      </div>
      <input
        type="text"
        value={query}
        onChange={e => {
          setQuery(e.target.value)
          updateFormData({ company_name: e.target.value, company_id: null })
        }}
        placeholder="Search companies..."
        className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 text-on-surface placeholder-on-surface-variant outline-none focus:border-primary transition-colors"
      />
      {query && (
        <div className="space-y-2">
          {filtered.map(c => (
            <button
              key={c.id}
              onClick={() => {
                updateFormData({ company_name: c.name, company_id: c.id })
                setQuery(c.name)
              }}
              className={cn(
                'w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left',
                formData.company_id === c.id
                  ? 'border-primary bg-primary/10'
                  : 'border-outline-variant bg-surface-container hover:border-primary/50'
              )}
            >
              <div className="w-9 h-9 rounded-lg bg-surface-variant flex items-center justify-center text-sm font-bold text-primary">
                {c.name[0]}
              </div>
              <div>
                <div className="text-on-surface font-medium text-sm">{c.name}</div>
                <div className="text-on-surface-variant text-xs">{c.industry} · {c.headquarters}</div>
              </div>
              {formData.company_id === c.id && <CheckCircle size={16} className="ml-auto text-primary" />}
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="text-on-surface-variant text-sm text-center py-4">No match — we'll add it. Press next to continue.</p>
          )}
        </div>
      )}
      <Button variant="primary" className="w-full" disabled={!formData.company_name} onClick={onNext}>
        Continue <ChevronRight size={16} />
      </Button>
    </div>
  )
}

function Step2({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { formData, updateFormData } = useContributionStore()
  const { data: roles = [] } = useRoles()
  const [query, setQuery] = useState(formData.role_title || '')
  const filtered = roles.filter(r =>
    r.title.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 6)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-on-surface mb-1">What's your role?</h2>
        <p className="text-on-surface-variant text-sm">Select the closest match to your actual title.</p>
      </div>
      <input
        type="text"
        value={query}
        onChange={e => {
          setQuery(e.target.value)
          updateFormData({ role_title: e.target.value, role_id: null })
        }}
        placeholder="e.g. Software Engineer, Product Manager..."
        className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 text-on-surface placeholder-on-surface-variant outline-none focus:border-primary transition-colors"
      />
      {query && filtered.length > 0 && (
        <div className="space-y-2">
          {filtered.map(r => (
            <button
              key={r.id}
              onClick={() => {
                updateFormData({ role_title: r.title, role_id: r.id })
                setQuery(r.title)
              }}
              className={cn(
                'w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left',
                formData.role_id === r.id
                  ? 'border-primary bg-primary/10'
                  : 'border-outline-variant bg-surface-container hover:border-primary/50'
              )}
            >
              <Briefcase size={16} className="text-primary" />
              <div>
                <div className="text-on-surface font-medium text-sm">{r.title}</div>
                <div className="text-on-surface-variant text-xs">{r.category} · {r.avg_salary_lpa}L avg</div>
              </div>
              {formData.role_id === r.id && <CheckCircle size={16} className="ml-auto text-primary" />}
            </button>
          ))}
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Experience</label>
          <select
            value={formData.experience_years ?? ''}
            onChange={e => updateFormData({ experience_years: Number(e.target.value) })}
            className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 text-on-surface outline-none focus:border-primary"
          >
            <option value="">Select years</option>
            {[0,1,2,3,4,5,6,7,8,9,10,12,15,20].map(y => (
              <option key={y} value={y}>{y === 0 ? 'Fresher' : `${y} years`}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Work Mode</label>
          <select
            value={formData.work_mode ?? ''}
            onChange={e => updateFormData({ work_mode: e.target.value as 'remote' | 'hybrid' | 'onsite' })}
            className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 text-on-surface outline-none focus:border-primary"
          >
            <option value="">Select mode</option>
            <option value="onsite">On-site</option>
            <option value="hybrid">Hybrid</option>
            <option value="remote">Remote</option>
          </select>
        </div>
      </div>
      <div className="flex gap-3">
        <Button variant="ghost" className="flex-1" onClick={onBack}><ChevronLeft size={16} /> Back</Button>
        <Button variant="primary" className="flex-1" disabled={!formData.role_title || formData.experience_years === null} onClick={onNext}>
          Continue <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  )
}

function Step3({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { formData, updateFormData } = useContributionStore()
  const bonus = formData.bonus_lpa ?? 0
  const equity = formData.equity_lpa ?? 0
  const base = formData.base_salary_lpa ?? 0
  const total = base + bonus + equity

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-on-surface mb-1">Your compensation</h2>
        <p className="text-on-surface-variant text-sm">All data is aggregated and anonymised before display.</p>
      </div>
      <div className="space-y-4">
        {[
          { label: 'Base Salary (LPA)', field: 'base_salary_lpa' as const, required: true },
          { label: 'Variable / Bonus (LPA)', field: 'bonus_lpa' as const, required: false },
          { label: 'Stock / ESOPs (LPA equivalent)', field: 'equity_lpa' as const, required: false },
        ].map(({ label, field, required }) => (
          <div key={field}>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
              {label} {!required && <span className="opacity-50">optional</span>}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-mono text-sm">₹</span>
              <input
                type="number"
                value={formData[field] ?? ''}
                onChange={e => updateFormData({ [field]: e.target.value ? Number(e.target.value) : null })}
                placeholder={field === 'base_salary_lpa' ? 'e.g. 24' : 'e.g. 4'}
                className="w-full bg-surface-container border border-outline-variant rounded-xl pl-8 pr-16 py-3 text-on-surface outline-none focus:border-primary"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-mono text-xs">LPA</span>
            </div>
          </div>
        ))}
        {base > 0 && (
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
            <div className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Total Compensation</div>
            <div className="text-2xl font-bold text-primary">₹{total.toFixed(1)}L</div>
          </div>
        )}
      </div>
      <div className="flex gap-3">
        <Button variant="ghost" className="flex-1" onClick={onBack}><ChevronLeft size={16} /> Back</Button>
        <Button variant="primary" className="flex-1" disabled={!formData.base_salary_lpa} onClick={onNext}>
          Continue <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  )
}

const CULTURE_FIELDS = [
  { key: 'wlb_rating' as const, label: 'Work-Life Balance' },
  { key: 'manager_rating' as const, label: 'Manager Quality' },
  { key: 'culture_rating' as const, label: 'Culture & Inclusivity' },
  { key: 'growth_rating' as const, label: 'Growth Opportunities' },
]

function Step4({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { formData, updateFormData } = useContributionStore()
  const allRated = CULTURE_FIELDS.every(f => (formData[f.key] ?? 0) > 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-on-surface mb-1">Rate your workplace</h2>
        <p className="text-on-surface-variant text-sm">Honest ratings help the community make better decisions.</p>
      </div>
      <div className="space-y-4">
        {CULTURE_FIELDS.map(f => (
          <div key={f.key} className="flex items-center justify-between">
            <span className="text-on-surface text-sm w-48">{f.label}</span>
            <RatingStars
              value={formData[f.key] ?? 0}
              onChange={v => updateFormData({ [f.key]: v })}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <Button variant="ghost" className="flex-1" onClick={onBack}><ChevronLeft size={16} /> Back</Button>
        <Button variant="primary" className="flex-1" disabled={!allRated} onClick={onNext}>
          Continue <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  )
}

function Step5({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { formData, updateFormData } = useContributionStore()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-on-surface mb-1">Share your experience</h2>
        <p className="text-on-surface-variant text-sm">Optional but valuable. All reviews are 100% anonymous.</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">What's great about working here?</label>
          <textarea
            value={formData.pros ?? ''}
            onChange={e => updateFormData({ pros: e.target.value })}
            rows={3}
            placeholder="Great engineering culture, flexible hours, strong mentorship..."
            className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 text-on-surface placeholder-on-surface-variant outline-none focus:border-primary resize-none"
          />
        </div>
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">What could be better?</label>
          <textarea
            value={formData.cons ?? ''}
            onChange={e => updateFormData({ cons: e.target.value })}
            rows={3}
            placeholder="Slow promotions, limited remote options..."
            className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 text-on-surface placeholder-on-surface-variant outline-none focus:border-primary resize-none"
          />
        </div>
      </div>
      <div className="p-4 bg-surface-container rounded-xl border border-outline-variant flex gap-3">
        <Shield size={18} className="text-secondary shrink-0 mt-0.5" />
        <p className="text-on-surface-variant text-xs leading-relaxed">
          Your review is stripped of identifying information before storage. We never sell or share individual data. All displayed stats are aggregated across at least 5 responses.
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="ghost" className="flex-1" onClick={onBack}><ChevronLeft size={16} /> Back</Button>
        <Button variant="primary" className="flex-1" onClick={onNext}>
          Review & Submit <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  )
}

function Step6({ onBack }: { onBack: () => void }) {
  const { formData, resetForm } = useContributionStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!user) {
      setSubmitError('Please sign in to submit your contribution.')
      return
    }
    setSubmitError(null)
    setSubmitting(true)
    try {
      await submitContribution(formData, user.id)
      setDone(true)
      resetForm()
      setTimeout(() => navigate('/'), 3000)
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Failed to submit contribution. Please verify required fields and retry.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8 space-y-4">
        <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary flex items-center justify-center mx-auto">
          <CheckCircle size={32} className="text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-on-surface">Thank you for contributing!</h2>
        <p className="text-on-surface-variant text-sm">Your data helps thousands of professionals make better decisions.</p>
        <Badge>Data published anonymously</Badge>
        <p className="text-on-surface-variant text-xs">Redirecting to home...</p>
      </motion.div>
    )
  }

  const total = (formData.base_salary_lpa ?? 0) + (formData.bonus_lpa ?? 0) + (formData.equity_lpa ?? 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-on-surface mb-1">Review your submission</h2>
        <p className="text-on-surface-variant text-sm">Everything looks correct? Let's publish it.</p>
      </div>
      <div className="space-y-3">
        {[
          { label: 'Company', value: formData.company_name },
          { label: 'Role', value: formData.role_title },
          { label: 'Experience', value: formData.experience_years != null ? `${formData.experience_years} years` : null },
          { label: 'Base Salary', value: formData.base_salary_lpa ? `₹${formData.base_salary_lpa}L` : null },
          { label: 'Total Comp', value: total > 0 ? `₹${total.toFixed(1)}L` : null },
          { label: 'Work Mode', value: formData.work_mode },
        ].filter(r => r.value).map(row => (
          <div key={row.label} className="flex justify-between items-center py-2 border-b border-outline-variant/30">
            <span className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">{row.label}</span>
            <span className="text-on-surface text-sm font-medium">{row.value}</span>
          </div>
        ))}
      </div>
      {submitError && (
        <p className="text-body-md text-error">{submitError}</p>
      )}
      <div className="flex gap-3">
        <Button variant="ghost" className="flex-1" onClick={onBack} disabled={submitting}><ChevronLeft size={16} /> Back</Button>
        <Button variant="primary" className="flex-1" onClick={handleSubmit} disabled={submitting}>
          {submitting ? <><Loader2 size={16} className="animate-spin" /> Publishing...</> : <>Submit Anonymously <CheckCircle size={16} /></>}
        </Button>
      </div>
    </div>
  )
}

export function ContributePage() {
  const { user } = useAuthStore()
  const { setAuthModalOpen } = useUIStore()
  const [step, setStep] = useState(1)

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <GlassCard className="p-8 max-w-md w-full text-center space-y-4">
          <Shield size={40} className="text-primary mx-auto" />
          <h2 className="text-xl font-bold text-on-surface">Sign in to contribute</h2>
          <p className="text-on-surface-variant text-sm">
            You need to be signed in to submit salary data. Your identity remains anonymous.
          </p>
          <Button variant="primary" onClick={() => setAuthModalOpen(true)}>Sign In</Button>
        </GlassCard>
      </div>
    )
  }

  const next = () => setStep(s => Math.min(s + 1, 6))
  const back = () => setStep(s => Math.max(s - 1, 1))

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-lg mx-auto">
        <div className="mb-8 text-center">
          <MonoLabel className="text-primary mb-2 block">CONTRIBUTE DATA</MonoLabel>
          <h1 className="text-3xl font-bold text-on-surface">Share your compensation</h1>
        </div>
        <StepIndicator current={step} />
        <GlassCard className="p-8">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              {step === 1 && <Step1 onNext={next} />}
              {step === 2 && <Step2 onNext={next} onBack={back} />}
              {step === 3 && <Step3 onNext={next} onBack={back} />}
              {step === 4 && <Step4 onNext={next} onBack={back} />}
              {step === 5 && <Step5 onNext={next} onBack={back} />}
              {step === 6 && <Step6 onBack={back} />}
            </motion.div>
          </AnimatePresence>
        </GlassCard>
        <p className="text-center text-on-surface-variant text-xs mt-6 flex items-center justify-center gap-2">
          <Shield size={12} /> All data is anonymized and aggregated before display
        </p>
      </div>
    </div>
  )
}
