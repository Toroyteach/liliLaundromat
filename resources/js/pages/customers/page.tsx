import { useState } from "react";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Users, TrendingUp, ShoppingCart, MoreVertical } from "lucide-react";

import type { Customer } from "@/lib/types";
import { AppLayout } from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { usePage } from "@inertiajs/react";

export default function CustomersPage() {
    const { props } = usePage();
    const customers = (props.customers ?? []) as Customer[];
    // const [customers, setCustomers] = useState<Customer[]>([
    //     {
    //         id: "CUST-001",
    //         name: "John Doe",
    //         phone: "+254712345678",
    //         email: "john@example.com",
    //         totalOrders: 5,
    //         totalSpent: 12500,
    //         lastOrderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    //         createdAt: new Date("2024-01-10"),
    //         notes: "VIP customer - prefers express service",
    //     },
    //     {
    //         id: "CUST-002",
    //         name: "Jane Smith",
    //         phone: "+254798765432",
    //         email: "jane@example.com",
    //         totalOrders: 3,
    //         totalSpent: 7500,
    //         lastOrderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    //         createdAt: new Date("2024-02-15"),
    //     },
    //     {
    //         id: "CUST-003",
    //         name: "Mike Johnson",
    //         phone: "+254723456789",
    //         totalOrders: 8,
    //         totalSpent: 24000,
    //         lastOrderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    //         createdAt: new Date("2023-12-01"),
    //         notes: "Regular customer - bulk orders",
    //     },
    // ]);

    const handleDeleteCustomer = (customerId: string) => {
        // setCustomers(customers.filter((c) => c.id !== customerId));
    };

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const paginatedCustomers = customers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
    );
    const totalPages = Math.ceil(customers.length / itemsPerPage);

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
        <AppLayout>
            <DashboardLayout>
                <div className="space-y-6">
                    {/* Header */}
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            Customers
                        </h1>
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
                                        <p className="text-sm text-muted-foreground">
                                            {stat.label}
                                        </p>
                                        <p className="text-2xl font-bold text-foreground mt-2">
                                            {stat.value}
                                        </p>
                                    </div>
                                    <stat.icon
                                        className={`w-8 h-8 ${stat.color}`}
                                    />
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Customers List */}
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold text-foreground mb-4">
                            All Customers
                        </h2>
                        <div className="flex justify-end items-center gap-2 mb-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    setCurrentPage((p) => Math.max(1, p - 1))
                                }
                                disabled={currentPage === 1}
                            >
                                Previous
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                Page {currentPage} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage((p) => p + 1)}
                                disabled={
                                    currentPage * itemsPerPage >=
                                    customers.length
                                }
                            >
                                Next
                            </Button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                                            Customer
                                        </th>
                                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                                            Contact
                                        </th>
                                        <th className="text-center py-3 px-4 font-semibold text-muted-foreground">
                                            Total Orders
                                        </th>
                                        <th className="text-right py-3 px-4 font-semibold text-muted-foreground">
                                            Total Spent
                                        </th>
                                        <th className="text-center py-3 px-4 font-semibold text-muted-foreground">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedCustomers.map((customer) => (
                                        <tr
                                            key={customer.id}
                                            className="border-b border-border hover:bg-secondary/50 transition-colors"
                                        >
                                            <td className="py-3 px-4">
                                                <div className="font-medium text-foreground">
                                                    {customer.name}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {customer.id}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="text-foreground">
                                                    {customer.phone}
                                                </div>
                                                {customer.email && (
                                                    <div className="text-xs text-muted-foreground">
                                                        {customer.email}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-center font-medium text-foreground">
                                                {customer.totalOrders}
                                            </td>
                                            <td className="py-3 px-4 text-right font-semibold text-foreground">
                                                KES{" "}
                                                {customer.totalSpent.toLocaleString()}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                {/* Dropdown for actions can be added here */}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        console.log(
                                                            "Actions for",
                                                            customer.id,
                                                        )
                                                    }
                                                >
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {paginatedCustomers.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">
                                    No customers found.
                                </p>
                            </div>
                        )}
                    </Card>
                </div>
            </DashboardLayout>
        </AppLayout>
    );
}
