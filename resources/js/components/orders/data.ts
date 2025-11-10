import type { Order } from "@/lib/types";

export const orders: Order[] = [
  {
      id: "ORD-001",
      barcode: "BAR-001",
      customerId: "CUST-001",
      customerName: "John Doe",
      customerPhone: "+254712345678",
      items: [{
          id: "ITEM-001", name: "Shirt", quantity: 2, serviceType: "wash-dry-iron", status: "completed",
          barcode: "",
          trackingHistory: []
      }],
      status: "completed",
      totalPrice: 1500,
      paymentMethod: "mpesa",
      paymentStatus: "completed",
      createdAt: new Date("2023-10-26T10:00:00Z"),
      trackingHistory: []
  },
  {
      id: "ORD-002",
      barcode: "BAR-002",
      customerId: "CUST-002",
      customerName: "Jane Smith",
      customerPhone: "+254723456789",
      items: [{
          id: "ITEM-002", name: "Trousers", quantity: 3, serviceType: "wash-dry", status: "in-progress",
          barcode: "",
          trackingHistory: []
      }],
      status: "in-progress",
      totalPrice: 2200,
      paymentMethod: "cash",
      paymentStatus: "pending",
      createdAt: new Date("2023-10-27T11:30:00Z"),
      trackingHistory: []
  },
  {
      id: "ORD-003",
      barcode: "BAR-003",
      customerId: "CUST-003",
      customerName: "Mike Johnson",
      customerPhone: "+254734567890",
      items: [{
          id: "ITEM-003", name: "Jacket", quantity: 1, serviceType: "dry-cleaning", status: "ready",
          barcode: "",
          trackingHistory: []
      }],
      status: "ready",
      totalPrice: 800,
      paymentMethod: "card",
      paymentStatus: "completed",
      createdAt: new Date("2023-10-28T09:00:00Z"),
      trackingHistory: []
  },
  // Add more mock orders as needed
];

export type OrderData = (typeof orders)[number];