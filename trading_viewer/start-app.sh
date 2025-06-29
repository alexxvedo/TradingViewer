#!/bin/bash

echo "🚀 Iniciando Trading Viewer..."
echo

# Matar procesos previos
pkill -f "electron" 2>/dev/null
pkill -f "next-server" 2>/dev/null

# Esperar un momento
sleep 2

echo "📱 Iniciando Next.js..."
npm run dev &
NEXTJS_PID=$!

echo "⏳ Esperando a que Next.js esté listo..."
sleep 8

echo "🖥️  Iniciando Electron..."
NODE_ENV=development electron . --no-sandbox --disable-gpu --disable-software-rasterizer --disable-dev-shm-usage &
ELECTRON_PID=$!

echo "✅ Aplicación iniciada!"
echo "🔍 Next.js PID: $NEXTJS_PID"
echo "🔍 Electron PID: $ELECTRON_PID"
echo
echo "Para cerrar la aplicación, presiona Ctrl+C"

# Función para limpiar al salir
cleanup() {
    echo
    echo "🛑 Cerrando aplicación..."
    kill $NEXTJS_PID 2>/dev/null
    kill $ELECTRON_PID 2>/dev/null
    pkill -f "electron" 2>/dev/null
    pkill -f "next-server" 2>/dev/null
    echo "✅ Aplicación cerrada"
    exit 0
}

# Capturar Ctrl+C
trap cleanup INT

# Esperar indefinidamente
wait 