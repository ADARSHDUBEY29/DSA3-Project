@echo off
if not exist bin (
    call build.bat
)
echo Starting EduTrack Orbital Campus Platform...
java -cp bin org.edutrack.Main %*
