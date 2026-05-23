import { supabase } from '@/lib/supabase'
import type {
  CityPageContent,
  CompanyPageContent,
  HomeContent,
  RolePageContent,
  SupplementalGlobalStats,
} from '@/types'

async function getContent<T>(key: string): Promise<T | null> {
  const { data, error } = await supabase
    .from('app_content')
    .select('value')
    .eq('key', key)
    .maybeSingle()

  if (error) {
    console.warn(`Unable to load Supabase app content for key "${key}"`, error)
    return null
  }

  if (!data) {
    console.warn(`Supabase app content key "${key}" was not found`)
    return null
  }

  return data.value as T
}

export function getHomeContent() {
  return getContent<HomeContent>('home')
}

export function getSupplementalGlobalStats() {
  return getContent<SupplementalGlobalStats>('global-stats')
}

export function getCompanyPageContent() {
  return getContent<CompanyPageContent>('company-page')
}

export function getCityPageContent() {
  return getContent<CityPageContent>('city-page')
}

export function getRolePageContent() {
  return getContent<RolePageContent>('role-page')
}
