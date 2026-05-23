import { supabase } from '@/lib/supabase'
import type { Role } from '@/types'

export async function getRoles(): Promise<Role[]> {
  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .order('avg_salary_lpa', { ascending: false })

  if (error) {
    throw error
  }

  return (data ?? []) as Role[]
}

export async function getRoleBySlug(slug: string): Promise<Role | null> {
  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (error) {
    throw error
  }

  return (data as Role | null) ?? null
}
