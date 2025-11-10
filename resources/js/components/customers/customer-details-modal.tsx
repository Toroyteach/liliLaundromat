import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { Customer } from "@/lib/types"

interface CustomerDetailsModalProps {
  customer: Customer
  isOpen: boolean
  onClose: () => void
}

export function CustomerDetailsModal({ customer, isOpen, onClose }: CustomerDetailsModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        {/* Header */}
        <div className="bg-card border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Customer Details</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Name</p>
            <p className="font-medium text-foreground">{customer.name}</p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1">Phone</p>
            <p className="font-medium text-foreground">{customer.phone}</p>
          </div>

          {customer.email && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Email</p>
              <p className="font-medium text-foreground">{customer.email}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Orders</p>
              <p className="font-medium text-foreground">{customer.totalOrders}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Spent</p>
              <p className="font-medium text-foreground">KES {customer.totalSpent.toLocaleString()}</p>
            </div>
          </div>

          {customer.lastOrderDate && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Last Order</p>
              <p className="font-medium text-foreground">{new Date(customer.lastOrderDate).toLocaleDateString()}</p>
            </div>
          )}

          {customer.notes && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Notes</p>
              <p className="font-medium text-foreground">{customer.notes}</p>
            </div>
          )}

          <div>
            <p className="text-xs text-muted-foreground mb-1">Member Since</p>
            <p className="font-medium text-foreground">{new Date(customer.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-card border-t border-border p-6">
          <Button onClick={onClose} className="w-full bg-primary hover:bg-primary/90">
            Close
          </Button>
        </div>
      </Card>
    </div>
  )
}
