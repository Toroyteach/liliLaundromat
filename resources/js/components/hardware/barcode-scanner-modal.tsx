
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Zap } from "lucide-react"
import { useBarcodeScanner } from "@/hooks/use-barcode-scanner"

interface BarcodeScannerModalProps {
  isOpen: boolean
  onClose: () => void
  onScan: (barcode: string) => void
  title?: string
}

export function BarcodeScannerModal({ isOpen, onClose, onScan, title = "Scan Barcode" }: BarcodeScannerModalProps) {
  const [scannedCodes, setScannedCodes] = useState<string[]>([])
  const { isListening, setIsListening, lastScan } = useBarcodeScanner((data) => {
    setScannedCodes((prev) => [data, ...prev])
    onScan(data)
  })

  useEffect(() => {
    if (isOpen) {
      setIsListening(true)
    } else {
      setIsListening(false)
    }
  }, [isOpen, setIsListening])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        {/* Header */}
        <div className="bg-card border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Scanner Status */}
          <div className="flex items-center justify-center p-8 bg-secondary rounded-lg">
            <div className="text-center">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isListening ? "bg-green-100" : "bg-gray-100"}`}
              >
                <Zap className={`w-8 h-8 ${isListening ? "text-green-600 animate-pulse" : "text-gray-400"}`} />
              </div>
              <p className={`font-semibold ${isListening ? "text-green-600" : "text-muted-foreground"}`}>
                {isListening ? "Scanner Active" : "Scanner Inactive"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Ready to scan items</p>
            </div>
          </div>

          {/* Last Scan */}
          {lastScan && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-xs text-green-700 font-semibold mb-1">Last Scanned</p>
              <p className="font-mono text-sm text-green-900">{lastScan}</p>
            </div>
          )}

          {/* Scanned Items */}
          {scannedCodes.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-2">Scanned Items ({scannedCodes.length})</p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {scannedCodes.map((code, index) => (
                  <div key={index} className="p-2 bg-secondary rounded text-sm font-mono text-foreground">
                    {code}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700 font-semibold mb-2">Instructions</p>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>• Point scanner at barcode</li>
              <li>• Press trigger to scan</li>
              <li>• Barcode will appear above</li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-card border-t border-border p-6 flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
            Close
          </Button>
          <Button
            className="bg-primary hover:bg-primary/90 flex-1"
            onClick={() => {
              setScannedCodes([])
              onClose()
            }}
          >
            Done
          </Button>
        </div>
      </Card>
    </div>
  )
}
