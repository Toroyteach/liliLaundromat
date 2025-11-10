import { useState } from "react";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { CustomersList } from "@/components/customers/customers-list";
import { Card } from "@/components/ui/card";
import { Users, TrendingUp, ShoppingCart } from "lucide-react";

import type { Customer } from "@/lib/types";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "CUST-001",
      name: "John Doe",
      phone: "+254712345678",
      email: "john@example.com",
      totalOrders: 5,
      totalSpent: 12500,
      lastOrderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      createdAt: new Date("2024-01-10"),
      notes: "VIP customer - prefers express service",
    },
    {
      id: "CUST-002",
      name: "Jane Smith",
      phone: "+254798765432",
      email: "jane@example.com",
      totalOrders: 3,
      totalSpent: 7500,
      lastOrderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      createdAt: new Date("2024-02-15"),
    },
    {
      id: "CUST-003",
      name: "Mike Johnson",
      phone: "+254723456789",
      totalOrders: 8,
      totalSpent: 24000,
      lastOrderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      createdAt: new Date("2023-12-01"),
      notes: "Regular customer - bulk orders",
    },
  ]);

  const handleDeleteCustomer = (customerId: string) => {
    setCustomers(customers.filter((c) => c.id !== customerId));
  };

  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgSpent =
    totalCustomers > 0 ? Math.round(totalRevenue / totalCustomers) : 0;

  const stats = [
    {
      label: "Total Customers",
      value: totalCustomers.toString(),
      icon: Users,
      color: "text-blue-600",
    },
    {
      label: "Total Revenue",
      value: `KES ${totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      label: "Avg. Spent per Customer",
      value: `KES ${avgSpent.toLocaleString()}`,
      icon: ShoppingCart,
      color: "text-purple-600",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Customers</h1>
          <p className="text-muted-foreground mt-1">
            View and manage your customer base
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-2">
                    {stat.value}
                  </p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </Card>
          ))}
        </div>

        {/* Customers List */}
        <CustomersList customers={customers} onDelete={handleDeleteCustomer} onEdit={(customer) => { console.log('Edit', customer)}} />
      </div>
    </DashboardLayout>
  );
}
