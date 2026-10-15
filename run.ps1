param (
    [string]$Mode = ""
)

if (-not (Test-Path "bin")) {
    & .\build.ps1
}

Write-Host "=== Launching EduTrack Orbital Campus Platform ===" -ForegroundColor Cyan
if ($Mode -eq "test") {
    java -cp bin org.edutrack.EduTrackTestSuite
} elseif ($Mode -eq "server") {
    java -cp bin org.edutrack.Main --server
} else {
    java -cp bin org.edutrack.Main
}
