import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/constants/queryKeys'
import {
  getCityPageContent,
  getCompanyPageContent,
  getHomeContent,
  getRolePageContent,
  getSupplementalGlobalStats,
} from '@/services/contentService'

export function useHomeContent() {
  return useQuery({
    queryKey: queryKeys.content('home'),
    queryFn: getHomeContent,
  })
}

export function useSupplementalGlobalStats() {
  return useQuery({
    queryKey: queryKeys.content('global-stats'),
    queryFn: getSupplementalGlobalStats,
  })
}

export function useCompanyPageContent() {
  return useQuery({
    queryKey: queryKeys.content('company-page'),
    queryFn: getCompanyPageContent,
  })
}

export function useCityPageContent() {
  return useQuery({
    queryKey: queryKeys.content('city-page'),
    queryFn: getCityPageContent,
  })
}

export function useRolePageContent() {
  return useQuery({
    queryKey: queryKeys.content('role-page'),
    queryFn: getRolePageContent,
  })
}
