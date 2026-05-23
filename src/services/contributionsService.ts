import { supabase } from '@/lib/supabase'
import type { ContributionFormData } from '@/types'

export async function submitContribution(form: ContributionFormData, userId: string) {
  const totalComp = (form.base_salary_lpa ?? 0) + (form.bonus_lpa ?? 0) + (form.equity_lpa ?? 0)

  const { error: salaryError } = await supabase.from('salary_entries').insert({
    user_id: userId,
    company_id: form.company_id,
    city_id: form.city_id,
    role_id: form.role_id,
    base_salary_lpa: form.base_salary_lpa,
    total_comp_lpa: totalComp,
    equity_lpa: form.equity_lpa,
    bonus_lpa: form.bonus_lpa,
    experience_years: form.experience_years,
    work_mode: form.work_mode,
    education: form.education,
    gender: form.gender,
  })

  if (salaryError) {
    throw salaryError
  }

  if (form.company_id) {
    const { error: cultureError } = await supabase.from('culture_reviews').insert({
      user_id: userId,
      company_id: form.company_id,
      wlb_rating: form.wlb_rating,
      manager_rating: form.manager_rating,
      culture_rating: form.culture_rating,
      growth_rating: form.growth_rating,
      pros: form.pros,
      cons: form.cons,
      is_current_employee: true,
    })

    if (cultureError) {
      throw cultureError
    }
  }
}
