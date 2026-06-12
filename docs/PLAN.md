# Timothy Yap — Portfolio Website Plan

## Goal
Job-hunting portfolio site showcasing performance marketing expertise with **dynamic, memorable** visuals (not static).

## Skills Applied

| Skill | Application |
|-------|-------------|
| **ui-ux-pro-max** | Dark professional palette, typography, glassmorphism, motion UX |
| **copywriting** | Hero headline, value prop, CTA — clear over clever, metrics-driven |
| **marketing-skills** | Positioning as data-driven Google Ads specialist; SEO meta tags |
| **creative-director** | Visual concept: "Data in Motion" — particles + metrics aesthetic |

## Reference
- [ReactBits Pro Components](https://pro.reactbits.dev/docs/components) — staggered text, particles, shader backgrounds, parallax, glass effects

## Tech Stack
- **Vite + React + TypeScript** — fast build, GitHub Pages friendly
- **Framer Motion** — page transitions, stagger reveals, hover springs
- **GSAP + ScrollTrigger** — scroll-linked animations, timeline reveals
- **Three.js (@react-three/fiber)** — 3D floating orbs / particle field background
- **@tsparticles/react** — interactive hero particle network

## Site Structure (Single Page)

1. **Hero** — Name, title, animated tagline, CTA (Contact / Download CV)
2. **About** — Profile summary with metric highlights (30+ campaigns, CPL focus)
3. **Skills** — Animated skill pills (Google Ads, GTM, GA4, languages, creative tools)
4. **Experience** — Timeline cards with scroll reveal
5. **Education** — Dean's List, CGPA 3.53
6. **Contact** — Email, phone, location + magnetic buttons

## Folder Structure

```
timothy-yap-portfolio/
├── docs/              ← planning & deploy guides
├── design-system/     ← MASTER design tokens
├── .github/workflows/ ← GitHub Pages CI
├── public/            ← static assets
└── src/
    ├── components/
    │   ├── effects/   ← Three.js, particles
    │   ├── layout/    ← Navbar, Footer
    │   ├── sections/  ← page sections
    │   └── ui/        ← reusable UI
    ├── data/          ← resume content (single source of truth)
    ├── hooks/
    └── styles/
```

## Live URL (after deploy)
`https://motypro66.github.io/timothy-yap-portfolio/`

## Open Questions for Timothy
- [ ] LinkedIn / GitHub profile URLs to add?
- [ ] Preferred accent color (cyan vs orange)?
- [ ] PDF resume download link?
