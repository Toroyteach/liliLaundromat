import { router } from '@inertiajs/react'
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { CreateOrderStepper } from "@/components/orders/create-order-stepper";
import type { Order, Customer } from "@/lib/types";
import { AppLayout } from '@/layouts/AppLayout';

export default function CreateOrderPage() {

  // Mock data for customers (replace with actual data fetching)
  const mockCustomers: Customer[] = [
    {
      id: "CUST-001",
      name: "Alice Smith",
      phone: "+254712345678",
      email: "alice@example.com",
      address: "123 Main St",
      createdAt: new Date(),
      totalOrders: 5,
      totalSpent: 1200,
    },
    {
      id: "CUST-002",
      name: "Bob Johnson",
      phone: "+254798765432",
      email: "bob@example.com",
      address: "456 Oak Ave",
      createdAt: new Date(),
      totalOrders: 3,
      totalSpent: 800,
    },
  ];

  const handleCreateOrder = (newOrder: Order) => {
    console.log("Order created:", newOrder);
    // In a real application, you would send this to an API
    // After successful creation, redirect to the orders list or order details page
    router.visit("/orders");
  };

  const handleSaveDraft = (draftOrder: Partial<Order>) => {
    console.log("Order draft saved:", draftOrder);
    // In a real application, you would save this to a draft API or local storage
    // Optionally, redirect or show a confirmation
    router.visit("/orders"); // Or stay on the page with a success message
  };

  const handleClose = () => {
    router.visit("/orders");
  };

  return (
    <AppLayout>
      <DashboardLayout>
        <div className="relative">
          <CreateOrderStepper
            onClose={handleClose}
            onCreate={handleCreateOrder}
            onSaveDraft={handleSaveDraft}
            customers={mockCustomers}
            isOpen={true}
          />
        </div>
      </DashboardLayout>

    </AppLayout>
  );
}
