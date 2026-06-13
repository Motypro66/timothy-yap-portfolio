import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/** Cloudflare Pages + local preview use root `/` */
const base = process.env.CF_PAGES || process.env.VITE_ROOT_BASE ? '/' : '/timothy-yap-portfolio/'

export default defineConfig({
  plugins: [react()],
  base,
})
