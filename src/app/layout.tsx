import type { Metadata } from 'next'
import './globals.css'
import { ToastProvider } from '@/components/ui/Toast'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dedran.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Dedran — Launch Your Career Journey',
    template: '%s | Dedran',
  },
  description:
    'Dedran empowers young professionals with customizable profiles, skill-building courses, interactive posts, and tools to track job applications seamlessly.',
  keywords: [
    'career platform',
    'job applications',
    'professional networking',
    'online courses',
    'young professionals',
    'UX design courses',
    'job tracker',
  ],
  authors: [{ name: 'Dedran' }],
  creator: 'Dedran',
  publisher: 'Dedran',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'Dedran',
    title: 'Dedran — Launch Your Career Journey',
    description:
      'Build standout profiles, learn in-demand skills, connect with professionals, and track every job application — all in one place.',
    images: [
      {
        url: `${BASE_URL}/og.png`,
        width: 1200,
        height: 630,
        alt: 'Dedran Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dedran — Launch Your Career Journey',
    description:
      'Build standout profiles, learn in-demand skills, connect with professionals, and track every job application.',
    images: [`${BASE_URL}/og.png`],
    creator: '@dedran',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Dedran',
    url: BASE_URL,
    description:
      'Career platform for young professionals to build profiles, learn skills, and track job applications.',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
    },
    author: {
      '@type': 'Organization',
      name: 'Dedran',
    },
  }

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  )
}
