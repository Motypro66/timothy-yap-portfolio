# Logo Motion Specification — pixel2motion v2

**Project:** Timothy Yap Portfolio
**Date:** 2026-06-16
**Asset:** `public/logo_motion.html` + `public/logo.svg`

---

## 1. Personality Brief

| Attribute | Interpretation |
|-----------|---------------|
| **Precise** | Clean stroke-draw on the T, no wobble, no overshoot on the lines. The geometry is minimal — let it speak through timing, not decoration. |
| **Warm** | The sun dot arrives with a soft bounce (not a spring, not a thud). Ambient orbs breathe slowly. The palette is amber/peach, not clinical white. |
| **Confident** | The wordmark "imothy" fades up cleanly — no bounce, no flourish. It appears because it belongs there. The fly-to-nav handoff is purposeful: `power3.inOut`. |

**What it is NOT:** Playful, quirky, corporate, flashy, 3D, gimmicky.

**Target metaphor:** A master calligrapher finishing a signature — deliberate stroke, a mark of completion, then a quiet confidence that the work speaks for itself.

---

## 2. Disney 12 Principles Applied

| Principle | Application |
|-----------|-------------|
| **1. Squash & Stretch** | Sun dot overshoots to scale 1.15 on bounce, settles to 1.0. Not cartoonish — a whisper of life. |
| **2. Anticipation** | Strokes begin drawing before the dot appears. The eye is primed by the T-shape forming. |
| **3. Stage Direction** | Three clear beats: (a) T forms, (b) sun dot drops in, (c) wordmark rises. Each occupies its own temporal space. |
| **4. Straight-On/Hold** | The completed logo holds for 0.5s — a breath — before the handoff begins. |
| **5. Follow-Through** | The ambient orbs continue floating after the logo settles, reinforcing warmth without competing for attention. |
| **6. Slow-In/Slow-Out** | All motion uses `power2.out` or `expo.out` easing — no linear movement anywhere. |
| **7. Arc** | Sun dot follows a slight arc: drops from y=-18 to y=0 with a subtle lateral drift of 2px. |
| **8. Staging** | Logo centered on screen at 70% scale. Background gradient draws the eye inward. No clutter. |
| **9. Appeal** | The warm amber palette, the clean geometry, the restrained motion — everything feels intentional, not template-generated. |
| **10. Solid Drawing** | SVG paths use exact geometry matching the static logo. Stroke widths, font sizes, and positions are pixel-accurate. |
| **11. Animation** | 1.8s total intro timeline. Each element has a distinct role in the sequence. |
| **12. Exaggeration** | Subtle only: dot bounce amplitude is 0.15x (not 0.5x), wordmark rise is 6px (not 20px). The restraint IS the personality. |

---

## 3. Timeline

```
Time (s)    Element           Action                          Easing
────────    ────────          ────────                        ────────
0.00        T-bar (stroke)    Begin drawing                   power1.inOut
0.04        T-stem (stroke)   Begin drawing                   power1.inOut
0.08        T-curve (stroke)  Begin drawing                   power1.inOut
0.38        Strokes complete  Restore round caps              —
0.40        Sun dot           Drop from y=-18, opacity 0→1    power3.in
0.54        Sun dot           Bounce overshoot scale 1.15     back.out(1.6)
0.68        Sun dot           Settle to scale 1.0             —
0.60        Glow ring         Bloom from dot (scale 0→1.12)   expo.out
0.68        Wordmark          Fade up from y=6                power2.out
0.88        Hold              Logo complete — breathe          —
1.38        Ambient orbs      Wake up (opacity 0→0.6)         power2.out
1.58        Replay button     Fade in                         power2.out
```

**Total intro duration:** 1.58s to full rest.

---

## 4. Easing Tokens

```css
--ease-stroke: cubic-bezier(0.4, 0, 0.2, 1);        /* power1.inOut */
--ease-gravity: cubic-bezier(0.4, 0, 1, 1);          /* power3.in */
--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);    /* back.out(1.6) */
--ease-bloom: cubic-bezier(0.16, 1, 0.3, 1);         /* expo.out */
--ease-rise: cubic-bezier(0.25, 1, 0.5, 1);          /* power2.out */
--ease-fly: cubic-bezier(0.32, 0, 0.67, 0);          /* power3.inOut */
```

---

## 5. Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| LOGO_INK | `#3d2e2a` | T-stroke, wordmark |
| LOGO_SUN | `#f5a623` | Sun dot |
| BG_WARM_1 | `#fff6ea` | Radial gradient center |
| BG_WARM_2 | `#ffedd6` | Radial gradient mid |
| BG_WARM_3 | `#f6d9b6` | Radial gradient edge |
| ORB_SUN | `rgba(255,217,138,0.55)` | Sun orb |
| ORB_PEACH | `rgba(255,193,170,0.45)` | Peach orb |
| ORB_SKY | `rgba(255,232,168,0.42)` | Sky orb |

---

## 6. Accessibility

- `prefers-reduced-motion: reduce` — all motion collapses to a single 0.3s fade-in of the complete logo. No stroke drawing, no bounce, no orbs.
- Replay button has `aria-label="Replay animation"`.
- Logo SVG has `role="img"` and `aria-label="Timothy"`.

---

## 7. Integration Notes

The standalone HTML at `public/logo_motion.html` is a self-contained showcase. The React integration in `src/components/effects/LogoIntro.tsx` uses the same animation logic but with GSAP for the fly-to-navbar handoff, which requires screen-coordinate measurements that CSS alone cannot provide.

Key differences between HTML and React versions:
- HTML: CSS `@keyframes` + `cubic-bezier` easing, no JS animation library
- React: GSAP timeline with `power1.inOut`, `back.out(1.6)`, `expo.out` easings (near-equivalents of the CSS cubic-beziers above)
- Both share the same timeline structure, easing tokens, and personality brief
