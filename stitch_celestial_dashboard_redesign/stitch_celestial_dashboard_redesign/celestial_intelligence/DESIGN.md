---
name: Celestial Intelligence
colors:
  surface: '#111319'
  surface-dim: '#111319'
  surface-bright: '#37393f'
  surface-container-lowest: '#0c0e13'
  surface-container-low: '#191c21'
  surface-container: '#1d2025'
  surface-container-high: '#282a30'
  surface-container-highest: '#33353b'
  on-surface: '#e2e2ea'
  on-surface-variant: '#c6c6ce'
  inverse-surface: '#e2e2ea'
  inverse-on-surface: '#2e3036'
  outline: '#909098'
  outline-variant: '#45464d'
  surface-tint: '#bcc6e7'
  primary: '#bcc6e7'
  on-primary: '#26304a'
  primary-container: '#202a44'
  on-primary-container: '#8791b0'
  inverse-primary: '#545e7b'
  secondary: '#c6c7c4'
  on-secondary: '#2f312f'
  secondary-container: '#484947'
  on-secondary-container: '#b8b9b6'
  tertiary: '#bcc8d7'
  on-tertiary: '#27313d'
  tertiary-container: '#212c37'
  on-tertiary-container: '#8893a1'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#bcc6e7'
  on-primary-fixed: '#101b34'
  on-primary-fixed-variant: '#3c4662'
  secondary-fixed: '#e3e3df'
  secondary-fixed-dim: '#c6c7c4'
  on-secondary-fixed: '#1a1c1a'
  on-secondary-fixed-variant: '#464745'
  tertiary-fixed: '#d8e4f3'
  tertiary-fixed-dim: '#bcc8d7'
  on-tertiary-fixed: '#111d27'
  on-tertiary-fixed-variant: '#3d4854'
  background: '#111319'
  on-background: '#e2e2ea'
  surface-variant: '#33353b'
  charcoal-gray: '#53565A'
  star-glow: '#FFFFFF'
  nebula-stroke: rgba(217, 217, 214, 0.15)
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Montserrat
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.1em
  data-heavy:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

This design system embodies a sophisticated, celestial aesthetic designed for deep analytical exploration and data-driven insights. It targets a professional audience that values precision, clarity, and an elevated sense of discovery. 

The visual style is **Corporate Modern** with a **Glassmorphism** influence. It leverages the depth of the night sky to create a focused environment. The interface should feel expansive yet controlled, utilizing a "constellation" metaphor where data points are connected by precise, thin lines and subtle glowing markers. The emotional response is one of calm authority and cosmic perspective.

## Colors

The palette is rooted in the depth of a dark celestial void. The background layers utilize `#07090E` as the base canvas, with `#131E29` and `#202A44` acting as surface containers to provide tonal depth without sacrificing the "dark mode" integrity.

`#D9D9D6` (Glowing White) is reserved for high-contrast typography and essential data markers, while `#53565A` (Charcoal) serves as the secondary text and border color to maintain a refined, low-noise environment. Glow effects should use white with high diffusion and low opacity to mimic distant starlight.

## Typography

The system utilizes **Montserrat** for display and headlines to provide a geometric, modern presence that feels structural and intentional. **Inter** is employed for body text and labels to ensure maximum legibility within complex data visualizations.

Use `label-caps` for table headers and card category labels to create a distinct information architecture. `data-heavy` is specifically for primary metrics within cards to ensure they are the first thing a user's eye gravitates toward.

## Layout & Spacing

The design system follows a **Fixed Grid** philosophy for dashboard views to maintain a consistent structural "map." Content is organized on a 12-column grid with generous 24px gutters to allow the dark background to "breathe."

**Breakpoints:**
- **Mobile (< 768px):** Single column, 16px margins. Cards stack vertically.
- **Tablet (768px - 1200px):** 6-column grid, 24px margins. Metrics cards may pair 2-up.
- **Desktop (> 1200px):** 12-column grid, 40px margins. Sidebars are fixed at 280px.

Spacing should follow a 4px base unit, favoring `stack-md` for internal card padding and `stack-lg` for section separation.

## Elevation & Depth

Depth is achieved through **Tonal Layering** and **Glassmorphism** rather than traditional drop shadows. 

1.  **Base Layer:** `#07090E` (The deep void).
2.  **Surface Layer:** `#131E29` with a 1px border of `nebula-stroke`.
3.  **Floating Elements:** Cards use a subtle backdrop-blur (12px) with `#202A44` at 60% opacity. 

Instead of shadows, use "inner glows" on active elements—a 2px white border with 10% opacity—to simulate light reflecting off a surface in a dark environment. For "star" background elements, use 1px to 3px circles with varying opacities (20% to 80%).

## Shapes

The shape language is precise and professional. A **Soft (0.25rem)** roundedness is the standard for cards and input fields to maintain a sense of technical rigor. Buttons and interactive chips may use **Rounded (0.5rem)** to differentiate them from static data containers. Avoid pill-shapes except for status indicators (e.g., "Active," "Live").

## Components

### Cards
Cards are the primary data container. They must feature a 1px solid border of `#53565A` at 30% opacity. Header sections within cards should be separated by a subtle horizontal rule. High-contrast architecture is key: Metric values should be in `#D9D9D6` while labels remain in `#53565A`.

### Buttons
- **Primary:** Solid `#D9D9D6` background with `#07090E` text. No glow.
- **Secondary:** Ghost style. 1px border of `#D9D9D6`, text in `#D9D9D6`.
- **Ghost:** No border, text in `#53565A`, turns `#D9D9D6` on hover.

### Data Visualization
Charts should use thin line weights (1px-1.5px). Use the primary blue `#202A44` for area fills at 20% opacity. Data points should be small 4px "stars" with a subtle outer glow.

### Input Fields
Dark backgrounds (`#07090E`) with `#53565A` borders. On focus, the border transitions to `#D9D9D6` with a very faint white outer glow (2px blur).

### Chips/Tags
Small, rectangular with `rounded-sm`. Background: `#202A44` at 40%. Text: `label-caps` in `#D9D9D6`.