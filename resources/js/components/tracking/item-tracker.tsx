import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Customer, GarmentItem, Order } from "@/lib/types";
import { CheckCircle2, Clock } from "lucide-react";
import { OrderDetails } from "./OrderDetails";

interface ItemTrackerProps {
  item: GarmentItem;
  order?: Order;
  customer?: Customer;
}

export function ItemTracker({ item, order, customer }: ItemTrackerProps) {
  // LaundroMart vocabulary for tracking stages
  const trackingStages = [
    {
      status: "received",
      label: "Received",
      description: "Item received at LaundroMart",
    },
    {
      status: "sorting",
      label: "Sorting",
      description: "Sorting by fabric type",
    },
    { status: "washing", label: "Washing", description: "In washing process" },
    { status: "drying", label: "Drying", description: "In drying process" },
    { status: "ironing", label: "Ironing", description: "Being ironed" },
    {
      status: "quality-check",
      label: "Quality Check",
      description: "Final quality inspection",
    },
    { status: "ready", label: "Ready", description: "Ready for pickup" },
    {
      status: "picked-up",
      label: "Picked Up",
      description: "Picked up by customer",
    },
  ];

  const currentStageIndex = trackingStages.findIndex(
    (stage) => stage.status === item.status
  );

  return (
    <div className="space-y-6">
      {order && customer && <OrderDetails order={order} customer={customer} />}
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {item.name}
          </h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{item.barcode}</Badge>
          </div>
        </div>

        {/* Item Meta */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <Meta label="Color" value={item.color ?? "—"} />
          <Meta label="Material" value={item.material ?? "—"} />
          <Meta label="Weight (kg)" value={item.weightKg ?? "—"} />
          <Meta label="Unit Price" value={`KES ${item.unitPrice}`} />
          <Meta label="Total Price" value={`KES ${item.totalPrice}`} />
          <Meta label="Status" value={item.status} />
        </div>

        {item.notes && (
          <div className="text-sm bg-muted/40 p-3 rounded">
            <p className="text-muted-foreground text-xs mb-1">Notes</p>
            <p>{item.notes}</p>
          </div>
        )}

        {/* Timeline */}
        <p className="text-xs font-semibold uppercase text-muted-foreground">
          Handling History
        </p>
        <div className="flex items-start">
          {trackingStages.map((stage, index) => {
            const isCompleted = index < currentStageIndex;
            const isCurrent = index === currentStageIndex;

            return (
              <>
                <div
                  key={stage.status}
                  className="flex flex-col items-center w-24"
                >
                  {/* Timeline Dot */}
                  <div className="relative">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${isCompleted
                        ? "bg-green-500 text-white"
                        : isCurrent
                          ? "bg-teal-500 text-white ring-4 ring-teal-200"
                          : "bg-gray-200 text-gray-400"
                        }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : isCurrent ? (
                        <Clock className="w-5 h-5 animate-spin" />
                      ) : (
                        <div className="w-2 h-2 bg-current rounded-full" />
                      )}
                    </div>
                  </div>

                  {/* Stage Info */}
                  <div className="text-center mt-2">
                    <h4
                      className={`font-semibold text-sm ${isCompleted
                        ? "text-green-600"
                        : isCurrent
                          ? "text-teal-600"
                          : "text-gray-400"
                        }`}
                    >
                      {stage.label}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {stage.description}
                    </p>
                    {isCurrent && (
                      <p className="text-xs text-teal-600 font-medium mt-1">
                        Processing...
                      </p>
                    )}
                  </div>
                </div>

                {/* Connector */}
                {index < trackingStages.length - 1 && (
                  <div
                    className={`flex-1 h-1 mt-5 ${isCompleted ? "bg-green-500" : "bg-gray-200"
                      }`}
                  />
                )}
              </>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

const Meta = ({ label, value }: { label: string; value: any }) => (
  <div>
    <p className="text-muted-foreground text-xs">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);
