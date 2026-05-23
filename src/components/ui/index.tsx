import React from 'react'
import { cn } from '@/utils'
import { motion } from 'framer-motion'

// ============================================================
// GlassCard
// ============================================================
interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
  accent?: 'primary' | 'secondary' | 'tertiary'
}

export function GlassCard({ children, className, hover, onClick, accent }: GlassCardProps) {
  const accentBorder = {
    primary: 'hover:border-primary/25 hover:shadow-glow-primary',
    secondary: 'hover:border-secondary/25 hover:shadow-glow-secondary',
    tertiary: 'hover:border-tertiary/25',
  }

  return (
    <div
      className={cn(
        'glass-card',
        hover && 'transition-all duration-200 cursor-pointer',
        hover && accent && accentBorder[accent],
        hover && !accent && 'hover:border-white/10',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

// ============================================================
// MonoLabel
// ============================================================
interface MonoLabelProps {
  children: React.ReactNode
  className?: string
  color?: 'primary' | 'secondary' | 'tertiary' | 'muted'
}

export function MonoLabel({ children, className, color = 'primary' }: MonoLabelProps) {
  const colorMap = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    tertiary: 'text-tertiary',
    muted: 'text-on-surface-variant',
  }

  return (
    <span className={cn('mono-label', colorMap[color], className)}>
      {children}
    </span>
  )
}

// ============================================================
// Badge / Chip
// ============================================================
interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'tertiary' | 'error' | 'ghost'
  size?: 'sm' | 'md'
  dot?: boolean
  className?: string
}

export function Badge({
  children,
  variant = 'primary',
  size = 'md',
  dot,
  className,
}: BadgeProps) {
  const variantClasses = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    secondary: 'bg-secondary/10 text-secondary border-secondary/20',
    tertiary: 'bg-tertiary/10 text-tertiary border-tertiary/20',
    error: 'bg-error/10 text-error border-error/20',
    ghost: 'bg-surface-container text-on-surface-variant border-outline-variant',
  }

  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-label-md',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-mono tracking-widest uppercase font-medium',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            {
              'bg-primary': variant === 'primary',
              'bg-secondary': variant === 'secondary',
              'bg-tertiary': variant === 'tertiary',
              'bg-error': variant === 'error',
              'bg-on-surface-variant': variant === 'ghost',
            }
          )}
        />
      )}
      {children}
    </span>
  )
}

// ============================================================
// Button
// ============================================================
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  loading?: boolean
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary to-primary-container text-on-primary hover:opacity-90',
    secondary: 'bg-secondary/10 text-secondary border border-secondary/20 hover:bg-secondary/20',
    ghost: 'bg-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high',
    outline: 'bg-transparent text-on-surface border border-outline-variant hover:bg-surface-container',
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-body-md gap-1.5',
    md: 'px-5 py-2.5 text-body-md gap-2',
    lg: 'px-7 py-3.5 text-body-lg gap-2.5',
  }

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-150 active:scale-[0.98]',
        variantClasses[variant],
        sizeClasses[size],
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          {children}
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </button>
  )
}

// ============================================================
// Skeleton Loader
// ============================================================
interface SkeletonProps {
  className?: string
  lines?: number
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'bg-surface-container-high rounded animate-pulse',
        className
      )}
    />
  )
}

export function SkeletonCard({ lines = 3 }: SkeletonProps) {
  return (
    <div className="glass-card p-6 space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-2/3" />
      {Array.from({ length: lines - 2 }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
    </div>
  )
}

// ============================================================
// StatCard
// ============================================================
interface StatCardProps {
  label: string
  value: string
  subtext?: string
  trend?: number
  accentColor?: string
  icon?: React.ReactNode
  className?: string
}

export function StatCard({
  label,
  value,
  subtext,
  trend,
  accentColor = '#cbd2ff',
  icon,
  className,
}: StatCardProps) {
  return (
    <GlassCard
      className={cn('p-5 relative overflow-hidden', className)}
      hover
    >
      {/* Radial accent */}
      <div
        className="absolute top-0 left-0 w-32 h-32 rounded-full opacity-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${accentColor}, transparent)` }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <MonoLabel color="muted">{label}</MonoLabel>
          {icon && <div className="text-on-surface-variant">{icon}</div>}
        </div>
        <div className="text-2xl font-bold text-on-surface font-sans tracking-tight mb-1">
          {value}
        </div>
        {(subtext || trend !== undefined) && (
          <div className="flex items-center gap-2">
            {trend !== undefined && (
              <span
                className={cn(
                  'font-mono text-label-md',
                  trend >= 0 ? 'text-secondary' : 'text-error'
                )}
              >
                {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </span>
            )}
            {subtext && (
              <span className="text-on-surface-variant text-body-md">{subtext}</span>
            )}
          </div>
        )}
      </div>
    </GlassCard>
  )
}

// ============================================================
// Score Gauge
// ============================================================
interface ScoreGaugeProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  label?: string
  showNumber?: boolean
}

export function ScoreGauge({ score, size = 'md', label, showNumber = true }: ScoreGaugeProps) {
  const dims = { sm: 64, md: 96, lg: 128 }[size]
  const strokeWidth = { sm: 5, md: 7, lg: 9 }[size]
  const radius = (dims - strokeWidth * 2) / 2
  const circumference = radius * 2 * Math.PI
  const progress = (score / 100) * circumference
  const gap = circumference - progress

  const color = score >= 75 ? '#9ad2c3' : score >= 55 ? '#cbd2ff' : score >= 40 ? '#d1d0ff' : '#ffb4ab'

  return (
    <div className="flex flex-col items-center gap-1">
      <svg
        width={dims}
        height={dims}
        className="score-ring"
        style={{ transform: 'rotate(-90deg)' }}
      >
        {/* Background ring */}
        <circle
          cx={dims / 2}
          cy={dims / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        {/* Score arc */}
        <motion.circle
          cx={dims / 2}
          cy={dims / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: gap }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
        />
      </svg>
      {showNumber && (
        <div style={{ marginTop: `-${dims / 2 + 12}px`, color }} className="font-bold text-center">
          <div className={cn({
            'text-xl': size === 'sm',
            'text-2xl': size === 'md',
            'text-4xl': size === 'lg',
          })}>
            {score}
          </div>
          {label && (
            <div className="font-mono text-[9px] text-on-surface-variant tracking-widest uppercase mt-0.5">
              {label}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================================
// Live Indicator
// ============================================================
export function LiveIndicator({ label = 'LIVE' }: { label?: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" />
      </span>
      <span className="font-mono text-label-md text-secondary tracking-widest">{label}</span>
    </div>
  )
}

// ============================================================
// Divider
// ============================================================
export function Divider({ className }: { className?: string }) {
  return (
    <div className={cn('border-t border-white/5', className)} />
  )
}

// ============================================================
// RatingStars
// ============================================================
export function RatingBar({ value, max = 5, label, className }: {
  value: number
  max?: number
  label?: string
  className?: string
}) {
  const pct = (value / max) * 100

  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <div className="flex justify-between items-center">
          <span className="text-body-md text-on-surface-variant">{label}</span>
          <span className="font-mono text-label-md text-on-surface">
            {value.toFixed(1)}
          </span>
        </div>
      )}
      <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
