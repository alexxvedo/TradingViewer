"use client";

import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  LayoutDashboard,
  Wallet,
  TrendingUp,
  Settings,
  ChevronRight,
  Plus,
  Activity,
  BarChart3,
  History,
} from "lucide-react";

// Mock data - en una aplicación real esto vendría de tu estado global
const mockAccounts = [
  {
    id: "1",
    name: "Cuenta 1",
    platform: "MT4",
    status: "active",
    balance: 10000,
  },
  {
    id: "2",
    name: "Cuenta 2",
    platform: "MT5",
    status: "inactive",
    balance: 5000,
  },
  {
    id: "3",
    name: "Cuenta 3",
    platform: "MT4",
    status: "active",
    balance: 15000,
  },
];

const data = {
  navMain: [
    {
      title: "Panel Principal",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Cuentas",
      url: "/accounts",
      icon: Wallet,
    },
    {
      title: "Trading",
      url: "/trading",
      icon: TrendingUp,
    },
    {
      title: "Reportes",
      url: "/reports",
      icon: BarChart3,
    },
    {
      title: "Configuración",
      url: "/settings",
      icon: Settings,
    },
  ],
};

export function AppSidebar() {
  const [activeItem, setActiveItem] = useState("/");

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <span className="text-xl">📊</span>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">TradingViewer</span>
                  <span className="truncate text-xs">Monitor MT4/MT5</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.items?.length ? (
                    <Collapsible asChild defaultOpen={item.url === "/accounts"}>
                      <div>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip={item.title}
                            isActive={activeItem === item.url}
                            onClick={() => setActiveItem(item.url)}
                          >
                            <item.icon />
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items?.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={activeItem === subItem.url}
                                  onClick={() => setActiveItem(subItem.url)}
                                >
                                  <a href={subItem.url}>
                                    <span>{subItem.title}</span>
                                  </a>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={activeItem === item.url}
                      onClick={() => setActiveItem(item.url)}
                    >
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Accounts */}
        <SidebarGroup>
          <SidebarGroupLabel>
            <div className="flex items-center justify-between">
              <span>Mis Cuentas</span>
              <Badge variant="secondary" className="text-xs">
                {mockAccounts.length}
              </Badge>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mockAccounts.map((account) => (
                <SidebarMenuItem key={account.id}>
                  <SidebarMenuButton
                    asChild
                    tooltip={`${account.name} - ${account.platform}`}
                  >
                    <a href={`/accounts/${account.id}`}>
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {account.platform === "MT4" ? "4" : "5"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {account.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ${account.balance.toLocaleString()}
                        </span>
                      </div>
                      <Badge
                        variant={
                          account.status === "active" ? "default" : "secondary"
                        }
                        className="ml-auto h-4 text-xs"
                      >
                        {account.status === "active" ? (
                          <Activity className="h-2 w-2" />
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                        )}
                      </Badge>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/accounts/add">
                    <Plus className="h-4 w-4" />
                    <span>Agregar Cuenta</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 px-2 py-1">
              <ThemeToggle />
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/profile">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Usuario</span>
                  <span className="truncate text-xs">usuario@ejemplo.com</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
