import { supabase } from '@/lib/supabase'
import type { Company } from '@/types'

export async function getCompanies(): Promise<Company[]> {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .order('opencomp_score', { ascending: false })

  if (error) {
    throw error
  }

  return (data ?? []) as Company[]
}

export async function getCompanyBySlug(slug: string): Promise<Company | null> {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (error) {
    throw error
  }

  return (data as Company | null) ?? null
}
