# Dedran — Career Platform for Young Professionals

> Full-stack web application built with Next.js 16, Supabase, Stripe & PayPal

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict mode) |
| UI | React 19, Tailwind CSS v4, Framer Motion 12 |
| Icons | Lucide React |
| Auth | Supabase Auth (email/password, magic link, password recovery) |
| Database | Supabase (PostgreSQL) with Row Level Security |
| Payments | Stripe Checkout + PayPal Orders API |
| Deployment | Vercel |

## Features

- **Authentication**: Sign up, sign in, password recovery, email confirmation
- **Dashboard**: Feed, profile, courses, job applications with animated UI
- **Payments**: Stripe Checkout + PayPal integration
- **SEO**: Open Graph, Twitter Cards, JSON-LD, sitemap.xml, robots.txt
- **Security**: CSP headers, HSTS, XSS protection, RLS policies
- **UX**: Skeleton loaders, toast notifications, error boundaries, loading states
- **Animations**: Framer Motion page transitions, staggered reveals, micro-interactions

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Stripe](https://stripe.com) account (optional)
- A [PayPal Developer](https://developer.paypal.com) account (optional)

### Setup

```bash
# Clone the repository
git clone https://github.com/your-username/dedran.git
cd dedran

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local
```

### Configure `.env.local`

```env
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe (optional)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# PayPal (optional)
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-client-id
PAYPAL_CLIENT_SECRET=your-client-secret
PAYPAL_MODE=sandbox
```

### Database Setup

1. Go to your Supabase dashboard → SQL Editor
2. Open `supabase/schema.sql`
3. Paste and run the SQL
4. This creates all tables (profiles, posts, courses, applications, payments) with RLS policies

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Scripts

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix lint issues
npm run format       # Format with Prettier
npm run type-check   # TypeScript type checking
npm run clean        # Remove .next and node_modules
```

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (SEO, fonts, providers)
│   ├── page.tsx                  # Landing / Home page
│   ├── loading.tsx               # Global loading UI
│   ├── not-found.tsx             # 404 page
│   ├── sitemap.ts                # Dynamic sitemap
│   ├── robots.ts                 # Robots.txt
│   ├── auth/
│   │   ├── page.tsx              # Sign in / Sign up
│   │   ├── confirm/page.tsx      # Email confirmation
│   │   ├── forgot-password/      # Password reset request
│   │   └── update-password/      # Set new password
│   ├── dashboard/page.tsx        # Main dashboard
│   └── api/
│       ├── auth/callback/        # Supabase auth callback
│       ├── profile/              # User profile CRUD
│       ├── posts/                # Posts CRUD
│       ├── courses/              # Course management
│       ├── applications/         # Job applications
│       ├── payments/
│       │   ├── stripe/           # Stripe checkout
│       │   └── paypal/           # PayPal orders
│       └── webhooks/
│           └── stripe/           # Stripe webhook handler
├── components/
│   ├── ui/                       # Reusable UI components
│   │   ├── ErrorBoundary.tsx     # React error boundary
│   │   ├── Skeleton.tsx          # Loading skeletons
│   │   └── Toast.tsx             # Toast notification system
│   ├── Landing.tsx               # Landing page
│   ├── AuthForm.tsx              # Auth form
│   └── Dashboard.tsx             # Dashboard
├── lib/
│   ├── auth.ts                   # Auth helpers (Supabase)
│   ├── stripe.ts                 # Stripe client
│   ├── utils.ts                  # cn() utility
│   ├── supabase/
│   │   ├── client.ts             # Browser Supabase client
│   │   └── server.ts             # Server Supabase client
│   └── hooks/
│       ├── useAuth.ts            # Auth hook
│       ├── useApi.ts             # API fetching hook
│       └── useStripe.ts          # Payment hook
├── types/
│   └── database.ts               # Supabase generated types
└── styles/                       # (globals.css in app/)
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | Get current user profile |
| PATCH | `/api/profile` | Update profile |
| GET | `/api/posts` | List all posts |
| POST | `/api/posts` | Create a post |
| DELETE | `/api/posts?id=` | Delete a post |
| GET | `/api/courses` | List all courses |
| POST | `/api/courses` | Create a course |
| GET | `/api/applications` | List user applications |
| POST | `/api/applications` | Create application |
| PATCH | `/api/applications` | Update application |
| POST | `/api/payments/stripe` | Create Stripe checkout |
| POST | `/api/payments/paypal` | Create PayPal order |
| POST | `/api/webhooks/stripe` | Stripe webhook handler |

## Database Tables

- **profiles** — User profiles (name, title, bio, avatar)
- **posts** — User posts (regular + temporary/expiring)
- **courses** — Course catalog
- **course_enrollments** — User-course relationships
- **applications** — Job applications tracker
- **payments** — Payment records (Stripe + PayPal)
- **saved_posts** — Bookmarked posts
- **post_likes** — Post likes

All tables have Row Level Security (RLS) policies enabled.

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Environment Variables in Vercel

1. Go to your Vercel project → Settings → Environment Variables
2. Add all variables from `.env.local`
3. Redeploy

### Stripe Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events: `checkout.session.completed`, `payment_intent.payment_failed`
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

## License

MIT
