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
    { data: citySalaryRows, error: citySalaryError },
    { data: roleGrowthRows, error: roleGrowthError },
  ] = await Promise.all([
    supabase.from('companies').select('*', { count: 'exact', head: true }),
    supabase.from('cities').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('salary_entries').select('*', { count: 'exact', head: true }),
    supabase.from('cities').select('avg_salary_lpa'),
    supabase.from('roles').select('yoy_growth_pct'),
  ])

  const queryErrors = [
    companiesError,
    citiesError,
    contributorsError,
    salaryEntriesError,
    citySalaryError,
    roleGrowthError,
  ].filter((error): error is NonNullable<typeof error> => error !== null)

  if (queryErrors.length > 0) {
    throw new Error(queryErrors.map((error) => error.message).join('; '))
  }

  const citySalaries = (citySalaryRows ?? [])
    .map((row) => Number(row.avg_salary_lpa ?? 0))
    .filter((value) => value > 0)
  const roleGrowthRates = (roleGrowthRows ?? [])
    .map((row) => Number(row.yoy_growth_pct ?? 0))
    .filter((value) => value > 0)

  const avgSalaryIndia = citySalaries.length > 0
    ? Number((citySalaries.reduce((sum, value) => sum + value, 0) / citySalaries.length).toFixed(1))
    : 0
  const yoySalaryGrowth = roleGrowthRates.length > 0
    ? Number((roleGrowthRates.reduce((sum, value) => sum + value, 0) / roleGrowthRates.length).toFixed(1))
    : 0

  return {
    total_contributors: contributorsCount ?? 0,
    total_data_points: salaryEntriesCount ?? 0,
    companies_tracked: companiesCount ?? 0,
    cities_covered: citiesCount ?? 0,
    avg_salary_india: avgSalaryIndia,
    yoy_salary_growth: yoySalaryGrowth,
  }
}
