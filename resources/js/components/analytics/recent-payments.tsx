import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Payment {
  id: string;
  amount: number;
  method: "cash" | "card" | "mpesa";
  status: "completed" | "pending" | "failed";
}

interface RecentPaymentsProps {
  payments: Payment[];
}

const getMethodBadgeColor = (method: string) => {
  switch (method) {
    case "cash":
      return "bg-green-100 text-green-700";
    case "card":
      return "bg-blue-100 text-blue-700";
    case "mpesa":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-700";
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "failed":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export function RecentPayments({ payments }: RecentPaymentsProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Recent Payments
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-right py-3 px-4 font-semibold text-muted-foreground">
                Amount
              </th>
              <th className="text-center py-3 px-4 font-semibold text-muted-foreground">
                Method
              </th>
              <th className="text-center py-3 px-4 font-semibold text-muted-foreground">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr
                key={payment.id}
                className="border-b border-border hover:bg-secondary/50 transition-colors"
              >
                <td className="py-3 px-4 text-right font-semibold text-foreground">
                  KES {payment.amount.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-center">
                  <Badge
                    className={`capitalize ${getMethodBadgeColor(
                      payment.method
                    )}`}
                  >
                    {payment.method}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-center">
                  <Badge
                    className={`capitalize ${getStatusBadgeColor(
                      payment.status
                    )}`}
                  >
                    {payment.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
