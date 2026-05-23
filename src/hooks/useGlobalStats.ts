import { useQuery } from '@tanstack/react-query'
import { getGlobalStats } from '@/services/statsService'
import { queryKeys } from '@/constants/queryKeys'

export function useGlobalStats() {
  return useQuery({
    queryKey: queryKeys.globalStats,
    queryFn: getGlobalStats,
  })
}
