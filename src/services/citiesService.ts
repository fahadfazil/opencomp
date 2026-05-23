import { supabase } from '@/lib/supabase'
import { MOCK_CITIES } from '@/data/mockData'
import type { City } from '@/types'
import { generateSlug } from '@/utils'

function toCity(record: Record<string, unknown>): City {
  const name = String(record.name ?? '')
  return {
    id: String(record.id ?? ''),
    name,
    slug: String(record.slug ?? generateSlug(name)),
    state: String(record.state ?? ''),
    latitude: Number(record.latitude ?? 0),
    longitude: Number(record.longitude ?? 0),
    avg_salary_lpa: Number(record.avg_salary_lpa ?? 0),
    tech_hub_rank: (record.tech_hub_rank as number | null | undefined) ?? null,
    cost_of_living_index: Number(record.cost_of_living_index ?? 50),
    metro_available: Boolean(record.metro_available),
    total_entries: Number(record.total_entries ?? 0),
    created_at: String(record.created_at ?? new Date().toISOString()),
  }
}

export async function getCities(): Promise<City[]> {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .order('avg_salary_lpa', { ascending: false })

  if (error || !data || data.length === 0) {
    return MOCK_CITIES
  }

  return data.map((row) => toCity(row as Record<string, unknown>))
}

export async function getCityBySlug(slug: string): Promise<City | null> {
  const cities = await getCities()
  return cities.find((city) => city.slug === slug) ?? null
}
