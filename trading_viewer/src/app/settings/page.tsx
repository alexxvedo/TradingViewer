"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ProfessionalHeader } from "@/components/ProfessionalHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  Bell,
  Palette,
  Shield,
  Database,
  Wifi,
  Monitor,
  Volume2,
  Mail,
  Smartphone,
  Globe,
  Save,
  RotateCcw,
  Download,
  Upload,
} from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // General
    language: "es",
    timezone: "UTC-3",
    autoSave: true,

    // Notificaciones
    emailNotifications: true,
    pushNotifications: true,
    soundAlerts: true,
    tradeAlerts: true,
    newsAlerts: false,

    // Tema
    theme: "system",
    fontSize: "medium",
    animations: true,

    // Trading
    confirmTrades: true,
    autoCloseDrawdown: true,
    maxDrawdown: 10,
    dailyLossLimit: 500,

    // Conexión
    updateInterval: 2,
    retryAttempts: 3,
    timeout: 30,

    // Seguridad
    twoFactor: false,
    sessionTimeout: 30,
    encryptData: true,
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Aquí se guardarían las configuraciones
    console.log("Guardando configuraciones:", settings);
  };

  const handleReset = () => {
    // Resetear a valores por defecto
    setSettings({
      language: "es",
      timezone: "UTC-3",
      autoSave: true,
      emailNotifications: true,
      pushNotifications: true,
      soundAlerts: true,
      tradeAlerts: true,
      newsAlerts: false,
      theme: "system",
      fontSize: "medium",
      animations: true,
      confirmTrades: true,
      autoCloseDrawdown: true,
      maxDrawdown: 10,
      dailyLossLimit: 500,
      updateInterval: 2,
      retryAttempts: 3,
      timeout: 30,
      twoFactor: false,
      sessionTimeout: 30,
      encryptData: true,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <ProfessionalHeader
        title="Configuración"
        subtitle="Personaliza tu experiencia de trading y ajusta las preferencias"
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Resetear
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2"
            >
              <Save className="h-4 w-4" />
              Guardar
            </Button>
          </div>
        }
      />

      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="general" className="gap-2">
                <Settings className="h-4 w-4" />
                General
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="h-4 w-4" />
                Notificaciones
              </TabsTrigger>
              <TabsTrigger value="appearance" className="gap-2">
                <Palette className="h-4 w-4" />
                Apariencia
              </TabsTrigger>
              <TabsTrigger value="trading" className="gap-2">
                <Database className="h-4 w-4" />
                Trading
              </TabsTrigger>
              <TabsTrigger value="connection" className="gap-2">
                <Wifi className="h-4 w-4" />
                Conexión
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2">
                <Shield className="h-4 w-4" />
                Seguridad
              </TabsTrigger>
            </TabsList>

            {/* General */}
            <TabsContent value="general">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-blue-600" />
                      Configuración Regional
                    </CardTitle>
                    <CardDescription>
                      Idioma, zona horaria y formato
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Idioma</Label>
                      <Select
                        value={settings.language}
                        onValueChange={(value) =>
                          handleSettingChange("language", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="pt">Português</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timezone">Zona Horaria</Label>
                      <Select
                        value={settings.timezone}
                        onValueChange={(value) =>
                          handleSettingChange("timezone", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC-3">
                            UTC-3 (Argentina)
                          </SelectItem>
                          <SelectItem value="UTC-5">
                            UTC-5 (Nueva York)
                          </SelectItem>
                          <SelectItem value="UTC+0">UTC+0 (Londres)</SelectItem>
                          <SelectItem value="UTC+1">
                            UTC+1 (Frankfurt)
                          </SelectItem>
                          <SelectItem value="UTC+9">UTC+9 (Tokio)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Guardado Automático</Label>
                        <p className="text-sm text-muted-foreground">
                          Guardar cambios automáticamente
                        </p>
                      </div>
                      <Switch
                        checked={settings.autoSave}
                        onCheckedChange={(checked) =>
                          handleSettingChange("autoSave", checked)
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-green-600" />
                      Datos y Respaldo
                    </CardTitle>
                    <CardDescription>
                      Gestión de datos y copias de seguridad
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full gap-2">
                      <Download className="h-4 w-4" />
                      Exportar Configuración
                    </Button>

                    <Button variant="outline" className="w-full gap-2">
                      <Upload className="h-4 w-4" />
                      Importar Configuración
                    </Button>

                    <Separator />

                    <div className="text-sm text-muted-foreground">
                      <p>Último respaldo: Hace 2 horas</p>
                      <p>Tamaño de datos: 2.4 MB</p>
                      <p>Configuraciones guardadas: 156</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Notificaciones */}
            <TabsContent value="notifications">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-orange-600" />
                      Alertas de Trading
                    </CardTitle>
                    <CardDescription>
                      Configurar notificaciones de operaciones
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Alertas de Operaciones</Label>
                        <p className="text-sm text-muted-foreground">
                          Notificar cuando se abran/cierren posiciones
                        </p>
                      </div>
                      <Switch
                        checked={settings.tradeAlerts}
                        onCheckedChange={(checked) =>
                          handleSettingChange("tradeAlerts", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Alertas de Noticias</Label>
                        <p className="text-sm text-muted-foreground">
                          Eventos económicos importantes
                        </p>
                      </div>
                      <Switch
                        checked={settings.newsAlerts}
                        onCheckedChange={(checked) =>
                          handleSettingChange("newsAlerts", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Sonidos de Alerta</Label>
                        <p className="text-sm text-muted-foreground">
                          Reproducir sonidos para notificaciones
                        </p>
                      </div>
                      <Switch
                        checked={settings.soundAlerts}
                        onCheckedChange={(checked) =>
                          handleSettingChange("soundAlerts", checked)
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5 text-purple-600" />
                      Canales de Notificación
                    </CardTitle>
                    <CardDescription>Cómo recibir las alertas</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5 flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <div>
                          <Label>Email</Label>
                          <p className="text-sm text-muted-foreground">
                            trader@email.com
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) =>
                          handleSettingChange("emailNotifications", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5 flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        <div>
                          <Label>Push (Escritorio)</Label>
                          <p className="text-sm text-muted-foreground">
                            Notificaciones del navegador
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.pushNotifications}
                        onCheckedChange={(checked) =>
                          handleSettingChange("pushNotifications", checked)
                        }
                      />
                    </div>

                    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Bell className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">
                          Configuración Recomendada
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Activar alertas de trading y email para no perderte
                        operaciones importantes.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Apariencia */}
            <TabsContent value="appearance">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5 text-pink-600" />
                      Tema y Colores
                    </CardTitle>
                    <CardDescription>
                      Personaliza la apariencia de la aplicación
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Tema</Label>
                      <Select
                        value={settings.theme}
                        onValueChange={(value) =>
                          handleSettingChange("theme", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Claro</SelectItem>
                          <SelectItem value="dark">Oscuro</SelectItem>
                          <SelectItem value="system">Sistema</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Tamaño de Fuente</Label>
                      <Select
                        value={settings.fontSize}
                        onValueChange={(value) =>
                          handleSettingChange("fontSize", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Pequeña</SelectItem>
                          <SelectItem value="medium">Mediana</SelectItem>
                          <SelectItem value="large">Grande</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Animaciones</Label>
                        <p className="text-sm text-muted-foreground">
                          Efectos visuales y transiciones
                        </p>
                      </div>
                      <Switch
                        checked={settings.animations}
                        onCheckedChange={(checked) =>
                          handleSettingChange("animations", checked)
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Vista Previa</CardTitle>
                    <CardDescription>
                      Cómo se verá tu configuración
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 border rounded-lg bg-muted/30">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                        <div>
                          <p
                            className={`font-medium ${
                              settings.fontSize === "small"
                                ? "text-sm"
                                : settings.fontSize === "large"
                                ? "text-lg"
                                : "text-base"
                            }`}
                          >
                            Trading Viewer Pro
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Vista previa del tema
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 bg-green-500 rounded w-3/4"></div>
                        <div className="h-2 bg-blue-500 rounded w-1/2"></div>
                        <div className="h-2 bg-purple-500 rounded w-2/3"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Trading */}
            <TabsContent value="trading">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-green-600" />
                      Configuración de Trading
                    </CardTitle>
                    <CardDescription>
                      Parámetros de operaciones y riesgo
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Confirmar Operaciones</Label>
                        <p className="text-sm text-muted-foreground">
                          Solicitar confirmación antes de operar
                        </p>
                      </div>
                      <Switch
                        checked={settings.confirmTrades}
                        onCheckedChange={(checked) =>
                          handleSettingChange("confirmTrades", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Monitoreo de Drawdown</Label>
                        <p className="text-sm text-muted-foreground">
                          Alertas cuando se alcance el límite
                        </p>
                      </div>
                      <Switch
                        checked={settings.autoCloseDrawdown}
                        onCheckedChange={(checked) =>
                          handleSettingChange("autoCloseDrawdown", checked)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxDrawdown">Drawdown Máximo (%)</Label>
                      <Input
                        id="maxDrawdown"
                        type="number"
                        value={settings.maxDrawdown}
                        onChange={(e) =>
                          handleSettingChange(
                            "maxDrawdown",
                            parseInt(e.target.value)
                          )
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dailyLossLimit">
                        Límite de Pérdida Diaria ($)
                      </Label>
                      <Input
                        id="dailyLossLimit"
                        type="number"
                        value={settings.dailyLossLimit}
                        onChange={(e) =>
                          handleSettingChange(
                            "dailyLossLimit",
                            parseInt(e.target.value)
                          )
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Límites Actuales</CardTitle>
                    <CardDescription>
                      Estado de los límites configurados
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Drawdown</span>
                        <Badge variant="outline" className="text-green-600">
                          2.3% / {settings.maxDrawdown}%
                        </Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${(2.3 / settings.maxDrawdown) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">
                          Pérdida Diaria
                        </span>
                        <Badge variant="outline" className="text-blue-600">
                          $85 / ${settings.dailyLossLimit}
                        </Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${(85 / settings.dailyLossLimit) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      <p>• Los límites son monitoreados en tiempo real</p>
                      <p>• Las alertas se envían al 80% del límite</p>
                      <p>• Control de posiciones debe configurarse en el EA</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Conexión */}
            <TabsContent value="connection">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wifi className="h-5 w-5 text-blue-600" />
                      Configuración de Red
                    </CardTitle>
                    <CardDescription>
                      Parámetros de conexión y actualización
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="updateInterval">
                        Intervalo de Actualización (segundos)
                      </Label>
                      <Select
                        value={settings.updateInterval.toString()}
                        onValueChange={(value) =>
                          handleSettingChange("updateInterval", parseInt(value))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 segundo</SelectItem>
                          <SelectItem value="2">2 segundos</SelectItem>
                          <SelectItem value="5">5 segundos</SelectItem>
                          <SelectItem value="10">10 segundos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="retryAttempts">
                        Intentos de Reconexión
                      </Label>
                      <Input
                        id="retryAttempts"
                        type="number"
                        min="1"
                        max="10"
                        value={settings.retryAttempts}
                        onChange={(e) =>
                          handleSettingChange(
                            "retryAttempts",
                            parseInt(e.target.value)
                          )
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timeout">
                        Timeout de Conexión (segundos)
                      </Label>
                      <Input
                        id="timeout"
                        type="number"
                        min="10"
                        max="120"
                        value={settings.timeout}
                        onChange={(e) =>
                          handleSettingChange(
                            "timeout",
                            parseInt(e.target.value)
                          )
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Estado de Conexión</CardTitle>
                    <CardDescription>
                      Información actual de la red
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">
                          Servidor Principal
                        </span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        Conectado
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Latencia:</span>
                        <span className="font-medium">12ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Última actualización:</span>
                        <span className="font-medium">Hace 2 segundos</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Paquetes perdidos:</span>
                        <span className="font-medium">0%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Uptime:</span>
                        <span className="font-medium">99.8%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Seguridad */}
            <TabsContent value="security">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-red-600" />
                      Configuración de Seguridad
                    </CardTitle>
                    <CardDescription>
                      Protección de cuenta y datos
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Autenticación de Dos Factores</Label>
                        <p className="text-sm text-muted-foreground">
                          Seguridad adicional para tu cuenta
                        </p>
                      </div>
                      <Switch
                        checked={settings.twoFactor}
                        onCheckedChange={(checked) =>
                          handleSettingChange("twoFactor", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Encriptar Datos Locales</Label>
                        <p className="text-sm text-muted-foreground">
                          Proteger información almacenada
                        </p>
                      </div>
                      <Switch
                        checked={settings.encryptData}
                        onCheckedChange={(checked) =>
                          handleSettingChange("encryptData", checked)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">
                        Timeout de Sesión (minutos)
                      </Label>
                      <Select
                        value={settings.sessionTimeout.toString()}
                        onValueChange={(value) =>
                          handleSettingChange("sessionTimeout", parseInt(value))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutos</SelectItem>
                          <SelectItem value="30">30 minutos</SelectItem>
                          <SelectItem value="60">1 hora</SelectItem>
                          <SelectItem value="120">2 horas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Actividad de Seguridad</CardTitle>
                    <CardDescription>
                      Últimos eventos de seguridad
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">
                          Inicio de sesión exitoso
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Hoy a las 14:32 desde 192.168.1.100
                      </p>
                    </div>

                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium">
                          Configuración actualizada
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Ayer a las 09:15
                      </p>
                    </div>

                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-sm font-medium">
                          Intento de acceso fallido
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Hace 3 días desde IP desconocida
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
