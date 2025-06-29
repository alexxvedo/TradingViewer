"use client";

import { useMemo } from "react";
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
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  FileText,
  Target,
  DollarSign,
  Activity,
  Award,
  AlertCircle,
} from "lucide-react";

export default function ReportsPage() {
  // Datos para la curva de patrimonio
  const equityCurve = useMemo(
    () => [
      { date: "Ene", equity: 10000, balance: 10000 },
      { date: "Feb", equity: 10800, balance: 10500 },
      { date: "Mar", equity: 11200, balance: 11000 },
      { date: "Abr", equity: 10900, balance: 10800 },
      { date: "May", equity: 12100, balance: 11800 },
      { date: "Jun", equity: 13200, balance: 12500 },
      { date: "Jul", equity: 14100, balance: 13800 },
      { date: "Ago", equity: 15200, balance: 14900 },
      { date: "Sep", equity: 15800, balance: 15500 },
      { date: "Oct", equity: 16500, balance: 16200 },
      { date: "Nov", equity: 17200, balance: 16800 },
      { date: "Dic", equity: 18000, balance: 17500 },
    ],
    []
  );

  // Beneficios mensuales
  const monthlyProfits = useMemo(
    () => [
      { month: "Ene", profit: 800, trades: 45 },
      { month: "Feb", profit: 700, trades: 38 },
      { month: "Mar", profit: 500, trades: 42 },
      { month: "Abr", profit: -200, trades: 35 },
      { month: "May", profit: 1300, trades: 52 },
      { month: "Jun", profit: 900, trades: 48 },
      { month: "Jul", profit: 1200, trades: 55 },
      { month: "Ago", profit: 1100, trades: 49 },
      { month: "Sep", profit: 600, trades: 41 },
      { month: "Oct", profit: 700, trades: 46 },
      { month: "Nov", profit: 700, trades: 43 },
      { month: "Dic", profit: 800, trades: 50 },
    ],
    []
  );

  // Tasa de éxito mensual
  const winRateData = useMemo(
    () => [
      { month: "Ene", winRate: 65.5 },
      { month: "Feb", winRate: 68.2 },
      { month: "Mar", winRate: 62.8 },
      { month: "Abr", winRate: 58.9 },
      { month: "May", winRate: 72.1 },
      { month: "Jun", winRate: 69.8 },
      { month: "Jul", winRate: 71.5 },
      { month: "Ago", winRate: 70.2 },
      { month: "Sep", winRate: 66.7 },
      { month: "Oct", winRate: 68.9 },
      { month: "Nov", winRate: 67.4 },
      { month: "Dic", winRate: 69.1 },
    ],
    []
  );

  // Análisis por símbolos
  const symbolAnalysis = useMemo(
    () => [
      { symbol: "EURUSD", profit: 2850, trades: 125, winRate: 68.8 },
      { symbol: "GBPUSD", profit: 1920, trades: 98, winRate: 65.3 },
      { symbol: "USDJPY", profit: 1450, trades: 87, winRate: 71.2 },
      { symbol: "AUDUSD", profit: 980, trades: 65, winRate: 63.1 },
      { symbol: "USDCAD", profit: 750, trades: 52, winRate: 69.2 },
      { symbol: "NZDUSD", profit: 420, trades: 38, winRate: 60.5 },
    ],
    []
  );

  // Distribución de ganancias
  const profitDistribution = useMemo(
    () => [
      { range: "< $50", count: 156, color: "#ef4444" },
      { range: "$50-100", count: 89, color: "#f59e0b" },
      { range: "$100-200", count: 67, color: "#eab308" },
      { range: "$200-500", count: 45, color: "#22c55e" },
      { range: "> $500", count: 23, color: "#10b981" },
    ],
    []
  );

  // Métricas clave
  const keyMetrics = [
    {
      title: "Ganancia Total",
      value: "$8,970",
      description: "Último año",
      icon: <DollarSign className="h-5 w-5" />,
      trend: { value: 89.7, isPositive: true },
      gradient: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    },
    {
      title: "Total Operaciones",
      value: "564",
      description: "Ejecutadas",
      icon: <Activity className="h-5 w-5" />,
      trend: { value: 12.4, isPositive: true },
      gradient: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    {
      title: "Tasa de Éxito",
      value: "67.2%",
      description: "Promedio anual",
      icon: <Target className="h-5 w-5" />,
      trend: { value: 3.8, isPositive: true },
      gradient: "bg-gradient-to-br from-purple-500 to-purple-600",
    },
    {
      title: "Drawdown Máx.",
      value: "8.5%",
      description: "Abril 2024",
      icon: <AlertCircle className="h-5 w-5" />,
      trend: { value: -2.1, isPositive: false },
      gradient: "bg-gradient-to-br from-orange-500 to-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <ProfessionalHeader
        title="Reportes Avanzados"
        subtitle="Análisis detallado de rendimiento y estadísticas de trading"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar PDF
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2">
              <FileText className="h-4 w-4" />
              Generar Reporte
            </Button>
          </div>
        }
      />

      <div className="p-6 space-y-8">
        {/* Métricas Clave */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {keyMetrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card
                className={`border-0 shadow-lg ${metric.gradient} text-white`}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white/90">
                    {metric.title}
                  </CardTitle>
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    className="text-white/80"
                  >
                    {metric.icon}
                  </motion.div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">
                    {metric.value}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-white/70">
                      {metric.description}
                    </p>
                    <Badge
                      variant={
                        metric.trend.isPositive ? "default" : "destructive"
                      }
                      className="bg-white/20 text-white border-white/30"
                    >
                      {metric.trend.isPositive ? "+" : ""}
                      {metric.trend.value}%
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs de Reportes */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Tabs defaultValue="performance" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="performance" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Rendimiento
              </TabsTrigger>
              <TabsTrigger value="analysis" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Análisis
              </TabsTrigger>
              <TabsTrigger value="symbols" className="gap-2">
                <PieChart className="h-4 w-4" />
                Símbolos
              </TabsTrigger>
              <TabsTrigger value="monthly" className="gap-2">
                <Calendar className="h-4 w-4" />
                Mensual
              </TabsTrigger>
            </TabsList>

            {/* Tab de Rendimiento */}
            <TabsContent value="performance" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <AnimatedChart
                  title="Curva de Patrimonio"
                  description="Evolución anual del equity vs balance"
                  data={equityCurve}
                  type="line"
                  dataKey="equity"
                  xAxisKey="date"
                  color="#10b981"
                  delay={600}
                  height={350}
                  icon={<TrendingUp className="h-5 w-5" />}
                />

                <AnimatedChart
                  title="Beneficios Mensuales"
                  description="Ganancias y pérdidas por mes"
                  data={monthlyProfits}
                  type="bar"
                  dataKey="profit"
                  xAxisKey="month"
                  color="#3b82f6"
                  delay={800}
                  height={350}
                  icon={<BarChart3 className="h-5 w-5" />}
                />
              </div>

              <AnimatedChart
                title="Tasa de Éxito Mensual"
                description="Porcentaje de operaciones ganadoras por mes"
                data={winRateData}
                type="area"
                dataKey="winRate"
                xAxisKey="month"
                color="#8b5cf6"
                delay={1000}
                height={300}
                icon={<Target className="h-5 w-5" />}
              />
            </TabsContent>

            {/* Tab de Análisis */}
            <TabsContent value="analysis" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-yellow-600" />
                      Mejores Operaciones
                    </CardTitle>
                    <CardDescription>
                      Top 5 operaciones más rentables
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { symbol: "EURUSD", profit: 450.2, date: "15 Nov" },
                      { symbol: "GBPUSD", profit: 380.5, date: "8 Oct" },
                      { symbol: "USDJPY", profit: 325.8, date: "22 Sep" },
                      { symbol: "AUDUSD", profit: 290.15, date: "5 Ago" },
                      { symbol: "USDCAD", profit: 275.6, date: "18 Jul" },
                    ].map((trade, index) => (
                      <motion.div
                        key={trade.symbol}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{trade.symbol}</p>
                          <p className="text-sm text-muted-foreground">
                            {trade.date}
                          </p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          +${trade.profit}
                        </Badge>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>

                <AnimatedChart
                  title="Distribución de Ganancias"
                  description="Rangos de beneficios por operación"
                  data={profitDistribution}
                  type="pie"
                  dataKey="count"
                  color="#06b6d4"
                  delay={1200}
                  height={350}
                  icon={<PieChart className="h-5 w-5" />}
                />
              </div>
            </TabsContent>

            {/* Tab de Símbolos */}
            <TabsContent value="symbols" className="space-y-6">
              <div className="grid gap-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Análisis por Símbolos</CardTitle>
                    <CardDescription>
                      Rendimiento detallado por par de divisas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {symbolAnalysis.map((symbol, index) => (
                        <motion.div
                          key={symbol.symbol}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 bg-muted/30 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-lg">
                                {symbol.symbol}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {symbol.trades} operaciones
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-green-600">
                                +${symbol.profit}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {symbol.winRate}% éxito
                              </p>
                            </div>
                          </div>
                          <Progress value={symbol.winRate} className="h-2" />
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tab Mensual */}
            <TabsContent value="monthly" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {monthlyProfits.slice(-6).map((month, index) => (
                  <motion.div
                    key={month.month}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">
                          {month.month} 2024
                        </CardTitle>
                        <CardDescription>
                          {month.trades} operaciones
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div>
                            <p
                              className={`text-2xl font-bold ${
                                month.profit >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {month.profit >= 0 ? "+" : ""}${month.profit}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Beneficio neto
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant={
                                month.profit >= 0 ? "default" : "destructive"
                              }
                            >
                              {month.profit >= 0 ? (
                                <TrendingUp className="h-3 w-3 mr-1" />
                              ) : (
                                <TrendingDown className="h-3 w-3 mr-1" />
                              )}
                              {Math.abs((month.profit / 10000) * 100).toFixed(
                                1
                              )}
                              %
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
