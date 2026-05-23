import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'
import type { CompScore } from '@/types'

// Extend twMerge so custom font-size utilities (text-body-md, text-body-lg, etc.)
// are recognized as font-size class group members and no longer conflict with
// text-color utilities such as text-black.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        'text-display-lg',
        'text-headline-lg',
        'text-headline-md',
        'text-body-lg',
        'text-body-md',
        'text-label-md',
      ],
    },
  },
})

// ============================================================
// Tailwind class utility
// ============================================================
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ============================================================
// Formatting utilities
// ============================================================
export function formatLPA(value: number, decimals = 1): string {
  if (value >= 100) {
    return `₹${(value / 100).toFixed(1)}Cr`
  }
  return `₹${value.toFixed(decimals)}L`
}

export function formatLPAShort(value: number): string {
  return `₹${value}L`
}

export function formatNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`
  }
  return value.toLocaleString('en-IN')
}

export function formatPercent(value: number, showSign = false): string {
  const sign = showSign && value > 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}%`
}

export function formatMonthlyRent(value: number): string {
  return `₹${(value / 1000).toFixed(0)}k/mo`
}

// ============================================================
// OpenComp Score Engine
// ============================================================
export function calculateOpenCompScore(params: {
  salary: number
  city_mean: number
  city_stddev: number
  role_mean: number
  role_stddev: number
  exp_weight?: number
}): CompScore {
  const { salary, city_mean, city_stddev, role_mean, role_stddev, exp_weight = 1 } = params

  // Z-score calculation
  const city_z = city_stddev > 0 ? (salary - city_mean) / city_stddev : 0
  const role_z = role_stddev > 0 ? (salary - role_mean) / role_stddev : 0

  // Weighted composite z-score
  const composite_z = (city_z * 0.4 + role_z * 0.6) * exp_weight

  // Normalize to 0-100
  const raw_score = normalizeScore(composite_z)

  // Calculate percentile using normal distribution approximation
  const percentile = calculatePercentile(composite_z)

  // Determine positioning
  let positioning: CompScore['positioning']
  if (raw_score >= 75) positioning = 'top_market'
  else if (raw_score >= 55) positioning = 'above_market'
  else if (raw_score >= 40) positioning = 'at_market'
  else positioning = 'below_market'

  return {
    score: Math.round(raw_score),
    percentile: Math.round(percentile),
    positioning,
    z_score: parseFloat(composite_z.toFixed(2)),
    comparison: {
      city_avg: city_mean,
      role_avg: role_mean,
      experience_avg: (city_mean + role_mean) / 2,
      your_salary: salary,
    },
  }
}

function normalizeScore(z: number): number {
  // Map z-score (-3 to +3) to (0 to 100)
  const clamped = Math.max(-3, Math.min(3, z))
  return ((clamped + 3) / 6) * 100
}

function calculatePercentile(z: number): number {
  // Approximation of normal CDF
  const a1 = 0.254829592
  const a2 = -0.284496736
  const a3 = 1.421413741
  const a4 = -1.453152027
  const a5 = 1.061405429
  const p = 0.3275911

  const sign = z < 0 ? -1 : 1
  const absZ = Math.abs(z)
  const t = 1 / (1 + p * absZ)
  const poly = ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t
  const erf = 1 - poly * Math.exp(-absZ * absZ)

  return Math.max(1, Math.min(99, 50 * (1 + sign * erf)))
}

export function getScoreColor(score: number): string {
  if (score >= 75) return 'text-secondary'
  if (score >= 55) return 'text-primary'
  if (score >= 40) return 'text-tertiary'
  return 'text-error'
}

export function getPositioningLabel(positioning: CompScore['positioning']): string {
  const labels = {
    top_market: 'Top of Market',
    above_market: 'Above Market',
    at_market: 'At Market',
    below_market: 'Below Market',
  }
  return labels[positioning]
}

export function getPositioningColor(positioning: CompScore['positioning']): string {
  const colors = {
    top_market: '#9ad2c3',
    above_market: '#cbd2ff',
    at_market: '#d1d0ff',
    below_market: '#ffb4ab',
  }
  return colors[positioning]
}

// ============================================================
// Date utilities
// ============================================================
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}

// ============================================================
// Array utilities
// ============================================================
export function calculatePercentiles(values: number[]): {
  p10: number; p25: number; p50: number; p75: number; p90: number
} {
  const sorted = [...values].sort((a, b) => a - b)
  const n = sorted.length

  const getPercentile = (p: number) => {
    const idx = (p / 100) * (n - 1)
    const lower = Math.floor(idx)
    const upper = Math.ceil(idx)
    const frac = idx - lower
    return sorted[lower] + frac * (sorted[upper] - sorted[lower])
  }

  return {
    p10: getPercentile(10),
    p25: getPercentile(25),
    p50: getPercentile(50),
    p75: getPercentile(75),
    p90: getPercentile(90),
  }
}

export function getMean(values: number[]): number {
  return values.reduce((sum, v) => sum + v, 0) / values.length
}

export function getStddev(values: number[]): number {
  const mean = getMean(values)
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length
  return Math.sqrt(variance)
}

// ============================================================
// Color utilities for maps/charts
// ============================================================
export function getSalaryColor(salary: number, min: number, max: number): string {
  const t = (salary - min) / (max - min)
  const colors = [
    { r: 80, g: 91, b: 147 },   // Low: inverse-primary
    { r: 179, g: 183, b: 255 },  // Mid: primary-container
    { r: 154, g: 210, b: 195 },  // High: secondary
  ]

  if (t <= 0.5) {
    const local_t = t * 2
    return interpolateColor(colors[0], colors[1], local_t)
  } else {
    const local_t = (t - 0.5) * 2
    return interpolateColor(colors[1], colors[2], local_t)
  }
}

function interpolateColor(
  c1: { r: number; g: number; b: number },
  c2: { r: number; g: number; b: number },
  t: number
): string {
  const r = Math.round(c1.r + (c2.r - c1.r) * t)
  const g = Math.round(c1.g + (c2.g - c1.g) * t)
  const b = Math.round(c1.b + (c2.b - c1.b) * t)
  return `rgb(${r}, ${g}, ${b})`
}

// ============================================================
// Validation
// ============================================================
export function validateSalary(lpa: number): boolean {
  return lpa >= 1 && lpa <= 500
}

export function validateExperience(years: number): boolean {
  return years >= 0 && years <= 40
}

export function validateRating(rating: number): boolean {
  return rating >= 1 && rating <= 5
}

// ============================================================
// Company slug helpers
// ============================================================
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}
