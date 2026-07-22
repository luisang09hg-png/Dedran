# Aldebaram — Career Platform for Young Professionals

> Modern web application built with HTML5, modular ES6+ JavaScript, and Tailwind CSS

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 (semantic) |
| Styling | Tailwind CSS v3 (CDN) + Custom CSS3 |
| JavaScript | Vanilla ES6+ (no framework) |
| Icons | Feather Icons (CDN) |
| Typography | System font stack (Inter, Segoe UI, Roboto) |

## Features

- **Landing Page**: Sticky header, hero section, feature grid with micro-interactions
- **Dashboard**: Tabbed workspace with feed, courses, and job application tracking
- **Design System**: Custom CSS variables for consistent branding across all components
- **Responsive**: Mobile-first layout with breakpoints at sm, md, lg, xl
- **Animations**: CSS keyframe animations for page transitions and hover states
- **Dark Theme**: Midnight Navy background with Astral Blue accents

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No build tools or Node.js required

### Run Locally

```bash
# Clone the repository
git clone https://github.com/your-username/aldebaram.git
cd aldebaram

# Open index.html in your browser
open index.html
```

Or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (npx)
npx serve .
```

Open [http://localhost:8000](http://localhost:8000)

## Project Structure

```
aldebaram/
├── index.html          # Landing page with hero section
├── dashboard.html      # Main dashboard (feed, courses, applications)
├── styles.css          # Design system tokens and component styles
├── script.js           # Tab switching and navigation logic
├── public/             # Static assets
├── .env.local          # Environment variables (Supabase, Stripe, PayPal)
├── .env.local.example  # Environment variables template
└── README.md           # This file
```

## Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-main` | #0A122A | Page background (Midnight Navy) |
| `--bg-surface` | #1B1B1B | Component canvas (Eclipse Black) |
| `--accent-primary` | #24476C | Primary accent and focus (Astral Blue) |
| `--text-muted` | #A8A9AD | Secondary text and elements (Moonlight Gray) |
| `--text-main` | #E6E8E6 | Primary text and headings (Stardust White) |
| `--border-subtle` | rgba(36,71,108,0.3) | Component borders |

## Pages

### Landing Page (`index.html`)
- Sticky header with SVG logo and navigation
- Hero section with call-to-action
- Features grid (6 cards) with hover animations
- About section with CTA
- Footer with brand mark

### Dashboard (`dashboard.html`)
- Sticky header with tab navigation
- Feed tab: Post composer and feed posts
- Courses tab: Course cards with pricing and ratings
- Applications tab: Kanban-style job tracker

## Scripts

```bash
# No build required — edit files directly
# For development with live reload:
npx live-server .
```

## Environment Variables

Configure `.env.local` for Supabase, Stripe, and PayPal integration:

```env
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe (optional)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# PayPal (optional)
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-client-id
PAYPAL_CLIENT_SECRET=your-client-secret
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT
