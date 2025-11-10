import React, { useState } from "react";
import { router } from '@inertiajs/react'
import { Link, usePage } from "@inertiajs/react"
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  CreditCard,
  Users2,
  Zap,
  BarChart3,
  MapPin,
  Bell,
  CheckCircle,
  UserPlus,
  FileWarning,
} from "lucide-react";
import {
  NotificationItem,
  type Notification,
} from "../../pages/dashboard/NotificationItem";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { url } = usePage() // gives current path
  const pathname = url 
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
    router.visit("/login");
  };

  // Mock notifications - in a real app, this would come from state management or an API
  const notificationsData: Notification[] = [
    {
      id: "notif-1",
      icon: ShoppingCart,
      title: "New Order Created",
      description:
        "A new order #ORD-004 for Jane Smith has been successfully created.",
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      href: "/orders/ORD-004",
    },
    {
      id: "notif-2",
      icon: CheckCircle,
      title: "Order Processed",
      description:
        "Your order #ORD-003 has been processed and is now ready for pickup.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      href: "/orders/ORD-003",
    },
    {
      id: "notif-3",
      icon: UserPlus,
      title: "New Staff Member",
      description: "A new staff member, 'Bob', has been added to the system.",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      href: "/staff/bob",
    },
    {
      id: "notif-4",
      icon: FileWarning,
      title: "Payment Failed",
      description:
        "The payment for invoice #INV-002 has failed. Please review and try again.",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      href: "/payments/INV-002",
    },
    {
      id: "notif-5",
      icon: Users,
      title: "New Customer Onboarded",
      description:
        "Welcome to our new customer, 'David Lee', who has just registered.",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      href: "/customers/david-lee",
    },
  ];

  const getNavItems = () => {
    const baseItems = [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/tracking", label: "Track Laundry", icon: MapPin },
    ];

    if (user?.role === "customer") {
      return [
        ...baseItems,
        { href: "/orders", label: "My Orders", icon: ShoppingCart },
        { href: "/settings", label: "Settings", icon: Settings },
      ];
    }

    if (user?.role === "staff") {
      return [
        ...baseItems,
        { href: "/orders", label: "Orders", icon: ShoppingCart },
        { href: "/hardware", label: "Hardware", icon: Zap },
        { href: "/settings", label: "Settings", icon: Settings },
      ];
    }

    if (user?.role === "manager") {
      return [
        ...baseItems,
        { href: "/orders", label: "Orders", icon: ShoppingCart },
        { href: "/payments", label: "Payments", icon: CreditCard },
        { href: "/staff", label: "Staff", icon: Users2 },
        { href: "/customers", label: "Customers", icon: Users },
        { href: "/hardware", label: "Hardware", icon: Zap },
        { href: "/settings", label: "Settings", icon: Settings },
        { href: "/reports", label: "Reports", icon: BarChart3 },
      ];
    }

    // Admin has access to everything
    return [
      ...baseItems,
      { href: "/orders", label: "Orders", icon: ShoppingCart },
      { href: "/payments", label: "Payments", icon: CreditCard },
      { href: "/staff", label: "Staff", icon: Users2 },
      { href: "/customers", label: "Customers", icon: Users },
      { href: "/hardware", label: "Hardware", icon: Zap },
      { href: "/settings", label: "Settings", icon: Settings },
      { href: "/reports", label: "Reports", icon: BarChart3 },
    ];
  };

  const navItems = getNavItems();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <span className="text-sidebar-primary-foreground font-bold">
                L
              </span>
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
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors ${
                pathname === item.href
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : ""
              }`}
            >
              <item.icon className="w-5 h-5" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-sidebar-border space-y-2">
          {sidebarOpen && (
            <div className="px-4 py-2 text-sm">
              <p className="font-medium text-sidebar-foreground">
                {user?.name}
              </p>
              <p className="text-xs text-sidebar-accent-foreground capitalize">
                {user?.role}
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Welcome back, {user?.name}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  {/* Optional: Notification dot */}
                  <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-primary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80" align="end">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="mt-4 space-y-2">
                  {notificationsData.map((notification, index) => (
                    <div key={notification.id}>
                      <NotificationItem notification={notification} />
                      {index < notificationsData.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
