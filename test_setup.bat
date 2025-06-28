@echo off
echo ========================================
echo  Verificando Instalación - TradingViewer
echo ========================================
echo.

REM Verificar si uv está instalado
echo [1/6] Verificando uv...
uv --version >nul 2>&1
if errorlevel 1 (
    echo ❌ uv no está instalado
    echo Instala uv con: pip install uv
    pause
    exit /b 1
) else (
    echo ✅ uv está instalado
)

REM Verificar entorno virtual
echo [2/6] Verificando entorno virtual...
if exist ".venv" (
    echo ✅ Entorno virtual existe
) else (
    echo ❌ Entorno virtual no encontrado
    echo Ejecuta: uv venv
    pause
    exit /b 1
)

REM Verificar dependencias
echo [3/6] Verificando PySide6...
uv run python -c "import PySide6; print('✅ PySide6 OK')" 2>nul
if errorlevel 1 (
    echo ❌ PySide6 no instalado
) else (
    echo ✅ PySide6 instalado
)

echo [4/6] Verificando MetaTrader5...
uv run python -c "import MetaTrader5; print('✅ MetaTrader5 OK')" 2>nul
if errorlevel 1 (
    echo ❌ MetaTrader5 no instalado
) else (
    echo ✅ MetaTrader5 instalado
)

echo [5/6] Verificando PyInstaller...
uv run python -c "import PyInstaller; print('✅ PyInstaller OK')" 2>nul
if errorlevel 1 (
    echo ❌ PyInstaller no instalado
) else (
    echo ✅ PyInstaller instalado
)

echo [6/6] Verificando archivos del proyecto...
if exist "launcher.py" (
    echo ✅ launcher.py encontrado
) else (
    echo ❌ launcher.py no encontrado
)

if exist "worker.py" (
    echo ✅ worker.py encontrado
) else (
    echo ❌ worker.py no encontrado
)

if exist "config.json" (
    echo ✅ config.json encontrado
) else (
    echo ❌ config.json no encontrado
)

echo.
echo ========================================
echo  VERIFICACIÓN COMPLETADA
echo ========================================
echo.
echo Si hay errores (❌), ejecuta:
echo 1. install_deps.bat (para instalar dependencias)
echo 2. Verifica que los archivos del proyecto estén presentes
echo.
echo Si todo está bien (✅), puedes ejecutar:
echo - run.bat (modo desarrollo)
echo - build_exe.bat (crear ejecutable)
echo.
pause 