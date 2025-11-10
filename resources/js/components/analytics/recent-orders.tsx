import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Order, OrderStatus } from "@/lib/types";

interface RecentOrdersProps {
  orders: Pick<
    Order,
    "id" | "customerName" | "status" | "totalPrice" | "createdAt"
  >[];
}

const getStatusBadgeColor = (status: OrderStatus) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-700";
    case "in-progress":
      return "bg-blue-100 text-blue-700";
    case "pending":
    case "received":
      return "bg-yellow-100 text-yellow-700";
    case "ready":
      return "bg-purple-100 text-purple-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Recent Orders
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                Customer
              </th>
              <th className="text-center py-3 px-4 font-semibold text-muted-foreground">
                Status
              </th>
              <th className="text-right py-3 px-4 font-semibold text-muted-foreground">
                Total
              </th>
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-border hover:bg-secondary/50 transition-colors"
              >
                <td className="py-3 px-4 font-medium text-foreground">
                  {order.customerName}
                </td>
                <td className="py-3 px-4 text-center">
                  <Badge
                    className={`capitalize ${getStatusBadgeColor(
                      order.status
                    )}`}
                  >
                    {order.status.replace("-", " ")}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-right font-semibold text-foreground">
                  KES {order.totalPrice.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
