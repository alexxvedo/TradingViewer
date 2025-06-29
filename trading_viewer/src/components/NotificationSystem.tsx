"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, Info, X, Activity } from "lucide-react";

interface Notification {
  id: string;
  type: "success" | "warning" | "info" | "trade";
  title: string;
  message: string;
  timestamp: Date;
  autoClose?: boolean;
  duration?: number;
}

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const tradeNotifications = [
        {
          type: "trade" as const,
          title: "Nueva Operación",
          message: "EURUSD Compra ejecutada - +$45.20",
          autoClose: true,
          duration: 5000,
        },
        {
          type: "success" as const,
          title: "Objetivo Alcanzado",
          message: "Take Profit ejecutado en GBPUSD",
          autoClose: true,
          duration: 4000,
        },
      ];

      const randomNotification =
        tradeNotifications[
          Math.floor(Math.random() * tradeNotifications.length)
        ];

      const newNotification: Notification = {
        id: `notif-${Date.now()}`,
        ...randomNotification,
        timestamp: new Date(),
      };

      setNotifications((prev) => [newNotification, ...prev.slice(0, 4)]);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-600" />;
      case "trade":
        return <Activity className="h-5 w-5 text-purple-600" />;
      default:
        return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{
              duration: 0.4,
              type: "spring",
              stiffness: 120,
              delay: index * 0.1,
            }}
          >
            <Card className="border-0 shadow-xl border-l-4 border-l-purple-500 bg-white dark:bg-gray-900 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-200 mt-1">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => removeNotification(notification.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
