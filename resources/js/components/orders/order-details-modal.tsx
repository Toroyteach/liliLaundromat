import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "./order-status-badge";
import { ReceiptModal } from "@/components/payments/receipt-modal";
import { PaymentModal } from "@/components/payments/payment-modal";
import { X, FileText, CreditCard } from "lucide-react";
import type { Order, OrderStatus } from "@/lib/types";

interface OrderDetailsModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
  onPaymentComplete?: (orderId: string) => void;
}

export function OrderDetailsModal({
  order,
  isOpen,
  onClose,
  onUpdateStatus,
  onPaymentComplete,
}: OrderDetailsModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  if (!isOpen) return null;

  const statusTransitions: Record<OrderStatus, OrderStatus[]> = {
    pending: ["in-progress", "cancelled"],
    "in-progress": ["ready", "cancelled"],
    ready: ["completed", "cancelled"],
    completed: [],
    received: ["in-progress", "cancelled"],
    cancelled: [],
  };

  const availableTransitions = statusTransitions[order.status];

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    setIsUpdating(true);
    try {
      onUpdateStatus(order.id, newStatus);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePaymentComplete = (orderId: string) => {
    onPaymentComplete?.(orderId);
    setIsPaymentOpen(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">{order.id}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Order Details
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Status Section */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                Current Status
              </h3>
              <div className="flex items-center gap-3">
                <OrderStatusBadge status={order.status} />
                <span className="text-sm text-muted-foreground">
                  Created {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Barcode */}
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Order Barcode
              </p>
              <p className="font-mono text-sm text-foreground bg-secondary px-2 py-1 rounded-md inline-block">
                {order.barcode}
              </p>
            </div>

            {/* Customer Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Customer Name
                </p>
                <p className="font-medium text-foreground">
                  {order.customerName}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Phone</p>
                <p className="font-medium text-foreground">
                  {order.customerPhone}
                </p>
              </div>
            </div>

            {/* Delivery & Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border pt-4">
              {order.customerAddress && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Delivery Details
                  </p>
                  <p className="font-medium text-foreground">
                    {order.customerAddress}
                  </p>
                </div>
              )}
              {order.notes && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Teller Notes
                  </p>
                  <p className="font-medium text-foreground">{order.notes}</p>
                </div>
              )}
            </div>

            {/* Items */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                Items
              </h3>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={item.id} className="p-3 bg-secondary rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-foreground">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.serviceType.replace(/-/g, " ")} • Units:{" "}
                          {item.quantity}
                        </p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                        {item.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mt-2 mb-1">
                        Item Barcode
                      </p>
                      <p className="font-mono text-xs text-foreground bg-background px-2 py-1 rounded-md inline-block">
                        {item.barcode}
                      </p>
                    </div>
                    {item.description && (
                      <p className="text-xs text-muted-foreground mt-2 italic">
                        Note: {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground">Total Price</span>
                <span className="font-bold text-foreground">
                  KES {order.totalPrice.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Payment Status</span>
                <span
                  className={`text-sm font-medium ${
                    order.paymentStatus === "completed"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {order.paymentStatus === "completed" ? "Paid" : "Pending"}
                </span>
              </div>
            </div>

            <div className="border-t border-border pt-4 flex gap-2">
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => setIsReceiptOpen(true)}
              >
                <FileText className="w-4 h-4 mr-2" />
                View Receipt
              </Button>
              {order.paymentStatus === "pending" && (
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={() => setIsPaymentOpen(true)}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Process Payment
                </Button>
              )}
            </div>

            {/* Status Update Actions */}
            {availableTransitions.length > 0 && (
              <div className="border-t border-border pt-4">
                <p className="text-xs text-muted-foreground mb-3">
                  Update Status
                </p>
                <div className="flex gap-2 flex-wrap">
                  {availableTransitions.map((status) => (
                    <Button
                      key={status}
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusUpdate(status)}
                      disabled={isUpdating}
                    >
                      Mark as {status.replace(/-/g, " ")}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Receipt Modal */}
      <ReceiptModal
        order={order}
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
      />

      {/* Payment Modal */}
      <PaymentModal
        order={order}
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onPaymentComplete={handlePaymentComplete}
      />
    </>
  );
}
