"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ReactNode } from "react";

interface AnimatedCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  gradient: string;
  delay?: number;
  hoverInfo?: string;
  onClick?: () => void;
}

export function AnimatedCard({
  title,
  value,
  description,
  icon,
  trend,
  gradient,
  delay = 0,
  hoverInfo,
  onClick,
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        type: "spring",
        stiffness: 100,
      }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.98 }}
    >
      <HoverCard>
        <HoverCardTrigger asChild>
          <Card
            className={`${gradient} border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group`}
            onClick={onClick}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">
                {title}
              </CardTitle>
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-white/80"
              >
                {icon}
              </motion.div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <motion.div
                    className="text-2xl font-bold text-white"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: delay + 0.2 }}
                  >
                    {value}
                  </motion.div>
                  {description && (
                    <p className="text-xs text-white/70 mt-1">{description}</p>
                  )}
                </div>
                {trend && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: delay + 0.3 }}
                  >
                    <Badge
                      variant={trend.isPositive ? "default" : "destructive"}
                      className="bg-white/20 text-white border-white/30"
                    >
                      {trend.isPositive ? "+" : ""}
                      {trend.value}%
                    </Badge>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </HoverCardTrigger>
        {hoverInfo && (
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">{title}</h4>
              <p className="text-sm text-muted-foreground">{hoverInfo}</p>
            </div>
          </HoverCardContent>
        )}
      </HoverCard>
    </motion.div>
  );
}
