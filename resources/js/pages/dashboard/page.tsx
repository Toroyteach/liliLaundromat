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
  const { props } = usePage();

  const user = props.auth?.user;

  const canCreateOrder = user && user.roles?.[0]?.name !== "customer";

  // ------------------------------  
  // DASHBOARD STATS FROM BACKEND  
  // ------------------------------
  const stats = [
    {
      label: "Total Revenue (Today)",
      value: `KES ${props.total_revenue_today ?? 0}`,
      icon: TrendingUp,
      color: "text-purple-600",
    },
    {
      label: "Total Orders (Today)",
      value: props.total_orders_today ?? 0,
      icon: ShoppingCart,
      color: "text-blue-600",
    },
    {
      label: "Completed Orders",
      value: props.completed_orders ?? 0,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      label: "Pending Invoices",
      value: props.pending_invoices ?? 0,
      icon: FileText,
      color: "text-orange-600",
    },
    {
      label: "Lost/Damaged Items",
      value: props.lost_damaged_items ?? 0,
      icon: FileWarning,
      color: "text-red-600",
    },
    {
      label: "New Customers",
      value: props.new_customers_today ?? 0,
      icon: UserPlus,
      color: "text-purple-600",
    },
    {
      label: "Total Customers",
      value: props.total_customers ?? 0,
      icon: Users,
      color: "text-green-600",
    },
  ];

  // ------------------------------  
  // WEEKLY REVENUE (FORMAT TO MATCH CHART)  
  // ------------------------------
  const revenueData = props.weekly_revenue?.map((item: any) => ({
    date: item.day_label,     // e.g. "Mon"
    revenue: item.total,
    target: 50000,
  })) ?? [];

  // ------------------------------  
  // PAYMENT METHODS  
  // ------------------------------
  const paymentMethodsData =
    props.payment_methods?.map((item: any) => ({
      name: item.method,
      value: item.value,
    })) ?? [];

  // ------------------------------  
  // RECENT ORDERS  
  // ------------------------------
  const recentOrdersData =
    props.recent_orders?.map((o: any) => ({
      id: o.id,
      customerName: o.customer_name,
      status: o.status,
      totalPrice: o.total_price,
      createdAt: o.created_at,
    })) ?? [];

  // ------------------------------  
  // OUTSTANDING INVOICES  
  // ------------------------------
  const outstandingInvoicesData =
    props.outstanding_invoices?.map((i: any) => ({
      id: i.id,
      customerName: i.customer_name,
      amount: i.subtotal,
      dueDate: 'today',
    })) ?? [];

  // ------------------------------  
  // RECENT PAYMENTS  
  // ------------------------------
  const recentPaymentsData =
    props.recent_payments?.map((t: any) => ({
      id: t.id,
      amount: t.amount,
      method: t.method,
      status: t.status,
    })) ?? [];

  // ------------------------------  
  // LOST ITEMS  
  // ------------------------------
  const lostItemLogsData =
    props.lost_items_list?.map((l: any) => ({
      id: l.id,
      garment: l.description,
      staffName: l.staff_name,
      reportedDate: l.scanned_at,
      status: l.stage,
    })) ?? [];

  // ------------------------------  
  // TOP CUSTOMERS  
  // ------------------------------
  const topCustomersData =
    props.top_customers?.map((c: any) => ({
      name: c.name,
      orders: c.order_count,
      spent: c.total_spent,
      percentage: c.percentage,
    })) ?? [];

  // ------------------------------  
  // NOTIFICATIONS (OPTIONAL)  
  // ------------------------------
  const notificationsData = props.notifications ?? [];

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
