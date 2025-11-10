import { Card } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface PaymentMethodsChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

export function PaymentMethodsChart({ data }: PaymentMethodsChartProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Payment Methods Breakdown
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--card)",
              border: `1px solid var(--border)`,
              borderRadius: "8px",
            }}
            labelStyle={{ color: "var(--foreground)" }}
          />
          <Legend />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            nameKey="name"
            label={({ name, value }) => `${name}: KES ${value}`}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
