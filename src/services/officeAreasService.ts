import { supabase } from '@/lib/supabase'
import { MOCK_OFFICE_AREAS } from '@/data/mockData'
import type { OfficeArea } from '@/types'

export async function getOfficeAreas(): Promise<OfficeArea[]> {
  const { data, error } = await supabase
    .from('office_areas')
    .select('*')

  if (error || !data || data.length === 0) {
    return MOCK_OFFICE_AREAS
  }

  return data as OfficeArea[]
}
