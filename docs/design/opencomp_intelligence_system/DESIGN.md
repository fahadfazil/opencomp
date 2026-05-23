---
name: OpenComp Intelligence System
colors:
  surface: '#111417'
  surface-dim: '#111417'
  surface-bright: '#36393e'
  surface-container-lowest: '#0b0e12'
  surface-container-low: '#191c20'
  surface-container: '#1d2024'
  surface-container-high: '#272a2e'
  surface-container-highest: '#323539'
  on-surface: '#e1e2e8'
  on-surface-variant: '#c6c5d1'
  inverse-surface: '#e1e2e8'
  inverse-on-surface: '#2e3135'
  outline: '#90909a'
  outline-variant: '#45464f'
  surface-tint: '#b9c3ff'
  primary: '#cbd2ff'
  on-primary: '#212c61'
  primary-container: '#aab5f3'
  on-primary-container: '#3a457b'
  inverse-primary: '#505b93'
  secondary: '#9ad2c3'
  on-secondary: '#00382e'
  secondary-container: '#195247'
  on-secondary-container: '#8cc3b5'
  tertiary: '#d1d0ff'
  on-tertiary: '#1000a9'
  tertiary-container: '#b0b2ff'
  on-tertiary-container: '#3131c1'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b9c3ff'
  on-primary-fixed: '#08164b'
  on-primary-fixed-variant: '#384379'
  secondary-fixed: '#b6eedf'
  secondary-fixed-dim: '#9ad2c3'
  on-secondary-fixed: '#00201a'
  on-secondary-fixed-variant: '#164f44'
  tertiary-fixed: '#e1e0ff'
  tertiary-fixed-dim: '#c0c1ff'
  on-tertiary-fixed: '#07006c'
  on-tertiary-fixed-variant: '#2f2ebe'
  background: '#111417'
  on-background: '#e1e2e8'
  surface-variant: '#323539'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.03em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: -0.01em
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  container-max: 1440px
---

## Brand & Style

The design system is built for a high-performance workplace intelligence platform. It prioritizes clarity and analytical depth while maintaining a futuristic, premium feel. The aesthetic is a hybrid of **Modern SaaS** and **Glassmorphism**, leveraging the density of a financial terminal with the refined elegance of modern developer tools. 

Key attributes include:
- **Atmospheric Depth:** Using layered translucent panels to organize complex data without visual clutter.
- **Precision:** Tight tracking, sharp borders, and monospaced accents to evoke a sense of accuracy and technical mastery.
- **Analytical Aura:** A dark-first environment that reduces eye strain for long-duration data analysis.

## Colors

The palette is anchored in deep, monochromatic slates to provide a high-contrast foundation for vibrant data visualization.

- **Primary (Electric Blue):** Used for primary actions, active states, and key data points.
- **Secondary (Cyan):** Used for success states, secondary data trends, and highlights.
- **Neutrals:** A range of graphites from `#0F1113` (canvas) to `#1A1D21` (surface) and `#24282D` (hover states).
- **Accents:** High-saturation gradients transitioning from Primary to Secondary are used for high-impact visual areas like charts and "Pro" features.

## Typography

This design system utilizes **Geist** for its technical precision and neutral geometric construction, ensuring high legibility in data-dense environments.

- **Headlines:** Use tight letter-spacing (`-0.02em` to `-0.04em`) to create a compact, authoritative "editorial" look.
- **Data Labels:** **JetBrains Mono** is introduced for tabular data, metrics, and small labels to emphasize the platform's open-source and analytical roots.
- **Hierarchy:** Maintain high contrast between display type and body text to guide the eye through complex dashboards.

## Layout & Spacing

The system follows a **12-column fluid grid** for dashboard views, transitioning to a single-column stack on mobile.

- **Density:** High-density layout with an 8px base unit. Gutters are kept tight (16px) to maximize screen real estate for data.
- **Safe Zones:** Content is contained within a 1440px max-width container on ultra-wide screens to prevent scanning fatigue.
- **Padding Rhythm:** Use `12px`, `24px`, and `48px` steps for internal component padding to maintain a mathematical, structured feel.

## Elevation & Depth

Hierarchy is established through **Glassmorphism** and **Tonal Layering** rather than traditional heavy shadows.

- **Surface Levels:** 
  - **L0 (Canvas):** `#0F1113` - The base background.
  - **L1 (Panels):** `#1A1D21` - Main content cards with a 1px border (`rgba(255,255,255,0.08)`).
  - **L2 (Floating):** Translucent backgrounds with `20px` backdrop blur and a lighter top-border to simulate a light source from above.
- **Outlines:** Instead of shadows, use "Inner Glow" borders (1px stroke) with varying opacities to separate stacked elements.

## Shapes

The shape language is **Soft** but disciplined. 

- **Standard Radius:** `4px` (Small) for inputs and chips, `8px` (Medium) for buttons and cards.
- **Visual Logic:** Larger containers should not exceed `12px` radius to maintain the professional, "Bloomberg Terminal" efficiency. 
- **Icons:** Use Lucide-style icons with a `1.5px` stroke weight to match the refined typography.

## Components

### Buttons
- **Primary:** Gradient fill (Electric Blue to Cyan) with white text. High-shine hover effect.
- **Secondary:** Ghost style with `border-subtle` and Primary-colored text on hover.

### Inputs
- **Search/Fields:** Darker than the panel level (`#0F1113`) with a focus state that activates a 1px Primary color glow. Use monospaced font for numerical inputs.

### Data Visualization
- **Charts:** Use a palette of Cyan, Blue, and Purple. Radar charts and heatmaps should use semi-transparent fills with `2px` strokes.
- **Tooltips:** Glassmorphic (blurred background) with monospaced data labels for high-precision reading.

### Cards
- **Stat Cards:** Feature a large "Display" metric and a small sparkline chart. Backgrounds should have a subtle radial gradient emanating from the top-left corner.

### Chips
- **Status Indicators:** Pill-shaped with a small leading dot. Use low-opacity background tints of the status color (e.g., 10% Cyan for "Active").