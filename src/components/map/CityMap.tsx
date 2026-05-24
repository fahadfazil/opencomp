import React, { useState } from 'react'
import { Map, Marker, NavigationControl, Popup } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import { INDIA_MAP_CENTER, INDIA_MAP_STYLE } from '@/constants/map'
import type { City, OfficeArea } from '@/types'
import { formatLPA, formatMonthlyRent, hasValidCoordinates } from '@/utils'

interface CityMapProps {
  city: City
  areas: OfficeArea[]
  height?: number
}

function getHeatColor(normalized: number): string {
  if (normalized >= 0.75) return '#9ad2c3'
  if (normalized >= 0.5) return '#cbd2ff'
  if (normalized >= 0.25) return '#b0b2ff'
  return '#505b93'
}

function getCityMapZoom(areaCount: number): number {
  if (areaCount > 1) return 11
  if (areaCount === 1) return 12
  return 10
}

function hasAreaSalary(area: OfficeArea): area is OfficeArea & { avg_salary_lpa: number } {
  return area.avg_salary_lpa !== null && area.avg_salary_lpa > 0
}

export function CityMap({ city, areas, height = 420 }: CityMapProps) {
  const [hoveredArea, setHoveredArea] = useState<OfficeArea | null>(null)
  const [mapHasError, setMapHasError] = useState(false)
  const token = import.meta.env.VITE_MAPBOX_TOKEN
  const validAreas = areas.filter((area) => hasValidCoordinates(area.latitude, area.longitude))
  const salaryAreas = validAreas.filter(hasAreaSalary)
  const hasSalaryData = salaryAreas.length > 0
  const metricValues = hasSalaryData
    ? salaryAreas.map((area) => area.avg_salary_lpa ?? 0)
    : validAreas.map((area) => area.office_density)
  const metricRange = {
    min: metricValues.length > 0 ? Math.min(...metricValues) : 0,
    max: metricValues.length > 0 ? Math.max(...metricValues) : 0,
  }
  const densityRange = {
    min: validAreas.length > 0 ? Math.min(...validAreas.map((area) => area.office_density)) : 0,
    max: validAreas.length > 0 ? Math.max(...validAreas.map((area) => area.office_density)) : 0,
  }
  const [indiaCenterLongitude, indiaCenterLatitude] = INDIA_MAP_CENTER
  const hasCityCoordinates = hasValidCoordinates(city.latitude, city.longitude)
  const mapCenter = hasCityCoordinates
    ? { latitude: city.latitude, longitude: city.longitude }
    : { latitude: indiaCenterLatitude, longitude: indiaCenterLongitude }

  if (!token) {
    return (
      <div
        className="w-full rounded-xl border border-outline-variant/50 bg-surface-container-lowest flex items-center justify-center p-6 text-center"
        style={{ height }}
      >
        <div>
          <p className="font-mono text-label-md text-primary mb-2">MAPBOX TOKEN REQUIRED</p>
          <p className="text-body-md text-on-surface-variant">
            Add VITE_MAPBOX_TOKEN in your environment to render the city map.
          </p>
        </div>
      </div>
    )
  }

  if (mapHasError) {
    return (
      <div
        className="w-full rounded-xl border border-outline-variant/50 bg-surface-container-lowest flex items-center justify-center p-6 text-center"
        style={{ height }}
      >
        <div>
          <p className="font-mono text-label-md text-primary mb-2">MAP TEMPORARILY UNAVAILABLE</p>
          <p className="text-body-md text-on-surface-variant">
            We couldn&apos;t render this city map right now. Please refresh or try again shortly.
          </p>
        </div>
      </div>
    )
  }

  const zoom = getCityMapZoom(validAreas.length)

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-white/5" style={{ height }}>
      <Map
        mapboxAccessToken={token}
        initialViewState={{
          longitude: mapCenter.longitude,
          latitude: mapCenter.latitude,
          zoom,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={INDIA_MAP_STYLE}
        keyboard
        dragRotate={false}
        touchPitch={false}
        onError={() => setMapHasError(true)}
      >
        <NavigationControl position="top-right" showCompass={false} />

        {/* City centre marker when no office areas are available */}
        {validAreas.length === 0 && hasCityCoordinates && (
          <Marker longitude={mapCenter.longitude} latitude={mapCenter.latitude}>
            <div className="relative cursor-default">
              <span
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
                style={{
                  width: '60px',
                  height: '60px',
                  background: '#9ad2c3',
                  opacity: 0.25,
                  filter: 'blur(10px)',
                }}
              />
              <span
                className="relative block rounded-full border-2 border-white/60"
                style={{
                  width: '12px',
                  height: '12px',
                  background: '#9ad2c3',
                  boxShadow: '0 0 14px #9ad2c3',
                }}
              />
            </div>
          </Marker>
        )}

        {/* Office area heatmap markers */}
        {validAreas.map(area => {
          const metricValue = hasSalaryData && hasAreaSalary(area)
            ? area.avg_salary_lpa
            : area.office_density
          const rawRange = metricRange.max - metricRange.min
          const normalized = rawRange <= 0
            ? 0.5
            : (metricValue - metricRange.min) / rawRange
          const densityRawRange = densityRange.max - densityRange.min
          const densityNormalized = densityRawRange <= 0
            ? 0.5
            : (area.office_density - densityRange.min) / densityRawRange
          const color = getHeatColor(densityNormalized)
          const dotSize = 6 + normalized * 10
          const heatSize = 26 + normalized * 42
          const isHovered = hoveredArea?.id === area.id

          return (
            <Marker key={area.id} longitude={area.longitude} latitude={area.latitude}>
              <button
                type="button"
                className="relative cursor-pointer"
                title={area.name}
                aria-label={
                  hasAreaSalary(area)
                    ? `${area.name} average salary ${formatLPA(area.avg_salary_lpa)}`
                    : `${area.name} office density ${area.office_density}%`
                }
                onClick={() => setHoveredArea(area)}
                onMouseEnter={() => setHoveredArea(area)}
                onMouseLeave={() => setHoveredArea(null)}
              >
                <span
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
                  style={{
                    width: `${heatSize}px`,
                    height: `${heatSize}px`,
                    background: color,
                    opacity: isHovered ? 0.28 : 0.18,
                    filter: 'blur(9px)',
                    transition: 'opacity 0.2s ease',
                  }}
                />
                <span
                  className="relative block rounded-full border border-white/60"
                  style={{
                    width: `${isHovered ? dotSize + 2 : dotSize}px`,
                    height: `${isHovered ? dotSize + 2 : dotSize}px`,
                    background: color,
                    boxShadow: `0 0 ${isHovered ? 14 : 10}px ${color}`,
                    transition: 'all 0.15s ease',
                  }}
                />
              </button>
            </Marker>
          )
        })}

        {/* Hover popup */}
        {hoveredArea && (
          <Popup
            longitude={hoveredArea.longitude}
            latitude={hoveredArea.latitude}
            closeButton={false}
            closeOnClick={false}
            anchor="bottom"
            offset={20}
          >
            <div
              style={{
                background: '#1a1d21',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                padding: '12px',
                minWidth: '172px',
                fontFamily: 'var(--font-sans)',
              }}
            >
              <div style={{ fontWeight: 600, fontSize: '13px', color: '#e6e1e8', marginBottom: '8px' }}>
                {hoveredArea.name}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', rowGap: '4px', columnGap: '12px' }}>
                {[
                  hasAreaSalary(hoveredArea)
                    ? { label: 'AVG SALARY', value: formatLPA(hoveredArea.avg_salary_lpa), color: '#9ad2c3' }
                    : { label: 'DENSITY', value: `${hoveredArea.office_density}%`, color: '#9ad2c3' },
                  { label: 'SAFETY', value: `${hoveredArea.safety_score}/100`, color: '#cbd2ff' },
                  { label: 'COMMUTE', value: `${hoveredArea.commute_score}/100`, color: '#b0b2ff' },
                  { label: 'FOOD', value: `${hoveredArea.food_score}/100`, color: '#d1d0ff' },
                  { label: '1 BHK', value: formatMonthlyRent(hoveredArea.avg_rent_1bhk), color: '#c6c5d1' },
                ].map(({ label, value, color }) => (
                  <React.Fragment key={label}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#90909a' }}>
                      {label}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color, textAlign: 'right' }}>
                      {value}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </Popup>
        )}
      </Map>

      {/* Density legend */}
      <div
        className="absolute bottom-4 left-4 glass-card p-3 pointer-events-none"
        style={{ zIndex: 1 }}
      >
        <span className="font-mono text-[9px] text-on-surface-variant tracking-widest block mb-1.5">
          OFFICE DENSITY
        </span>
        <div
          className="w-20 h-2 rounded-full"
          style={{ background: 'linear-gradient(to right, #505b93, #cbd2ff, #9ad2c3)' }}
        />
        <div className="flex justify-between font-mono text-[9px] text-on-surface-variant mt-1">
          <span>{Math.round(densityRange.min)}%</span>
          <span>{Math.round(densityRange.max)}%</span>
        </div>
      </div>
    </div>
  )
}
