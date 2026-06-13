# Sunny 3D room for Timothy Yap portfolio

## Option A — Blender GUI (first time)

1. Open **Blender** → top menu **Scripting**
2. **Open** → select `blender/generate_sunny_room.py`
3. Click **Run Script** (▶)
4. Check the console at the bottom: `Exported: .../public/models/sunny-room.glb`

## Option B — Double-click batch file

Run `blender/run-export.bat` (edit the Blender path inside if needed).

## Option C — Headless (terminal)

```bat
"C:\Program Files\Blender Foundation\Blender 4.4\blender.exe" --background --python "blender/generate_sunny_room.py"
```

## Option D — Replace with a downloaded room (CGTrader / Meshy / Hyper3D / Free3D)

You can swap in any **`.glb` / `.gltf`** interior model:

1. Browse / generate on a marketplace (examples):
   - [CGTrader — Blender room models](https://www.cgtrader.com/3d-models/blender-room)
   - [Meshy — Blender-tagged models](https://www.meshy.ai/tags/blender)
   - [Hyper3D Rodin workspace](http://hyper3d.ai/workspace/rodin)
   - [Free3D — Blender category](https://free3d.com/3d-models/blender)
2. Export or download as **GLB** (prefer &lt; 25 MB for GitHub; keep textures reasonable for mobile)
3. Rename to `public/models/sunny-room.glb` (overwrite)
4. Redeploy — the site normalizes scale, aligns the **Floor** mesh to ground, and builds scroll cameras from desk / monitor / window landmarks

**License:** use models you are allowed to ship (CC0, royalty-free, or purchased).  
**CC0 packs:** [PolygonalMind GLB collection](https://github.com/ToxSam/cc0-models-Polygonal-Mind), [MrEliptik office pack](https://mreliptik.itch.io/office-low-poly-pack).

Named meshes (`Floor`, `Ceiling`, `DeskTop`, `MonitorScreen`, `WindowGlass`, `Shelf`) improve camera targeting; otherwise the site falls back to bounds-based shots.

## After export

- File lands in `public/models/sunny-room.glb`
- Refresh the dev site or redeploy — the website loads this model automatically
- Re-run the script anytime you want to regenerate the room

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Script error on Run | Use Blender **4.0+** |
| Export path not found | Run from this repo; script creates `public/models/` |
| Viewport looks dark | Press **Z** → **Material Preview** |
| Website still shows fallback room | Hard refresh; confirm `public/models/sunny-room.glb` exists |

You do **not** need to model by hand — the script builds the whole room.
