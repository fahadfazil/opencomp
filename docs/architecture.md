# OpenComp Architecture

## Frontend Layers

```text
src/
  components/    # reusable UI and map/chart components
  constants/     # query keys, map config, design token constants
  features/      # feature-specific modules (auth)
  hooks/         # app hooks and React Query hooks
  layouts/       # shared route/page layout composition
  pages/         # route-level pages
  services/      # Supabase-backed data/auth/contribution services
  store/         # Zustand UI/auth/form state
  styles/        # global and theme styles
  types/         # domain and DTO types
  utils/         # formatting, scoring, helpers
```

## Data Flow
1. Pages consume hooks from `src/hooks`.
2. Hooks call typed service functions in `src/services`.
3. Services query Supabase and provide resilient fallback behavior where needed.
4. TanStack Query handles caching/invalidation and async status.

## Auth Flow
- OAuth providers: Google, GitHub, LinkedIn (via Supabase provider mapping).
- `useAuthSession` hydrates and syncs auth session into Zustand.
- Contribution route requires authenticated user state.

## Map Layer
- Interactive India map uses Mapbox GL (`mapbox-gl` + `react-map-gl`).
- City markers are rendered from data layer, with salary-intensity heat representation.

## Database
Schema file: `supabase/schema.sql`

Core analytical tables include:
- `salary_entries`
- `culture_reviews`
- `office_areas`
- `perks`
- `office_facilities`
- `workplace_scores`
- `area_intelligence`

RLS is enabled with public-read on non-sensitive intelligence data and authenticated inserts for contribution tables.
