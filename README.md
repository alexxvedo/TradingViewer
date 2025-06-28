# MT5 Portable Launcher

Un launcher de escritorio para gestionar múltiples cuentas de MetaTrader 5 en **modo portable** con carpetas temporales independientes.

## 🚀 Características

- **🎨 Interfaz Moderna**: Nueva UI con tema oscuro, gradientes y efectos visuales
- **📊 Dashboard de Métricas**: Tarjetas interactivas con balance, equity y P&L en tiempo real
- **🚀 Gestión Multi-Cuenta**: Maneja múltiples cuentas MT5 simultáneamente
- **💫 Modo Portable**: Cada instancia MT5 se ejecuta en su propio directorio temporal
- **🎯 Controles Intuitivos**: Botones con colores específicos y estados visuales
- **🔄 Ventanas Ocultas**: MT5 se ejecuta en segundo plano sin ventanas visibles
- **📈 Monitoreo Avanzado**: Dashboard con métricas principales y estado global
- **⚡ Gestión de Procesos**: Control completo de inicio/parada de workers
- **🔧 Configuración Dinámica**: Recarga automática al modificar config.json
- **🧹 Limpieza Automática**: Gestión inteligente de directorios temporales
- **📦 Empaquetado**: Compilación a ejecutable único con PyInstaller

## 📋 Requisitos

- **Python 3.10+**
- **Windows** (recomendado, aunque funciona en Linux)
- **MetaTrader 5** instalado
- **uv** para gestión de dependencias

## 🛠️ Instalación

### 1. Clonar o descargar el proyecto

```bash
git clone <tu-repo>
cd mt5-portable-launcher
```

### 2. Instalar dependencias con uv

```bash
# Instalar uv si no lo tienes
pip install uv

# Crear entorno virtual e instalar dependencias
uv venv
uv pip install -e .
```

### 3. Activar el entorno virtual

**Windows:**

```bash
.venv\Scripts\activate
```

**Linux/Mac:**

```bash
source .venv/bin/activate
```

## ⚙️ Configuración

### 1. Editar `config.json`

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
  },
  {
    "name": "Mi Cuenta Real",
    "login": 654321,
    "password": "mi_password_real",
    "server": "MiBroker-Real",
    "terminal_path": "C:/Program Files/MetaTrader 5/terminal64.exe",
    "enabled": true,
    "update_interval": 3
  }
]
```

### 2. Parámetros de configuración

| Campo             | Descripción                            | Ejemplo                                        |
| ----------------- | -------------------------------------- | ---------------------------------------------- |
| `name`            | Nombre descriptivo de la cuenta        | "Mi Cuenta Demo"                               |
| `login`           | Número de login MT5                    | 123456                                         |
| `password`        | Contraseña de la cuenta                | "mi_password"                                  |
| `server`          | Servidor del broker                    | "MetaQuotes-Demo"                              |
| `terminal_path`   | Ruta al ejecutable MT5                 | "C:/Program Files/MetaTrader 5/terminal64.exe" |
| `enabled`         | Si la cuenta está activa               | true/false                                     |
| `update_interval` | Intervalo de actualización en segundos | 5                                              |

## 🎯 Uso

### 1. Ejecutar el launcher

```bash
python launcher.py
```

### 🎨 Nueva Interfaz Moderna

La aplicación ahora cuenta con una **interfaz completamente renovada** con:

#### 🌟 **Header Moderno**

- Logo y título estilizado "🚀 TradingViewer"
- Indicador de estado global en tiempo real
- Diseño con gradientes y efectos visuales

#### 📊 **Dashboard de Métricas**

- **💰 Balance Total**: Suma de todos los balances de cuentas
- **📊 Equity Total**: Equity consolidado en tiempo real
- **📈 P&L Total**: Profit/Loss total con colores dinámicos
- **🔗 Cuentas Activas**: Contador de cuentas conectadas

#### 🎯 **Barra de Herramientas Moderna**

- **▶ Iniciar Todo**: Botón verde para iniciar todos los workers
- **⏹ Detener Todo**: Botón rojo para detener todas las conexiones
- **🔄 Recargar**: Botón naranja para recargar configuración
- **✏ Editar Config**: Acceso rápido al archivo de configuración
- **🧹 Limpiar**: Botón morado para limpieza de temporales

#### 🎨 **Tema Visual**

- **Tema oscuro** con gradientes azul-violeta
- **Efectos de sombra** en las tarjetas de métricas
- **Colores específicos** para cada tipo de acción
- **Tipografía moderna** con fuentes system (Segoe UI)
- **Animaciones hover** en botones y elementos interactivos

### 2. Funcionalidades principales

#### 📊 **Tab Cuentas**

- Visualiza todas las cuentas configuradas
- Muestra balance, equity, profit en tiempo real
- Botones individuales para iniciar/detener workers
- Totales consolidados de todas las cuentas

#### 📈 **Tab Posiciones**

- Lista todas las posiciones abiertas de todas las cuentas
- Información detallada: símbolo, tipo, volumen, profit
- Actualización automática cada 2 segundos

#### 📁 **Tab Directorios Temporales**

- Muestra los directorios temporales creados
- Información de tamaño y estado
- Botón para abrir directorios en el explorador

#### 📋 **Tab Logs**

- Registro de todas las actividades
- Exportación de logs a archivo
- Limpieza de logs

### 3. Controles principales

| Botón                     | Función                                        |
| ------------------------- | ---------------------------------------------- |
| ▶ **Iniciar Todo**        | Inicia todos los workers habilitados           |
| ⏹ **Detener Todo**        | Detiene todos los workers activos              |
| 🔄 **Recargar Config**    | Recarga la configuración desde `config.json`   |
| ✏ **Editar Config**       | Abre `config.json` en el editor predeterminado |
| 🧹 **Limpiar Temporales** | Elimina todos los directorios temporales       |

## 🔧 Arquitectura

### Componentes principales

1. **`launcher.py`** - Interfaz gráfica principal

   - Gestiona la UI con PySide6
   - Monitorea cambios en `config.json`
   - Crea/destruye procesos worker
   - Lee datos desde bases de datos SQLite

2. **`worker.py`** - Proceso individual por cuenta

   - Se conecta a MT5 en modo portable
   - Crea directorio temporal independiente
   - Guarda datos en SQLite local
   - Monitorea posiciones y deals

3. **`config.json`** - Configuración de cuentas
   - Lista de cuentas MT5 a gestionar
   - Parámetros de conexión y actualización

### Flujo de datos

```
launcher.py
    ├── Lee config.json
    ├── Crea workers (subprocess)
    │   └── worker.py
    │       ├── Crea directorio temporal
    │       ├── Conecta a MT5 (portable)
    │       ├── Guarda datos en SQLite
    │       └── Bucle de monitoreo
    └── Lee SQLite de cada worker
        └── Actualiza UI
