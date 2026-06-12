import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/** Cloudflare Pages uses root `/`; GitHub Pages project site keeps subpath */
const base = process.env.CF_PAGES ? '/' : '/timothy-yap-portfolio/'

export default defineConfig({
  plugins: [react()],
  base,
})
