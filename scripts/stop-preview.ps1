# Stop stray Vite preview/dev servers on common local ports (4173-4180, 5173).
param(
  [int[]]$Ports = @(3000, 4173, 4174, 4175, 4176, 4177, 4178, 4179, 4180, 5173)
)

$stopped = @()

foreach ($port in $Ports) {
  $connections = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
  foreach ($conn in $connections) {
    $procId = $conn.OwningProcess
    if ($procId -and $stopped -notcontains $procId) {
      Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
      $stopped += $procId
      Write-Output "Stopped PID $procId (port $port)"
    }
  }
}

if ($stopped.Count -eq 0) {
  Write-Output "No preview servers found on ports: $($Ports -join ', ')"
} else {
  Write-Output "Done. Stopped $($stopped.Count) process(es)."
}
