# 📦 Guía de Instalación - MT5 Portable Launcher

Esta guía te llevará paso a paso para instalar y configurar el MT5 Portable Launcher.

## 🎯 Instalación Rápida

### Para Windows (Recomendado)

1. **Descargar el proyecto**

   ```cmd
   git clone https://github.com/tu-usuario/mt5-portable-launcher.git
   cd mt5-portable-launcher
   ```

2. **Ejecutar el script de construcción**

   ```cmd
   build.bat
   ```

   Este script automáticamente:

   - ✅ Instala `uv` si no está presente
   - ✅ Crea el entorno virtual
   - ✅ Instala todas las dependencias
   - ✅ Construye el ejecutable con PyInstaller
   - ✅ Copia los archivos necesarios

3. **¡Listo!** El ejecutable estará en `dist/MT5PortableLauncher.exe`

### Para Linux/Mac

1. **Descargar el proyecto**

   ```bash
   git clone https://github.com/tu-usuario/mt5-portable-launcher.git
   cd mt5-portable-launcher
   ```

2. **Dar permisos y ejecutar el script**
   ```bash
   chmod +x build.sh
   ./build.sh
   ```

## 🛠️ Instalación Manual

### Paso 1: Prerrequisitos

#### Windows

- **Python 3.10+** - [Descargar desde python.org](https://www.python.org/downloads/)
- **MetaTrader 5** - [Descargar desde MetaQuotes](https://www.metatrader5.com/en/download)
- **Git** (opcional) - [Descargar desde git-scm.com](https://git-scm.com/downloads)

#### Linux

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install python3 python3-pip python3-venv git

# CentOS/RHEL
sudo yum install python3 python3-pip git

# Arch Linux
sudo pacman -S python python-pip git
```

### Paso 2: Instalar uv

```bash
# Instalar uv (gestor de paquetes rápido)
pip install uv
```

### Paso 3: Configurar el proyecto

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/tu-usuario/mt5-portable-launcher.git
   cd mt5-portable-launcher
   ```

2. **Crear entorno virtual**

   ```bash
   uv venv
   ```

3. **Activar entorno virtual**

   **Windows:**

   ```cmd
   .venv\Scripts\activate
   ```

   **Linux/Mac:**

   ```bash
   source .venv/bin/activate
   ```

4. **Instalar dependencias**
   ```bash
   uv pip install -e .
   ```

### Paso 4: Configurar cuentas MT5

1. **Editar `config.json`**

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

2. **Verificar rutas de MT5**
   - Windows: `C:/Program Files/MetaTrader 5/terminal64.exe`
   - Linux con Wine: `~/.wine/drive_c/Program Files/MetaTrader 5/terminal64.exe`

### Paso 5: Probar la instalación

```bash
# Ejecutar el launcher en modo desarrollo
python launcher.py
```

## 🏗️ Construcción del Ejecutable

### Opción 1: Script Automático (Recomendado)

**Windows:**

```cmd
build.bat
```

**Linux/Mac:**

```bash
chmod +x build.sh
./build.sh
```

### Opción 2: Manual con PyInstaller

1. **Instalar PyInstaller**

   ```bash
   uv pip install pyinstaller
   ```

2. **Construir ejecutable básico**

   ```bash
   pyinstaller --onefile --windowed launcher.py
   ```

3. **Construir con archivos adicionales**
   ```bash
   pyinstaller \
       --onefile \
       --windowed \
       --name "MT5PortableLauncher" \
       --add-data "worker.py;." \
       --add-data "config.json;." \
       launcher.py
   ```

### Opción 3: Con icono personalizado

1. **Agregar icono** (opcional)

   ```bash
   # Crear carpeta assets
   mkdir assets
   # Copiar tu icono como assets/icon.ico
   ```

2. **Construir con icono**
   ```bash
   pyinstaller \
       --onefile \
       --windowed \
       --name "MT5PortableLauncher" \
       --icon "assets/icon.ico" \
       --add-data "worker.py;." \
       --add-data "config.json;." \
       launcher.py
   ```

## 📁 Estructura de Archivos

Después de la instalación, tendrás esta estructura:

```
mt5-portable-launcher/
├── launcher.py              # Aplicación principal
├── worker.py               # Worker para cada cuenta
├── config.json             # Configuración de cuentas
├── pyproject.toml          # Configuración del proyecto
├── README.md               # Documentación principal
├── INSTALL.md              # Esta guía
├── build.bat               # Script de construcción (Windows)
├── build.sh                # Script de construcción (Linux/Mac)
├── .venv/                  # Entorno virtual
├── build/                  # Archivos temporales de PyInstaller
└── dist/                   # Ejecutable final
    ├── MT5PortableLauncher.exe  # Ejecutable principal
    └── config.json              # Configuración
```

## 🔧 Configuración Avanzada

### Variables de Entorno

Puedes configurar estas variables de entorno:

```bash
# Directorio base para archivos temporales
export MT5_TEMP_DIR="/tmp/mt5_launcher"

# Nivel de logging (DEBUG, INFO, WARNING, ERROR)
export MT5_LOG_LEVEL="INFO"

# Puerto para comunicación interna (por defecto 9999)
export MT5_LAUNCHER_PORT="9999"
```

### Configuración de PyInstaller

Crear archivo `launcher.spec` personalizado:

```python
# launcher.spec
a = Analysis(
    ['launcher.py'],
    pathex=[],
    binaries=[],
    datas=[
        ('worker.py', '.'),
        ('config.json', '.'),
        ('assets', 'assets'),
    ],
    hiddenimports=[
        'PySide6.QtCore',
        'PySide6.QtWidgets',
        'PySide6.QtGui',
        'MetaTrader5',
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=None,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=None)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='MT5PortableLauncher',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon='assets/icon.ico'
)
```

Luego construir con:

```bash
pyinstaller launcher.spec
```

## 🚦 Solución de Problemas de Instalación

### Error: "uv no encontrado"

```bash
# Instalar uv manualmente
pip install uv
# O usando curl
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### Error: "Python no encontrado"

**Windows:**

1. Descargar Python desde [python.org](https://www.python.org/downloads/)
2. Marcar "Add Python to PATH" durante la instalación
3. Reiniciar el terminal

**Linux:**

```bash
# Ubuntu/Debian
sudo apt install python3 python3-pip

# CentOS/RHEL
sudo yum install python3 python3-pip
```

### Error: "MetaTrader5 module not found"

```bash
# Reinstalar MetaTrader5
uv pip uninstall MetaTrader5
uv pip install MetaTrader5
```

### Error: "PySide6 not found"

```bash
# Reinstalar PySide6
uv pip uninstall PySide6
uv pip install PySide6
```

### Error: "Permission denied" (Linux)

```bash
# Dar permisos a los scripts
chmod +x build.sh
chmod +x dist/MT5PortableLauncher
```

### Error: "PyInstaller failed"

1. **Limpiar archivos temporales**

   ```bash
   rm -rf build/ dist/ *.spec
   ```

2. **Reinstalar PyInstaller**

   ```bash
   uv pip uninstall pyinstaller
   uv pip install pyinstaller
   ```

3. **Construir en modo debug**
   ```bash
   pyinstaller --onefile --windowed --debug all launcher.py
   ```

## 📋 Verificación de la Instalación

### 1. Verificar dependencias

```bash
# Activar entorno virtual
source .venv/bin/activate  # Linux/Mac
# o
.venv\Scripts\activate     # Windows

# Verificar instalación
python -c "import PySide6; print('PySide6 OK')"
python -c "import MetaTrader5; print('MetaTrader5 OK')"
python -c "import watchdog; print('Watchdog OK')"
```

### 2. Verificar ejecutable

```bash
# Verificar que el ejecutable se creó
ls -la dist/MT5PortableLauncher*

# Verificar que es ejecutable (Linux/Mac)
file dist/MT5PortableLauncher
```

### 3. Probar ejecución

```bash
# Ejecutar en modo desarrollo
python launcher.py

# Ejecutar el ejecutable
./dist/MT5PortableLauncher  # Linux/Mac
dist\MT5PortableLauncher.exe  # Windows
```

## 🎯 Próximos Pasos

1. **Configurar cuentas MT5** en `config.json`
2. **Leer la documentación** en `README.md`
3. **Ejecutar el launcher** y verificar conexiones
4. **Personalizar configuración** según tus necesidades

## 💡 Consejos

- **Backup de configuración**: Siempre respalda tu `config.json`
- **Prueba en demo**: Prueba primero con cuentas demo
- **Monitorea recursos**: Vigila el uso de CPU y memoria
- **Actualiza regularmente**: Mantén las dependencias actualizadas

---

¿Necesitas ayuda? Consulta el [README.md](README.md) o crea un issue en el repositorio.
