import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Printer, Download } from "lucide-react"
import type { Order } from "@/lib/types"
import { useRef } from "react"

interface ReceiptModalProps {
  order: Order
  isOpen: boolean
  onClose: () => void
}

export function ReceiptModal({ order, isOpen, onClose }: ReceiptModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null)

  if (!isOpen) return null

  const handlePrint = () => {
    if (receiptRef.current) {
      const printWindow = window.open("", "", "height=600,width=800")
      if (printWindow) {
        printWindow.document.write(receiptRef.current.innerHTML)
        printWindow.document.close()
        printWindow.print()
      }
    }
  }

  const handleDownload = () => {
    if (receiptRef.current) {
      const element = receiptRef.current
      const opt = {
        margin: 10,
        filename: `receipt-${order.id}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: "portrait", unit: "mm", format: "a4" },
      }
      // In a real app, you'd use html2pdf library
      console.log("Download receipt as PDF:", opt.filename)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Order Receipt</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Receipt Content */}
        <div ref={receiptRef} className="p-8 space-y-6 bg-white text-black">
          {/* Header */}
          <div className="text-center border-b-2 border-gray-300 pb-4">
            <h1 className="text-3xl font-bold">LAUNDROMAT</h1>
            <p className="text-sm text-gray-600">Professional Laundry Services</p>
            <p className="text-xs text-gray-500 mt-1">Receipt #{order.id}</p>
          </div>

          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 font-semibold">Customer</p>
              <p className="font-medium">{order.customerName}</p>
              <p className="text-gray-600">{order.customerPhone}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600 font-semibold">Date</p>
              <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
              <p className="text-gray-600">{new Date(order.createdAt).toLocaleTimeString()}</p>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-2 font-semibold">Item</th>
                  <th className="text-center py-2 font-semibold">Qty</th>
                  <th className="text-left py-2 font-semibold">Service</th>
                  <th className="text-right py-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200">
                    <td className="py-2">{item.name}</td>
                    <td className="text-center py-2">{item.quantity}</td>
                    <td className="py-2">{item.serviceType.replace(/-/g, " ")}</td>
                    <td className="text-right py-2 capitalize">{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="border-t-2 border-gray-300 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>KES {order.totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax (0%)</span>
              <span>KES 0</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-2 mt-2">
              <span>Total</span>
              <span>KES {order.totalPrice.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-gray-100 p-4 rounded text-sm">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-medium capitalize">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Status</span>
              <span
                className={`font-medium ${order.paymentStatus === "completed" ? "text-green-600" : "text-yellow-600"}`}
              >
                {order.paymentStatus === "completed" ? "PAID" : "PENDING"}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center border-t-2 border-gray-300 pt-4 text-xs text-gray-600">
            <p>Thank you for your business!</p>
            <p className="mt-1">Please keep this receipt for your records</p>
          </div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-card border-t border-border p-6 flex gap-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button className="bg-primary hover:bg-primary/90" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </Card>
    </div>
  )
}
