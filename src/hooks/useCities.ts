import { useQuery } from '@tanstack/react-query'
import { getCities, getCityBySlug } from '@/services/citiesService'
import { getOfficeAreas } from '@/services/officeAreasService'
import { queryKeys } from '@/constants/queryKeys'

export function useCities() {
  return useQuery({
    queryKey: queryKeys.cities,
    queryFn: getCities,
  })
}

export function useCity(slug: string) {
  return useQuery({
    queryKey: queryKeys.cityBySlug(slug),
    queryFn: () => getCityBySlug(slug),
    enabled: !!slug,
  })
}

export function useOfficeAreas() {
  return useQuery({
    queryKey: queryKeys.officeAreas,
    queryFn: getOfficeAreas,
  })
}
