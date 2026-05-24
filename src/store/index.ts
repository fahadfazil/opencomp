import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, SalaryFilters, ContributionFormData } from '@/types'

// ============================================================
// Auth Store
// ============================================================
interface AuthState {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'opencomp-auth',
      partialize: (state) => ({ user: state.user }),
    }
  )
)

// ============================================================
// UI Store
// ============================================================
export type FooterModalKey = 'about' | 'privacy' | 'open-data' | 'api' | null

interface UIState {
  commandPaletteOpen: boolean
  authModalOpen: boolean
  contributeModalOpen: boolean
  footerModal: FooterModalKey
  sidebarCollapsed: boolean
  mapStyle: 'dark' | 'satellite' | 'terrain'
  toggleCommandPalette: () => void
  setAuthModalOpen: (open: boolean) => void
  setContributeModalOpen: (open: boolean) => void
  setFooterModal: (modal: FooterModalKey) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setMapStyle: (style: UIState['mapStyle']) => void
}

export const useUIStore = create<UIState>((set) => ({
  commandPaletteOpen: false,
  authModalOpen: false,
  contributeModalOpen: false,
  footerModal: null,
  sidebarCollapsed: false,
  mapStyle: 'dark',
  toggleCommandPalette: () =>
    set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
  setAuthModalOpen: (open) => set({ authModalOpen: open }),
  setContributeModalOpen: (open) => set({ contributeModalOpen: open }),
  setFooterModal: (modal) => set({ footerModal: modal }),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setMapStyle: (mapStyle) => set({ mapStyle }),
}))

// ============================================================
// Filter Store
// ============================================================
interface FilterState {
  filters: SalaryFilters
  searchQuery: string
  setFilters: (filters: Partial<SalaryFilters>) => void
  setSearchQuery: (query: string) => void
  clearFilters: () => void
}

export const useFilterStore = create<FilterState>((set) => ({
  filters: {},
  searchQuery: '',
  setFilters: (newFilters) =>
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  clearFilters: () => set({ filters: {}, searchQuery: '' }),
}))

// ============================================================
// Contribution Store
// ============================================================
interface ContributionState {
  formData: ContributionFormData
  updateFormData: (data: Partial<ContributionFormData>) => void
  nextStep: () => void
  prevStep: () => void
  resetForm: () => void
}

const initialFormData: ContributionFormData = {
  step: 1,
  company_id: null,
  company_name: '',
  role_id: null,
  role_title: '',
  city_id: null,
  base_salary_lpa: null,
  total_comp_lpa: null,
  equity_lpa: null,
  bonus_lpa: null,
  experience_years: null,
  work_mode: null,
  education: null,
  gender: null,
  wlb_rating: null,
  manager_rating: null,
  culture_rating: null,
  growth_rating: null,
  review_text: null,
  pros: null,
  cons: null,
}

export const useContributionStore = create<ContributionState>()(
  persist(
    (set) => ({
      formData: initialFormData,
      updateFormData: (data) =>
        set((state) => ({ formData: { ...state.formData, ...data } })),
      nextStep: () =>
        set((state) => ({
          formData: { ...state.formData, step: state.formData.step + 1 },
        })),
      prevStep: () =>
        set((state) => ({
          formData: { ...state.formData, step: Math.max(1, state.formData.step - 1) },
        })),
      resetForm: () => set({ formData: initialFormData }),
    }),
    {
      name: 'opencomp-contribution',
    }
  )
)
