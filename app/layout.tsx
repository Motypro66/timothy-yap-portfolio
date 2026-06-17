import type { Metadata, Viewport } from 'next'
import { profile } from '@/data/resume'
import '@/styles/globals.css'
import '@/styles/components.css'
import '@/styles/logo-intro.css'
import '@/styles/floating-orbs.css'
import '@/styles/polish.css'

const siteUrl = 'https://timothy-yap.pages.dev'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Timothy Yap | Performance Marketing Specialist',
  description:
    'Timothy Yap — Data-driven Performance Marketing Specialist. Google Ads, GTM, GA4, conversion tracking & lead generation.',
  keywords: ['Timothy Yap', 'Performance Marketing', 'Google Ads', 'GTM', 'GA4', 'Kuala Lumpur'],
  authors: [{ name: profile.name }],
  openGraph: {
    title: 'Timothy Yap | Performance Marketing Specialist',
    description: 'Google Ads & GA4 · 30+ Search campaigns · Lead generation · Kuala Lumpur',
    type: 'website',
    siteName: profile.name,
    url: siteUrl,
    images: [
      {
        url: '/og-image.png?v=2',
        width: 1200,
        height: 1200,
        alt: 'Timothy Yap — Performance Marketing Specialist',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Timothy Yap | Performance Marketing Specialist',
    description: 'Google Ads & GA4 · 30+ Search campaigns · Lead generation · Kuala Lumpur',
    images: ['/og-image.png?v=2'],
  },
  icons: {
    icon: [{ url: '/favicon.svg?v=4', type: 'image/svg+xml' }],
    apple: '/apple-touch-icon.svg?v=4',
  },
  manifest: '/site.webmanifest?v=4',
  appleWebApp: { title: 'Timothy' },
}

export const viewport: Viewport = {
  themeColor: '#fff8f0',
  width: 'device-width',
  initialScale: 1,
}

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.fullName,
  jobTitle: profile.title,
  url: siteUrl,
  email: profile.email,
  telephone: profile.phone,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Kuala Lumpur',
    addressCountry: 'MY',
  },
  sameAs: [profile.linkedin, profile.instagram],
  description: profile.summary,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="intro-active">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700&display=swap"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700;9..144,800&family=JetBrains+Mono:wght@400;500&family=Outfit:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
