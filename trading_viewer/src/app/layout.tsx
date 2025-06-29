import type { Metadata } from "next";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { NotificationSystem } from "@/components/NotificationSystem";
import { ParticleBackground } from "@/components/ParticleBackground";

export const metadata: Metadata = {
  title: "Trading Viewer",
  description: "Monitorea tus cuentas MT4/MT5 en tiempo real",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <AppSidebar />
            <ParticleBackground />
            <main className="flex-1 relative z-10">{children}</main>
            <NotificationSystem />
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
