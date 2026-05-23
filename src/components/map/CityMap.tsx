import React, { useState } from 'react'
import { Map, Marker, NavigationControl, Popup } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import { INDIA_MAP_STYLE } from '@/constants/map'
import type { City, OfficeArea } from '@/types'

interface CityMapProps {
  city: City
  areas: OfficeArea[]
  height?: number
}

function getDensityColor(density: number): string {
  if (density >= 80) return '#9ad2c3'
  if (density >= 60) return '#cbd2ff'
  if (density >= 40) return '#b0b2ff'
  return '#505b93'
}

export function CityMap({ city, areas, height = 420 }: CityMapProps) {
  const [hoveredArea, setHoveredArea] = useState<OfficeArea | null>(null)
  const token = import.meta.env.VITE_MAPBOX_TOKEN

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

  const zoom = areas.length > 1 ? 11 : areas.length === 1 ? 12 : 10

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-white/5" style={{ height }}>
      <Map
        mapboxAccessToken={token}
        initialViewState={{
          longitude: city.longitude,
          latitude: city.latitude,
          zoom,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={INDIA_MAP_STYLE}
        keyboard
        dragRotate={false}
        touchPitch={false}
      >
        <NavigationControl position="top-right" showCompass={false} />

        {/* City centre marker when no office areas are available */}
        {areas.length === 0 && (
          <Marker longitude={city.longitude} latitude={city.latitude}>
            <div className="relative cursor-default">
              <span
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
                style={{
                  width: '80px',
                  height: '80px',
                  background: '#9ad2c3',
                  opacity: 0.25,
                  filter: 'blur(14px)',
                }}
              />
              <span
                className="relative block rounded-full border-2 border-white/60"
                style={{
                  width: '16px',
                  height: '16px',
                  background: '#9ad2c3',
                  boxShadow: '0 0 24px #9ad2c3',
                }}
              />
            </div>
          </Marker>
        )}

        {/* Office area heatmap markers */}
        {areas.map(area => {
          const color = getDensityColor(area.office_density)
          const dotSize = 8 + (area.office_density / 100) * 14
          const heatSize = 36 + (area.office_density / 100) * 56
          const isHovered = hoveredArea?.id === area.id

          return (
            <Marker key={area.id} longitude={area.longitude} latitude={area.latitude}>
              <button
                type="button"
                className="relative cursor-pointer"
                title={area.name}
                onMouseEnter={() => setHoveredArea(area)}
                onMouseLeave={() => setHoveredArea(null)}
              >
                <span
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
                  style={{
                    width: `${heatSize}px`,
                    height: `${heatSize}px`,
                    background: color,
                    opacity: isHovered ? 0.35 : 0.22,
                    filter: 'blur(12px)',
                    transition: 'opacity 0.2s ease',
                  }}
                />
                <span
                  className="relative block rounded-full border border-white/60"
                  style={{
                    width: `${isHovered ? dotSize + 3 : dotSize}px`,
                    height: `${isHovered ? dotSize + 3 : dotSize}px`,
                    background: color,
                    boxShadow: `0 0 ${isHovered ? 24 : 16}px ${color}`,
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
                  { label: 'DENSITY', value: `${hoveredArea.office_density}%`, color: '#9ad2c3' },
                  { label: 'SAFETY', value: `${hoveredArea.safety_score}/100`, color: '#cbd2ff' },
                  { label: 'COMMUTE', value: `${hoveredArea.commute_score}/100`, color: '#b0b2ff' },
                  { label: 'FOOD', value: `${hoveredArea.food_score}/100`, color: '#d1d0ff' },
                  { label: '1 BHK', value: `₹${Math.round(hoveredArea.avg_rent_1bhk / 1000)}k/mo`, color: '#c6c5d1' },
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
          <span>LOW</span>
          <span>HIGH</span>
        </div>
      </div>
    </div>
  )
}
