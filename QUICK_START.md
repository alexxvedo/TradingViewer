# 🚀 Guía Rápida - TradingViewer

## 📋 Instalación Rápida (Windows)

### Opción 1: Scripts Automáticos (Recomendado)

1. **Instalar dependencias:**

   ```cmd
   install_deps.bat
   ```

2. **Ejecutar en modo desarrollo:**

   ```cmd
   run.bat
   ```

3. **Crear ejecutable:**
   ```cmd
   build_exe.bat
   ```

### Opción 2: Paso a Paso

1. **Instalar dependencias manualmente:**

   ```cmd
   pip install uv
   uv venv
   uv pip install PySide6 MetaTrader5 watchdog psutil pyinstaller
   ```

2. **Configurar cuentas en `config.json`:**

   ```json
   [
     {
       "name": "Mi Cuenta Demo",
       "login": 123456,
       "password": "mi_password",
       "server": "MetaQuotes-Demo",
       "terminal_path": "C:/Program Files/MetaTrader 5/terminal64.exe",
       "enabled": true,
       "update_interval": 5
     }
   ]
   ```

3. **Ejecutar:**
   ```cmd
   uv run python launcher.py
   ```

## 🛠️ Scripts Disponibles

| Script             | Descripción                                    |
| ------------------ | ---------------------------------------------- |
| `install_deps.bat` | Instala todas las dependencias necesarias      |
| `test_setup.bat`   | Verifica que todo esté instalado correctamente |
| `run.bat`          | Ejecuta la aplicación en modo desarrollo       |
| `build_exe.bat`    | Crea el ejecutable final                       |
| `build.bat`        | Script completo (instala + construye)          |

## ⚙️ Configuración Básica

1. **Editar `config.json`** con tus credenciales MT5
2. **Verificar rutas** de MetaTrader 5
3. **Ejecutar `run.bat`** para probar
4. **Usar `build_exe.bat`** para crear ejecutable

## 🎯 Características

- ✅ **Múltiples cuentas MT5** en paralelo
- ✅ **Carpetas temporales** independientes
- ✅ **Interfaz gráfica** moderna
- ✅ **Monitoreo en tiempo real**
- ✅ **Ventanas MT5 ocultas**
- ✅ **Un solo ejecutable** final

## 🚦 Solución de Problemas

### Error: "Python no encontrado"

- Instalar Python 3.10+ desde [python.org](https://www.python.org/downloads/)
- Marcar "Add Python to PATH"

### Error: "Dependencias no instaladas"

- Ejecutar `install_deps.bat`

### Error: "PyInstaller failed"

- Ejecutar `install_deps.bat` nuevamente
- Probar `build_exe.bat` en lugar de `build.bat`

### Error: "No se puede conectar a MT5"

- Verificar credenciales en `config.json`
- Verificar ruta de `terminal_path`
- Asegurar que MT5 esté instalado

## 📁 Estructura de Archivos

```
TradingViewer/
├── launcher.py          # Aplicación principal
├── worker.py           # Worker para cada cuenta
├── config.json         # Configuración de cuentas
├── install_deps.bat    # Instalar dependencias
├── run.bat            # Ejecutar en desarrollo
├── build_exe.bat      # Crear ejecutable
├── build.bat          # Script completo
└── dist/              # Ejecutable final
    ├── TradingViewer.exe
    ├── config.json
    └── worker.py
```

## 🎮 Uso de la Interfaz

1. **Tab Cuentas:** Ver estado de todas las cuentas
2. **Tab Posiciones:** Ver posiciones abiertas
3. **Tab Directorios:** Gestionar carpetas temporales
4. **Tab Logs:** Ver registro de actividades

### Botones Principales:

- ▶ **Iniciar Todo:** Activa todos los workers
- ⏹ **Detener Todo:** Detiene todos los workers
- 🔄 **Recargar Config:** Recarga configuración
- 🧹 **Limpiar Temporales:** Limpia directorios

---

**¿Problemas?** Consulta el [README.md](README.md) completo o el [INSTALL.md](INSTALL.md) detallado.
