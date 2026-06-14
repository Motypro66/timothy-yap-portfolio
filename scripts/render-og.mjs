import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const out = join(__dirname, '..', 'public', 'og-image.png')

/** Square canvas — WhatsApp / iMessage crop link previews to ~1:1; wide layouts get chopped. */
const SIZE = 1200
const cx = SIZE / 2
const cy = SIZE / 2

let rays = ''
for (let i = 0; i < 22; i++) {
  const a = (i / 22) * Math.PI * 2
  const r1 = 60
  const r2 = SIZE * 0.72
  rays += `<line x1="${cx + Math.cos(a) * r1}" y1="${180 + Math.sin(a) * r1}" x2="${cx + Math.cos(a) * r2}" y2="${180 + Math.sin(a) * r2}"/>`
}

const svg = `<svg width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff6ea"/>
      <stop offset="0.55" stop-color="#ffe7c9"/>
      <stop offset="1" stop-color="#f6d3ad"/>
    </linearGradient>
    <radialGradient id="sun" cx="0.5" cy="0.18" r="0.62">
      <stop offset="0" stop-color="#ffdb95" stop-opacity="0.95"/>
      <stop offset="0.5" stop-color="#ffcf78" stop-opacity="0.28"/>
      <stop offset="1" stop-color="#ffcf78" stop-opacity="0"/>
    </radialGradient>
    <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="38"/></filter>
  </defs>

  <rect width="${SIZE}" height="${SIZE}" fill="url(#bg)"/>
  <g stroke="#f5a623" stroke-opacity="0.1" stroke-width="2">${rays}</g>
  <rect width="${SIZE}" height="${SIZE}" fill="url(#sun)"/>

  <circle cx="180" cy="980" r="140" fill="#ffd166" opacity="0.2" filter="url(#soft)"/>
  <circle cx="1020" cy="920" r="130" fill="#ff8c69" opacity="0.16" filter="url(#soft)"/>
  <circle cx="1040" cy="220" r="100" fill="#e8a838" opacity="0.14" filter="url(#soft)"/>

  <!-- Safe zone: centered square — survives WhatsApp / WeChat square thumbnails -->
  <g text-anchor="middle">
    <g transform="translate(${cx - 42}, 318) scale(2.1)">
      <path d="M6 8h16M14 8v22M14 26c6 0 11-3 12-8" stroke="#2a2218" stroke-width="2.35" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="26" cy="16" r="3.4" fill="#f5a623"/>
      <text x="30" y="27" font-family="Georgia, 'Times New Roman', serif" font-size="20" font-weight="700" letter-spacing="-0.03em" fill="#2a2218">imothy</text>
    </g>

    <text x="${cx}" y="468" font-family="'DejaVu Sans', sans-serif" font-size="24" letter-spacing="8" fill="#9a5a08">PERFORMANCE MARKETING</text>

    <text x="${cx}" y="598" font-family="Georgia, 'Times New Roman', serif" font-size="108" font-weight="700" fill="#2a2218">Timothy Yap</text>
    <rect x="${cx - 64}" y="622" width="128" height="6" rx="3" fill="#f5a623"/>

    <text x="${cx}" y="702" font-family="'DejaVu Sans', sans-serif" font-size="40" fill="#3d342b">Performance Marketing Specialist</text>
    <text x="${cx}" y="762" font-family="'DejaVu Sans', sans-serif" font-size="28" fill="#7a6f62">Google Ads · GA4 · GTM · Kuala Lumpur</text>

    <text x="${cx}" y="1040" font-family="'DejaVu Sans', sans-serif" font-size="24" letter-spacing="1" fill="#a08d77">timothy-yap.pages.dev</text>
  </g>
</svg>`

await sharp(Buffer.from(svg)).png().toFile(out)
console.log('wrote', out)
