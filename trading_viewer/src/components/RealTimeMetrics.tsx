"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  Target,
  DollarSign,
  Clock,
  BarChart3,
} from "lucide-react";

interface MetricData {
  value: number;
  change: number;
  isPositive: boolean;
  trend: number[];
}

export function RealTimeMetrics() {
  const [metrics, setMetrics] = useState({
    balance: { value: 15720.5, change: 2.4, isPositive: true },
    equity: { value: 16125.3, change: 3.8, isPositive: true },
    dailyPL: { value: 404.8, change: 1.2, isPositive: true },
    winRate: { value: 68.5, change: 0.8, isPositive: true },
  });

  const [liveData, setLiveData] = useState({
    spread: 0.8,
    ping: 12,
    serverLoad: 23,
    activePositions: 7,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        balance: {
          ...prev.balance,
          value: prev.balance.value + (Math.random() - 0.5) * 10,
        },
        equity: {
          ...prev.equity,
          value: prev.equity.value + (Math.random() - 0.5) * 15,
        },
        dailyPL: {
          ...prev.dailyPL,
          value: prev.dailyPL.value + (Math.random() - 0.5) * 5,
        },
        winRate: {
          ...prev.winRate,
          value: Math.max(
            0,
            Math.min(100, prev.winRate.value + (Math.random() - 0.5) * 0.5)
          ),
        },
      }));

      setLiveData((prev) => ({
        spread: Math.max(0.1, prev.spread + (Math.random() - 0.5) * 0.2),
        ping: Math.max(5, Math.min(50, prev.ping + (Math.random() - 0.5) * 3)),
        serverLoad: Math.max(
          0,
          Math.min(100, prev.serverLoad + (Math.random() - 0.5) * 5)
        ),
        activePositions: Math.max(
          0,
          prev.activePositions + Math.floor((Math.random() - 0.5) * 2)
        ),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                {formatCurrency(metrics.balance.value)}
              </div>
              <Badge variant="default" className="text-xs mt-2">
                +{metrics.balance.change.toFixed(2)}%
              </Badge>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Patrimonio</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {formatCurrency(metrics.equity.value)}
              </div>
              <Badge variant="default" className="text-xs mt-2">
                +{metrics.equity.change.toFixed(2)}%
              </Badge>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">P&L Diario</CardTitle>
              <Activity className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                +{formatCurrency(metrics.dailyPL.value)}
              </div>
              <Badge variant="default" className="text-xs mt-2">
                +{metrics.dailyPL.change.toFixed(2)}%
              </Badge>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tasa de Éxito
              </CardTitle>
              <Target className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                {metrics.winRate.value.toFixed(1)}%
              </div>
              <Progress value={metrics.winRate.value} className="h-2 mt-2" />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="h-5 w-5 text-green-600" />
            </motion.div>
            Estado de Conexión en Vivo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Spread</span>
              </div>
              <Badge variant="outline">{liveData.spread.toFixed(1)} pips</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Ping</span>
              </div>
              <Badge variant="outline">{liveData.ping.toFixed(0)}ms</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Servidor</span>
              </div>
              <Badge variant="outline">{liveData.serverLoad.toFixed(0)}%</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium">Posiciones</span>
              </div>
              <Badge variant="outline">{liveData.activePositions}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
