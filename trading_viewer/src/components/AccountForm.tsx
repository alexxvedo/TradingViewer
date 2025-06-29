"use client";

import { useState } from "react";
import { AccountData } from "@/types/electron";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Folder } from "lucide-react";

interface AccountFormProps {
  onAddAccount: (accountData: AccountData & { name: string }) => void;
}

export default function AccountForm({ onAddAccount }: AccountFormProps) {
  const [formData, setFormData] = useState<
    Partial<AccountData & { name: string }>
  >({
    name: "",
    platform: "mt4",
    login: "",
    password: "",
    server: "",
    terminalPath: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.login ||
      !formData.password ||
      !formData.server ||
      !formData.terminalPath
    ) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    onAddAccount(formData as AccountData & { name: string });

    // Reset form
    setFormData({
      name: "",
      platform: "mt4",
      login: "",
      password: "",
      server: "",
      terminalPath: "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, platform: value as "mt4" | "mt5" }));
  };

  const handleBrowseTerminal = () => {
    // In a real implementation, you would use electron's dialog API
    // For now, we'll just show an alert
    alert(
      "Por favor ingresa manualmente la ruta al ejecutable del terminal MT4/MT5"
    );
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la Cuenta *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="ej. Cuenta Principal, Scalping, Swing Trading"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="platform">Plataforma *</Label>
            <Select
              value={formData.platform}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar plataforma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mt4">MetaTrader 4</SelectItem>
                <SelectItem value="mt5">MetaTrader 5</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="login">Login *</Label>
            <Input
              id="login"
              name="login"
              value={formData.login}
              onChange={handleChange}
              placeholder="Ingresa el login de la cuenta"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña *</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Ingresa la contraseña de la cuenta"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="server">Servidor *</Label>
            <Input
              id="server"
              name="server"
              value={formData.server}
              onChange={handleChange}
              placeholder="ej. broker-server.com:443"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="terminalPath">Ruta del Terminal *</Label>
            <div className="flex gap-2">
              <Input
                id="terminalPath"
                name="terminalPath"
                value={formData.terminalPath}
                onChange={handleChange}
                placeholder="C:\Program Files\MetaTrader 4\terminal.exe"
                className="flex-1"
                required
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleBrowseTerminal}
              >
                <Folder className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Ruta al archivo ejecutable del terminal MT4/MT5
            </p>
          </div>

          <Button type="submit" className="w-full">
            Agregar Cuenta
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
