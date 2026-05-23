OpenComp Architecture & Implementation Plan

A complete production-grade multi-file React + Vite application with proper scalable architecture and actual working functionality.

This is NOT just a UI prototype.

Implement real features, real flows, reusable architecture, database integration, state management, authentication, analytics logic, and production-ready frontend behavior.

The output must include:
- package.json
- vite.config.ts
- tsconfig.json
- Tailwind configuration
- ESLint + Prettier setup
- React application structure
- reusable components
- pages
- layouts
- hooks
- utilities
- Supabase integration
- routing
- state management
- environment configuration
- reusable UI system
- charts/maps
- API abstractions
- database schema
- seed data
- README setup guide

Use:
- React
- Vite
- TypeScript
- Tailwind CSS
- Framer Motion
- React Router
- TanStack Query
- Zustand
- Supabase
- Mapbox GL
- Lucide React
- Recharts

Create actual source files and proper folder structure instead of a monolithic HTML prototype.

Expected structure example:

/src
/components
/features
/pages
/layouts
/hooks
/services
/store
/lib
/utils
/types
/styles
/constants

The app must be:
- production ready
- scalable
- modular
- responsive
- typed everywhere
- maintainable
- optimized for performance

Do NOT use:
- inline CSS-heavy HTML
- CDN-based scripts
- plain JavaScript
- bootstrap templates
- monolithic files
- fake placeholder architecture

Generate code suitable for immediate local development with:

npm install
npm run dev

Also generate:
- Supabase schema SQL
- environment variable examples
- README setup instructions
- seed/mock data
- reusable utilities

Follow the attached Google Stitch design prototype closely for:
- layouts
- spacing
- typography
- visual hierarchy
- animations
- color palette
- glassmorphism styling
- dashboard structure
- floating analytics widgets
- map overlays
- interaction patterns

If parts of the prototype are incomplete:
- infer missing UX naturally
- maintain strict visual consistency
- extend the design system professionally

==================================================
PROJECT
==================================================

Build a production-grade modern web application called “OpenComp” — an open-source workplace intelligence and salary transparency platform focused on anonymous, community-owned compensation and workplace culture data across India.

==================================================
CORE PHILOSOPHY
==================================================

OpenComp is:
- open-source
- privacy-first
- community-owned
- anonymous
- transparent
- no ads
- no dark patterns
- publicly accessible without login

Users can:
- browse anonymously
- contribute only after social login
- remain anonymous publicly

The platform should feel like:
“A premium open-source Bloomberg Terminal for workplace intelligence.”

==================================================
DESIGN LANGUAGE
==================================================

Visual inspiration:
- Linear
- Stripe
- Vercel
- Arc Browser
- Bloomberg Terminal

Style:
- dark mode by default
- futuristic but professional
- map-native UX
- minimalistic but data-rich
- glassmorphism floating panels
- graphite/slate backgrounds
- electric blue + cyan accents
- large typography
- soft gradients
- subtle motion
- smooth microinteractions
- Lucide icons only
- no emojis

Avoid:
- bootstrap admin templates
- HR portal aesthetics
- generic dashboards
- excessive gradients
- cluttered layouts
- skeuomorphic styling

==================================================
ACTUAL FEATURES & FUNCTIONALITIES
==================================================

Implement REAL functionality for:

1. Authentication
- Google login
- GitHub login
- LinkedIn login
- Supabase auth integration
- session persistence
- protected contributor routes
- anonymous public browsing

2. Interactive Map System
- Mapbox integration
- zoomable India map
- animated salary heatmaps
- clustered city markers
- office density overlays
- floating analytics cards
- dynamic filtering
- layered map intelligence

3. Salary Intelligence
- salary submissions
- compensation analytics
- percentile calculations
- city-wise salary aggregation
- role-based salary comparisons
- experience-level filtering
- salary trend visualization

4. OpenComp Score Engine
   Implement actual scoring logic:

z = (salary - mean_salary) / standard_deviation

Normalize score between:
0–100

Compare against:
- city
- role
- experience range
- company type
- work mode

Create:
- percentile gauges
- compensation ranking
- salary positioning indicators
- reusable scoring utilities

5. Company Intelligence
- company profile pages
- salary distributions
- culture analytics
- radar charts
- trend graphs
- department-wise insights
- engineering culture
- HR culture
- sales culture
- manager friendliness
- work-life balance
- perks & facilities

6. City Intelligence Dashboard
- city heatmaps
- affordability analysis
- rent vs salary comparisons
- commute analysis
- food availability
- metro connectivity
- office density
- safety score
- walkability
- air quality
- top employers

7. Role Intelligence
- salary by city
- compensation growth curves
- remote premium analysis
- demand trends
- top companies by role
- work-life comparisons

8. Contribution Flow
   Create actual multi-step contribution flow:
- company selection
- role input
- salary submission
- culture ratings
- office area intelligence
- perks/facilities
- final review
- autosave
- validation
- mobile-friendly UX

9. Search & Filtering
   Implement:
- global search
- city filters
- role filters
- company filters
- compensation ranges
- experience ranges
- work mode filters
- sort systems

10. Analytics & Charts
    Implement:
- radar charts
- salary trend graphs
- percentile visualizations
- animated counters
- city comparisons
- compensation distributions
- culture score charts

==================================================
DATABASE DESIGN
==================================================

Create complete Supabase schema for:
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

Include:
- indexing
- RLS policies
- aggregation views
- analytics queries
- optimized joins
- percentile calculations
- seed data

==================================================
LANDING PAGE
==================================================

Create:
- animated fullscreen India salary heatmap
- floating global search
- contributor statistics
- trending insights
- open-source messaging
- GitHub/community section
- floating analytics widgets
- modern hero section
- smooth animated transitions

==================================================
COMPANY PAGE
==================================================

Include:
- salary distributions
- OpenComp Score
- department culture
- manager friendliness
- politics/toxicity
- work-life balance
- perks/insurance
- office facilities
- anonymous reviews
- charts and graphs

==================================================
CITY DASHBOARD
==================================================

Include:
- salary heatmaps
- area intelligence
- affordability metrics
- commute analysis
- rent analysis
- food/cafe availability
- metro access
- safety/walkability
- engineering hotspots

==================================================
COMPONENT SYSTEM
==================================================

Create reusable:
- glass cards
- floating panels
- command palette
- analytics widgets
- heatmap legends
- trend charts
- score gauges
- skeleton loaders
- modal systems
- reusable map overlays

All components must:
- support dark mode
- be responsive
- be accessible
- follow consistent spacing/tokens
- match attached Stitch prototype

==================================================
BRANDING
==================================================

Brand:
OpenComp

Core messaging:
- Open-source workplace intelligence
- Community-owned salary transparency
- Anonymous workplace insights
- Open workplace data for everyone

Brand personality:
- trustworthy
- analytical
- futuristic
- community-driven
- transparent

==================================================
FINAL EXPECTATION
==================================================

The final application should feel:
- premium
- futuristic
- trustworthy
- highly polished
- map-native
- analytics-focused
- open-data centric
- production ready

It should visually and functionally feel like:
“A modern open-source workplace intelligence platform combining Glassdoor, Levels.fyi, Bloomberg Terminal, and interactive geographic analytics.”

If necessary, generate the project incrementally file-by-file instead of collapsing everything into one HTML file.