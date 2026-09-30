import type { Metadata, Viewport } from 'next'
import { assetUrl } from '@/lib/assetUrl'
import { bricolage, dmSans, caveat } from './fonts'
import './globals.css'

const siteUrl = 'https://motypro66.github.io/timothy-yap-portfolio/'
const title = 'Timothy — This is an ad. For a human.'
const description = 'Meet Timothy Yap: a performance marketer in Kuala Lumpur connecting ads, data and ideas. Experience, approach and the Kongsi personal project.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: { canonical: siteUrl },
  authors: [{ name: 'Timothy Yap Wei Zhong' }],
  openGraph: {
    title,
    description,
    type: 'website',
    siteName: 'Timothy Yap Portfolio',
    url: siteUrl,
    images: [{
      url: `${siteUrl}timothy-in-real-life.webp`,
      width: 1536,
      height: 1148,
      alt: 'Timothy smiling outdoors by the water',
    }],
  },
  twitter: { card: 'summary_large_image', title, description },
  icons: {
    icon: assetUrl('/favicon.svg'),
    shortcut: assetUrl('/favicon.svg'),
  },
}

export const viewport: Viewport = {
  themeColor: '#f7e56a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${dmSans.variable} ${caveat.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
