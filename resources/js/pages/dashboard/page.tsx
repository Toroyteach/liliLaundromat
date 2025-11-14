import { useState } from "react";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bell,
  ShoppingCart,
  Users,
  TrendingUp,
  CheckCircle,
  FileWarning,
  FileText,
  UserPlus,
} from "lucide-react";
import { Link, usePage } from '@inertiajs/react'
import { RevenueChart } from "@/components/analytics/revenue-chart";
import { PaymentMethodsChart } from "@/components/analytics/payment-methods-chart";
import { RecentOrders } from "@/components/analytics/recent-orders";
import { OutstandingInvoices } from "@/components/analytics/outstanding-invoices";
import { RecentPayments } from "@/components/analytics/recent-payments";
import { LostItemLogs } from "@/components/analytics/lost-item-logs";
import { TopCustomers } from "@/components/analytics/top-customers";
import { formatDistanceToNow } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppLayout } from "@/layouts/AppLayout";

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState("7days");
  const { props } = usePage<{ auth?: { user?: any } }>();

  const user = props.auth?.user;

  const canCreateOrder = user && user.roles?.[0]?.name !== "customer";
  // Dashboard stats
  const stats = [
    {
      label: "Total Revenue (Today)",
      value: "KES 15,240",
      icon: TrendingUp,
      color: "text-purple-600",
    },
    {
      label: "Total Orders (Today)",
      value: "12",
      icon: ShoppingCart,
      color: "text-blue-600",
    },
    {
      label: "Completed Orders",
      value: "8",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      label: "Pending Invoices",
      value: "3",
      icon: FileText,
      color: "text-orange-600",
    },
    {
      label: "Lost/Damaged Items",
      value: "1",
      icon: FileWarning,
      color: "text-red-600",
    },
    {
      label: "New Customers",
      value: "5",
      icon: UserPlus,
      color: "text-purple-600",
    },
    {
      label: "Total Customers",
      value: "248",
      icon: Users,
      color: "text-green-600",
    },
  ];

  // Analytics data from analytics page
  const revenueData = [
    { date: "Mon", revenue: 45000, target: 50000 },
    { date: "Tue", revenue: 52000, target: 50000 },
    { date: "Wed", revenue: 48000, target: 50000 },
    { date: "Thu", revenue: 61000, target: 50000 },
    { date: "Fri", revenue: 55000, target: 50000 },
    { date: "Sat", revenue: 67000, target: 50000 },
    { date: "Sun", revenue: 58000, target: 50000 },
  ];

  const paymentMethodsData = [
    { name: "M-Pesa", value: 400 },
    { name: "Cash", value: 300 },
    { name: "Card", value: 200 },
    { name: "Invoice", value: 100 },
  ];

  const recentOrdersData = [
    {
      id: "ORD-001",
      customerName: "John Doe",
      status: "completed" as const,
      totalPrice: 2500,
      createdAt: new Date(),
    },
    {
      id: "ORD-002",
      customerName: "Jane Smith",
      status: "in-progress" as const,
      totalPrice: 1500,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: "ORD-003",
      customerName: "Mike Johnson",
      status: "ready" as const,
      totalPrice: 3000,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  ];

  const outstandingInvoicesData = [
    {
      id: "INV-001",
      customerName: "Emily White",
      amount: 1200,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    },
    {
      id: "INV-002",
      customerName: "Chris Green",
      amount: 800,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    },
  ];

  const recentPaymentsData = [
    {
      id: "TXN-001",
      amount: 2500,
      method: "mpesa" as const,
      status: "completed" as const,
    },
    {
      id: "TXN-002",
      amount: 1500,
      method: "cash" as const,
      status: "completed" as const,
    },
    {
      id: "TXN-003",
      amount: 3000,
      method: "card" as const,
      status: "pending" as const,
    },
  ];

  const lostItemLogsData = [
    {
      id: "LST-001",
      garment: "Blue Cotton Shirt (ORD-002)",
      staffName: "Sarah",
      reportedDate: new Date(),
      status: "investigating" as const,
    },
  ];

  const topCustomersData = [
    {
      name: "Mike Johnson",
      orders: 8,
      spent: 24000,
      percentage: 12,
    },
    {
      name: "John Doe",
      orders: 5,
      spent: 12500,
      percentage: 6,
    },
    {
      name: "Jane Smith",
      orders: 3,
      spent: 7500,
      percentage: 4,
    },
  ];

  const notificationsData = [
    {
      id: "notif-1",
      icon: ShoppingCart,
      title: "New Order Created",
      description: "Order #ORD-004 for Jane Smith has been created.",
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      href: "/orders/ORD-004",
    },
    {
      id: "notif-2",
      icon: CheckCircle,
      title: "Order Processed",
      description: "Order #ORD-003 is now ready for pickup.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      href: "/orders/ORD-003",
    },
    {
      id: "notif-3",
      icon: UserPlus,
      title: "User Status Updated",
      description: "Staff member 'Bob' has been activated.",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      href: "/staff/bob",
    },
    {
      id: "notif-4",
      icon: FileWarning,
      title: "Payment Failed",
      description: "Payment for invoice #INV-002 failed.",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      href: "/payments/INV-002",
    },
    {
      id: "notif-5",
      icon: Users,
      title: "New Customer Onboarded",
      description: "A new customer 'David Lee' has been registered.",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      href: "/customers/david-lee",
    },
  ];

  const handleGenerateReport = (type: string, format: string) => {
    alert(`Generating ${type} report in ${format.toUpperCase()} format...`);
    // In a real app, this would trigger a backend API call
  };

  return (
    <AppLayout>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's a summary of your laundromat's activity.
            </p>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="operations">Operations</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                {stats.map((stat) => (
                  <Card key={stat.label} className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {stat.label}
                        </p>
                        <p className="text-2xl font-bold text-foreground mt-2">
                          {stat.value}
                        </p>
                      </div>
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </Card>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Quick Actions
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/orders">
                      <Button variant="outline">View All Orders</Button>
                    </Link>
                    <Link href="/customers">
                      <Button variant="outline">Customers</Button>
                    </Link>
                    <Link href="/payments">
                      <Button variant="outline">Payments</Button>
                    </Link>
                    <Link href="/settings">
                      <Button variant="outline">Settings</Button>
                    </Link>
                  </div>
                </Card>
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    Notifications
                  </h2>
                  <div className="space-y-4">
                    {notificationsData.map((notification) => (
                      <div
                        key={notification.id}
                        className="flex items-start gap-3 hover:bg-secondary p-2 rounded-lg transition-colors"
                      >
                        <div className="bg-secondary p-2 rounded-full mt-1">
                          <notification.icon className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <Link href={notification.href} className="block">
                            <p className="text-sm font-medium text-foreground hover:underline">
                              {notification.title}
                            </p>
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            {notification.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(notification.timestamp, {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="mt-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Analytics Overview
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    Track performance and generate insights.
                  </p>
                </div>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="90days">Last 90 Days</option>
                  <option value="1year">Last Year</option>
                </select>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RevenueChart data={revenueData} />
                <PaymentMethodsChart data={paymentMethodsData} />
              </div>
              <TopCustomers data={topCustomersData} />
            </TabsContent>

            {/* Operations Tab */}
            <TabsContent value="operations" className="mt-6 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Operational Overview
                </h2>
                <p className="text-muted-foreground mt-1">
                  Manage day-to-day laundry operations.
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentOrders orders={recentOrdersData} />
                <OutstandingInvoices invoices={outstandingInvoicesData} />
                <RecentPayments payments={recentPaymentsData} />
                <LostItemLogs items={lostItemLogsData} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </AppLayout>
  );
}
