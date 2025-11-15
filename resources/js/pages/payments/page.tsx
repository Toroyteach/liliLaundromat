
import { usePage } from "@inertiajs/react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Card } from "@/components/ui/card"
import { CreditCard, TrendingUp, Calendar } from "lucide-react"
import { AppLayout } from "@/layouts/AppLayout"

interface Transaction {
  id: string
  orderId: string
  customerName: string
  amount: number
  method: "cash" | "card" | "mpesa"
  status: "completed" | "pending" | "failed"
  date: Date
}

export default function PaymentsPage() {
  const { props } = usePage();
  const transactions = (props.transactions ?? []) as Transaction[];

  const totalRevenue = transactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingAmount = transactions
    .filter((t) => t.status === "pending")
    .reduce((sum, t) => sum + t.amount, 0);

  const stats = [
    {
      label: "Total Revenue",
      value: `KES ${totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      label: "Pending Payments",
      value: `KES ${pendingAmount.toLocaleString()}`,
      icon: CreditCard,
      color: "text-yellow-600",
    },
    {
      label: "Total Transactions",
      value: transactions.length.toString(),
      icon: Calendar,
      color: "text-blue-600",
    },
  ];

  const getMethodBadgeColor = (method: string) => {
    switch (method) {
      case "cash":
        return "bg-green-100 text-green-700"
      case "card":
        return "bg-blue-100 text-blue-700"
      case "mpesa":
        return "bg-purple-100 text-purple-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700"
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      case "failed":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <AppLayout>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Payments & Transactions</h1>
            <p className="text-muted-foreground mt-1">Track all payment transactions and revenue</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </Card>
            ))}
          </div>

          {/* Transactions Table */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Recent Transactions</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Transaction ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Order ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Customer</th>
                    <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Amount</th>
                    <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Method</th>
                    <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                      <td className="py-3 px-4 font-medium text-foreground">{transaction.id}</td>
                      <td className="py-3 px-4 text-foreground">{transaction.orderId}</td>
                      <td className="py-3 px-4 text-foreground">{transaction.customerName}</td>
                      <td className="py-3 px-4 text-right font-semibold text-foreground">
                        KES {transaction.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-medium capitalize ${getMethodBadgeColor(transaction.method)}`}
                        >
                          {transaction.method}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-medium capitalize ${getStatusBadgeColor(transaction.status)}`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {transaction.date.toLocaleDateString()} {transaction.date.toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    </AppLayout>
  )
}
