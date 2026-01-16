@echo off
cd /d %~dp0

echo Starting SERVER...
start /b cmd /c "cd server && node index.js"

timeout /t 1 >nul

echo Starting CLIENT...
start /b cmd /c "cd client && npm run dev"

timeout /t 2 >nul

echo Opening browser...
start "" http://localhost:5173/

pause
