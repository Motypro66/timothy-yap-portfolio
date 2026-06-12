# Design System — Timothy Yap Portfolio

## Concept: **Data in Motion**
Performance marketing meets cinematic UI — dark canvas, glowing data particles, glass cards floating over depth.

## Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-deep` | `#06080f` | Page background |
| `--bg-surface` | `#0d1117` | Section surfaces |
| `--accent-cyan` | `#00e5ff` | Primary accent, links, glow |
| `--accent-coral` | `#ff6b4a` | Secondary CTA, highlights |
| `--accent-violet` | `#8b5cf6` | Gradient blend |
| `--text-primary` | `#f0f4f8` | Headlines |
| `--text-muted` | `#94a3b8` | Body secondary |
| `--glass-border` | `rgba(255,255,255,0.08)` | Card borders |
| `--glass-bg` | `rgba(255,255,255,0.04)` | Glass panels |

## Typography
- **Display:** Syne 700/800 — hero, section titles
- **Body:** DM Sans 400/500 — paragraphs, labels
- **Mono:** JetBrains Mono — metrics, tags

## Effects (ReactBits-inspired)
- Particle network background (Synaptic Shift / Cursor Wave vibe)
- Staggered text reveal on hero load
- Glass morphism cards with backdrop-blur
- 3D floating orbs (Three.js) in hero
- Scroll-triggered section fades (GSAP ScrollTrigger)
- Magnetic hover on primary buttons
- Skill pills with spring parallax on hover

## Motion Rules
- Duration: 0.4–0.8s for UI; 1.2s+ for hero
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (smooth out)
- Respect `prefers-reduced-motion`

## Anti-patterns
- No static flat white backgrounds
- No stock photo hero
- No auto-playing video with sound
- No text smaller than 14px on mobile
