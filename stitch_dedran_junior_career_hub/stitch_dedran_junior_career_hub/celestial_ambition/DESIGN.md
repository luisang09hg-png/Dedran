---
name: Celestial Ambition
colors:
  surface: '#101417'
  surface-dim: '#101417'
  surface-bright: '#36393d'
  surface-container-lowest: '#0b0f12'
  surface-container-low: '#191c1f'
  surface-container: '#1d2023'
  surface-container-high: '#272a2e'
  surface-container-highest: '#323539'
  on-surface: '#e1e2e7'
  on-surface-variant: '#c6c6cb'
  inverse-surface: '#e1e2e7'
  inverse-on-surface: '#2d3134'
  outline: '#909095'
  outline-variant: '#46474b'
  surface-tint: '#c5c6cd'
  primary: '#c5c6cd'
  on-primary: '#2e3036'
  primary-container: '#07090e'
  on-primary-container: '#77797f'
  inverse-primary: '#5c5e65'
  secondary: '#bcc8d7'
  on-secondary: '#27313d'
  secondary-container: '#3f4a56'
  on-secondary-container: '#aeb9c8'
  tertiary: '#bcc6e7'
  on-tertiary: '#26304a'
  tertiary-container: '#000821'
  on-tertiary-container: '#6f7897'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2ea'
  primary-fixed-dim: '#c5c6cd'
  on-primary-fixed: '#191c21'
  on-primary-fixed-variant: '#45474d'
  secondary-fixed: '#d8e4f3'
  secondary-fixed-dim: '#bcc8d7'
  on-secondary-fixed: '#111d27'
  on-secondary-fixed-variant: '#3d4854'
  tertiary-fixed: '#dae2ff'
  tertiary-fixed-dim: '#bcc6e7'
  on-tertiary-fixed: '#101b34'
  on-tertiary-fixed-variant: '#3c4662'
  background: '#101417'
  on-background: '#e1e2e7'
  surface-variant: '#323539'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.03em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style

The design system for this platform is built on the concept of "Navigating the Future." It positions youth employment not just as a job search, but as a journey through a vast, professional universe. The brand personality is **Visionary, Calm, and Empowering**.

The visual style is a hybrid of **Minimalism** and **Corporate Modern**, infused with a subtle **Cosmic Motif**. By utilizing deep, nocturnal blues paired with pristine whites, the UI evokes a sense of infinite possibility and professional stability. High-quality whitespace and generous roundedness prevent the interface from feeling "heavy" despite the dark palette, ensuring the platform remains approachable for a younger demographic.

## Colors

The "Celestial" palette uses a high-contrast dark mode foundation to create depth and focus. 

- **Primary (#07090E):** Used for the main application background and deep-tier containers.
- **Secondary (#131E29):** Reserved for navigational elements like sidebars and persistent headers to create structural separation.
- **Accents (#202A44):** Used for subtle hover states, secondary button backgrounds, and interactive borders.
- **Surface (#FFFFFF):** High-contrast cards and content areas to ensure maximum readability for job listings and profiles.
- **Text & UI (#53565A & #D9D9D6):** Functional grays used to establish typographic hierarchy and soft UI dividers.

## Typography

This design system employs a multi-font strategy to balance character with utility. **Hanken Grotesk** is used for headlines to provide a sharp, contemporary edge. **Manrope** handles the body text for its exceptional legibility and balanced proportions. **Geist** is utilized for labels and technical data to reinforce the "modern tool" feel.

Type scales are generous to accommodate younger users who favor scanning over deep reading. Mobile headlines are scaled down to maintain layout integrity on smaller viewports.

## Layout & Spacing

The layout follows a **fluid grid system** with a 12-column structure on desktop. Spacing is governed by an 8px base unit, ensuring consistent vertical and horizontal rhythm. 

- **Desktop:** 12 columns, 24px gutters, 40px outer margins.
- **Tablet:** 8 columns, 16px gutters, 24px outer margins.
- **Mobile:** 4 columns, 16px gutters, 16px outer margins.

The layout philosophy emphasizes "breathing room," with large padding (32px+) inside white content cards to create a sense of premium quality and focus.

## Elevation & Depth

Visual hierarchy is achieved through a combination of **Tonal Layers** and **Ambient Shadows**. 

1. **Background Layer:** The Deep Dark Blue (#07090E) serves as the infinite canvas.
2. **Structural Layer:** Sidebars and navigation use Night Blue (#131E29) with no shadows to provide a grounded frame.
3. **Interactive Layer:** Pure White (#FFFFFF) cards float above the dark background. These use extra-diffused, soft shadows with a slight blue tint (rgba(7, 9, 14, 0.15)) to prevent the "stark white" from feeling disconnected from the celestial theme.
4. **Hero Patterns:** Background sections use low-opacity (5-10%) constellation patterns to add texture without distracting from content.

## Shapes

The design system utilizes a high degree of roundedness to maintain a friendly, approachable aesthetic. 

- **Standard Elements:** 12px (0.75rem) for input fields, small buttons, and list items.
- **Primary Containers:** 24px (1.5rem) for main cards, modals, and featured sections.
- **Status Tags:** Fully rounded (pill-shaped) for quick identification.

This "rounded-xl/2xl" approach softens the corporate nature of employment, making the platform feel more like a lifestyle tool for the youth.

## Components

### Buttons
- **Primary:** High-contrast White background with Deep Dark Blue text. Transitions to Grayish Blue on hover.
- **Secondary:** Transparent background with Grayish Blue borders and text.
- **Animations:** All buttons use a 200ms ease-out transition on scale and background color.

### Cards
- **Job Cards:** Pure White background, 24px radius, soft shadow (0 12px 24px -4px).
- **Metric Cards:** Night Blue background with White text and subtle constellation accents in the corner.

### Inputs
- **Field Style:** Grayish Blue (#202A44) backgrounds with Light Gray (#D9D9D6) text placeholders.
- **Focus State:** 2px solid border in Pure White to provide high visibility against the dark UI.

### Chips & Badges
- **Style:** Small, pill-shaped elements using the Accent color (#202A44) with White text.

### Hero Section
- Must incorporate the "Starry Night" motif. This should be a SVG background pattern consisting of thin 1px lines and small circular nodes (stars) at 10% opacity, layered over the primary background.