import { supabase } from '@/lib/supabase'
import { getSupplementalGlobalStats } from '@/services/contentService'
import type { GlobalStats } from '@/types'

export async function getGlobalStats(): Promise<GlobalStats> {
  const supplementalStats = await getSupplementalGlobalStats()

  if (supplementalStats) {
    return supplementalStats
  }

  const [
    { count: companiesCount, error: companiesError },
    { count: citiesCount, error: citiesError },
    { count: contributorsCount, error: contributorsError },
    { count: salaryEntriesCount, error: salaryEntriesError },
  ] = await Promise.all([
    supabase.from('companies').select('*', { count: 'exact', head: true }),
    supabase.from('cities').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('salary_entries').select('*', { count: 'exact', head: true }),
  ])

  const queryError = companiesError || citiesError || contributorsError || salaryEntriesError

  if (queryError) {
    throw queryError
  }

  return {
    total_contributors: contributorsCount ?? 0,
    total_data_points: salaryEntriesCount ?? 0,
    companies_tracked: companiesCount ?? 0,
    cities_covered: citiesCount ?? 0,
    avg_salary_india: 0,
    yoy_salary_growth: 0,
  }
}
