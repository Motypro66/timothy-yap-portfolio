import type { NextConfig } from 'next'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectDir = path.dirname(fileURLToPath(import.meta.url))

/** Cloudflare Pages sets CF_PAGES=1; GitHub Pages uses subpath. */
const isRootDeploy =
  process.env.CF_PAGES === '1' ||
  process.env.CF_PAGES === 'true' ||
  process.env.NEXT_PUBLIC_ROOT_BASE === '1'

const basePath = isRootDeploy ? '' : '/timothy-yap-portfolio'

const nextConfig: NextConfig = {
  output: 'export',
  outputFileTracingRoot: projectDir,
  ...(basePath ? { basePath, assetPrefix: `${basePath}/` } : {}),
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
}

export default nextConfig
