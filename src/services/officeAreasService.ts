import { supabase } from '@/lib/supabase'
import type { OfficeArea } from '@/types'

export async function getOfficeAreas(): Promise<OfficeArea[]> {
  const { data, error } = await supabase
    .from('office_areas')
    .select('*')

  if (error) {
    throw error
  }

  return (data ?? []) as OfficeArea[]
}
