import {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Cell
} from 'recharts'
import type { TrendPoint, OfficeArea } from '@/types'

const CHART_MONO_FONT = 'var(--font-mono)'

// ============================================================
// Custom Tooltip
// ============================================================
interface GlassTooltipProps {
  active?: boolean
  payload?: Array<{ color: string; value: number | string }>
  label?: string
  prefix?: string
  suffix?: string
}

/**
 * Subset of Recharts tooltip props used by this component.
 * Full API: https://recharts.org/en-US/api/Tooltip
 */
// Recharts passes tooltip render props (`active`, `payload`, `label`) to custom tooltip components.
function GlassTooltip({ active, payload, label, prefix = '₹', suffix = 'L' }: GlassTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-panel rounded-lg px-3 py-2.5 border border-white/10 shadow-xl">
      <div className="font-mono text-[10px] text-on-surface-variant mb-1">{label}</div>
      {payload.map((entry, i: number) => (
        <div key={i} className="font-mono text-sm font-bold" style={{ color: entry.color }}>
          {prefix}{entry.value}{suffix}
        </div>
      ))}
    </div>
  )
}

// ============================================================
// Salary Trend Chart
// ============================================================
interface TrendChartProps {
  data: TrendPoint[]
  height?: number
  showAxis?: boolean
  color?: string
}

export function SalaryTrendChart({
  data,
  height = 180,
  showAxis = true,
  color = '#cbd2ff',
}: TrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: showAxis ? 0 : -20 }}>
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        {showAxis && (
          <>
            <XAxis
              dataKey="period"
              tick={{ fill: '#90909a', fontSize: 10, fontFamily: CHART_MONO_FONT }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.05)' }}
              interval={2}
            />
            <YAxis
              tick={{ fill: '#90909a', fontSize: 10, fontFamily: CHART_MONO_FONT }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `₹${v}L`}
            />
          </>
        )}
        <Tooltip content={<GlassTooltip />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill="url(#areaGradient)"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// ============================================================
// Salary Distribution (Percentile) Bar Chart
// ============================================================
interface DistributionProps {
  p10: number; p25: number; p50: number; p75: number; p90: number
  userSalary?: number
  height?: number
}

export function SalaryDistributionChart({
  p10, p25, p50, p75, p90,
  userSalary,
  height = 120
}: DistributionProps) {
  const data = [
    { label: 'P10', value: p10, fill: '#45464f' },
    { label: 'P25', value: p25, fill: '#505b93' },
    { label: 'P50', value: p50, fill: '#cbd2ff' },
    { label: 'P75', value: p75, fill: '#9ad2c3' },
    { label: 'P90', value: p90, fill: '#9ad2c3' },
  ]

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: '#90909a', fontSize: 10, fontFamily: CHART_MONO_FONT }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fill: '#90909a', fontSize: 10, fontFamily: CHART_MONO_FONT }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `₹${v}L`}
        />
        <Tooltip content={<GlassTooltip />} />
        {userSalary && (
          <ReferenceLine
            y={userSalary}
            stroke="#d1d0ff"
            strokeDasharray="4 4"
            label={{ value: 'YOU', position: 'right', fill: '#d1d0ff', fontSize: 9, fontFamily: CHART_MONO_FONT }}
          />
        )}
        <Bar dataKey="value" radius={[3, 3, 0, 0]} maxBarSize={50}>
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

// ============================================================
// Culture Radar Chart
// ============================================================
interface RadarDataPoint {
  subject: string
  value: number
  fullMark: number
}

interface CultureRadarProps {
  data: RadarDataPoint[]
  height?: number
  color?: string
}

export function CultureRadar({ data, height = 200, color = '#cbd2ff' }: CultureRadarProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data} margin={{ top: 5, right: 30, bottom: 5, left: 30 }}>
        <PolarGrid stroke="rgba(255,255,255,0.08)" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: '#90909a', fontSize: 10, fontFamily: CHART_MONO_FONT }}
        />
        <PolarRadiusAxis angle={90} domain={[0, 5]} tick={false} axisLine={false} />
        <Radar
          name="Culture"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          fill={color}
          fillOpacity={0.15}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}

