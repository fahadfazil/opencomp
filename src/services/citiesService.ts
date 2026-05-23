import { supabase } from '@/lib/supabase'
import type { City } from '@/types'

function toCity(record: Record<string, unknown>): City {
  return {
    id: String(record.id ?? ''),
    name: String(record.name ?? ''),
    slug: String(record.slug ?? ''),
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

  if (error) {
    throw error
  }

  return (data ?? []).map((row) => toCity(row as Record<string, unknown>))
}

export async function getCityBySlug(slug: string): Promise<City | null> {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data ? toCity(data as Record<string, unknown>) : null
}
