import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface RevenueChartProps {
  data: Array<{
    date: string;
    revenue: number;
    target: number;
  }>;
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Daily Revenue Trend
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
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
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="var(--primary)"
            strokeWidth={2}
            name="Actual Revenue"
          />
          <Line
            type="monotone"
            dataKey="target"
            stroke="var(--accent)"
            strokeWidth={2}
            name="Target"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
