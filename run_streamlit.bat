@echo off
echo.
echo ========================================
echo   🚀 TradingViewer - Streamlit Web App
echo ========================================
echo.

echo [1/3] Verificando dependencias...
uv pip show streamlit >nul 2>&1
if errorlevel 1 (
    echo Instalando dependencias de Streamlit...
    uv pip install streamlit pandas plotly
)

echo.
echo [2/3] Iniciando servidor Streamlit...
echo.
echo 🌐 La aplicación se abrirá en tu navegador
echo 📱 URL: http://localhost:8501
echo 🔄 Presiona Ctrl+C para detener el servidor
echo.

uv run streamlit run streamlit_app.py --server.port 8501 --server.address localhost

echo.
echo ✅ Servidor Streamlit detenido
pause 