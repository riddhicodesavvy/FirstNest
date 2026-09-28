@echo off
echo ========================================================
echo STARTING SMART HOUSE BUDGET ^& REQUIREMENT ANALYZER
echo ========================================================
echo.
echo Starting FastAPI Backend (Port 8000)...
start "SmartHouse-Backend" cmd /k "python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload"

echo Starting Vite React Frontend (Port 5173)...
start "SmartHouse-Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers have been launched in separate windows!
echo Backend API: http://127.0.0.1:8000
echo Frontend UI: http://localhost:5173
echo API Docs:    http://127.0.0.1:8000/docs
echo.
pause
