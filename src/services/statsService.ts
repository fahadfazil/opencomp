import { supabase } from '@/lib/supabase'
import { getSupplementalGlobalStats } from '@/services/contentService'
import type { GlobalStats } from '@/types'

export async function getGlobalStats(): Promise<GlobalStats> {
  const supplementalStats = await getSupplementalGlobalStats()

  if (supplementalStats) {
    return supplementalStats
  }

  const [
    companiesResult,
    citiesResult,
    contributorsResult,
    salaryEntriesResult,
    citySalaryResult,
    roleGrowthResult,
  ] = await Promise.all([
    supabase.from('companies').select('*', { count: 'exact', head: true }),
    supabase.from('cities').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('salary_entries').select('*', { count: 'exact', head: true }),
    supabase.from('cities').select('avg_salary_lpa'),
    supabase.from('roles').select('yoy_growth_pct'),
  ])

  const queryErrors = [
    ['companies count', companiesResult.error],
    ['cities count', citiesResult.error],
    ['contributors count', contributorsResult.error],
    ['salary entries count', salaryEntriesResult.error],
    ['city salary averages', citySalaryResult.error],
    ['role growth rates', roleGrowthResult.error],
  ].filter((entry): entry is [string, NonNullable<(typeof entry)[1]>] => entry[1] !== null)

  if (queryErrors.length > 0) {
    throw new Error(
      queryErrors
        .map(([label, error]) => `${label}: ${typeof error === 'string' ? error : error.message}`)
        .join('; ')
    )
  }

  const citySalaries = (citySalaryResult.data ?? [])
    .map((row) => Number(row.avg_salary_lpa ?? 0))
    .filter((value) => value > 0)
  const roleGrowthRates = (roleGrowthResult.data ?? [])
    .map((row) => Number(row.yoy_growth_pct ?? 0))
    .filter((value) => value > 0)

  const avgSalaryIndia = citySalaries.length > 0
    ? Number((citySalaries.reduce((sum, value) => sum + value, 0) / citySalaries.length).toFixed(1))
    : 0
  const yoySalaryGrowth = roleGrowthRates.length > 0
    ? Number((roleGrowthRates.reduce((sum, value) => sum + value, 0) / roleGrowthRates.length).toFixed(1))
    : 0

  return {
    total_contributors: contributorsResult.count ?? 0,
    total_data_points: salaryEntriesResult.count ?? 0,
    companies_tracked: companiesResult.count ?? 0,
    cities_covered: citiesResult.count ?? 0,
    avg_salary_india: avgSalaryIndia,
    yoy_salary_growth: yoySalaryGrowth,
  }
}
