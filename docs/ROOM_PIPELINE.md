# 3D Room Journey — Pipeline & Priority

## Structure (always this order)

```
1. STRUCTURE   → scroll map, camera path, room landmarks (Floor/Ceiling/desk)
2. CORRECTNESS → no clipping, floor alignment, path inside walkable volume
3. FEEL        → smooth scroll, eye height, lighting
4. POLISH      → mesh detail, materials, props
```

Do **not** tune camera FOV before floor alignment is correct.  
Do **not** add props before navigation volume exists (causes clipping).

## Severity matrix

| Priority | Issue | Symptom | Fix layer |
|----------|--------|---------|-----------|
| **P0** | Camera clipping (穿模) | Camera inside desk/wall/monitor | `cameraCollision.ts` + perimeter shots |
| **P0** | Wrong floor align | Camera under floor / wrong height | `normalizeRoom` uses `Floor` mesh top |
| **P1** | Scroll not smooth | Jumps between sections, lag | Single scrub timeline, no multi-pin jumps |
| **P1** | Double easing | Camera fights scroll | Direct follow while scrolling |
| **P2** | Blocky room | “Squares only” look | Blender script detail + bevels |
| **P3** | External GLB | Photoreal room | User drops asset → `public/models/sunny-room.glb` |

## How the model is made

1. **`blender/generate_sunny_room.py`** — procedural room in Blender (not hand-modeled in the browser).
2. Export → **`public/models/sunny-room.glb`**
3. Site loads GLB, **`normalizeRoom()`** scales and aligns floor, **`analyzeRoomLayout()`** finds landmarks.
4. **`buildCameraPathFromLayout()`** + **`sanitizeCameraPath()`** place shots on the walkable perimeter.

Replace the GLB anytime (CGTrader / Meshy / etc.) — see `blender/README.md`.

## Mistakes we do not repeat

- Using **full scene bbox min Y** for floor (geometry below floor broke height).
- **Hero target on monitor** while camera path crosses desk volume.
- **Multiple ScrollTrigger pins** with weighted progress (section resets → camera jumps).
- **Random scroll shake** on camera while scrubbing.
- **SunStreak** volume extending below floor (inflated bbox).

## Verification checklist

- [ ] Hero: see room, desk, window — not through monitor
- [ ] Full scroll 0→1: progress monotonic, no backward jump
- [ ] No camera inside brown desk / white monitor blocks
- [ ] Mobile: DPR low tier still loads GLB
