import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navbar } from './components/layout/Navbar'
import { CommandPalette } from './components/layout/CommandPalette'
import { AuthModal } from './features/auth/AuthModal'
import { HomePage } from './pages/HomePage'
import { CompaniesPage } from './pages/CompaniesPage'
import { CompanyPage } from './pages/CompanyPage'
import { CitiesPage } from './pages/CitiesPage'
import { CityPage } from './pages/CityPage'
import { RolesPage, RolePage } from './pages/RolesPage'
import { ContributePage } from './pages/ContributePage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
    },
  },
})

function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Navbar />
      <CommandPalette />
      <AuthModal />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/companies/:slug" element={<CompanyPage />} />
          <Route path="/cities" element={<CitiesPage />} />
          <Route path="/cities/:slug" element={<CityPage />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/roles/:slug" element={<RolePage />} />
          <Route path="/contribute" element={<ContributePage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
