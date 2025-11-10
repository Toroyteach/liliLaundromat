import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TopCustomer {
  name: string
  orders: number
  spent: number
  percentage: number
}

interface TopCustomersProps {
  data: TopCustomer[]
}

export function TopCustomers({ data }: TopCustomersProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Top Customers</h3>
      <div className="space-y-3">
        {data.map((customer, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline">#{index + 1}</Badge>
                <p className="font-medium text-foreground">{customer.name}</p>
              </div>
              <p className="text-xs text-muted-foreground">{customer.orders} orders</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-foreground">KES {customer.spent.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">{customer.percentage}% of revenue</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
