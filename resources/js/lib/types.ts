// User roles for RBAC
export type UserRole = "admin" | "manager" | "staff" | "customer"

// User authentication state
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  phone?: string
  avatar?: string
  createdAt: Date
  gender?: "male" | "female"
}

// Authentication context
export interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  error: string | null
}

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
  barcode: string
  customerId: string
  customerName: string
  customerPhone: string
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
}

// Staff and Customer types for management features
export interface Staff {
  id: string
  name: string
  email: string
  phone: string
  role: "manager" | "staff"
  status: "active" | "inactive"
  joinDate: Date
  avatar?: string
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
