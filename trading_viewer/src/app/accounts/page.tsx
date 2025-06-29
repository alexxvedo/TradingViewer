"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ProfessionalHeader } from "@/components/ProfessionalHeader";
import AccountForm from "@/components/AccountForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Users,
  Server,
  Wifi,
  WifiOff,
  Settings,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Account {
  id: string;
  name: string;
  server: string;
  login: string;
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
  isConnected: boolean;
  lastUpdate: string;
  profit: number;
  profitPercent: number;
  positions: number;
  orders: number;
}

export default function AccountsPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: "1",
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
    },
    {
      id: "2",
      name: "Cuenta Secundaria",
      server: "MetaTrader-Live02",
      login: "987654321",
      balance: 5000.0,
      equity: 4850.25,
      margin: 1200.0,
      freeMargin: 3650.25,
      marginLevel: 404.19,
      isConnected: true,
      lastUpdate: "Hace 12 segundos",
      profit: -149.75,
      profitPercent: -2.99,
      positions: 2,
      orders: 0,
    },
    {
      id: "3",
      name: "Cuenta de Pruebas",
      server: "MetaTrader-Demo03",
      login: "555666777",
      balance: 1000.0,
      equity: 1000.0,
      margin: 0.0,
      freeMargin: 1000.0,
      marginLevel: 0,
      isConnected: false,
      lastUpdate: "Hace 5 minutos",
      profit: 0.0,
      profitPercent: 0.0,
      positions: 0,
      orders: 0,
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddAccount = (accountData: any) => {
    const newAccount: Account = {
      id: Date.now().toString(),
      name: accountData.name,
      server: accountData.server,
      login: accountData.login,
      balance: 0,
      equity: 0,
      margin: 0,
      freeMargin: 0,
      marginLevel: 0,
      isConnected: false,
      lastUpdate: "Nunca",
      profit: 0,
      profitPercent: 0,
      positions: 0,
      orders: 0,
    };

    setAccounts((prev) => [...prev, newAccount]);
    setIsDialogOpen(false);
  };

  const handleDeleteAccount = (id: string) => {
    setAccounts((prev) => prev.filter((account) => account.id !== id));
  };

  const connectedAccounts = accounts.filter((acc) => acc.isConnected).length;
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalEquity = accounts.reduce((sum, acc) => sum + acc.equity, 0);
  const totalProfit = accounts.reduce((sum, acc) => sum + acc.profit, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <ProfessionalHeader
        title="Gestión de Cuentas"
        subtitle="Administra y monitorea todas tus cuentas de trading"
        actions={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2">
                <Plus className="h-4 w-4" />
                Agregar Cuenta
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Agregar Nueva Cuenta</DialogTitle>
              </DialogHeader>
              <AccountForm onAddAccount={handleAddAccount} />
            </DialogContent>
          </Dialog>
        }
      />

      <div className="p-6 space-y-8">
        {/* Resumen General */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">
                Cuentas Conectadas
              </CardTitle>
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="text-white/80"
              >
                <Users className="h-5 w-5" />
              </motion.div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white mb-1">
                {connectedAccounts} / {accounts.length}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/70">Activas ahora</p>
                <Badge className="bg-white/20 text-white border-white/30">
                  {Math.round((connectedAccounts / accounts.length) * 100)}%
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">
                Balance Total
              </CardTitle>
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="text-white/80"
              >
                <DollarSign className="h-5 w-5" />
              </motion.div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white mb-1">
                ${totalBalance.toLocaleString()}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/70">Todas las cuentas</p>
                <Badge className="bg-white/20 text-white border-white/30">
                  USD
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">
                Patrimonio Total
              </CardTitle>
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="text-white/80"
              >
                <Activity className="h-5 w-5" />
              </motion.div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white mb-1">
                ${totalEquity.toLocaleString()}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/70">Valor actual</p>
                <Badge className="bg-white/20 text-white border-white/30">
                  Real
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`border-0 shadow-lg ${
              totalProfit >= 0
                ? "bg-gradient-to-br from-emerald-500 to-emerald-600"
                : "bg-gradient-to-br from-red-500 to-red-600"
            } text-white`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">
                P&L Total
              </CardTitle>
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="text-white/80"
              >
                {totalProfit >= 0 ? (
                  <TrendingUp className="h-5 w-5" />
                ) : (
                  <TrendingDown className="h-5 w-5" />
                )}
              </motion.div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white mb-1">
                {totalProfit >= 0 ? "+" : ""}${totalProfit.toFixed(2)}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/70">Ganancia/Pérdida</p>
                <Badge className="bg-white/20 text-white border-white/30">
                  {((totalProfit / totalBalance) * 100).toFixed(2)}%
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Lista de Cuentas */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Mis Cuentas</h2>
            <Badge variant="outline" className="text-sm">
              {accounts.length} cuenta{accounts.length !== 1 ? "s" : ""}
            </Badge>
          </div>

          <div className="grid gap-6">
            {accounts.map((account, index) => (
              <motion.div
                key={account.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => router.push(`/accounts/${account.id}`)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-xl ${
                            account.isConnected
                              ? "bg-green-100 dark:bg-green-900/20"
                              : "bg-gray-100 dark:bg-gray-900/20"
                          }`}
                        >
                          {account.isConnected ? (
                            <Wifi className="h-6 w-6 text-green-600" />
                          ) : (
                            <WifiOff className="h-6 w-6 text-gray-500" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">
                            {account.name}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Server className="h-3 w-3" />
                              {account.server}
                            </span>
                            <span>Login: {account.login}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            account.isConnected ? "default" : "secondary"
                          }
                          className={
                            account.isConnected
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {account.isConnected ? "CONECTADO" : "DESCONECTADO"}
                        </Badge>

                        <div
                          className="flex gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() =>
                              router.push(`/accounts/${account.id}`)
                            }
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                            onClick={() => handleDeleteAccount(account.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">Balance</span>
                        </div>
                        <p className="text-2xl font-bold">
                          ${account.balance.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Depósito inicial
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-medium">
                            Patrimonio
                          </span>
                        </div>
                        <p className="text-2xl font-bold">
                          ${account.equity.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Valor actual
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {account.profit >= 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                          <span className="text-sm font-medium">P&L</span>
                        </div>
                        <p
                          className={`text-2xl font-bold ${
                            account.profit >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {account.profit >= 0 ? "+" : ""}$
                          {account.profit.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {account.profit >= 0 ? "+" : ""}
                          {account.profitPercent.toFixed(2)}%
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-orange-600" />
                          <span className="text-sm font-medium">
                            Nivel Margen
                          </span>
                        </div>
                        <p className="text-2xl font-bold">
                          {account.marginLevel.toFixed(0)}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {account.marginLevel > 200
                            ? "Seguro"
                            : account.marginLevel > 100
                            ? "Moderado"
                            : "Riesgo"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <div className="grid grid-cols-3 gap-6 text-center">
                          <div>
                            <p className="text-lg font-semibold">
                              {account.positions}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Posiciones
                            </p>
                          </div>
                          <div>
                            <p className="text-lg font-semibold">
                              {account.orders}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Órdenes
                            </p>
                          </div>
                          <div>
                            <p className="text-lg font-semibold">
                              ${account.freeMargin.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Margen Libre
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            Última actualización
                          </p>
                          <p className="text-sm font-medium">
                            {account.lastUpdate}
                          </p>
                        </div>
                      </div>

                      {account.margin > 0 && (
                        <div className="mt-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Margen Utilizado</span>
                            <span>
                              ${account.margin.toLocaleString()} / $
                              {account.equity.toLocaleString()}
                            </span>
                          </div>
                          <Progress
                            value={(account.margin / account.equity) * 100}
                            className="h-2"
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {accounts.length === 0 && (
            <Card className="border-0 shadow-lg">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No hay cuentas configuradas
                </h3>
                <p className="text-muted-foreground text-center mb-4">
                  Agrega tu primera cuenta de trading para comenzar a monitorear
                  tus operaciones.
                </p>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Agregar Primera Cuenta
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Agregar Nueva Cuenta</DialogTitle>
                    </DialogHeader>
                    <AccountForm onAddAccount={handleAddAccount} />
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
