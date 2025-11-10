"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Card } from "@/components/ui/card"
import { RevenueChart } from "@/components/analytics/revenue-chart"
import { OrdersChart } from "@/components/analytics/orders-chart"
import { ServiceBreakdown } from "@/components/analytics/service-breakdown"
import { TopCustomers } from "@/components/analytics/top-customers"
import { ReportGenerator } from "@/components/analytics/report-generator"
import { TrendingUp, ShoppingCart, Users, DollarSign } from "lucide-react"

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("7days")

  // Sample data for charts
  const revenueData = [
    { date: "Mon", revenue: 45000, target: 50000 },
    { date: "Tue", revenue: 52000, target: 50000 },
    { date: "Wed", revenue: 48000, target: 50000 },
    { date: "Thu", revenue: 61000, target: 50000 },
    { date: "Fri", revenue: 55000, target: 50000 },
    { date: "Sat", revenue: 67000, target: 50000 },
    { date: "Sun", revenue: 58000, target: 50000 },
  ]

  const ordersData = [
    { date: "Mon", completed: 24, pending: 8, cancelled: 2 },
    { date: "Tue", completed: 28, pending: 6, cancelled: 1 },
    { date: "Wed", completed: 22, pending: 10, cancelled: 2 },
    { date: "Thu", completed: 32, pending: 5, cancelled: 1 },
    { date: "Fri", completed: 26, pending: 9, cancelled: 2 },
    { date: "Sat", completed: 35, pending: 4, cancelled: 1 },
    { date: "Sun", completed: 29, pending: 7, cancelled: 2 },
  ]

  const serviceData = [
    { name: "Wash & Dry", value: 45 },
    { name: "Wash, Dry & Iron", value: 30 },
    { name: "Wash Only", value: 15 },
    { name: "Iron Only", value: 10 },
  ]

  const topCustomers = [
    { name: "Mike Johnson", orders: 8, spent: 24000, percentage: 12 },
    { name: "John Doe", orders: 5, spent: 12500, percentage: 6 },
    { name: "Jane Smith", orders: 3, spent: 7500, percentage: 4 },
  ]

  const stats = [
    {
      label: "Total Revenue",
      value: "KES 386,000",
      change: "+12.5%",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      label: "Total Orders",
      value: "196",
      change: "+8.2%",
      icon: ShoppingCart,
      color: "text-blue-600",
    },
    {
      label: "Active Customers",
      value: "48",
      change: "+5.1%",
      icon: Users,
      color: "text-purple-600",
    },
    {
      label: "Avg Order Value",
      value: "KES 1,969",
      change: "+3.8%",
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ]

  const handleGenerateReport = (type: string, format: string) => {
    alert(`Generating ${type} report in ${format.toUpperCase()} format...`)
    // In a real app, this would trigger a backend API call
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics & Reports</h1>
            <p className="text-muted-foreground mt-1">Track performance and generate insights</p>
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

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
                  <p className="text-xs text-green-600 mt-1">{stat.change} from last period</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart data={revenueData} />
          <OrdersChart data={ordersData} />
        </div>

        {/* Service Breakdown and Top Customers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ServiceBreakdown data={serviceData} />
          <TopCustomers data={topCustomers} />
        </div>

        {/* Report Generator */}
        <ReportGenerator onGenerateReport={handleGenerateReport} />
      </div>
    </DashboardLayout>
  )
}
