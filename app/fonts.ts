import localFont from 'next/font/local'

export const bricolage = localFont({
  src: '../src/assets/fonts/bricolage-grotesque-latin-wght-normal.woff2',
  variable: '--font-bricolage',
  weight: '200 800',
  style: 'normal',
  display: 'swap',
})

export const dmSans = localFont({
  src: '../src/assets/fonts/dm-sans-latin-wght-normal.woff2',
  variable: '--font-dm',
  weight: '100 1000',
  style: 'normal',
  display: 'swap',
})

export const caveat = localFont({
  src: '../src/assets/fonts/caveat-latin-600-normal.woff2',
  variable: '--font-caveat',
  weight: '600',
  style: 'normal',
  display: 'swap',
})
