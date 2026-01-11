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
import { Link, usePage } from "@inertiajs/react";
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
    const [topCustomersPage, setTopCustomersPage] = useState(1);
    const [outstandingInvoicesPage, setOutstandingInvoicesPage] = useState(1);
    const [recentPaymentsPage, setRecentPaymentsPage] = useState(1);
    const [lostItemsPage, setLostItemsPage] = useState(1);
    const [recentOrdersPage, setRecentOrdersPage] = useState(1);
    const [topCustomersSortBy, setTopCustomersSortBy] = useState("spent"); // 'spent' or 'orders'
    const { props } = usePage();

    // Explicitly type props to ensure 'auth' and 'user' are recognized
    const { auth } = props as {
        auth?: { user?: { name: string; roles?: { name: string }[] } };
    } & Record<string, any>;
    const user = auth?.user;

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
    const revenueData =
        props.weekly_revenue?.map((item: any) => ({
            date: item.day_label, // e.g. "Mon"
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
            totalItems: o.total_items, // Added total items
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
            dueDate: "today",
        })) ?? [];

    // ------------------------------
    // RECENT PAYMENTS
    // ------------------------------
    const recentPaymentsData =
        props.recent_payments?.map((t: any) => ({
            id: t.id,
            amount: t.amount,
            method: t.method,
            reference: t.reference, // Assuming this field exists
            processed_by: t.processed_by, // Assuming this field exists
            paid_at: t.paid_at, // Assuming this field exists
        })) ?? [];

    // ------------------------------
    // LOST ITEMS
    // ------------------------------
    const lostItemLogsData =
        props.lost_items_list?.map((l: any) => ({
            id: l.id,
            garment: l.description,
            orderNumber: l.order_number, // Assuming this field exists
            customerName: l.customer_name, // Assuming this field exists
            reportedDate: l.scanned_at,
            staffName: l.staff_name,
            status: l.stage,
        })) ?? [];
    // ------------------------------
    // TOP CUSTOMERS
    // ------------------------------
    const topCustomersData: {
        id: any;
        name: any;
        email: any;
        phone: any;
        orders: any;
        spent: any;
        percentage: any;
    }[] =
        props.top_customers?.map((c: any) => ({
            id: c.id,
            name: c.name,
            email: c.email,
            phone: c.phone,
            orders: c.order_count,
            spent: c.total_spent,
            percentage: c.percentage,
        })) ?? [];

    const sortedTopCustomers = [...topCustomersData].sort((a, b) => {
        if (topCustomersSortBy === "spent") {
            return b.spent - a.spent;
        }
        return b.orders - a.orders;
    });

    const topCustomersItemsPerPage = 10;
    const paginatedTopCustomers = sortedTopCustomers.slice(
        (topCustomersPage - 1) * topCustomersItemsPerPage,
        topCustomersPage * topCustomersItemsPerPage,
    );

    const recentOrdersItemsPerPage = 10;
    const paginatedRecentOrders = recentOrdersData.slice(
        (recentOrdersPage - 1) * recentOrdersItemsPerPage,
        recentOrdersPage * recentOrdersItemsPerPage,
    );

    const outstandingInvoicesItemsPerPage = 10;
    const paginatedOutstandingInvoices = outstandingInvoicesData.slice(
        (outstandingInvoicesPage - 1) * outstandingInvoicesItemsPerPage,
        outstandingInvoicesPage * outstandingInvoicesItemsPerPage,
    );

    const recentPaymentsItemsPerPage = 10;
    const paginatedRecentPayments = recentPaymentsData.slice(
        (recentPaymentsPage - 1) * recentPaymentsItemsPerPage,
        recentPaymentsPage * recentPaymentsItemsPerPage,
    );

    const lostItemsItemsPerPage = 10;
    const paginatedLostItems = lostItemLogsData.slice(
        (lostItemsPage - 1) * lostItemsItemsPerPage,
        lostItemsPage * lostItemsItemsPerPage,
    );

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
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="analytics">
                                Analytics
                            </TabsTrigger>
                            {/* <TabsTrigger value="operations">
                                Operations
                            </TabsTrigger> */}
                        </TabsList>

                        {/* Overview Tab */}
                        <TabsContent
                            value="overview"
                            className="mt-6 space-y-6"
                        >
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
                                            <stat.icon
                                                className={`w-8 h-8 ${stat.color}`}
                                            />
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
                                            <Button variant="outline">
                                                View All Orders
                                            </Button>
                                        </Link>
                                        <Link href="/customers">
                                            <Button variant="outline">
                                                Customers
                                            </Button>
                                        </Link>
                                        <Link href="/payments">
                                            <Button variant="outline">
                                                Payments
                                            </Button>
                                        </Link>
                                        <Link href="/settings">
                                            <Button variant="outline">
                                                Settings
                                            </Button>
                                        </Link>
                                    </div>
                                </Card>
                                <Card className="p-6">
                                    <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                                        <Bell className="w-5 h-5 mr-2" />
                                        Notifications
                                    </h2>
                                    <div className="space-y-4">
                                        {notificationsData.map(
                                            (notification) => (
                                                <div
                                                    key={notification.id}
                                                    className="flex items-start gap-3 hover:bg-secondary p-2 rounded-lg transition-colors"
                                                >
                                                    <div className="bg-secondary p-2 rounded-full mt-1">
                                                        <notification.icon className="w-4 h-4 text-muted-foreground" />
                                                    </div>
                                                    <div>
                                                        <Link
                                                            href={
                                                                notification.href
                                                            }
                                                            className="block"
                                                        >
                                                            <p className="text-sm font-medium text-foreground hover:underline">
                                                                {
                                                                    notification.title
                                                                }
                                                            </p>
                                                        </Link>
                                                        <p className="text-sm text-muted-foreground">
                                                            {
                                                                notification.description
                                                            }
                                                        </p>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            {formatDistanceToNow(
                                                                notification.timestamp,
                                                                {
                                                                    addSuffix: true,
                                                                },
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Analytics Tab */}
                        <TabsContent
                            value="analytics"
                            className="mt-6 space-y-6"
                        >
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
                                    onChange={(e) =>
                                        setDateRange(e.target.value)
                                    }
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
                                <PaymentMethodsChart
                                    data={paymentMethodsData}
                                />
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground">
                                            Top Customers
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Sorted by{" "}
                                            {topCustomersSortBy === "spent"
                                                ? "Total Revenue"
                                                : "Total Orders"}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant={
                                                topCustomersSortBy === "spent"
                                                    ? "default"
                                                    : "outline"
                                            }
                                            size="sm"
                                            onClick={() =>
                                                setTopCustomersSortBy("spent")
                                            }
                                        >
                                            By Revenue
                                        </Button>
                                        <Button
                                            variant={
                                                topCustomersSortBy === "orders"
                                                    ? "default"
                                                    : "outline"
                                            }
                                            size="sm"
                                            onClick={() =>
                                                setTopCustomersSortBy("orders")
                                            }
                                        >
                                            By Orders
                                        </Button>
                                    </div>
                                </div>
                                <TopCustomers
                                    data={paginatedTopCustomers}
                                    sortBy={topCustomersSortBy}
                                />
                                <div className="flex justify-end items-center gap-2 mt-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setTopCustomersPage((p) =>
                                                Math.max(1, p - 1),
                                            )
                                        }
                                        disabled={topCustomersPage === 1}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setTopCustomersPage((p) => p + 1)
                                        }
                                        disabled={
                                            paginatedTopCustomers.length <
                                            topCustomersItemsPerPage
                                        }
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Operations Tab */}
                        <TabsContent
                            value="operations"
                            className="mt-6 space-y-6"
                        >
                            <div>
                                <h2 className="text-2xl font-bold text-foreground">
                                    Operational Overview
                                </h2>
                                <p className="text-muted-foreground mt-1">
                                    Manage day-to-day laundry operations.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div>
                                    <div className="flex justify-end items-center gap-2 mb-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setRecentOrdersPage((p) =>
                                                    Math.max(1, p - 1),
                                                )
                                            }
                                            disabled={recentOrdersPage === 1}
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setRecentOrdersPage(
                                                    (p) => p + 1,
                                                )
                                            }
                                            disabled={
                                                recentOrdersPage *
                                                    recentOrdersItemsPerPage >=
                                                recentOrdersData.length
                                            }
                                        >
                                            Next
                                        </Button>
                                    </div>
                                    <RecentOrders
                                        orders={paginatedRecentOrders}
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-end items-center gap-2 mb-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setOutstandingInvoicesPage(
                                                    (p) => Math.max(1, p - 1),
                                                )
                                            }
                                            disabled={
                                                outstandingInvoicesPage === 1
                                            }
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setOutstandingInvoicesPage(
                                                    (p) => p + 1,
                                                )
                                            }
                                            disabled={
                                                outstandingInvoicesPage *
                                                    outstandingInvoicesItemsPerPage >=
                                                outstandingInvoicesData.length
                                            }
                                        >
                                            Next
                                        </Button>
                                    </div>
                                    <OutstandingInvoices
                                        invoices={paginatedOutstandingInvoices}
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-end items-center gap-2 mb-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setRecentPaymentsPage((p) =>
                                                    Math.max(1, p - 1),
                                                )
                                            }
                                            disabled={recentPaymentsPage === 1}
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setRecentPaymentsPage(
                                                    (p) => p + 1,
                                                )
                                            }
                                            disabled={
                                                recentPaymentsPage *
                                                    recentPaymentsItemsPerPage >=
                                                recentPaymentsData.length
                                            }
                                        >
                                            Next
                                        </Button>
                                    </div>
                                    <RecentPayments
                                        payments={paginatedRecentPayments}
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-end items-center gap-2 mb-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setLostItemsPage((p) =>
                                                    Math.max(1, p - 1),
                                                )
                                            }
                                            disabled={lostItemsPage === 1}
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setLostItemsPage((p) => p + 1)
                                            }
                                            disabled={
                                                lostItemsPage *
                                                    lostItemsItemsPerPage >=
                                                lostItemLogsData.length
                                            }
                                        >
                                            Next
                                        </Button>
                                    </div>
                                    <LostItemLogs items={paginatedLostItems} />
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </DashboardLayout>
        </AppLayout>
    );
}
