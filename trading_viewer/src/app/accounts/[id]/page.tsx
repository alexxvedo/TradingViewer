"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { ProfessionalHeader } from "@/components/ProfessionalHeader";
import { AnimatedChart } from "@/components/AnimatedChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowLeft,
  DollarSign,
  Activity,
  TrendingUp,
  TrendingDown,
  Users,
  Bot,
  Settings,
  Play,
  Pause,
  Edit,
  Trash2,
  Plus,
  Wifi,
  WifiOff,
  AlertCircle,
  Target,
  Zap,
  BarChart3,
  PieChart,
  Clock,
  Server,
  Shield,
  Bell,
  Palette,
} from "lucide-react";

interface ExpertAdvisor {
  id: string;
  name: string;
  magicNumber: number;
  description: string;
  isActive: boolean;
  totalTrades: number;
  totalPL: number;
  averagePL: number;
  winRate: number;
}

interface Trade {
  id: string;
  symbol: string;
  type: "BUY" | "SELL";
  volume: number;
  openPrice: number;
  closePrice?: number;
  openTime: string;
  closeTime?: string;
  profit: number;
  magicNumber: number;
  status: "OPEN" | "CLOSED";
}

export default function AccountDetailPage() {
  const params = useParams();
  const router = useRouter();
  const accountId = params.id as string;

  // Datos dummy de la cuenta
  const accountData = useMemo(
    () => ({
      id: accountId,
      name: "Cuenta Principal",
      server: "MetaTrader-Demo01",
      login: "123456789",
      balance: 10000.0,
      equity: 10245.8,
      margin: 2500.0,
      freeMargin: 7745.8,
      marginLevel: 409.83,
      isConnected: true,
      lastUpdate: "Hace 5 segundos",
      profit: 245.8,
      profitPercent: 2.46,
      positions: 3,
      orders: 1,
      leverage: 100,
      currency: "USD",
      company: "Demo Broker Ltd.",
    }),
    [accountId]
  );

  // Estados
  const [expertAdvisors, setExpertAdvisors] = useState<ExpertAdvisor[]>([
    {
      id: "1",
      name: "Scalping Pro",
      magicNumber: 12345,
      description: "EA de scalping para EURUSD",
      isActive: true,
      totalTrades: 156,
      totalPL: 1250.5,
      averagePL: 8.01,
      winRate: 68.5,
    },
    {
      id: "2",
      name: "Trend Follower",
      magicNumber: 67890,
      description: "Seguidor de tendencias multi-par",
      isActive: false,
      totalTrades: 89,
      totalPL: -125.3,
      averagePL: -1.41,
      winRate: 45.2,
    },
    {
      id: "3",
      name: "Grid Master",
      magicNumber: 11111,
      description: "Sistema de grid avanzado",
      isActive: true,
      totalTrades: 234,
      totalPL: 890.75,
      averagePL: 3.81,
      winRate: 72.1,
    },
  ]);

  const [trades, setTrades] = useState<Trade[]>([
    {
      id: "1",
      symbol: "EURUSD",
      type: "BUY",
      volume: 0.1,
      openPrice: 1.0875,
      closePrice: 1.0892,
      openTime: "2024-01-15 10:30:00",
      closeTime: "2024-01-15 11:45:00",
      profit: 17.0,
      magicNumber: 12345,
      status: "CLOSED",
    },
    {
      id: "2",
      symbol: "GBPUSD",
      type: "SELL",
      volume: 0.2,
      openPrice: 1.2745,
      openTime: "2024-01-15 14:20:00",
      profit: 25.5,
      magicNumber: 12345,
      status: "OPEN",
    },
    {
      id: "3",
      symbol: "USDJPY",
      type: "BUY",
      volume: 0.15,
      openPrice: 149.85,
      openTime: "2024-01-15 16:10:00",
      profit: -12.3,
      magicNumber: 11111,
      status: "OPEN",
    },
  ]);

  const [isAddEADialogOpen, setIsAddEADialogOpen] = useState(false);
  const [newEA, setNewEA] = useState({
    name: "",
    magicNumber: "",
    description: "",
  });

  // Datos para gráficos
  const equityData = useMemo(
    () => [
      { time: "09:00", equity: 10000, balance: 10000 },
      { time: "10:00", equity: 10050, balance: 10000 },
      { time: "11:00", equity: 10125, balance: 10000 },
      { time: "12:00", equity: 10200, balance: 10000 },
      { time: "13:00", equity: 10180, balance: 10000 },
      { time: "14:00", equity: 10245, balance: 10000 },
      { time: "15:00", equity: 10220, balance: 10000 },
      { time: "16:00", equity: 10246, balance: 10000 },
    ],
    []
  );

  const symbolDistribution = useMemo(
    () => [
      { name: "EURUSD", value: 45, color: "#10b981" },
      { name: "GBPUSD", value: 30, color: "#3b82f6" },
      { name: "USDJPY", value: 25, color: "#8b5cf6" },
    ],
    []
  );

  // Funciones
  const handleAddEA = () => {
    if (!newEA.name || !newEA.magicNumber || !newEA.description) {
      alert("Por favor completa todos los campos");
      return;
    }

    const ea: ExpertAdvisor = {
      id: Date.now().toString(),
      name: newEA.name,
      magicNumber: parseInt(newEA.magicNumber),
      description: newEA.description,
      isActive: false,
      totalTrades: 0,
      totalPL: 0,
      averagePL: 0,
      winRate: 0,
    };

    setExpertAdvisors((prev) => [...prev, ea]);
    setNewEA({ name: "", magicNumber: "", description: "" });
    setIsAddEADialogOpen(false);
  };

  const handleToggleEA = (id: string) => {
    setExpertAdvisors((prev) =>
      prev.map((ea) => (ea.id === id ? { ...ea, isActive: !ea.isActive } : ea))
    );
  };

  const handleDeleteEA = (id: string) => {
    setExpertAdvisors((prev) => prev.filter((ea) => ea.id !== id));
  };

  const getTradesByMagic = (magicNumber: number) => {
    return trades.filter((trade) => trade.magicNumber === magicNumber);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <ProfessionalHeader
        title={accountData.name}
        subtitle={`${accountData.server} • Login: ${accountData.login}`}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="h-4 w-4" />
              Configurar
            </Button>
          </div>
        }
      />

      <div className="p-6 space-y-8">
        {/* Estado de Conexión */}
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
                      accountData.isConnected ? "bg-green-500" : "bg-gray-500"
                    }`}
                  >
                    {accountData.isConnected ? (
                      <Wifi className="h-6 w-6 text-white" />
                    ) : (
                      <WifiOff className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      Estado de la Cuenta
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {accountData.isConnected
                        ? "Conectada y operando"
                        : "Desconectada"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      +${accountData.profit.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      P&L Flotante
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      {accountData.positions}
                    </p>
                    <p className="text-sm text-muted-foreground">Posiciones</p>
                  </div>
                  <div className="text-center">
                    <Badge
                      className={
                        accountData.isConnected
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {accountData.isConnected ? "ONLINE" : "OFFLINE"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs Principales */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Resumen
              </TabsTrigger>
              <TabsTrigger value="experts" className="gap-2">
                <Bot className="h-4 w-4" />
                Expert Advisors
              </TabsTrigger>
              <TabsTrigger value="trades" className="gap-2">
                <Activity className="h-4 w-4" />
                Operaciones
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Settings className="h-4 w-4" />
                Configuración
              </TabsTrigger>
            </TabsList>

            {/* Tab Resumen */}
            <TabsContent value="overview" className="space-y-6">
              {/* Métricas Principales */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white/90">
                      Balance
                    </CardTitle>
                    <DollarSign className="h-5 w-5 text-white/80" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white mb-1">
                      ${accountData.balance.toLocaleString()}
                    </div>
                    <p className="text-xs text-white/70">Depósito inicial</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white/90">
                      Patrimonio
                    </CardTitle>
                    <Activity className="h-5 w-5 text-white/80" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white mb-1">
                      ${accountData.equity.toLocaleString()}
                    </div>
                    <p className="text-xs text-white/70">Valor actual</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white/90">
                      Margen
                    </CardTitle>
                    <AlertCircle className="h-5 w-5 text-white/80" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white mb-1">
                      ${accountData.margin.toLocaleString()}
                    </div>
                    <p className="text-xs text-white/70">Utilizado</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white/90">
                      Posiciones
                    </CardTitle>
                    <Target className="h-5 w-5 text-white/80" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white mb-1">
                      {accountData.positions}
                    </div>
                    <p className="text-xs text-white/70">Abiertas</p>
                  </CardContent>
                </Card>
              </div>

              {/* Gráficos */}
              <div className="grid gap-6 lg:grid-cols-2">
                <AnimatedChart
                  title="Evolución del Patrimonio"
                  description="Equity vs Balance en tiempo real"
                  data={equityData}
                  type="line"
                  dataKey="equity"
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
                  icon={<PieChart className="h-5 w-5" />}
                />
              </div>

              {/* Información Detallada */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Server className="h-5 w-5 text-blue-600" />
                      Información de la Cuenta
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Servidor</p>
                        <p className="font-medium">{accountData.server}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Login</p>
                        <p className="font-medium">{accountData.login}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Apalancamiento</p>
                        <p className="font-medium">1:{accountData.leverage}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Moneda</p>
                        <p className="font-medium">{accountData.currency}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Compañía</p>
                        <p className="font-medium">{accountData.company}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Última Act.</p>
                        <p className="font-medium">{accountData.lastUpdate}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-green-600" />
                      Métricas de Trading
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Nivel de Margen</span>
                        <span className="font-medium">
                          {accountData.marginLevel.toFixed(2)}%
                        </span>
                      </div>
                      <Progress
                        value={Math.min(accountData.marginLevel / 5, 100)}
                        className="h-3"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {accountData.marginLevel > 200
                          ? "Nivel seguro"
                          : "Precaución requerida"}
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Margen Libre</span>
                        <span className="font-medium">
                          ${accountData.freeMargin.toLocaleString()}
                        </span>
                      </div>
                      <Progress
                        value={
                          (accountData.freeMargin / accountData.equity) * 100
                        }
                        className="h-3"
                      />
                    </div>

                    <div className="pt-2 border-t">
                      <div className="flex justify-between">
                        <span>P&L Total</span>
                        <span
                          className={`font-bold ${
                            accountData.profit >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {accountData.profit >= 0 ? "+" : ""}$
                          {accountData.profit.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tab Expert Advisors */}
            <TabsContent value="experts" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Expert Advisors</h3>
                <Dialog
                  open={isAddEADialogOpen}
                  onOpenChange={setIsAddEADialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Definir EA
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Definir Expert Advisor</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="ea-name">Nombre del EA</Label>
                        <Input
                          id="ea-name"
                          value={newEA.name}
                          onChange={(e) =>
                            setNewEA((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          placeholder="ej. Scalping Pro"
                        />
                      </div>
                      <div>
                        <Label htmlFor="ea-magic">Magic Number</Label>
                        <Input
                          id="ea-magic"
                          type="number"
                          value={newEA.magicNumber}
                          onChange={(e) =>
                            setNewEA((prev) => ({
                              ...prev,
                              magicNumber: e.target.value,
                            }))
                          }
                          placeholder="ej. 12345"
                        />
                      </div>
                      <div>
                        <Label htmlFor="ea-description">Descripción</Label>
                        <Input
                          id="ea-description"
                          value={newEA.description}
                          onChange={(e) =>
                            setNewEA((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          placeholder="Descripción del EA"
                        />
                      </div>
                      <Button onClick={handleAddEA} className="w-full">
                        Definir EA
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Las operaciones con este magic number se asignarán
                      automáticamente a este EA
                    </p>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-6">
                {expertAdvisors.map((ea, index) => (
                  <motion.div
                    key={ea.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-0 shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <Avatar
                              className={`h-12 w-12 ${
                                ea.isActive ? "bg-green-100" : "bg-gray-100"
                              }`}
                            >
                              <AvatarFallback>
                                <Bot
                                  className={`h-6 w-6 ${
                                    ea.isActive
                                      ? "text-green-600"
                                      : "text-gray-500"
                                  }`}
                                />
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold text-lg">
                                {ea.name}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Magic: {ea.magicNumber}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {ea.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <Badge
                                variant={
                                  getTradesByMagic(ea.magicNumber).filter(
                                    (t) => t.status === "OPEN"
                                  ).length > 0
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {getTradesByMagic(ea.magicNumber).filter(
                                  (t) => t.status === "OPEN"
                                ).length > 0
                                  ? "OPERANDO"
                                  : "SIN OPERACIONES"}
                              </Badge>
                              <p className="text-xs text-muted-foreground mt-1">
                                {getTradesByMagic(ea.magicNumber).length}{" "}
                                operaciones totales
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteEA(ea.id)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-4 mb-4">
                          <div className="text-center p-3 bg-muted/30 rounded-lg">
                            <p className="text-2xl font-bold">
                              {ea.totalTrades}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Operaciones
                            </p>
                          </div>
                          <div className="text-center p-3 bg-muted/30 rounded-lg">
                            <p
                              className={`text-2xl font-bold ${
                                ea.totalPL >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {ea.totalPL >= 0 ? "+" : ""}$
                              {ea.totalPL.toFixed(2)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              P&L Total
                            </p>
                          </div>
                          <div className="text-center p-3 bg-muted/30 rounded-lg">
                            <p
                              className={`text-2xl font-bold ${
                                ea.averagePL >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {ea.averagePL >= 0 ? "+" : ""}$
                              {ea.averagePL.toFixed(2)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              P&L Promedio
                            </p>
                          </div>
                          <div className="text-center p-3 bg-muted/30 rounded-lg">
                            <p className="text-2xl font-bold">
                              {ea.winRate.toFixed(1)}%
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Tasa Éxito
                            </p>
                          </div>
                        </div>

                        {/* Operaciones del EA */}
                        <div>
                          <h5 className="font-medium mb-2">
                            Operaciones Recientes
                          </h5>
                          <div className="space-y-2">
                            {getTradesByMagic(ea.magicNumber)
                              .slice(0, 3)
                              .map((trade) => (
                                <div
                                  key={trade.id}
                                  className="flex items-center justify-between p-2 bg-muted/20 rounded"
                                >
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant={
                                        trade.type === "BUY"
                                          ? "default"
                                          : "secondary"
                                      }
                                    >
                                      {trade.type}
                                    </Badge>
                                    <span className="font-medium">
                                      {trade.symbol}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                      {trade.volume}
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    <p
                                      className={`font-medium ${
                                        trade.profit >= 0
                                          ? "text-green-600"
                                          : "text-red-600"
                                      }`}
                                    >
                                      {trade.profit >= 0 ? "+" : ""}$
                                      {trade.profit.toFixed(2)}
                                    </p>
                                    <Badge
                                      variant={
                                        trade.status === "OPEN"
                                          ? "default"
                                          : "outline"
                                      }
                                    >
                                      {trade.status}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Tab Operaciones */}
            <TabsContent value="trades" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Historial de Operaciones</CardTitle>
                  <CardDescription>
                    Todas las operaciones de esta cuenta
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Símbolo</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Volumen</TableHead>
                        <TableHead>Precio Apertura</TableHead>
                        <TableHead>Precio Cierre</TableHead>
                        <TableHead>P&L</TableHead>
                        <TableHead>Magic</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Fecha</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {trades.map((trade) => (
                        <TableRow key={trade.id}>
                          <TableCell className="font-medium">
                            {trade.symbol}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                trade.type === "BUY" ? "default" : "secondary"
                              }
                            >
                              {trade.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{trade.volume}</TableCell>
                          <TableCell>{trade.openPrice.toFixed(5)}</TableCell>
                          <TableCell>
                            {trade.closePrice?.toFixed(5) || "-"}
                          </TableCell>
                          <TableCell>
                            <span
                              className={
                                trade.profit >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              {trade.profit >= 0 ? "+" : ""}$
                              {trade.profit.toFixed(2)}
                            </span>
                          </TableCell>
                          <TableCell>{trade.magicNumber}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                trade.status === "OPEN" ? "default" : "outline"
                              }
                            >
                              {trade.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(trade.openTime).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab Configuración */}
            <TabsContent value="settings" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-blue-600" />
                      Configuración de Cuenta
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="account-name">Nombre de la Cuenta</Label>
                      <Input id="account-name" value={accountData.name} />
                    </div>
                    <div>
                      <Label htmlFor="server">Servidor</Label>
                      <Input id="server" value={accountData.server} />
                    </div>
                    <div>
                      <Label htmlFor="login">Login</Label>
                      <Input id="login" value={accountData.login} />
                    </div>
                    <Button className="w-full">Guardar Cambios</Button>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-orange-600" />
                      Notificaciones
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Alertas de Operaciones</Label>
                        <p className="text-sm text-muted-foreground">
                          Notificar nuevas operaciones
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Alertas de Margen</Label>
                        <p className="text-sm text-muted-foreground">
                          Cuando el margen sea bajo
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Reportes Diarios</Label>
                        <p className="text-sm text-muted-foreground">
                          Resumen diario por email
                        </p>
                      </div>
                      <Switch />
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
