import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { formatLPA, getSalaryColor } from '@/utils'
import { MOCK_CITIES } from '@/data/mockData'
import type { City } from '@/types'

// Simplified map positions for Indian cities (x%, y% on a bounding box)
const CITY_POSITIONS: Record<string, { x: number; y: number }> = {
  blr: { x: 52, y: 78 },
  mum: { x: 38, y: 62 },
  del: { x: 52, y: 30 },
  hyd: { x: 52, y: 68 },
  pun: { x: 42, y: 58 },
  che: { x: 58, y: 80 },
  kol: { x: 74, y: 48 },
  ahm: { x: 36, y: 48 },
  jai: { x: 47, y: 36 },
}

const MIN_SALARY = Math.min(...MOCK_CITIES.map(c => c.avg_salary_lpa))
const MAX_SALARY = Math.max(...MOCK_CITIES.map(c => c.avg_salary_lpa))

interface IndiaMapProps {
  onCityClick?: (city: City) => void
  highlightCityId?: string
  compact?: boolean
}

export function IndiaMap({ onCityClick, highlightCityId, compact = false }: IndiaMapProps) {
  const navigate = useNavigate()
  const [hoveredCity, setHoveredCity] = useState<City | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const handleCityClick = (city: City) => {
    if (onCityClick) {
      onCityClick(city)
    } else {
      navigate(`/cities/${city.slug}`)
    }
  }

  return (
    <div className="relative w-full h-full select-none">
      {/* SVG India outline - simplified abstract map */}
      <svg
        viewBox="0 0 600 700"
        className="w-full h-full"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
        }}
      >
        <defs>
          <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(203,210,255,0.05)" />
            <stop offset="100%" stopColor="rgba(203,210,255,0)" />
          </radialGradient>
          <filter id="cityGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background glow */}
        <ellipse cx="300" cy="350" rx="220" ry="300" fill="url(#mapGlow)" />

        {/* Simplified India outline */}
        <path
          d="M 260 60 L 310 55 L 360 70 L 420 80 L 460 100 L 480 140 L 490 180 L 480 220 L 500 250 L 510 290 L 490 330 L 470 360 L 460 390 L 440 420 L 420 450 L 400 480 L 380 510 L 360 540 L 340 570 L 320 590 L 310 600 L 295 590 L 280 570 L 260 540 L 240 510 L 220 480 L 200 450 L 185 420 L 170 390 L 160 360 L 150 330 L 145 290 L 150 250 L 165 210 L 160 170 L 175 140 L 195 110 L 220 85 Z"
          fill="none"
          stroke="rgba(203,210,255,0.12)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Grid lines (subtle) */}
        {[200, 300, 400, 500].map(x => (
          <line key={`v${x}`} x1={x} y1="50" x2={x} y2="620" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
        ))}
        {[150, 250, 350, 450, 550].map(y => (
          <line key={`h${y}`} x1="130" y1={y} x2="510" y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
        ))}

        {/* Heatmap blobs */}
        {MOCK_CITIES.map((city) => {
          const pos = CITY_POSITIONS[city.id]
          if (!pos) return null
          const x = (pos.x / 100) * 600
          const y = (pos.y / 100) * 700
          const color = getSalaryColor(city.avg_salary_lpa, MIN_SALARY, MAX_SALARY)
          const radius = 40 + (city.total_entries / 20000) * 30

          return (
            <ellipse
              key={`heat-${city.id}`}
              cx={x}
              cy={y}
              rx={radius}
              ry={radius * 0.8}
              fill={color}
              opacity={0.12}
            />
          )
        })}

        {/* City Markers */}
        {MOCK_CITIES.map((city, idx) => {
          const pos = CITY_POSITIONS[city.id]
          if (!pos) return null
          const x = (pos.x / 100) * 600
          const y = (pos.y / 100) * 700
          const color = getSalaryColor(city.avg_salary_lpa, MIN_SALARY, MAX_SALARY)
          const isHighlighted = highlightCityId === city.id
          const isHovered = hoveredCity?.id === city.id
          const size = 3.5 + (city.avg_salary_lpa / MAX_SALARY) * 4

          return (
            <g
              key={city.id}
              onClick={() => handleCityClick(city)}
              onMouseEnter={() => setHoveredCity(city)}
              onMouseLeave={() => setHoveredCity(null)}
              className="cursor-pointer"
            >
              {/* Pulse rings */}
              {(isHighlighted || (idx < 4)) && (
                <>
                  <circle cx={x} cy={y} r={size + 6} fill={color} opacity={0.15}>
                    <animate attributeName="r" values={`${size + 4};${size + 14};${size + 4}`} dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.15;0;0.15" dur="3s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={x} cy={y} r={size + 3} fill={color} opacity={0.25}>
                    <animate attributeName="r" values={`${size + 2};${size + 8};${size + 2}`} dur="3s" repeatCount="indefinite" begin="0.5s" />
                    <animate attributeName="opacity" values="0.25;0;0.25" dur="3s" repeatCount="indefinite" begin="0.5s" />
                  </circle>
                </>
              )}

              {/* Main dot */}
              <circle
                cx={x}
                cy={y}
                r={isHovered ? size + 2 : size}
                fill={color}
                stroke={isHovered ? 'white' : 'rgba(255,255,255,0.5)'}
                strokeWidth={isHovered ? 2 : 1}
                style={{ transition: 'all 0.2s ease', filter: `drop-shadow(0 0 ${size * 2}px ${color})` }}
              />

              {/* City label */}
              {(city.avg_salary_lpa > 25 || isHovered) && (
                <text
                  x={x}
                  y={y - size - 6}
                  textAnchor="middle"
                  fontSize="9"
                  fontFamily="JetBrains Mono"
                  letterSpacing="0.08em"
                  fill={isHovered ? '#e1e2e8' : 'rgba(225,226,232,0.6)'}
                  fontWeight={isHovered ? '700' : '500'}
                >
                  {city.name.toUpperCase()}
                </text>
              )}

              {/* Salary badge on hover */}
              {isHovered && (
                <g>
                  <rect
                    x={x - 28}
                    y={y + size + 4}
                    width="56"
                    height="16"
                    rx="3"
                    fill="rgba(15,17,19,0.95)"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="0.5"
                  />
                  <text
                    x={x}
                    y={y + size + 15}
                    textAnchor="middle"
                    fontSize="9"
                    fontFamily="JetBrains Mono"
                    fontWeight="600"
                    fill={color}
                    letterSpacing="0.05em"
                  >
                    {formatLPA(city.avg_salary_lpa)} AVG
                  </text>
                </g>
              )}
            </g>
          )
        })}
      </svg>

      {/* Legend */}
      {!compact && (
        <div className="absolute bottom-4 right-4 glass-card p-3 flex flex-col gap-2">
          <span className="font-mono text-[9px] text-on-surface-variant tracking-widest">SALARY RANGE</span>
          <div className="flex items-center gap-2">
            <div
              className="w-20 h-2 rounded-full"
              style={{ background: 'linear-gradient(to right, rgb(80,91,147), rgb(179,183,255), rgb(154,210,195))' }}
            />
          </div>
          <div className="flex justify-between font-mono text-[9px] text-on-surface-variant">
            <span>{formatLPA(MIN_SALARY)}</span>
            <span>{formatLPA(MAX_SALARY)}</span>
          </div>
        </div>
      )}
    </div>
  )
}
