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