// ============================================================
// Mini Sparkline
// ============================================================
interface SparklineProps {
  data: number[]
  color?: string
  height?: number
  width?: number
}

export function Sparkline({ data, color = '#cbd2ff', height = 40, width = 100 }: SparklineProps) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((v - min) / range) * (height - 4) - 2
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={`sg-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

// ============================================================
// City Comparison Bar
// ============================================================
interface CityComparisonProps {
  cities: { name: string; value: number; id: string }[]
  maxValue: number
  height?: number
}

export function CityComparisonChart({ cities, maxValue, height = 200 }: CityComparisonProps) {
  const data = cities.map(c => ({ ...c, label: c.name }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <XAxis
          type="number"
          tick={{ fill: '#90909a', fontSize: 10, fontFamily: CHART_MONO_FONT }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `₹${v}L`}
          domain={[0, maxValue]}
        />
        <YAxis
          type="category"
          dataKey="label"
          tick={{ fill: '#c6c5d1', fontSize: 11, fontFamily: CHART_MONO_FONT }}
          tickLine={false}
          axisLine={false}
          width={80}
        />
        <Tooltip content={<GlassTooltip />} />
        <Bar dataKey="value" radius={[0, 3, 3, 0]} maxBarSize={20}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={i === 0 ? '#9ad2c3' : i < 3 ? '#cbd2ff' : '#45464f'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

// ============================================================
// Area Score Heatmap
// ============================================================
type HeatmapMetricKey =
  | 'office_density'
  | 'commute_score'
  | 'food_score'
  | 'safety_score'
  | 'walkability_score'

const HEATMAP_METRICS: { key: HeatmapMetricKey; label: string }[] = [
  { key: 'office_density', label: 'DENSITY' },
  { key: 'commute_score', label: 'COMMUTE' },
  { key: 'food_score', label: 'FOOD' },
  { key: 'safety_score', label: 'SAFETY' },
  { key: 'walkability_score', label: 'WALK' },
]

function getHeatmapCellColor(score: number): string {
  if (score >= 75) return '#9ad2c3'
  if (score >= 55) return '#cbd2ff'
  if (score >= 35) return '#b0b2ff'
  return '#ffb4ab'
}

interface AreaScoreHeatmapProps {
  areas: OfficeArea[]
}

export function AreaScoreHeatmap({ areas }: AreaScoreHeatmapProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="font-mono text-[10px] text-on-surface-variant tracking-widest pb-3 pr-6 min-w-[130px]">
              AREA
            </th>
            {HEATMAP_METRICS.map(m => (
              <th
                key={m.key}
                className="font-mono text-[10px] text-on-surface-variant tracking-widest pb-3 px-1.5 text-center"
              >
                {m.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {areas.map((area, rowIdx) => (
            <tr key={area.id} className={rowIdx > 0 ? 'border-t border-white/5' : ''}>
              <td className="py-2.5 pr-6 font-mono text-[11px] text-on-surface whitespace-nowrap">
                {area.name}
              </td>
              {HEATMAP_METRICS.map(m => {
                const val = area[m.key]
                const color = getHeatmapCellColor(val)
                return (
                  <td key={m.key} className="px-1.5 py-2.5 text-center">
                    <div
                      className="rounded-md inline-flex items-center justify-center font-mono text-[10px] font-bold"
                      style={{
                        width: '52px',
                        height: '28px',
                        background: `${color}20`,
                        color,
                        border: `1px solid ${color}40`,
                      }}
                    >
                      {val}
                    </div>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-4 flex-wrap">
        {[
          { color: '#9ad2c3', label: '75–100' },
          { color: '#cbd2ff', label: '55–74' },
          { color: '#b0b2ff', label: '35–54' },
          { color: '#ffb4ab', label: '0–34' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ background: `${color}30`, border: `1px solid ${color}60` }}
            />
            <span className="font-mono text-[9px] text-on-surface-variant">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
