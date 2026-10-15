@echo off
echo ===================================================
echo   Compiling EduTrack Antigravity Campus Platform
echo ===================================================
if not exist bin mkdir bin
powershell -NoProfile -ExecutionPolicy Bypass -Command "$srcs = Get-ChildItem -Recurse -Filter *.java src | ForEach-Object { $_.FullName }; & javac -d bin $srcs"
if %errorlevel% neq 0 (
    echo [ERROR] Compilation failed!
    exit /b %errorlevel%
)
echo [SUCCESS] Compilation completed successfully into bin/ directory!
