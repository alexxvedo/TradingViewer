#!/bin/bash

echo "========================================"
echo "  MT5 Portable Launcher - Build Script"
echo "========================================"
echo



echo "[1/5] Creando entorno virtual..."
uv venv

echo "[2/5] Activando entorno virtual..."
source .venv/bin/activate

echo "[3/5] Instalando dependencias..."
uv pip install -e .

echo "[4/5] Construyendo ejecutable con PyInstaller..."
pyinstaller \
    --onefile \
    --windowed \
    --name "TradingViewer" \
    --add-data "worker.py:." \
    --add-data "config.json:." \
    --distpath "./dist" \
    --workpath "./build" \
    --specpath "./build" \
    launcher.py

if [ $? -ne 0 ]; then
    echo "Error: Falló la construcción con PyInstaller"
    exit 1
fi

echo "[5/5] Copiando archivos adicionales..."
if [ ! -f "dist/config.json" ]; then
    cp "config.json" "dist/"
fi

echo
echo "========================================"
echo "  BUILD COMPLETADO EXITOSAMENTE"
echo "========================================"
echo
echo "Ejecutable creado en: dist/MT5PortableLauncher"
echo
echo "Para distribuir, copia toda la carpeta 'dist' que contiene:"
echo "- MT5PortableLauncher (ejecutable principal)"
echo "- config.json (archivo de configuración)"
echo

# Hacer ejecutable el archivo generado
chmod +x dist/MT5PortableLauncher

echo "¿Deseas ejecutar el launcher ahora? (s/N)"
read -r choice
if [[ "$choice" =~ ^[Ss]$ ]]; then
    ./dist/MT5PortableLauncher &
fi

echo
echo "Build script completado." 