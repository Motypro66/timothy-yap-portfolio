/** Public asset URL with optional Next.js basePath (GitHub Pages subpath). */
export function assetUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
  const clean = path.startsWith('/') ? path : `/${path}`
  return base ? `${base}${clean}` : clean
}
