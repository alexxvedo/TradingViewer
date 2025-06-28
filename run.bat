@echo off
echo ========================================
echo  Ejecutando TradingViewer - Modo Dev
echo ========================================
echo.

REM Activar entorno virtual si existe
if exist ".venv\Scripts\activate.bat" (
    echo Activando entorno virtual...
    call .venv\Scripts\activate.bat
)

REM Verificar que las dependencias estén instaladas
uv run python -c "import PySide6" >nul 2>&1
if errorlevel 1 (
    echo Error: Dependencias no instaladas
    echo Ejecuta primero: install_deps.bat
    pause
    exit /b 1
)

echo Iniciando TradingViewer...
echo.
uv run python launcher.py

pause 