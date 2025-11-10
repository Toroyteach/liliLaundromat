import type { OrderStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const statusConfig: Record<
    OrderStatus,
    { label: string; variant: "default" | "secondary" | "destructive" | "outline" | null | undefined }
  > = {
    pending: {
      label: "Pending",
      variant: "outline",
    },
    "in-progress": {
      label: "In Progress",
      variant: "secondary",
    },
    ready: {
      label: "Ready",
      variant: "default",
    },
    completed: {
      label: "Completed",
      variant: "default", // You might want a different color, e.g., a custom "success" variant
    },
    cancelled: {
      label: "Cancelled",
      variant: "destructive",
    },
    received: {
      label: "Received",
      variant: "secondary",
    },
  };

  const config = statusConfig[status] || {
    label: "Unknown",
    variant: "outline",
  };

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
