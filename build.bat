@echo off
echo ========================================
echo  MT5 Portable Launcher - Build Script
echo ========================================
echo.


echo [1/5] Creando entorno virtual...
uv venv

echo [2/5] Activando entorno virtual...
call .venv\Scripts\activate.bat

echo [3/5] Instalando dependencias...
uv pip install PySide6 MetaTrader5 watchdog psutil pyinstaller

echo [4/5] Construyendo ejecutable con PyInstaller...

REM Verificar que PyInstaller esté instalado
uv run pyinstaller --version >nul 2>&1
if errorlevel 1 (
    echo Error: PyInstaller no está instalado correctamente
    echo Intentando reinstalar PyInstaller...
    uv pip install --force-reinstall pyinstaller
)

uv run pyinstaller ^
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
    echo.
    echo Intentando construcción alternativa...
    uv run pyinstaller --onefile --name "TradingViewer" launcher.py
    if errorlevel 1 (
        echo Error: Falló la construcción alternativa
        pause
        exit /b 1
    )
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
echo Ejecutable creado en: dist\TradingViewer.exe
echo.
echo Para distribuir, copia toda la carpeta 'dist' que contiene:
echo - TradingViewer.exe (ejecutable principal)
echo - config.json (archivo de configuración)
echo.
echo Presiona cualquier tecla para abrir la carpeta dist...
pause >nul
explorer dist

echo.
echo ¿Deseas ejecutar el launcher ahora? (S/N)
set /p choice=
if /i "%choice%"=="S" (
    start "" "dist\TradingViewer.exe"
)

echo.
echo Build script completado.
pause 