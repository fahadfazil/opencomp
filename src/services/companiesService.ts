import { supabase } from '@/lib/supabase'
import { MOCK_COMPANIES } from '@/data/mockData'
import type { Company } from '@/types'

export async function getCompanies(): Promise<Company[]> {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .order('opencomp_score', { ascending: false })

  if (error || !data || data.length === 0) {
    return MOCK_COMPANIES
  }

  return data as Company[]
}

export async function getCompanyBySlug(slug: string): Promise<Company | null> {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (error || !data) {
    return MOCK_COMPANIES.find((company) => company.slug === slug) ?? null
  }

  return data as Company
}