```

### Directorios temporales

Cada worker crea un directorio temporal único:

```
C:\Users\Usuario\AppData\Local\Temp\mt5_123456_xyz123\
    ├── metatrader.ini      # Configuración MT5
    ├── mt5_data_123456.db  # Base de datos SQLite
    └── [archivos MT5]      # Archivos temporales de MT5
```

## 🧪 Probar la Nueva Interfaz

Para ver la nueva interfaz moderna:

```bash
# 1. Instalar dependencias
install_deps.bat

# 2. Ejecutar la aplicación
run.bat
# o directamente
uv run python launcher.py
```

### 🎨 Vista Previa de la Interfaz

La nueva interfaz incluye:

- **🌈 Gradientes modernos** en fondo y elementos
- **💫 Efectos de sombra** en las tarjetas de métricas
- **🎯 Colores semánticos**: Verde (start), Rojo (stop), Naranja (reload), etc.
- **📱 Diseño responsive** que se adapta al tamaño de ventana
- **⚡ Actualizaciones en tiempo real** de todas las métricas
- **🔄 Indicadores de estado** visuales y dinámicos

## 📦 Empaquetado con PyInstaller

### 1. Instalar PyInstaller

```bash
uv pip install pyinstaller
```

### 2. Crear el ejecutable

```bash
# Ejecutable básico
pyinstaller --onefile --windowed launcher.py

# Con icono personalizado (opcional)
pyinstaller --onefile --windowed --icon=icon.ico launcher.py

# Incluyendo MT5 portable (si tienes una instalación portable)
pyinstaller --onefile --windowed \
    --add-data "path/to/MT5;MT5" \
    launcher.py
```

### 3. Parámetros de PyInstaller

| Parámetro               | Descripción                       |
| ----------------------- | --------------------------------- |
| `--onefile`             | Genera un solo archivo ejecutable |
| `--windowed`            | Oculta la consola en Windows      |
| `--icon=icon.ico`       | Agrega icono personalizado        |
| `--add-data "src;dest"` | Incluye archivos adicionales      |
| `--name "MT5Launcher"`  | Nombre del ejecutable             |

### 4. Ejemplo completo de empaquetado

```bash
pyinstaller \
    --onefile \
    --windowed \
    --name "MT5PortableLauncher" \
    --icon=assets/icon.ico \
    --add-data "config.json;." \
    --add-data "worker.py;." \
    launcher.py
```

### 5. Distribución

El ejecutable se genera en `dist/MT5PortableLauncher.exe` y incluye:

- ✅ Todas las dependencias Python
- ✅ worker.py embebido
- ✅ config.json de ejemplo
- ✅ Interfaz gráfica completa

## 🚦 Solución de problemas

### Error: "No se puede conectar a MT5"

1. Verificar que MT5 esté instalado
2. Comprobar credenciales en `config.json`
3. Verificar que el servidor esté disponible
4. Revisar la ruta de `terminal_path`

### Error: "No se puede crear directorio temporal"

1. Verificar permisos de escritura
2. Liberar espacio en disco
3. Ejecutar como administrador si es necesario

### Workers no se detienen correctamente

1. Usar el botón "Detener Todo"
2. Cerrar el launcher completamente
3. Verificar en el Administrador de tareas
4. Usar "Limpiar Temporales" si es necesario

### Rendimiento lento

1. Aumentar `update_interval` en config.json
2. Reducir número de cuentas simultáneas
3. Verificar recursos del sistema

## 📝 Logs y debugging

### Ubicación de logs

- **Interfaz:** Tab "Logs" en el launcher
- **Consola:** Salida estándar de cada proceso
- **Archivos:** Exportar desde la interfaz

### Niveles de logging

- 🟢 **Info:** Operaciones normales
- 🟡 **Warning:** Advertencias no críticas
- 🔴 **Error:** Errores que requieren atención
- ⚪ **Debug:** Información detallada de desarrollo

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

Para soporte técnico:

1. Revisar la documentación
2. Buscar en issues existentes
3. Crear un nuevo issue con detalles completos
4. Incluir logs y configuración (sin contraseñas)

---

**Nota:** Este launcher es para uso educativo y de desarrollo. Asegúrate de cumplir con los términos de servicio de tu broker y las regulaciones locales.
