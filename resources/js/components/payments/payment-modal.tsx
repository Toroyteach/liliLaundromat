import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Check } from "lucide-react"
import type { Order } from "@/lib/types"

interface PaymentModalProps {
  order: Order
  isOpen: boolean
  onClose: () => void
  onPaymentComplete: (orderId: string) => void
}

export function PaymentModal({ order, isOpen, onClose, onPaymentComplete }: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState(order.paymentMethod)
  const [amountPaid, setAmountPaid] = useState(order.totalPrice)

  if (!isOpen) return null

  const handleProcessPayment = async () => {
    setIsProcessing(true)
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500))
      onPaymentComplete(order.id)
      setIsProcessing(false)
      onClose()
    } catch (error) {
      console.error("Payment error:", error)
      setIsProcessing(false)
    }
  }

  const change = amountPaid - order.totalPrice

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        {/* Header */}
        <div className="bg-card border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Process Payment</h2>
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isProcessing}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Order Summary */}
          <div className="bg-secondary rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Order ID</p>
            <p className="text-lg font-bold text-foreground mb-4">{order.id}</p>
            <p className="text-sm text-muted-foreground mb-1">Customer</p>
            <p className="font-medium text-foreground">{order.customerName}</p>
          </div>

          {/* Amount */}
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
              <span className="text-muted-foreground">Amount Due</span>
              <span className="text-2xl font-bold text-foreground">KES {order.totalPrice.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">Payment Method</label>
            <div className="grid grid-cols-3 gap-2">
              {(["cash", "card", "mpesa"] as const).map((method) => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`p-3 rounded-lg border-2 transition-colors capitalize font-medium text-sm ${
                    paymentMethod === method
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-foreground hover:border-primary/50"
                  }`}
                  disabled={isProcessing}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Amount Paid */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Amount Paid</label>
            <input
              type="number"
              value={amountPaid}
              onChange={(e) => setAmountPaid(Number.parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isProcessing}
            />
          </div>

          {/* Change */}
          {change > 0 && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">Change: KES {change.toLocaleString()}</p>
            </div>
          )}
          {change < 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">Insufficient amount: KES {Math.abs(change).toLocaleString()} short</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="bg-card border-t border-border p-6 flex gap-3">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            className="bg-primary hover:bg-primary/90 flex-1"
            onClick={handleProcessPayment}
            disabled={isProcessing || change < 0}
          >
            {isProcessing ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Processing...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Complete Payment
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  )
}
