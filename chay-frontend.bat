@echo off
cd /d "%~dp0frontend"
if not exist node_modules call npm install
echo Frontend goi API: 
type .env.local
npm start
pause
