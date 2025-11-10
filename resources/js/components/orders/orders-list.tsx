import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "./order-status-badge";
import { useState } from "react";
import { OrderDetailsModal } from "./order-details-modal"; // Keep this for viewing existing order details
import { ChevronRight, Eye } from "lucide-react";
import type { Order, OrderStatus } from "@/lib/types";

interface OrdersListProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
  onPaymentComplete?: (orderId: string) => void;
}

export function OrdersList({
  orders,
  onUpdateStatus,
  onPaymentComplete,
}: OrdersListProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  if (orders.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">No orders found</p>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {orders.map((order) => (
          <Card
            key={order.id}
            className="p-4 hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center justify-between gap-4">
              {/* Order Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-foreground">{order.id}</h3>
                  <OrderStatusBadge status={order.status} />
                </div>
                <p className="text-sm text-muted-foreground">
                  {order.customerName} • {order.customerPhone}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {order.items.length} item(s) • KES{" "}
                  {order.totalPrice.toLocaleString()}
                </p>
              </div>

              {/* Payment Status */}
              <div className="text-right">
                <p className="text-xs text-muted-foreground mb-1">Payment</p>
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    order.paymentStatus === "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.paymentStatus === "completed" ? "Paid" : "Pending"}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedOrder(order);
                    setIsDetailsOpen(true);
                  }}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedOrder(order);
                    setIsDetailsOpen(true);
                  }}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          isOpen={isDetailsOpen}
          onClose={() => {
            setIsDetailsOpen(false);
            setSelectedOrder(null);
          }}
          onUpdateStatus={onUpdateStatus}
          onPaymentComplete={onPaymentComplete}
        />
      )}
    </>
  );
}
