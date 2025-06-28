@echo off
echo ========================================
echo  Construyendo Ejecutable - TradingViewer
echo ========================================
echo.

REM Activar entorno virtual si existe
if exist ".venv\Scripts\activate.bat" (
    echo Activando entorno virtual...
    call .venv\Scripts\activate.bat
)

REM Verificar que PyInstaller esté disponible
uv run python -c "import PyInstaller" >nul 2>&1
if errorlevel 1 (
    echo Error: PyInstaller no está instalado
    echo Ejecuta primero: install_deps.bat
    pause
    exit /b 1
)

echo Construyendo ejecutable...
uv run pyinstaller ^
    --onefile ^
    --windowed ^
    --name "TradingViewer" ^
    --distpath "./dist" ^
    --workpath "./build" ^
    --specpath "./build" ^
    launcher.py

if errorlevel 1 (
    echo Error: Falló la construcción
    echo.
    echo Intentando construcción básica...
    uv run pyinstaller --onefile --name "TradingViewer" launcher.py
    if errorlevel 1 (
        echo Error: Falló la construcción básica
        pause
        exit /b 1
    )
)

echo.
echo Copiando archivos adicionales...
if not exist "dist\config.json" (
    copy "config.json" "dist\" >nul 2>&1
)
if not exist "dist\worker.py" (
    copy "worker.py" "dist\" >nul 2>&1
)

echo.
echo ========================================
echo  EJECUTABLE CREADO EXITOSAMENTE
echo ========================================
echo.
echo Ejecutable: dist\TradingViewer.exe
echo.
echo Para distribuir, copia la carpeta 'dist' completa.
echo.
pause 