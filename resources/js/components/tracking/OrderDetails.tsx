import type { Customer, Order } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, User, FileText } from "lucide-react";

interface OrderDetailsProps {
  order: Order;
  customer: Customer;
}

export function OrderDetails({ order, customer }: OrderDetailsProps) {
  if (!order || !customer) {
    return null;
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Order Details
      </h3>
      <div className="space-y-4">
        {order.customerAddress && (
          <div className="flex items-start gap-3">
            <Home className="w-5 h-5 text-muted-foreground mt-1" />
            <div>
              <p className="font-medium text-foreground">Delivery Details</p>
              <p className="text-sm text-muted-foreground">
                {order.customerAddress}
              </p>
            </div>
          </div>
        )}
        {order.notes && (
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-muted-foreground mt-1" />
            <div>
              <p className="font-medium text-foreground">Teller Notes</p>
              <p className="text-sm text-muted-foreground">{order.notes}</p>
            </div>
          </div>
        )}
        {customer.notes && (
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-muted-foreground mt-1" />
            <div>
              <p className="font-medium text-foreground">Customer Metadata</p>
              <p className="text-sm text-muted-foreground">{customer.notes}</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
