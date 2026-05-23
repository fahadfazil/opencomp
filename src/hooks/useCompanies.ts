import { useQuery } from '@tanstack/react-query'
import { getCompanies, getCompanyBySlug } from '@/services/companiesService'
import { queryKeys } from '@/constants/queryKeys'

export function useCompanies() {
  return useQuery({
    queryKey: queryKeys.companies,
    queryFn: getCompanies,
  })
}

export function useCompany(slug: string) {
  return useQuery({
    queryKey: queryKeys.companyBySlug(slug),
    queryFn: () => getCompanyBySlug(slug),
    enabled: !!slug,
  })
}
