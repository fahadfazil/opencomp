# OpenComp

OpenComp is an open-source workplace intelligence and salary transparency platform for India.

## Tech Stack
- React + Vite + TypeScript
- Tailwind CSS + Framer Motion
- React Router
- TanStack Query + Zustand
- Supabase (Auth + Postgres)
- Mapbox GL

## Local Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create env file:
   ```bash
   cp .env.example .env
   ```
3. Fill in `.env` values for Supabase and Mapbox.
4. Start dev server:
   ```bash
   npm run dev
   ```

## Build & Lint
```bash
npm run lint
npm run build
```

## Architecture
The frontend follows a modular structure:

```text
src/
  components/
  constants/
  features/
  hooks/
  layouts/
  pages/
  services/
  store/
  styles/
  types/
  utils/
```

- `services/`: Supabase-backed data and auth access layer
- `hooks/`: React Query hooks over services
- `layouts/`: route layout shells
- `constants/`: query keys, map constants, design token references

## Database
Schema is at:

```text
supabase/schema.sql
```

It includes tables for users, companies, cities, roles, salary entries, culture reviews, office areas, perks, office facilities, workplace scores, and area intelligence.
