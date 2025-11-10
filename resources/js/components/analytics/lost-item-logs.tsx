import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LostItem {
  id: string;
  garment: string;
  staffName: string;
  reportedDate: Date;
  status: "reported" | "investigating" | "resolved";
}

interface LostItemLogsProps {
  items: LostItem[];
}

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "resolved":
      return "bg-green-100 text-green-700";
    case "investigating":
      return "bg-blue-100 text-blue-700";
    case "reported":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export function LostItemLogs({ items }: LostItemLogsProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Lost Item Logs
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                Garment
              </th>
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                Staff
              </th>
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                Reported
              </th>
              <th className="text-center py-3 px-4 font-semibold text-muted-foreground">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-border hover:bg-secondary/50 transition-colors"
              >
                <td className="py-3 px-4 font-medium text-foreground">
                  {item.garment}
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  {item.staffName}
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  {item.reportedDate.toLocaleDateString()}
                </td>
                <td className="py-3 px-4 text-center">
                  <Badge
                    className={`capitalize ${getStatusBadgeColor(item.status)}`}
                  >
                    {item.status}
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
