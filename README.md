# Timothy Yap — Portfolio

Dynamic job-hunting portfolio built with React, Three.js, GSAP, and Framer Motion.

**Live:** https://timothy-yap.pages.dev/  
**Mirror:** https://motypro66.github.io/timothy-yap-portfolio/

## Stack

- Vite + React + TypeScript
- Three.js (@react-three/fiber) — 3D floating orbs
- @tsparticles/react — interactive particle network
- GSAP ScrollTrigger — scroll reveals
- Framer Motion — stagger text, springs, page motion

## Structure

```
docs/           Planning & deploy guides
design-system/  Design tokens (MASTER.md)
src/
  components/
    effects/    ParticleBackground, FloatingOrbs, ScrollReveal
    layout/     Navbar, Footer
    sections/   Hero, About, Skills, Experience, Education, Contact
    ui/         Reusable UI primitives
  data/         resume.ts (single source of truth)
  styles/       globals, tokens, components
```

## Commands

```bash
npm install   # install dependencies
npm run dev   # local dev server
npm run build # production build
```

See [docs/DEPLOY.md](docs/DEPLOY.md) for Cloudflare Pages and GitHub Pages setup.
