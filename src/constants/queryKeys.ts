export const queryKeys = {
  content: (key: string) => ['content', key] as const,
  globalStats: ['global-stats'] as const,
  companies: ['companies'] as const,
  companyBySlug: (slug: string) => ['company', slug] as const,
  cities: ['cities'] as const,
  cityBySlug: (slug: string) => ['city', slug] as const,
  roles: ['roles'] as const,
  roleBySlug: (slug: string) => ['role', slug] as const,
  officeAreas: ['office-areas'] as const,
}
