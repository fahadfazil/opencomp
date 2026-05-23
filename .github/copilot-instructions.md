## Project Overview

OpenComp is an open-source workplace intelligence and salary transparency platform focused on anonymous, community-owned compensation and workplace culture data across India.

The platform combines:
- salary intelligence
- workplace culture analytics
- geographic workplace insights
- office-area intelligence
- compensation benchmarking
- interactive map analytics

The product should feel like:
> “A modern open-source Bloomberg Terminal for workplace intelligence.”

---

# Design Files

The official UI/UX reference files and design assets are available in:

```text
/docs/design
```

This directory contains:
- Google Stitch exports
- branding assets
- layout references
- UI prototypes
- interaction references
- design inspiration
- spacing and visual hierarchy references

All frontend implementation must closely follow the design language and interaction patterns defined in `/docs/design`.

When extending the UI:
- maintain visual consistency
- reuse existing patterns
- preserve spacing rhythm
- follow typography scale
- preserve glassmorphism styling
- match animation behavior
- maintain component hierarchy

Do not introduce conflicting design systems or inconsistent styling patterns.

The production implementation should feel like a polished and scalable evolution of the provided design files.

---

# Core Product Principles

## Open Source First
- Prioritize transparency
- Keep architecture modular and understandable
- Prefer explicit logic over “magic”
- Document important systems clearly
- Avoid vendor lock-in where possible

## Privacy First
- Public browsing requires no login
- Users authenticate only to contribute
- Never expose contributor identities publicly
- Avoid invasive tracking
- No ads
- No dark patterns

## Community Owned
- Community-generated workplace intelligence
- Transparent scoring systems
- Explainable analytics
- Open contribution model

---

# Tech Stack

## Frontend
- React
- Vite
- TypeScript
- Tailwind CSS
- Framer Motion
- React Router
- TanStack Query
- Zustand
- Recharts
- Mapbox GL
- Lucide React

## Backend
- Supabase
- PostgreSQL
- Supabase Auth
- Row Level Security
- Supabase Edge Functions

---

# UI / UX Direction

## Design Inspiration
- Linear
- Stripe
- Vercel
- Arc Browser
- Bloomberg Terminal

## Design Principles
- Dark mode first
- Glassmorphism panels
- Map-first experience
- Minimal but data-rich
- Smooth micro-interactions
- Large typography
- Clean spacing
- Floating analytics widgets
- High information density without clutter

## Avoid
- Bootstrap aesthetics
- HR portal styling
- Generic admin dashboards
- Emoji-heavy UI
- Overly colorful layouts
- Excessive gradients
- Skeuomorphic design

---

# Branding

## Brand Name
OpenComp

## Core Messaging
- Open-source workplace intelligence
- Community-owned salary transparency
- Anonymous workplace insights
- Open workplace data for everyone

## Brand Personality
- Trustworthy
- Analytical
- Futuristic
- Community-driven
- Transparent

---

# Architecture Guidelines

## Folder Structure

```text
/src
  /components
  /features
  /pages
  /layouts
  /hooks
  /store
  /services
  /lib
  /utils
  /types
  /styles
  /constants
```

## Rules
- Keep components small and reusable
- Prefer composition over inheritance
- Avoid prop drilling
- Use typed interfaces everywhere
- Separate UI logic from business logic
- Keep API logic isolated in services
- Use feature-oriented organization where appropriate

---

# State Management

## Use Zustand For
- UI state
- modal state
- filters
- map state
- temporary submission state

## Use TanStack Query For
- server state
- caching
- async fetching
- optimistic updates
- pagination
- invalidation

Avoid storing server data in Zustand unless necessary.

---

# Styling Guidelines

## Use
- Tailwind utility classes
- reusable utility patterns
- design tokens
- consistent spacing scale
- responsive layouts
- subtle animations

---

# Map System

The map is the centerpiece of OpenComp.

## Required Features
- Interactive India map
- Salary heatmaps
- Office density overlays
- Clustered markers
- Area intelligence layers
- Animated transitions
- Floating analytics cards

---

# OpenComp Score

## Formula

```text
z = (salary - mean_salary) / standard_deviation
```

Normalize:
- 0–100 scale

## Comparison Dimensions
- city
- role
- experience range
- company type
- work mode

---

# Database Guidelines

## Core Tables
- users
- companies
- cities
- office_areas
- roles
- salary_entries
- culture_reviews
- perks
- office_facilities
- workplace_scores
- area_intelligence

---

# Authentication

## Supported Providers
- Google
- GitHub
- LinkedIn

## Rules
- Public browsing requires no login
- Contribution requires auth
- Never expose user identity publicly

---

# Final Product Experience

The final product should feel:
- premium
- futuristic
- trustworthy
- map-native
- analytics-focused
- community-driven
- highly polished

It should feel like:
> “The open-source operating system for workplace intelligence.”
