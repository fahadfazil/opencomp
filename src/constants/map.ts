import type { StyleSpecification } from 'maplibre-gl'

export const INDIA_MAP_CENTER: [number, number] = [78.9629, 22.5937]
export const INDIA_MAP_ZOOM = 3.8
export const INDIA_MAP_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    cartoDark: {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      ],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors © CARTO',
    },
  },
  layers: [
    {
      id: 'carto-dark-raster',
      type: 'raster',
      source: 'cartoDark',
      minzoom: 0,
      maxzoom: 19,
    },
  ],
}
