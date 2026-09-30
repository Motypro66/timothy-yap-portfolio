# Timothy Yap Portfolio

A playful, animated personal portfolio for Timothy Yap Wei Zhong.

Live: https://motypro66.github.io/timothy-yap-portfolio/

The design, copy, illustration and motion are migrated from the approved [Sites version](https://timothy-for-a-human.newtomato66.chatgpt.site), source commit `69e20198d0f6ddc68cad1afb506ca32e31a4572c`.

## Development

```sh
npm ci
npm run dev
```

Open `http://localhost:3000/timothy-yap-portfolio/`.

## Build and deploy

```sh
npm run build
```

Next.js statically renders the complete page to `out/`. The existing GitHub Actions workflow builds and deploys this directory whenever `main` changes. See [deployment notes](docs/DEPLOY.md).

## Implementation

- `app/page.tsx`: portfolio content and interactive controls
- `app/globals.css`: responsive layout, styling and CSS animations
- `app/motion.tsx`: GSAP entrance, scroll and idle animations, with pause/replay controls
- `app/fonts.ts`: the original local fonts, preloaded through Next.js
- `src/components/ui`: the four Radix-based controls used by the page
- `public/timothy-illustration-*.webp`: responsive sizes of the original illustration

## Loading performance

The 1,865,647-byte original hero PNG is delivered as a 140,380-byte (640px), 297,336-byte (960px), or 408,438-byte (1159px) WebP based on display size and pixel density. Its matching responsive preload avoids downloading an extra size. The 229,400-byte About photo loads lazily. Fonts are local, and HTML, CSS and JavaScript are generated ahead of time; no runtime server or external font request is required.

The layout rules and GSAP timelines are preserved from the approved source. All assets respect the GitHub Pages subpath, and the 2/3/4-person split demo, tabs, accordions, email copy and WhatsApp link remain interactive.
