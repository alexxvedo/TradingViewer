# Quick Start Guide - Trading Viewer

## 🚀 Inicio Rápido (5 minutos)

### 1. Instalación

```bash
# Clonar el proyecto
git clone <repository-url>
cd trading_viewer

# Instalar dependencias
npm install

# Construir la aplicación
npm run build
```

### 2. Ejecutar la aplicación

```bash
# Modo desarrollo (recomendado para pruebas)
npm run electron-dev

# Modo producción
npm run electron
```

### 3. Configurar MT4/MT5

#### Compilar Expert Advisors:

1. Abrir MetaEditor
2. Compilar `resources/MT4/TradingViewer.mq4` → genera `TradingViewer.ex4`
3. Compilar `resources/MT5/TradingViewer.mq5` → genera `TradingViewer.ex5`

#### Configurar permisos:

1. En MT4/MT5: Tools → Options → Expert Advisors
2. ✅ Allow automated trading
3. ✅ Allow WebRequest for listed URL
4. Añadir: `http://127.0.0.1:3001`

### 4. Añadir cuenta

1. Seleccionar plataforma (MT4/MT5)
2. Introducir datos de login
3. Especificar ruta del terminal:
   - MT4: `C:\Program Files\MetaTrader 4\terminal.exe`
   - MT5: `C:\Program Files\MetaTrader 5\terminal64.exe`
4. Click "Add Account"
5. Click "Start" para iniciar monitoreo

## 📦 Generar Ejecutable

```bash
# Windows
npm run electron-pack -- --win --x64

# macOS
npm run electron-pack -- --mac

# Linux
npm run electron-pack -- --linux
```

## 🔧 Solución Rápida de Problemas

### ❌ "WebRequest not allowed"

- Ir a MT4/MT5 → Tools → Options → Expert Advisors
- Añadir `http://127.0.0.1:3001` a URLs permitidas

### ❌ EA no aparece en terminal

- Verificar que el archivo .ex4/.ex5 esté compilado
- Copiar a la carpeta correcta: `MQL4/Experts/` o `MQL5/Experts/`
- Reiniciar MT4/MT5

### ❌ Aplicación no inicia

- Verificar que el puerto 3001 esté libre
- Ejecutar: `npm install` para reinstalar dependencias
- Revisar logs en la consola

## 📋 Checklist de Verificación

- [ ] Node.js instalado (v18+)
- [ ] Dependencias instaladas (`npm install`)
- [ ] Expert Advisors compilados (.ex4/.ex5)
- [ ] WebRequest habilitado en MT4/MT5
- [ ] URL permitida: `http://127.0.0.1:3001`
- [ ] Ruta del terminal correcta
- [ ] Puerto 3001 disponible

## 🎯 Comandos Esenciales

```bash
# Desarrollo
npm run electron-dev

# Producción
npm run electron

# Empaquetar
npm run electron-pack

# Solo Next.js
npm run dev

# Construir Next.js
npm run build
```

## 📁 Estructura Mínima Requerida

```
trading_viewer/
├── resources/
│   ├── MT4/
│   │   └── TradingViewer.ex4  ← Compilar desde .mq4
│   └── MT5/
│       └── TradingViewer.ex5  ← Compilar desde .mq5
├── public/
│   ├── electron.js
│   └── preload.js
└── out/                       ← Generado por 'npm run build'
```

## 🔗 Enlaces Útiles

- [Documentación completa](README.md)
- [Configuración de ejemplo](config.example.json)
- [MetaEditor - Compilar EAs](https://www.metatrader4.com/en/trading-platform/help/autotrading/experts/creation)

---

**¿Problemas?** Revisa el [README.md](README.md) completo o abre un issue en el repositorio.
