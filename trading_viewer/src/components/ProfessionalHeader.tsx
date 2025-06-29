"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Users,
  Globe,
  Zap,
  Shield,
  Bell,
  Settings,
} from "lucide-react";
import { LiveClock } from "./LiveClock";

interface ProfessionalHeaderProps {
  title: string;
  subtitle?: string;
  showLiveData?: boolean;
  actions?: React.ReactNode;
}

export function ProfessionalHeader({
  title,
  subtitle,
  showLiveData = true,
  actions,
}: ProfessionalHeaderProps) {
  const liveStats = [
    { label: "Activo", value: "24/7", icon: Activity, color: "bg-green-500" },
    { label: "Cuentas", value: "12", icon: Users, color: "bg-blue-500" },
    { label: "Mercados", value: "5", icon: Globe, color: "bg-purple-500" },
    { label: "Uptime", value: "99.9%", icon: Shield, color: "bg-emerald-500" },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 opacity-10" />

      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.15)_1px,_transparent_0)] bg-[size:20px_20px]" />
      </div>

      <div className="relative px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {/* Main Title */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
              className="flex items-center gap-4 mb-2"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg"
              >
                <TrendingUp className="h-8 w-8 text-white" />
              </motion.div>

              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  {title}
                </h1>
                {subtitle && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg text-muted-foreground mt-1"
                  >
                    {subtitle}
                  </motion.p>
                )}
              </div>
            </motion.div>

            {/* Live Stats */}
            {showLiveData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex items-center gap-6 mt-4"
              >
                {liveStats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <div className={`p-2 ${stat.color} rounded-lg shadow-sm`}>
                      <stat.icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Live Clock */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="text-right"
            >
              <LiveClock />
              <p className="text-xs text-muted-foreground mt-1">
                Hora del servidor
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-2"
            >
              <Button variant="outline" size="sm" className="gap-2">
                <Bell className="h-4 w-4" />
                Alertas
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Settings className="h-4 w-4" />
                Config
              </Button>
              {actions}
            </motion.div>

            {/* Status Indicator */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
              className="flex items-center gap-2"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.8, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-3 h-3 bg-green-500 rounded-full shadow-lg"
              />
              <Badge
                variant="outline"
                className="text-green-600 border-green-200"
              >
                <Zap className="h-3 w-3 mr-1" />
                En Vivo
              </Badge>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
