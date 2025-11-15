import { useState } from "react"
import { usePage } from "@inertiajs/react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { ItemTracker } from "@/components/tracking/item-tracker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Barcode } from "lucide-react"
import type { Order } from "@/lib/types"
import { AppLayout } from "@/layouts/AppLayout"

export default function TrackingPage() {
  const page = usePage().props
  const orders: Order[] = (page.data as Order[]) ?? []

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const filteredOrders = orders.filter(
    (order) =>
      order.barcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone.includes(searchQuery)
  )

  return (
    <AppLayout>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Track Your Laundry</h1>
            <p className="text-muted-foreground mt-1">Monitor your items through every stage at LaundroMart</p>
          </div>

          {/* Search */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by order barcode, customer name, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="icon">
              <Barcode className="w-5 h-5" />
            </Button>
          </div>

          {/* Results */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Orders List */}
            <div className="lg:col-span-1">
              <Card className="p-4">
                <h2 className="font-semibold text-foreground mb-4">Orders</h2>
                <div className="space-y-2">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <button
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${selectedOrder?.id === order.id ? "bg-teal-50 border-teal-500" : "border-border hover:bg-accent"
                          }`}
                      >
                        <div className="font-medium text-sm">{order.customerName}</div>
                        <div className="text-xs text-muted-foreground">{order.barcode}</div>
                        <Badge className="mt-2 bg-teal-100 text-teal-800 text-xs">{order.items.length} items</Badge>
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No orders found</p>
                  )}
                </div>
              </Card>
            </div>

            {/* Tracking Details */}
            <div className="lg:col-span-2">
              {selectedOrder ? (
                <div className="space-y-4">
                  <Card className="p-4 bg-teal-50 border-teal-200">
                    <h3 className="font-semibold text-foreground mb-2">Order Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Order ID</p>
                        <p className="font-medium">{selectedOrder.id}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Barcode</p>
                        <p className="font-medium text-xs">{selectedOrder.barcode}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Customer</p>
                        <p className="font-medium">{selectedOrder.customerName}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <Badge className="bg-teal-600 text-white capitalize">{selectedOrder.status}</Badge>
                      </div>
                    </div>
                  </Card>

                  {/* Items Tracking */}
                  <div className="space-y-4">
                    {selectedOrder.items.map((item) => (
                      <ItemTracker key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <Barcode className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Select an order to view tracking details</p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AppLayout>
  )
}
