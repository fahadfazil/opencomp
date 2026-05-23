import { supabase } from '@/lib/supabase'
import { MOCK_GLOBAL_STATS } from '@/data/mockData'
import type { GlobalStats } from '@/types'

export async function getGlobalStats(): Promise<GlobalStats> {
  const [
    { count: companiesCount },
    { count: citiesCount },
    { count: contributorsCount },
    { count: salaryEntriesCount },
  ] = await Promise.all([
    supabase.from('companies').select('*', { count: 'exact', head: true }),
    supabase.from('cities').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('salary_entries').select('*', { count: 'exact', head: true }),
  ])

  if (!companiesCount || !citiesCount || !contributorsCount || !salaryEntriesCount) {
    return MOCK_GLOBAL_STATS
  }

  return {
    total_contributors: contributorsCount,
    total_data_points: salaryEntriesCount,
    companies_tracked: companiesCount,
    cities_covered: citiesCount,
    avg_salary_india: MOCK_GLOBAL_STATS.avg_salary_india,
    yoy_salary_growth: MOCK_GLOBAL_STATS.yoy_salary_growth,
  }
}
