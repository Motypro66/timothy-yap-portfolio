# Fetch CC0 GLBs + Poly Haven 1k textures for compose_cc0_studio.py
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$hi = Join-Path $PSScriptRoot 'assets\homeinterior'
$cc0 = Join-Path $PSScriptRoot 'assets\cc0'
$tex = Join-Path $PSScriptRoot 'assets\textures'
New-Item -ItemType Directory -Force -Path $hi, $cc0, $tex | Out-Null

$zip = Join-Path $PSScriptRoot 'assets\homeinteriorassets.zip'
if (-not (Test-Path (Join-Path $hi 'table.glb'))) {
  curl.exe -L -o $zip 'https://opengameart.org/sites/default/files/homeinteriorassets.zip'
  Expand-Archive -Force -Path $zip -DestinationPath $hi
}

$base = 'https://raw.githubusercontent.com/ToxSam/cc0-models-Polygonal-Mind/main/projects/avatar-show'
foreach ($f in @('Pot_Plant.glb', 'CoffeeMug.glb', 'TableLamp.glb')) {
  $out = Join-Path $cc0 $f
  if (-not (Test-Path $out)) { curl.exe -L -o $out "$base/$f" }
}

$textures = @(
  @('wood_floor_worn_diff_1k.jpg', 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/wood_floor_worn/wood_floor_worn_diff_1k.jpg'),
  @('wood_floor_worn_nor_gl_1k.jpg', 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/wood_floor_worn/wood_floor_worn_nor_gl_1k.jpg'),
  @('wood_floor_worn_rough_1k.jpg', 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/wood_floor_worn/wood_floor_worn_rough_1k.jpg'),
  @('plastered_wall_diff_1k.jpg', 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/plastered_wall/plastered_wall_diff_1k.jpg'),
  @('plastered_wall_nor_gl_1k.jpg', 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/plastered_wall/plastered_wall_nor_gl_1k.jpg'),
  @('plastered_wall_rough_1k.jpg', 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/plastered_wall/plastered_wall_rough_1k.jpg'),
  @('wood_table_diff_1k.jpg', 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/wood_table/wood_table_diff_1k.jpg'),
  @('wood_table_nor_gl_1k.jpg', 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/wood_table/wood_table_nor_gl_1k.jpg'),
  @('wood_table_rough_1k.jpg', 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/wood_table/wood_table_rough_1k.jpg'),
  @('brown_leather_diff_1k.jpg', 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/brown_leather/brown_leather_diff_1k.jpg'),
  @('brown_leather_nor_gl_1k.jpg', 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/brown_leather/brown_leather_nor_gl_1k.jpg'),
  @('brown_leather_rough_1k.jpg', 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/brown_leather/brown_leather_rough_1k.jpg'),
  @('carpet_persian_diff_1k.jpg', 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/carpet_persian/carpet_persian_diff_1k.jpg'),
  @('carpet_persian_nor_gl_1k.jpg', 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/carpet_persian/carpet_persian_nor_gl_1k.jpg'),
  @('carpet_persian_rough_1k.jpg', 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/carpet_persian/carpet_persian_rough_1k.jpg'),
  @('metal_plate_diff_1k.jpg', 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/metal_plate/metal_plate_diff_1k.jpg'),
  @('metal_plate_nor_gl_1k.jpg', 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/metal_plate/metal_plate_nor_gl_1k.jpg'),
  @('metal_plate_rough_1k.jpg', 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/metal_plate/metal_plate_rough_1k.jpg')
)
foreach ($pair in $textures) {
  $out = Join-Path $tex $pair[0]
  if (-not (Test-Path $out)) { curl.exe -L -o $out $pair[1] }
}

Write-Host 'Assets ready under blender/assets/'
