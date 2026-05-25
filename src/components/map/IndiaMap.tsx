import { useMemo, useState } from 'react'
import { Map, Marker, NavigationControl } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useNavigate } from 'react-router-dom'
import { formatLPA, hasValidCoordinates } from '@/utils'
import { useCities } from '@/hooks'
import { INDIA_MAP_CENTER, INDIA_MAP_STYLE, INDIA_MAP_ZOOM } from '@/constants/map'
import type { City } from '@/types'

interface IndiaMapProps {
  onCityClick?: (city: City) => void
  highlightCityId?: string
  compact?: boolean
}

function getHeatColor(score: number) {
  if (score >= 0.75) return '#9ad2c3'
  if (score >= 0.5) return '#cbd2ff'
  if (score >= 0.25) return '#b0b2ff'
  return '#505b93'
}

export function IndiaMap({ onCityClick, highlightCityId, compact = false }: IndiaMapProps) {
  const navigate = useNavigate()
  const { data: cities = [] } = useCities()
  const [mapHasError, setMapHasError] = useState(false)

  const validCities = useMemo(
    () => cities.filter((city) => hasValidCoordinates(city.latitude, city.longitude)),
    [cities]
  )

  const salaryRange = useMemo(() => {
    const values = validCities.map((city) => city.avg_salary_lpa)
    const min = Math.min(...values)
    const max = Math.max(...values)
    return {
      min: Number.isFinite(min) ? min : 0,
      max: Number.isFinite(max) ? max : 0,
    }
  }, [validCities])

  const handleCityClick = (city: City) => {
    if (onCityClick) {
      onCityClick(city)
      return
    }
    navigate(`/cities/${city.slug}`)
  }

  if (mapHasError) {
    return (
      <div className="w-full h-full rounded-xl border border-outline-variant/50 bg-surface-container-lowest flex items-center justify-center p-6 text-center">
        <div>
          <p className="font-mono text-label-md text-primary mb-2">MAP TEMPORARILY UNAVAILABLE</p>
          <p className="text-body-md text-on-surface-variant">
            We couldn&apos;t render the interactive map right now. Please refresh or try again shortly.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-white/5 isolate">
      <Map
        initialViewState={{
          longitude: INDIA_MAP_CENTER[0],
          latitude: INDIA_MAP_CENTER[1],
          zoom: INDIA_MAP_ZOOM,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={INDIA_MAP_STYLE}
        keyboard
        dragRotate={false}
        touchPitch={false}
        onError={() => setMapHasError(true)}
      >
        <NavigationControl position="top-right" showCompass={false} />

        {validCities.map((city) => {
          const rawRange = salaryRange.max - salaryRange.min
          const normalized = rawRange <= 0
            ? 0.5
            : (city.avg_salary_lpa - salaryRange.min) / rawRange
          const dotSize = 8 + normalized * 12
          const heatSize = 30 + normalized * 40
          const isHighlighted = city.id === highlightCityId
          const color = getHeatColor(normalized)

          return (
            <Marker key={`heat-${city.id}`} longitude={city.longitude} latitude={city.latitude}>
              <button
                type="button"
                onClick={() => handleCityClick(city)}
                className="relative cursor-pointer"
                title={`${city.name} • ${formatLPA(city.avg_salary_lpa)}`}
              >
                <span
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    width: `${heatSize}px`,
                    height: `${heatSize}px`,
                    background: color,
                    opacity: isHighlighted ? 0.35 : 0.2,
                    filter: 'blur(10px)',
                  }}
                />
                <span
                  className="relative block rounded-full border border-white/60"
                  style={{
                    width: `${isHighlighted ? dotSize + 4 : dotSize}px`,
                    height: `${isHighlighted ? dotSize + 4 : dotSize}px`,
                    background: color,
                    boxShadow: `0 0 20px ${color}`,
                  }}
                />
              </button>
            </Marker>
          )
        })}
      </Map>

      {!compact && (
        <div className="absolute bottom-4 right-4 glass-card p-3 flex flex-col gap-2 pointer-events-none">
          <span className="font-mono text-[9px] text-on-surface-variant tracking-widest">SALARY RANGE</span>
          <div className="w-20 h-2 rounded-full" style={{ background: 'linear-gradient(to right, #505b93, #cbd2ff, #9ad2c3)' }} />
          <div className="flex justify-between font-mono text-[9px] text-on-surface-variant">
            <span>{formatLPA(salaryRange.min)}</span>
            <span>{formatLPA(salaryRange.max)}</span>
          </div>
        </div>
      )}
    </div>
  )
}
