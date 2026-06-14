$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root
$blender = 'C:\Program Files\Blender Foundation\Blender 5.1\blender.exe'
$log = Join-Path $root 'blender-export.log'
$prev = $ErrorActionPreference
$ErrorActionPreference = 'Continue'
& $blender --background --python (Join-Path $PSScriptRoot 'compose_cc0_studio.py') *>&1 | Tee-Object -FilePath $log
$code = $LASTEXITCODE
$ErrorActionPreference = $prev
if ($code -ne 0) { throw "Blender export failed with exit code $code" }
$glb = Join-Path $root 'public\models\sunny-room.glb'
if (-not (Test-Path $glb)) { throw "Missing export: $glb" }
Write-Output "GLB_BYTES=$((Get-Item $glb).Length)"
