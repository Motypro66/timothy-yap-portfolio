# 3D model and texture attribution

All listed assets are used under CC0 1.0 or equivalent licenses at each source.

## OpenGameArt - Home Interior Assets

- Pack: Home Interior Assets (homeinteriorassets.zip)
- URL: https://opengameart.org/content/home-interior-assets
- Files used: table, bookcase, chair02, couch, books, vase, frame, cabinet, bench, stool (.glb)
- Local: `blender/assets/homeinterior/`

## Polygonal Mind - CC0 avatar-show (ToxSam mirror)

- Repo: https://github.com/ToxSam/cc0-models-Polygonal-Mind (projects/avatar-show/)
- Files used: Pot_Plant.glb, CoffeeMug.glb, TableLamp.glb
- Local: `blender/assets/cc0/`

## Poly Haven - PBR textures (1k JPG)

- Site: https://polyhaven.com/ (dl.polyhaven.org)
- wood_floor_worn: diff, nor_gl, rough
- plastered_wall: diff, nor_gl, rough
- wood_table: diff, nor_gl, rough
- carpet_persian: diff (optional; rug falls back to flat material if missing)
- metal_plate: diff, nor_gl, rough (optional; mouse uses flat metal if missing)
- Local: `blender/assets/textures/`

## Export

- Download: `blender/download_assets.ps1`
- Compose + export: `blender/export_room.ps1` or `blender/compose_cc0_studio.py` (Blender 5.1 headless)
- Output: `public/models/sunny-room.glb`
