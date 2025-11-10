
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Printer, Plus, Trash2, RefreshCw } from "lucide-react"
import type { PrinterConfig } from "@/lib/types"

interface PrinterSettingsProps {
  printers: PrinterConfig[]
  onAdd: (printer: PrinterConfig) => void
  onRemove: (printerId: string) => void
  onTest: (printerId: string) => void
}

export function PrinterSettings({ printers, onAdd, onRemove, onTest }: PrinterSettingsProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    type: "thermal" as const,
  })

  const handleAddPrinter = () => {
    if (formData.name.trim()) {
      const newPrinter: PrinterConfig = {
        id: `PRINTER-${Date.now()}`,
        name: formData.name,
        type: formData.type,
        status: "connected",
        lastUsed: new Date(),
      }
      onAdd(newPrinter)
      setFormData({ name: "", type: "thermal" })
      setShowAddForm(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-700"
      case "disconnected":
        return "bg-yellow-100 text-yellow-700"
      case "error":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Printers</h3>
        <Button size="sm" onClick={() => setShowAddForm(!showAddForm)} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Printer
        </Button>
      </div>

      {/* Add Printer Form */}
      {showAddForm && (
        <Card className="p-4 space-y-3">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Printer Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Receipt Printer 1"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Printer Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="thermal">Thermal</option>
              <option value="inkjet">Inkjet</option>
              <option value="laser">Laser</option>
            </select>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowAddForm(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleAddPrinter} className="flex-1 bg-primary hover:bg-primary/90">
              Add
            </Button>
          </div>
        </Card>
      )}

      {/* Printers List */}
      <div className="space-y-3">
        {printers.length === 0 ? (
          <Card className="p-6 text-center">
            <Printer className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No printers configured</p>
          </Card>
        ) : (
          printers.map((printer) => (
            <Card key={printer.id} className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-foreground">{printer.name}</h4>
                    <Badge className={getStatusColor(printer.status)}>{printer.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground capitalize">Type: {printer.type}</p>
                  {printer.lastUsed && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Last used: {new Date(printer.lastUsed).toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => onTest(printer.id)} title="Test print">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRemove(printer.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
