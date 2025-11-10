
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, Plus, Trash2, RefreshCw } from "lucide-react"
import type { ScannerConfig } from "@/lib/types"

interface ScannerSettingsProps {
  scanners: ScannerConfig[]
  onAdd: (scanner: ScannerConfig) => void
  onRemove: (scannerId: string) => void
  onTest: (scannerId: string) => void
}

export function ScannerSettings({ scanners, onAdd, onRemove, onTest }: ScannerSettingsProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    type: "barcode" as const,
  })

  const handleAddScanner = () => {
    if (formData.name.trim()) {
      const newScanner: ScannerConfig = {
        id: `SCANNER-${Date.now()}`,
        name: formData.name,
        type: formData.type,
        status: "connected",
        lastUsed: new Date(),
      }
      onAdd(newScanner)
      setFormData({ name: "", type: "barcode" })
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
        <h3 className="text-lg font-semibold text-foreground">Scanners</h3>
        <Button size="sm" onClick={() => setShowAddForm(!showAddForm)} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Scanner
        </Button>
      </div>

      {/* Add Scanner Form */}
      {showAddForm && (
        <Card className="p-4 space-y-3">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Scanner Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Barcode Scanner 1"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Scanner Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="barcode">Barcode</option>
              <option value="qr">QR Code</option>
            </select>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowAddForm(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleAddScanner} className="flex-1 bg-primary hover:bg-primary/90">
              Add
            </Button>
          </div>
        </Card>
      )}

      {/* Scanners List */}
      <div className="space-y-3">
        {scanners.length === 0 ? (
          <Card className="p-6 text-center">
            <Zap className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No scanners configured</p>
          </Card>
        ) : (
          scanners.map((scanner) => (
            <Card key={scanner.id} className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-foreground">{scanner.name}</h4>
                    <Badge className={getStatusColor(scanner.status)}>{scanner.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground capitalize">Type: {scanner.type}</p>
                  {scanner.lastUsed && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Last used: {new Date(scanner.lastUsed).toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => onTest(scanner.id)} title="Test scanner">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRemove(scanner.id)}
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
