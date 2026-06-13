@echo off
REM Run from repo root or blender folder. Adjust BLENDER path if needed.
set BLENDER="C:\Program Files\Blender Foundation\Blender 4.4\blender.exe"
if not exist %BLENDER% set BLENDER="C:\Program Files\Blender Foundation\Blender 4.3\blender.exe"
if not exist %BLENDER% set BLENDER="C:\Program Files\Blender Foundation\Blender 4.2\blender.exe"
if not exist %BLENDER% set BLENDER="C:\Program Files\Blender Foundation\Blender 4.1\blender.exe"
if not exist %BLENDER% set BLENDER="C:\Program Files\Blender Foundation\Blender 5.1\blender.exe"

echo Using %BLENDER%
%BLENDER% --background --python "%~dp0generate_sunny_room.py"
pause
