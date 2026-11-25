@echo off
cd /d "%~dp0"
findstr /r /c:"^DATABASE_URL=..*" backend\.env >nul
if errorlevel 1 (
  echo [!] Chua co connection string trong backend\.env
  echo     Neon ^> chon nhanh csdl-baocao ^> Connect ^> Copy, dan sau DATABASE_URL= roi luu lai.
  notepad backend\.env
  pause
  exit /b
)
if not exist venv\Scripts\python.exe (
  echo Tao moi truong ao venv...
  py -3.11 -m venv venv 2>nul || python -m venv venv
)
call venv\Scripts\activate
python --version
echo Cai thu vien (lan dau mat 1-2 phut)...
pip install -q -r backend\requirements.txt
cd backend
echo.
echo Cap nhat bang (migrate)...
python manage.py migrate
echo Backend chay tai http://127.0.0.1:8000/api/tours/  -  Dang ky: http://127.0.0.1:8000/api/auth/register/
python manage.py runserver
pause
