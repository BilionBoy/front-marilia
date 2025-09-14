"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Menu,
  Package,
  DollarSign,
  ShoppingCart,
  Tag,
  LogOut,
  Home,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Categorias",
    href: "/dashboard/categorias",
    icon: Package,
  },

  {
    name: "Produtos",
    href: "/dashboard/produtos",
    icon: Package,
  },
  {
    name: "Financeiro",
    href: "/dashboard/financeiro",
    icon: DollarSign,
  },
  {
    name: "Vendas",
    href: "/dashboard/vendas",
    icon: ShoppingCart,
  },
  {
    name: "Promoções",
    href: "/dashboard/promocoes",
    icon: Tag,
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // Remover o cookie de autenticação
    document.cookie =
      "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    // Usar router do Next.js para redirecionamento
    router.push("/");
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar Desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 bg-sidebar overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="w-12 h-12 relative mr-3">
              <Image
                src="/logo-marilia-cruz.png"
                alt="MC Logo"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">
                MC Marilia Cruz
              </h1>
              <p className="text-xs text-sidebar-foreground/70">Admin Panel</p>
            </div>
          </div>
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center px-2 py-3 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "mr-3 flex-shrink-0 h-5 w-5",
                        isActive
                          ? "text-sidebar-primary-foreground"
                          : "text-sidebar-foreground/70"
                      )}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="flex-shrink-0 p-2">
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0 bg-sidebar">
          <div className="flex flex-col h-full pt-5">
            <div className="flex items-center flex-shrink-0 px-4">
              <div className="w-12 h-12 relative mr-3">
                <Image
                  src="/logo-marilia-cruz.png"
                  alt="MC Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold text-sidebar-foreground">
                  MC Marilia Cruz
                </h1>
                <p className="text-xs text-sidebar-foreground/70">
                  Admin Panel
                </p>
              </div>
            </div>
            <div className="mt-8 flex-grow flex flex-col">
              <nav className="flex-1 px-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "group flex items-center px-2 py-3 text-sm font-medium rounded-md transition-colors",
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "mr-3 flex-shrink-0 h-5 w-5",
                          isActive
                            ? "text-sidebar-primary-foreground"
                            : "text-sidebar-foreground/70"
                        )}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
              <div className="flex-shrink-0 p-2">
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="md:hidden">
          <div className="flex items-center justify-between p-4 bg-card border-b border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-lg font-semibold text-foreground">
              MC Marilia Cruz
            </h1>
            <div className="w-6" /> {/* Spacer */}
          </div>
        </div>
        <main className="flex-1 overflow-y-auto bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
