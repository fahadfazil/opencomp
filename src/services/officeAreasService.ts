import { supabase } from '@/lib/supabase'
import type { OfficeArea } from '@/types'

function toOfficeArea(record: Record<string, unknown>): OfficeArea {
  return {
    id: String(record.id ?? ''),
    city_id: String(record.city_id ?? ''),
    name: String(record.name ?? ''),
    avg_salary_lpa: record.avg_salary_lpa === null || record.avg_salary_lpa === undefined
      ? null
      : Number(record.avg_salary_lpa),
    avg_rent_1bhk: Number(record.avg_rent_1bhk ?? 0),
    avg_rent_2bhk: Number(record.avg_rent_2bhk ?? 0),
    commute_score: Number(record.commute_score ?? 0),
    food_score: Number(record.food_score ?? 0),
    safety_score: Number(record.safety_score ?? 0),
    walkability_score: Number(record.walkability_score ?? 0),
    metro_distance_km: record.metro_distance_km === null || record.metro_distance_km === undefined
      ? null
      : Number(record.metro_distance_km),
    office_density: Number(record.office_density ?? 0),
    avg_aqi: Number(record.avg_aqi ?? 0),
    latitude: Number(record.latitude ?? 0),
    longitude: Number(record.longitude ?? 0),
  }
}

export async function getOfficeAreas(): Promise<OfficeArea[]> {
  const { data, error } = await supabase
    .from('office_areas')
    .select('*')

  if (error) {
    throw error
  }

  return (data ?? []).map((row) => toOfficeArea(row as Record<string, unknown>))
}
