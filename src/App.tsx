import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { AppLayout } from '@/layouts/AppLayout'
import { useAuthSession } from '@/hooks'
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
    },
  },
})

function SessionBootstrap() {
  useAuthSession()
  return <AppLayout />
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <GoogleAnalytics />
        <SessionBootstrap />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
