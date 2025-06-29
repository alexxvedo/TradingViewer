"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { ProfessionalHeader } from "@/components/ProfessionalHeader";
import { AnimatedChart } from "@/components/AnimatedChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Target,
  AlertTriangle,
  Play,
  Pause,
  Square,
  Settings,
  Zap,
  Clock,
  BarChart3,
} from "lucide-react";

export default function TradingPage() {
  const [isLiveTrading, setIsLiveTrading] = useState(true);
  const [currentPL, setCurrentPL] = useState(245.8);

  // Datos P&L en tiempo real
  const plData = useMemo(
    () => [
      { time: "09:00", pl: 0 },
      { time: "09:30", pl: 45.2 },
      { time: "10:00", pl: 78.5 },
      { time: "10:30", pl: 125.3 },
      { time: "11:00", pl: 89.7 },
      { time: "11:30", pl: 156.8 },
      { time: "12:00", pl: 203.4 },
      { time: "12:30", pl: 245.8 },
      { time: "13:00", pl: 278.9 },
      { time: "13:30", pl: 234.6 },
      { time: "14:00", pl: 289.2 },
    ],
    []
  );

  // Distribución por símbolos
  const symbolDistribution = useMemo(
    () => [
      { name: "EURUSD", value: 40, color: "#10b981", positions: 3 },
      { name: "GBPUSD", value: 25, color: "#3b82f6", positions: 2 },
      { name: "USDJPY", value: 20, color: "#8b5cf6", positions: 2 },
      { name: "AUDUSD", value: 10, color: "#f59e0b", positions: 1 },
      { name: "USDCAD", value: 5, color: "#ef4444", positions: 1 },
    ],
    []
  );

  // Análisis por horas
  const hourlyAnalysis = useMemo(
    () => [
      { hour: "08:00", volume: 12, profit: 45.2 },
      { hour: "09:00", volume: 18, profit: 78.5 },
      { hour: "10:00", volume: 25, profit: 125.3 },
      { hour: "11:00", volume: 22, profit: 89.7 },
      { hour: "12:00", volume: 30, profit: 156.8 },
      { hour: "13:00", volume: 28, profit: 203.4 },
      { hour: "14:00", volume: 20, profit: 134.6 },
      { hour: "15:00", volume: 15, profit: 98.2 },
    ],
    []
  );

  // Posiciones activas
  const activePositions = [
    {
      symbol: "EURUSD",
      type: "BUY",
      volume: 0.5,
      openPrice: 1.0875,
      currentPrice: 1.0892,
      pl: 85.0,
      time: "10:45",
    },
    {
      symbol: "GBPUSD",
      type: "SELL",
      volume: 0.3,
      openPrice: 1.2745,
      currentPrice: 1.2728,
      pl: 51.0,
      time: "11:20",
    },
    {
      symbol: "USDJPY",
      type: "BUY",
      volume: 0.4,
      openPrice: 149.85,
      currentPrice: 150.12,
      pl: 108.0,
      time: "12:15",
    },
  ];

  // Simular cambios en P&L
  useEffect(() => {
    if (!isLiveTrading) return;

    const interval = setInterval(() => {
      setCurrentPL((prev) => prev + (Math.random() - 0.5) * 10);
    }, 3000);

    return () => clearInterval(interval);
  }, [isLiveTrading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <ProfessionalHeader
        title="Trading en Vivo"
        subtitle="Monitoreo y gestión de operaciones en tiempo real"
        actions={
          <div className="flex gap-2">
            <Badge
              variant={isLiveTrading ? "default" : "secondary"}
              className={
                isLiveTrading
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }
            >
              {isLiveTrading ? "MONITOREANDO" : "DESCONECTADO"}
            </Badge>
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="h-4 w-4" />
              Configurar
            </Button>
          </div>
        }
      />

      <div className="p-6 space-y-8">
        {/* Estado de Trading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-background to-muted/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-xl ${
                      isLiveTrading ? "bg-green-500" : "bg-gray-500"
                    }`}
                  >
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      Estado del Trading
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {isLiveTrading ? "Operando en vivo" : "Trading pausado"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      +${currentPL.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">P&L Diario</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      {activePositions.length}
                    </p>
                    <p className="text-sm text-muted-foreground">Posiciones</p>
                  </div>
                  <div className="text-center">
                    <Badge
                      className={
                        isLiveTrading
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {isLiveTrading ? "ACTIVO" : "INACTIVO"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs de Trading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Tabs defaultValue="live" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="live" className="gap-2">
                <Activity className="h-4 w-4" />
                En Vivo
              </TabsTrigger>
              <TabsTrigger value="positions" className="gap-2">
                <Target className="h-4 w-4" />
                Posiciones
              </TabsTrigger>
              <TabsTrigger value="analysis" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Análisis
              </TabsTrigger>
              <TabsTrigger value="risk" className="gap-2">
                <AlertTriangle className="h-4 w-4" />
                Riesgo
              </TabsTrigger>
            </TabsList>

            {/* Tab En Vivo */}
            <TabsContent value="live" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <AnimatedChart
                  title="P&L en Tiempo Real"
                  description="Ganancia/pérdida acumulada del día"
                  data={plData}
                  type="line"
                  dataKey="pl"
                  xAxisKey="time"
                  color="#10b981"
                  delay={600}
                  height={350}
                  icon={<TrendingUp className="h-5 w-5" />}
                />

                <AnimatedChart
                  title="Distribución por Símbolos"
                  description="Exposición actual por pares"
                  data={symbolDistribution}
                  type="pie"
                  dataKey="value"
                  color="#3b82f6"
                  delay={800}
                  height={350}
                  icon={<Target className="h-5 w-5" />}
                />
              </div>

              <AnimatedChart
                title="Análisis por Horas"
                description="Volumen y beneficios por hora de trading"
                data={hourlyAnalysis}
                type="bar"
                dataKey="profit"
                xAxisKey="hour"
                color="#8b5cf6"
                delay={1000}
                height={300}
                icon={<Clock className="h-5 w-5" />}
              />
            </TabsContent>

            {/* Tab Posiciones */}
            <TabsContent value="positions" className="space-y-6">
              <div className="grid gap-4">
                {activePositions.map((position, index) => (
                  <motion.div
                    key={`${position.symbol}-${position.time}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div
                              className={`p-3 rounded-lg ${
                                position.type === "BUY"
                                  ? "bg-green-100"
                                  : "bg-red-100"
                              }`}
                            >
                              {position.type === "BUY" ? (
                                <TrendingUp className="h-5 w-5 text-green-600" />
                              ) : (
                                <TrendingDown className="h-5 w-5 text-red-600" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold text-lg">
                                {position.symbol}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {position.type} {position.volume} lotes
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-6 text-center">
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Precio Apertura
                              </p>
                              <p className="font-medium">
                                {position.openPrice}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Precio Actual
                              </p>
                              <p className="font-medium">
                                {position.currentPrice}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                P&L
                              </p>
                              <p
                                className={`font-bold ${
                                  position.pl >= 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {position.pl >= 0 ? "+" : ""}$
                                {position.pl.toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <Badge
                              variant={
                                position.pl >= 0 ? "default" : "destructive"
                              }
                            >
                              {position.pl >= 0 ? "GANANDO" : "PERDIENDO"}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Tab Análisis */}
            <TabsContent value="analysis" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-blue-600" />
                      Rendimiento Diario
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Operaciones</span>
                      <span className="font-medium">24</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ganadoras</span>
                      <span className="font-medium text-green-600">16</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Perdedoras</span>
                      <span className="font-medium text-red-600">8</span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between">
                        <span>Tasa de Éxito</span>
                        <span className="font-bold">66.7%</span>
                      </div>
                      <Progress value={66.7} className="mt-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      Métricas Financieras
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Ganancia Bruta</span>
                      <span className="font-medium text-green-600">
                        +$456.80
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pérdida Bruta</span>
                      <span className="font-medium text-red-600">-$211.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ganancia Promedio</span>
                      <span className="font-medium">$28.55</span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between">
                        <span>P&L Neto</span>
                        <span className="font-bold text-green-600">
                          +$245.80
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-purple-600" />
                      Mejor Símbolo
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold">EURUSD</h3>
                      <p className="text-muted-foreground">Más rentable hoy</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Operaciones</span>
                        <span className="font-medium">8</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Beneficio</span>
                        <span className="font-medium text-green-600">
                          +$145.20
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Éxito</span>
                        <span className="font-medium">75%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tab Riesgo */}
            <TabsContent value="risk" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      Gestión de Riesgo
                    </CardTitle>
                    <CardDescription>
                      Métricas de exposición y riesgo
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Exposición Total</span>
                        <span className="font-medium">$45,000</span>
                      </div>
                      <Progress value={75} className="h-3" />
                      <p className="text-xs text-muted-foreground mt-1">
                        75% del capital
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Nivel de Margen</span>
                        <span className="font-medium text-green-600">350%</span>
                      </div>
                      <Progress value={87.5} className="h-3" />
                      <p className="text-xs text-muted-foreground mt-1">
                        Nivel seguro
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Drawdown Actual</span>
                        <span className="font-medium text-orange-600">
                          2.3%
                        </span>
                      </div>
                      <Progress value={23} className="h-3" />
                      <p className="text-xs text-muted-foreground mt-1">
                        Bajo riesgo
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Square className="h-5 w-5 text-blue-600" />
                      Límites de Trading
                    </CardTitle>
                    <CardDescription>
                      Configuración de stop loss y take profit
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="font-medium text-red-600">
                          Stop Loss Diario
                        </span>
                      </div>
                      <p className="text-sm">Máximo: $500 | Actual: $211</p>
                      <Progress value={42.2} className="mt-2 h-2" />
                    </div>

                    <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-600">
                          Take Profit Diario
                        </span>
                      </div>
                      <p className="text-sm">
                        Objetivo: $300 | Actual: $245.80
                      </p>
                      <Progress value={81.9} className="mt-2 h-2" />
                    </div>

                    <div className="pt-2">
                      <p className="text-xs text-muted-foreground text-center">
                        Los límites son configurables desde el EA
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
