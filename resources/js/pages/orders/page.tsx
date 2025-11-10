import { useState, useEffect } from "react";
import { router } from '@inertiajs/react'
import { usePage } from '@inertiajs/react'
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { OrdersList } from "@/components/orders/orders-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Order, OrderStatus, Customer } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import React from "react";

function OrdersPageContent() {
  const { url } = usePage()
  const searchParams = new URLSearchParams(url.split('?')[1] || '')
  const { user } = useAuth();

  const canCreateOrder = user && user.role !== "customer";
  useEffect(() => {
    if (searchParams.get("create") === "true") {
      setCreateModalOpen(true);
    }
  }, [searchParams]);

  // Mock data for customers and orders
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "CUST-1678886400000",
      name: "John Doe",
      phone: "+254712345678",
      email: "john.doe@example.com",
      createdAt: new Date(),
      totalOrders: 1,
      totalSpent: 2500,
    },
  ]);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD-001",
      customerId: "CUST-1678886400000",
      customerName: "John Doe",
      customerPhone: "+254712345678",
      items: [
        {
          id: "ORD-001-ITM-1",
          barcode: "some-barcode-1", // Added barcode
          name: "Shirts",
          quantity: 5,
          serviceType: "wash-dry",
          status: "drying",
          trackingHistory: [], // Added trackingHistory
        },
      ],
      status: "in-progress", // Corrected status from "processing"
      totalPrice: 2500,
      weight: 5.5,
      paymentMethod: "cash",
      paymentStatus: "completed",
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      barcode: "ORD-001-BARCODE", // Added barcode
      trackingHistory: [], // Added trackingHistory
    },
  ]);

  const handleCreateOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    // Check if it's a new customer and add them to the list
    const customerExists = customers.some((c) => c.id === newOrder.customerId);
    if (!customerExists) {
      setCustomers((prev) => [
        ...prev,
        {
          id: newOrder.customerId,
          name: newOrder.customerName,
          phone: newOrder.customerPhone,
          email: (newOrder as any).customerEmail || "",
          createdAt: new Date(),
          totalOrders: 1,
          totalSpent: newOrder.totalPrice,
          // Add other required properties for Customer if they exist in your type definition
          // For example, if 'address' is required: address: newOrder.customerAddress || '',
        },
      ]);
    }
    setCreateModalOpen(false);
  };

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(
      orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const handlePaymentComplete = (orderId: string) => {
    setOrders(
      orders.map((o) =>
        o.id === orderId
          ? { ...o, paymentStatus: "completed", status: "completed" }
          : o
      )
    );
  };

  return (
    <>
      <DashboardLayout>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Orders</h1>
              <p className="text-muted-foreground mt-1">
                Manage all customer orders.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {canCreateOrder && (
                <Button onClick={() => router.visit("/orders/create")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Order
                </Button>
              )}
            </div>
          </div>

          <OrdersList
            orders={orders}
            onUpdateStatus={handleUpdateStatus}
            onPaymentComplete={handlePaymentComplete}
          />
        </div>
      </DashboardLayout>
    </>
  );
}

export default function OrdersPage() {
  return (
    // Suspense boundary is required for useSearchParams
    <React.Suspense fallback={<div>Loading...</div>}>
      <OrdersPageContent />
    </React.Suspense>
  );
}
function setCreateModalOpen(arg0: boolean) {
  throw new Error("Function not implemented.");
}

