@echo off
echo ========================================
echo  MT5 Portable Launcher - Build Script
echo ========================================
echo.

REM Verificar si Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python no está instalado o no está en el PATH
    pause
    exit /b 1
)

REM Verificar si uv está instalado
uv --version >nul 2>&1
if errorlevel 1 (
    echo Instalando uv...
    pip install uv
)

echo [1/5] Creando entorno virtual...
uv venv

echo [2/5] Activando entorno virtual...
call .venv\Scripts\activate.bat

echo [3/5] Instalando dependencias...
uv pip install -e .

echo [4/5] Construyendo ejecutable con PyInstaller...
pyinstaller ^
    --onefile ^
    --windowed ^
    --name "TradingViewer" ^
    --add-data "worker.py;." ^
    --add-data "config.json;." ^
    --distpath "./dist" ^
    --workpath "./build" ^
    --specpath "./build" ^
    launcher.py

if errorlevel 1 (
    echo Error: Falló la construcción con PyInstaller
    pause
    exit /b 1
)

echo [5/5] Copiando archivos adicionales...
if not exist "dist\config.json" (
    copy "config.json" "dist\"
)

echo.
echo ========================================
echo  BUILD COMPLETADO EXITOSAMENTE
echo ========================================
echo.
echo Ejecutable creado en: dist\MT5PortableLauncher.exe
echo.
echo Para distribuir, copia toda la carpeta 'dist' que contiene:
echo - MT5PortableLauncher.exe (ejecutable principal)
echo - config.json (archivo de configuración)
echo.
echo Presiona cualquier tecla para abrir la carpeta dist...
pause >nul
explorer dist

echo.
echo ¿Deseas ejecutar el launcher ahora? (S/N)
set /p choice=
if /i "%choice%"=="S" (
    start "" "dist\MT5PortableLauncher.exe"
)

echo.
echo Build script completado.
pause 