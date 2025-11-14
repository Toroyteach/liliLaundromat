import React, { useState, useEffect } from "react";
import { usePage, router, Link } from "@inertiajs/react";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard,
  MapPin,
  ShoppingCart,
  Settings,
  Zap,
  CreditCard,
  Users2,
  Users,
  BarChart3,
  LogOut,
  Menu,
  X,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

import { NotificationItem, Notification } from "./NotificationItem";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  // Use permission string for granular access control
  permission?: string;
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { url } = usePage();
  const { user, can, isAuthenticated, primaryRole } = useAuth();
  const pathname = url;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user !== undefined) setLoading(false);
  }, [user]);

  const handleLogout = async () => {
    await router.post("/logout");
    router.visit("/sign-in");
  };


  const getNavItems = (): NavItem[] => {
    if (!isAuthenticated) return [];

    const allNavItems: NavItem[] = [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/tracking", label: "Track Laundry", icon: MapPin, permission: "orders.read" },
      { href: "/orders", label: "Orders", icon: ShoppingCart, permission: "orders.read" },
      { href: "/payments", label: "Payments", icon: CreditCard, permission: "payments.read" },
      { href: "/reports", label: "Reports", icon: BarChart3, permission: "reports.read" },
      { href: "/customers", label: "Customers", icon: Users, permission: "customers.read" },
      { href: "/staff", label: "Staff", icon: Users2, permission: "users.read" },
      { href: "/hardware", label: "Hardware", icon: Zap, permission: "settings.read" },
      { href: "/settings", label: "Settings", icon: Settings, permission: "settings.read" },
    ];

    return allNavItems.filter((item) =>
      item.permission ? can(item.permission) : true
    );
  };

  const notificationsData: Notification[] = [
    {
      id: "notif-1",
      icon: ShoppingCart,
      title: "New Order Created",
      description: "A new order has been successfully created.",
      timestamp: new Date(),
      href: "/orders/ORD-004",
    },
  ];

  const navItems = getNavItems();

  return (
      <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <aside
          className={`${sidebarOpen ? "w-64" : "w-20"
            } bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col`}
        >
          <div className="p-6 border-b border-sidebar-border flex items-center gap-3">
            <div className="w-10 h-10 bg-sidebar-primary rounded-lg flex items-center justify-center font-bold text-sidebar-primary-foreground">
              L
            </div>
            {sidebarOpen && (
              <div>
                <h2 className="font-bold text-sidebar-foreground">
                  LaundroHub
                </h2>
                <p className="text-xs text-sidebar-accent-foreground">
                  Management
                </p>
              </div>
            )}
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors ${pathname === item.href
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : ""
                  }`}
              >
                <item.icon className="w-5 h-5" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-sidebar-border space-y-2">
            {sidebarOpen && (
              <div className="px-4 py-2 text-sm">
                <p className="font-medium text-sidebar-foreground">
                  {user?.name}
                </p>
                <p className="text-xs text-sidebar-accent-foreground capitalize">
                  {primaryRole || "User"}
                </p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <LogOut className="w-4 h-4" />
              {sidebarOpen && <span className="ml-2">Logout</span>}
            </Button>
          </div>
        </aside>

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Welcome back, {user?.name}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-primary" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80" align="end">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="mt-4 space-y-2">
                    {notificationsData.map((n, i) => (
                      <div key={n.id}>
                        <NotificationItem notification={n} />
                        {i < notificationsData.length - 1 && <Separator />}
                      </div>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
  );
}