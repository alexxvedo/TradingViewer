"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

export function LiveClock() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Inicializar el lado del cliente
  useEffect(() => {
    setIsClient(true);
    setCurrentTime(new Date());
  }, []);

  // Actualizar la hora cada segundo solo en el cliente
  useEffect(() => {
    if (!isClient) return;

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [isClient]);

  return (
    <Badge variant="outline" className="text-xs">
      {currentTime ? currentTime.toLocaleTimeString("es-ES") : "--:--:--"}
    </Badge>
  );
}
