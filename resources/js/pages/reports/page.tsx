import { BulkUploadCard } from "./bulk-upload-card";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
  FileText,
  Activity,
  Bell,
  User,
  Settings,
  ShoppingCart,
  FileUp,
  Download,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { AppLayout } from "@/layouts/AppLayout"

function ReportGenerator({
  onGenerateReport,
}: {
  onGenerateReport: (
    type: string,
    format: string,
    dateRange?: DateRange
  ) => void;
}) {
  const [reportType, setReportType] = useState("revenue");
  const [reportFormat, setReportFormat] = useState("pdf");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Generate Report
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={reportType} onValueChange={setReportType}>
          <SelectTrigger>
            <SelectValue placeholder="Select data type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="revenue">Revenue</SelectItem>
            <SelectItem value="orders">Orders</SelectItem>
            <SelectItem value="customers">Customers</SelectItem>
            <SelectItem value="inventory">Inventory</SelectItem>
          </SelectContent>
        </Select>
        <DateRangePicker date={dateRange} onDateChange={setDateRange} />
        <Button
          onClick={() => onGenerateReport(reportType, reportFormat, dateRange)}
          className="w-full"
        >
          <Download className="w-4 h-4 mr-2" />
          Generate
        </Button>
      </CardContent>
    </Card>
  );
}

// Mock data for Audit Trail
const auditTrailData = [
  {
    id: 1,
    user: "Alice Johnson",
    action: "Created new order #ORD-004 for customer 'David Lee'.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    icon: ShoppingCart,
  },
  {
    id: 2,
    user: "Admin",
    action: "Updated business settings: Changed currency to KES.",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    icon: Settings,
  },
  {
    id: 3,
    user: "Bob Smith",
    action: "Updated staff profile for Carol Davis, status set to 'active'.",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    icon: User,
  },
  {
    id: 4,
    user: "System",
    action: "Generated daily revenue report automatically.",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    icon: FileText,
  },
  {
    id: 5,
    user: "Alice Johnson",
    action: "Logged in successfully.",
    timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000), // 9 hours ago
    icon: User,
  },
];

// Mock data for System Notifications
const systemNotificationsData = [
  {
    id: 1,
    type: "info" as const,
    message:
      "System update scheduled for tonight at 2:00 AM. Expect brief downtime.",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
  },
  {
    id: 2,
    type: "warning" as const,
    message:
      "Printer for order labels is low on ink. Please replace the cartridge soon.",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
  },
  {
    id: 3,
    type: "error" as const,
    message:
      "Failed to process payment for invoice #INV-002. Please check payment details.",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
];

export default function ReportsPage() {
  const handleGenerateReport = (
    type: string,
    format: string,
    dateRange?: DateRange
  ) => {
    let dateInfo = "for all time";
    if (dateRange?.from && dateRange?.to) {
      dateInfo = `from ${dateRange.from.toLocaleDateString()} to ${dateRange.to.toLocaleDateString()}`;
    }
    alert(
      `Generating ${type} report in ${format.toUpperCase()} format ${dateInfo}...`
    );
    // In a real app, this would trigger a backend API call
  };

  const getNotificationStyles = (type: "info" | "warning" | "error") => {
    switch (type) {
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
    }
  };

  return (
    <AppLayout>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reports & Logs</h1>
            <p className="text-muted-foreground mt-1">
              Generate custom reports and track system activity.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Report Generator and Notifications */}
            <div className="lg:col-span-1 space-y-6">
              <ReportGenerator onGenerateReport={handleGenerateReport} />
              <BulkUploadCard />

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground flex items-center mb-4">
                  <Bell className="w-5 h-5 mr-2" />
                  System Notifications
                </h3>
                <div className="space-y-3">
                  {systemNotificationsData.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border rounded-lg text-sm ${getNotificationStyles(
                        notification.type
                      )}`}
                    >
                      <p className="font-medium">{notification.message}</p>
                      <p className="text-xs opacity-80 mt-1">
                        {formatDistanceToNow(notification.timestamp, {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right Column: Audit Trail */}
            <div className="lg:col-span-2">
              <Card className="p-6 h-full">
                <h3 className="text-lg font-semibold text-foreground flex items-center mb-4">
                  <Activity className="w-5 h-5 mr-2" />
                  Audit Trail / Activity Log
                </h3>
                <div className="space-y-4 max-h-[calc(100vh-20rem)] overflow-y-auto pr-2">
                  {auditTrailData.map((log) => (
                    <div key={log.id} className="flex items-start gap-3">
                      <div className="bg-secondary p-2 rounded-full mt-1">
                        <log.icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-foreground">
                          <span className="font-semibold">{log.user}</span>{" "}
                          {log.action.includes(log.user)
                            ? ""
                            : log.action.charAt(0).toLowerCase() +
                            log.action.slice(1)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(log.timestamp, {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AppLayout>
  );
}
