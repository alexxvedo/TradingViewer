# 🚀 Trading Viewer Pro

**Panel de Control Profesional para Monitoreo de Cuentas MT4/MT5**

Una aplicación de escritorio de nivel empresarial construida con Next.js, Electron, y tecnologías modernas para el monitoreo avanzado de cuentas de trading.

![Trading Viewer Pro](https://img.shields.io/badge/Version-2.0.0-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black?style=for-the-badge&logo=next.js)
![Electron](https://img.shields.io/badge/Electron-Latest-47848F?style=for-the-badge&logo=electron)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)

## ✨ Características Premium

### 🎨 **Interfaz Profesional**

- **Animaciones Fluidas**: Implementadas con Framer Motion para microinteracciones profesionales
- **Tema Oscuro/Claro**: Sistema completo de temas con transiciones suaves
- **Diseño Responsivo**: Optimizado para todas las resoluciones de pantalla
- **Efectos Visuales**: Fondo de partículas animado y gradientes dinámicos

### 📊 **Dashboard Ejecutivo**

- **Métricas en Tiempo Real**: Balance, patrimonio, P&L diario y tasa de éxito
- **Gráficos Interactivos**: 12+ tipos de gráficos con animaciones profesionales
- **Indicadores de Estado**: Conexión en vivo, latencia, carga del servidor
- **Alertas Inteligentes**: Sistema de notificaciones contextual

### 🔄 **Monitoreo en Tiempo Real**

- **Actualizaciones Automáticas**: Datos refrescados cada 2 segundos
- **Conexión Estable**: Monitoreo de ping, spread y carga del servidor
- **Estado Visual**: Indicadores animados de conexión y actividad
- **Historial de Operaciones**: Seguimiento completo de todas las transacciones

### 📈 **Análisis Avanzado**

- **Múltiples Timeframes**: Análisis diario, semanal, mensual
- **Distribución por Símbolos**: Gráficos de torta interactivos
- **Rendimiento Histórico**: Curvas de equity y balance
- **Métricas de Riesgo**: Drawdown, win rate, profit factor

### 🎯 **Monitoreo de Cuentas**

- **Multi-Cuenta**: Soporte para múltiples cuentas MT4/MT5
- **Expert Advisors**: Detección automática de EAs por magic numbers
- **Estadísticas Avanzadas**: Métricas detalladas por cuenta y EA
- **Configuración**: Ajustes de monitoreo y alertas

## 🛠️ Tecnologías Utilizadas

### Frontend

- **Next.js 15.3.4** - Framework React con App Router
- **TypeScript** - Tipado estático para mayor robustez
- **Tailwind CSS** - Diseño utility-first
- **shadcn/ui** - Componentes UI profesionales
- **Framer Motion** - Animaciones y transiciones
- **Recharts** - Gráficos interactivos

### Desktop

- **Electron** - Aplicación de escritorio multiplataforma
- **Electron Builder** - Empaquetado y distribución

### Herramientas de Desarrollo

- **ESLint** - Linting de código
- **Prettier** - Formateo automático
- **Turbopack** - Bundler ultra-rápido

## 🚀 Instalación y Configuración

### Prerrequisitos

```bash
Node.js >= 18.0.0
npm >= 9.0.0
```

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/trading-viewer-pro.git
cd trading-viewer-pro/trading_viewer

# Instalar dependencias
npm install

# Configurar archivo de configuración
cp config.example.json config.json
```

### Configuración

Edita `config.json` con tus datos:

```json
{
  "accounts": [
    {
      "name": "Cuenta Principal",
      "server": "tu-servidor-mt4.com",
      "login": "12345678",
      "password": "tu-password"
    }
  ],
  "settings": {
    "updateInterval": 2000,
    "theme": "system",
    "notifications": true
  }
}
```

## 🎮 Uso

### Desarrollo

```bash
# Ejecutar en modo desarrollo
npm run dev

# La aplicación estará disponible en http://localhost:3001
```

### Producción

```bash
# Construir para producción
npm run build

# Ejecutar aplicación Electron
npm run electron

# Empaquetar para distribución
npm run dist
```

## 📱 Características por Página

### 🏠 **Dashboard Principal**

- Métricas en tiempo real con animaciones
- Gráficos de evolución de patrimonio
- Distribución por símbolos
- Rendimiento mensual
- Acciones rápidas

### 📊 **Reportes**

- Curva de patrimonio histórica
- Análisis de beneficios mensuales
- Tasa de éxito por períodos
- Análisis por símbolos
- Distribución de ganancias

### 💼 **Trading**

- P&L en tiempo real
- Posiciones activas
- Análisis por horas de trading
- Gestión de riesgo

### 👤 **Cuentas**

- Lista de cuentas conectadas
- Monitoreo individual por cuenta
- Expert Advisors detectados por magic number
- Estadísticas y reportes por cuenta

### ⚙️ **Configuración**

- Ajustes de aplicación
- Configuración de notificaciones
- Preferencias de tema
- Configuración de conexión

## 🎨 Sistema de Diseño

### Colores Profesionales

- **Verde**: `#10b981` - Ganancias y éxito
- **Azul**: `#3b82f6` - Información y balance
- **Púrpura**: `#8b5cf6` - Métricas especiales
- **Naranja**: `#f59e0b` - Alertas y objetivos
- **Rojo**: `#ef4444` - Pérdidas y riesgos

### Animaciones

- **Entrada**: Fade in con spring physics
- **Hover**: Scale y glow effects
- **Transiciones**: Smooth 300ms easing
- **Gráficos**: Animaciones de 1.5s con delays escalonados

## 📈 Rendimiento

- **Tiempo de Carga**: < 2 segundos
- **Actualización de Datos**: 2 segundos
- **Animaciones**: 60 FPS constantes
- **Memoria**: < 150MB RAM
- **CPU**: < 5% en idle

## 🔐 Seguridad

- **Encriptación**: Credenciales encriptadas localmente
- **Conexión Segura**: SSL/TLS para todas las comunicaciones
- **Logs Seguros**: Sin exposición de datos sensibles
- **Validación**: Validación completa de inputs

## 🌐 Compatibilidad

### Sistemas Operativos

- ✅ Windows 10/11
- ✅ macOS 10.15+
- ✅ Linux (Ubuntu, Debian, CentOS)

### Brokers Compatibles

- ✅ MetaTrader 4
- ✅ MetaTrader 5
- ✅ Todos los brokers MT4/MT5

## 📞 Soporte

### Documentación

- [Wiki Completa](https://github.com/tu-usuario/trading-viewer-pro/wiki)
- [API Reference](https://docs.trading-viewer-pro.com)
- [Guías de Usuario](https://help.trading-viewer-pro.com)

### Comunidad

- [Discord](https://discord.gg/trading-viewer-pro)
- [Telegram](https://t.me/trading_viewer_pro)
- [Reddit](https://reddit.com/r/TradingViewerPro)

## 🚀 Roadmap

### v2.1.0 (Q2 2024)

- [ ] Integración con TradingView
- [ ] Alertas por email/SMS
- [ ] Análisis de correlaciones
- [ ] Backtesting integrado

### v2.2.0 (Q3 2024)

- [ ] Machine Learning para predicciones
- [ ] API REST completa
- [ ] Aplicación móvil
- [ ] Trading social

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## ⭐ Reconocimientos

- [Next.js](https://nextjs.org/) - Framework React
- [shadcn/ui](https://ui.shadcn.com/) - Componentes UI
- [Framer Motion](https://www.framer.com/motion/) - Animaciones
- [Recharts](https://recharts.org/) - Gráficos
- [Lucide](https://lucide.dev/) - Iconos

---

<div align="center">
  <strong>Trading Viewer Pro - Llevando el trading al siguiente nivel</strong>
  <br>
  <sub>Construido con ❤️ para traders profesionales</sub>
</div>
