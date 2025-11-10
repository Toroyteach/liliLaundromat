import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface ReportGeneratorProps {
  onGenerateReport: (type: string, format: string) => void
}

export function ReportGenerator({ onGenerateReport }: ReportGeneratorProps) {
  const [selectedReport, setSelectedReport] = useState("revenue")
  const [selectedFormat, setSelectedFormat] = useState("pdf")

  const reportTypes = [
    { id: "revenue", label: "Revenue Report" },
    { id: "orders", label: "Orders Report" },
    { id: "customers", label: "Customers Report" },
    { id: "staff", label: "Staff Performance" },
  ]

  const formats = [
    { id: "pdf", label: "PDF" },
    { id: "csv", label: "CSV" },
    { id: "excel", label: "Excel" },
  ]

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Generate Reports</h3>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">Report Type</label>
          <select
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {reportTypes.map((report) => (
              <option key={report.id} value={report.id}>
                {report.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground block mb-2">Export Format</label>
          <div className="grid grid-cols-3 gap-2">
            {formats.map((format) => (
              <button
                key={format.id}
                onClick={() => setSelectedFormat(format.id)}
                className={`p-2 rounded-lg border-2 transition-colors text-sm font-medium ${
                  selectedFormat === format.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                }`}
              >
                {format.label}
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={() => onGenerateReport(selectedReport, selectedFormat)}
          className="w-full bg-primary hover:bg-primary/90"
        >
          <Download className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>
    </Card>
  )
}
