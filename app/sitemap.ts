import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/siteConfig'

export const dynamic = 'force-static'

const siteUrl = SITE_URL

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}
