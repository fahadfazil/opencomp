import { useQuery } from '@tanstack/react-query'
import { getRoles, getRoleBySlug } from '@/services/rolesService'
import { queryKeys } from '@/constants/queryKeys'

export function useRoles() {
  return useQuery({
    queryKey: queryKeys.roles,
    queryFn: getRoles,
  })
}

export function useRole(slug: string) {
  return useQuery({
    queryKey: queryKeys.roleBySlug(slug),
    queryFn: () => getRoleBySlug(slug),
    enabled: !!slug,
  })
}
