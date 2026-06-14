import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const out = join(__dirname, '..', 'public', 'og-image.png')

// sun rays radiating from the top-right sun
const cx = 1015
const cy = 105
let rays = ''
for (let i = 0; i < 26; i++) {
  const a = (i / 26) * Math.PI * 2
  const r1 = 70
  const r2 = 720
  rays += `<line x1="${cx + Math.cos(a) * r1}" y1="${cy + Math.sin(a) * r1}" x2="${cx + Math.cos(a) * r2}" y2="${cy + Math.sin(a) * r2}"/>`
}

const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff6ea"/>
      <stop offset="0.55" stop-color="#ffe7c9"/>
      <stop offset="1" stop-color="#f6d3ad"/>
    </linearGradient>
    <radialGradient id="sun" cx="0.84" cy="0.16" r="0.55">
      <stop offset="0" stop-color="#ffdb95" stop-opacity="0.95"/>
      <stop offset="0.5" stop-color="#ffcf78" stop-opacity="0.3"/>
      <stop offset="1" stop-color="#ffcf78" stop-opacity="0"/>
    </radialGradient>
    <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="34"/></filter>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <g stroke="#f5a623" stroke-opacity="0.09" stroke-width="2">${rays}</g>
  <rect width="1200" height="630" fill="url(#sun)"/>

  <circle cx="1000" cy="500" r="150" fill="#ff8c69" opacity="0.16" filter="url(#soft)"/>
  <circle cx="1130" cy="330" r="110" fill="#5bb5e8" opacity="0.12" filter="url(#soft)"/>
  <circle cx="150" cy="560" r="120" fill="#ffd166" opacity="0.18" filter="url(#soft)"/>

  <!-- brand lockup -->
  <g transform="translate(92,74) scale(1.7)">
    <path d="M6 8h16M14 8v22M14 26c6 0 11-3 12-8" stroke="#2a2218" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="26" cy="16" r="3.4" fill="#f5a623"/>
    <text x="34" y="27" font-family="Georgia, 'Times New Roman', serif" font-size="20" font-weight="700" fill="#2a2218">imothy</text>
  </g>

  <text x="92" y="312" font-family="'DejaVu Sans', sans-serif" font-size="23" letter-spacing="7" fill="#9a5a08">PERFORMANCE MARKETING</text>

  <text x="86" y="406" font-family="Georgia, 'Times New Roman', serif" font-size="96" font-weight="700" fill="#2a2218">Timothy Yap</text>
  <rect x="92" y="430" width="128" height="6" rx="3" fill="#f5a623"/>

  <text x="92" y="492" font-family="'DejaVu Sans', sans-serif" font-size="36" fill="#3d342b">Performance Marketing Specialist</text>
  <text x="92" y="536" font-family="'DejaVu Sans', sans-serif" font-size="25" fill="#7a6f62">Kuala Lumpur · Google Ads · GA4 · Lead Generation</text>

  <text x="1108" y="586" text-anchor="end" font-family="'DejaVu Sans', sans-serif" font-size="21" letter-spacing="1" fill="#a08d77">timothy-yap.pages.dev</text>
</svg>`

await sharp(Buffer.from(svg)).png().toFile(out)
console.log('wrote', out)
