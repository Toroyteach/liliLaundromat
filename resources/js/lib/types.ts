// Order status
export type OrderStatus =
  | "pending"
  | "received"
  | "in-progress"
  | "ready"
  | "completed"
  | "cancelled"

// Garment item (Order Item)
export interface GarmentItem {
  id: string
  barcode: string
  name: string
  quantity: number
  description?: string
  serviceType: "wash" | "dry" | "iron" | "wash-dry" | "wash-dry-iron" | "dry-cleaning"
  status: "pending" | "received" | "sorting" | "washing" | "drying" | "ironing" | "quality-check" | "ready" | "picked-up" | "completed" | "in-progress"
  specialInstructions?: string
  material?: "cotton" | "wool" | "synthetic" | "delicate"
  washType?: "machine" | "hand" | "dry-clean"
  trackingHistory: TrackingEvent[]
  garmentType?: "shirt" | "pants" | "jacket" | "underwear" | "dress" | "skirt" | "suit" | "other" | "socks" | "coat" | "sweater"

  orderId: string
  pricingMode: 'per_item' | 'by_weight'
  weightKg?: number
  unitPrice: number
  totalPrice: number
  color?: string
  barcodeNumber?: string
  notes?: string
  createdAt: Date
}

// Tracking event interface
export interface TrackingEvent {
  status: "received" | "sorting" | "washing" | "drying" | "ironing" | "quality-check" | "ready" | "picked-up"
  timestamp: Date
  staffName?: string
  notes?: string
}

// Order
export interface Order {
  id: string
  barcode?: string
  customerId?: string
  customerName: string
  customerPhone?: string
  customerEmail?: string
  customerAddress?: string
  items: GarmentItem[]
  status: OrderStatus
  totalPrice: number
  weight?: number
  paymentMethod: "cash" | "card" | "mpesa" | "airtel-money"
  paymentStatus: "pending" | "completed" | "failed" | "pay-on-delivery"
  notes?: string
  createdAt: Date
  dueDate?: Date
  completedAt?: Date
  staffId?: string
  transactionId?: string
  trackingHistory: TrackingEvent[]

  userId: string
  branchId?: string
  totalAmount: number
}

// Staff and Customer types for management features
export interface Staff {
  id: number;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'staff' | 'cashier' | 'admin';
  status: 'active' | 'inactive';
  joinDate: Date;
}

export interface Customer {
  id: string
  name: string
  phone: string
  email?: string
  address?: string
  totalOrders: number
  totalSpent: number
  lastOrderDate?: Date
  createdAt: Date
  notes?: string
  avatar?: string
}

export interface BarcodeData {
  type: "order" | "customer" | "item"
  value: string
  timestamp: Date
}

export interface PrinterConfig {
  id: string
  name: string
  type: "thermal" | "inkjet" | "laser"
  status: "connected" | "disconnected" | "error"
  lastUsed?: Date
}

export interface ScannerConfig {
  id: string
  name: string
  type: "barcode" | "qr"
  status: "connected" | "disconnected" | "error"
  lastUsed?: Date
}

export interface QueuedAction {
  id: string
  type: "scan" | "print" | "payment" | "status-update"
  data: Record<string, unknown>
  timestamp: Date
  status: "pending" | "synced" | "failed"
  retries: number
}

export interface RealtimeUpdate {
  type: "order-status" | "payment-completed" | "scan-received" | "print-completed"
  orderId: string
  data: Record<string, unknown>
  timestamp: Date
}

export interface ConnectionStatus {
  isOnline: boolean
  lastSyncTime?: Date
  pendingActions: number
  syncInProgress: boolean
}
