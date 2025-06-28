@echo off
echo ========================================
echo  Instalando Dependencias - TradingViewer
echo ========================================
echo.


echo [1/3] Creando entorno virtual...
uv venv

echo [2/3] Activando entorno virtual...
call .venv\Scripts\activate.bat

echo [3/3] Instalando dependencias...
echo Instalando PySide6...
uv pip install PySide6

echo Instalando MetaTrader5...
uv pip install MetaTrader5

echo Instalando watchdog...
uv pip install watchdog

echo Instalando psutil...
uv pip install psutil

echo Instalando pyinstaller...
uv pip install pyinstaller

echo.
echo ========================================
echo  DEPENDENCIAS INSTALADAS EXITOSAMENTE
echo ========================================
echo.
echo Ahora puedes ejecutar:
echo 1. python launcher.py (para modo desarrollo)
echo 2. build.bat (para crear ejecutable)
echo.
pause 