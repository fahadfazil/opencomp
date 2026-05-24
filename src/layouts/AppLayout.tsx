import { Routes, Route } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { CommandPalette } from '@/components/layout/CommandPalette'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SeoMeta } from '@/components/seo/SeoMeta'
import { AuthModal } from '@/features/auth/AuthModal'
import { FooterModal } from '@/features/footer/FooterModal'
import { HomePage } from '@/pages/HomePage'
import { CompaniesPage } from '@/pages/CompaniesPage'
import { CompanyPage } from '@/pages/CompanyPage'
import { CitiesPage } from '@/pages/CitiesPage'
import { CityPage } from '@/pages/CityPage'
import { RolesPage, RolePage } from '@/pages/RolesPage'
import { ContributePage } from '@/pages/ContributePage'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <SeoMeta />
      <Navbar />
      <CommandPalette />
      <AuthModal />
      <FooterModal />
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
      <SiteFooter />
    </div>
  )
}
