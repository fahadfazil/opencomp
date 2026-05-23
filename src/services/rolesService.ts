import { supabase } from '@/lib/supabase'
import { MOCK_ROLES } from '@/data/mockData'
import type { Role } from '@/types'

export async function getRoles(): Promise<Role[]> {
  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .order('avg_salary_lpa', { ascending: false })

  if (error || !data || data.length === 0) {
    return MOCK_ROLES
  }

  return data as Role[]
}

export async function getRoleBySlug(slug: string): Promise<Role | null> {
  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (error || !data) {
    return MOCK_ROLES.find((role) => role.slug === slug) ?? null
  }

  return data as Role
}
