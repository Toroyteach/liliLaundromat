import { Card } from "@/components/ui/card"
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts"

interface ServiceBreakdownProps {
  data: Array<{
    name: string
    value: number
  }>
}

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"]

export function ServiceBreakdown({ data }: ServiceBreakdownProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Service Type Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--card)",
              border: `1px solid var(--border)`,
              borderRadius: "8px",
            }}
            labelStyle={{ color: "var(--foreground)" }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  )
}
