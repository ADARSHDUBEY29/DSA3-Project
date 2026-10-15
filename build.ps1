Write-Host "=== Compiling EduTrack Antigravity Campus Platform ===" -ForegroundColor Cyan
if (-not (Test-Path "bin")) {
    New-Item -ItemType Directory -Path "bin" | Out-Null
}
$sources = Get-ChildItem -Recurse -Filter *.java src | ForEach-Object { $_.FullName }
javac -d bin $sources
if ($LASTEXITCODE -eq 0) {
    Write-Host "[SUCCESS] Compilation successful into bin/" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Compilation failed with exit code $LASTEXITCODE" -ForegroundColor Red
}
