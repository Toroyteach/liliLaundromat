import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface OrdersChartProps {
  data: Array<{
    date: string
    completed: number
    pending: number
    cancelled: number
  }>
}

export function OrdersChart({ data }: OrdersChartProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Orders by Status</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="date" stroke="var(--muted-foreground)" />
          <YAxis stroke="var(--muted-foreground)" />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--card)",
              border: `1px solid var(--border)`,
              borderRadius: "8px",
            }}
            labelStyle={{ color: "var(--foreground)" }}
          />
          <Legend />
          <Bar dataKey="completed" fill="var(--chart-1)" name="Completed" />
          <Bar dataKey="pending" fill="var(--chart-2)" name="Pending" />
          <Bar dataKey="cancelled" fill="var(--chart-3)" name="Cancelled" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
