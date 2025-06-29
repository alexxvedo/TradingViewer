"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { ProfessionalHeader } from "@/components/ProfessionalHeader";
import { AnimatedCard } from "@/components/AnimatedCard";
import { AnimatedChart } from "@/components/AnimatedChart";
import { RealTimeMetrics } from "@/components/RealTimeMetrics";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DollarSign,
  TrendingUp,
  Activity,
  Users,
  Target,
  Zap,
  AlertTriangle,
  BarChart3,
  PieChart,
  LineChart,
  Plus,
} from "lucide-react";

export default function Dashboard() {
  // Datos dummy para gráficos con mejor estructura
  const equityData = useMemo(
    () => [
      { time: "00:00", equity: 15000, balance: 15000 },
      { time: "04:00", equity: 15250, balance: 15000 },
      { time: "08:00", equity: 15180, balance: 15000 },
      { time: "12:00", equity: 15420, balance: 15000 },
      { time: "16:00", equity: 15380, balance: 15000 },
      { time: "20:00", equity: 15650, balance: 15000 },
      { time: "24:00", equity: 15720, balance: 15000 },
    ],
    []
  );

  const symbolDistribution = useMemo(
    () => [
      { name: "EURUSD", value: 35, color: "#10b981" },
      { name: "GBPUSD", value: 25, color: "#3b82f6" },
      { name: "USDJPY", value: 20, color: "#8b5cf6" },
      { name: "AUDUSD", value: 12, color: "#f59e0b" },
      { name: "USDCAD", value: 8, color: "#ef4444" },
    ],
    []
  );

  const monthlyPerformance = useMemo(
    () => [
      { month: "Ene", profit: 1200 },
      { month: "Feb", profit: 800 },
      { month: "Mar", profit: 1500 },
      { month: "Abr", profit: -300 },
      { month: "May", profit: 2100 },
      { month: "Jun", profit: 1800 },
    ],
    []
  );

  const balanceProgress = useMemo(
    () => [
      { date: "1 Jun", balance: 15000 },
      { date: "5 Jun", balance: 15200 },
      { date: "10 Jun", balance: 15100 },
      { date: "15 Jun", balance: 15400 },
      { date: "20 Jun", balance: 15600 },
      { date: "25 Jun", balance: 15720 },
      { date: "30 Jun", balance: 15850 },
    ],
    []
  );

  // Datos de estadísticas principales
  const mainStats = [
    {
      title: "Balance Total",
      value: "$15,720.50",
      description: "Balance actual",
      icon: <DollarSign className="h-5 w-5" />,
      trend: { value: 4.8, isPositive: true },
      gradient: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      hoverInfo:
        "Balance total de todas las cuentas conectadas. Incluye ganancias y pérdidas realizadas.",
    },
    {
      title: "Patrimonio",
      value: "$16,125.30",
      description: "Equity en tiempo real",
      icon: <TrendingUp className="h-5 w-5" />,
      trend: { value: 7.5, isPositive: true },
      gradient: "bg-gradient-to-br from-blue-500 to-blue-600",
      hoverInfo:
        "Valor actual del patrimonio incluyendo posiciones abiertas y balance disponible.",
    },
    {
      title: "P&L Diario",
      value: "+$404.80",
      description: "Ganancia del día",
      icon: <Activity className="h-5 w-5" />,
      trend: { value: 2.6, isPositive: true },
      gradient: "bg-gradient-to-br from-purple-500 to-purple-600",
      hoverInfo:
        "Ganancia o pérdida acumulada en las últimas 24 horas de trading.",
    },
    {
      title: "Tasa de Éxito",
      value: "68.5%",
      description: "Operaciones exitosas",
      icon: <Target className="h-5 w-5" />,
      trend: { value: 3.2, isPositive: true },
      gradient: "bg-gradient-to-br from-orange-500 to-orange-600",
      hoverInfo:
        "Porcentaje de operaciones cerradas en ganancia vs total de operaciones.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Professional Header */}
      <ProfessionalHeader
        title="Trading Dashboard"
        subtitle="Panel de control profesional para monitoreo de cuentas MT4/MT5"
        actions={
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2">
            <Plus className="h-4 w-4" />
            Nueva Cuenta
          </Button>
        }
      />

      <div className="p-6 space-y-8">
        {/* Real Time Metrics */}
        <RealTimeMetrics />

        {/* Quick Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-background to-muted/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Acciones Rápidas</h3>
                    <p className="text-sm text-muted-foreground">
                      Gestiona tus operaciones y cuentas
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" className="gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Análisis
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Alertas
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Users className="h-4 w-4" />
                    Cuentas
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Equity vs Balance Chart */}
          <AnimatedChart
            title="Evolución del Patrimonio"
            description="Comparación entre equity y balance en tiempo real"
            data={equityData}
            type="line"
            dataKey="equity"
            xAxisKey="time"
            color="#10b981"
            delay={600}
            height={350}
            icon={<LineChart className="h-5 w-5" />}
          />

          {/* Symbol Distribution */}
          <AnimatedChart
            title="Distribución por Símbolos"
            description="Exposición actual por pares de divisas"
            data={symbolDistribution}
            type="pie"
            dataKey="value"
            color="#3b82f6"
            delay={800}
            height={350}
            icon={<PieChart className="h-5 w-5" />}
          />
        </div>

        {/* Secondary Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Monthly Performance */}
          <AnimatedChart
            title="Rendimiento Mensual"
            description="Ganancias y pérdidas por mes"
            data={monthlyPerformance}
            type="bar"
            dataKey="profit"
            xAxisKey="month"
            color="#8b5cf6"
            delay={1000}
            height={300}
            icon={<BarChart3 className="h-5 w-5" />}
          />

          {/* Balance Progress */}
          <AnimatedChart
            title="Progreso del Balance"
            description="Evolución del balance en el tiempo"
            data={balanceProgress}
            type="area"
            dataKey="balance"
            xAxisKey="date"
            color="#06b6d4"
            delay={1200}
            height={300}
            icon={<TrendingUp className="h-5 w-5" />}
          />
        </div>

        {/* Additional Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="grid gap-6 md:grid-cols-3"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-blue-50 dark:to-blue-950/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-600" />
                Actividad Reciente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">EURUSD Compra</span>
                <Badge variant="outline" className="text-green-600">
                  +$45.20
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">GBPUSD Venta</span>
                <Badge variant="outline" className="text-red-600">
                  -$12.50
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">USDJPY Compra</span>
                <Badge variant="outline" className="text-green-600">
                  +$78.90
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-purple-50 dark:to-purple-950/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-600" />
                Objetivos del Mes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Ganancia Objetivo</span>
                  <span>$2,000</span>
                </div>
                <Progress value={65} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  $1,300 conseguidos
                </p>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Operaciones</span>
                  <span>150</span>
                </div>
                <Progress value={80} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  120 completadas
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-emerald-50 dark:to-emerald-950/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-600" />
                Estado de Cuentas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Cuenta Principal</span>
                <Badge className="bg-green-100 text-green-800">Activa</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Cuenta Demo</span>
                <Badge className="bg-blue-100 text-blue-800">Conectada</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Cuenta Backup</span>
                <Badge variant="secondary">Standby</Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
