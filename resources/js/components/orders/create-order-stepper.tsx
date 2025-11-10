import { useState, useMemo, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  X,
  User,
  Package,
  ScanLine,
  Tag,
  Wallet,
  CheckCircle,
  Printer,
  ChevronDown,
  Send,
} from 'lucide-react';
import type { Order, Customer, GarmentItem } from '@/lib/types';
import {
  generateOrderBarcode,
  generateItemBarcode,
} from '@/lib/barcode-generator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { GarmentList, DEFAULT_GARMENTS } from '@/components/garments/garment-list';

interface CreateOrderStepperProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveDraft?: (order: Partial<Order>) => void;
  onCreate: (order: Order) => void;
  customers: Customer[]; // Pass existing customers for search
}

const steps = [
  { id: 1, name: "Customer", icon: User },
  { id: 2, name: "Garment Intake & Pricing", icon: ScanLine },
  { id: 3, name: "Review & Confirm", icon: CheckCircle },
  { id: 4, name: "Payment & Receipt", icon: Wallet },
  { id: 5, name: "Finalization", icon: Package },
];

export function CreateOrderStepper({
  isOpen,
  onClose,
  onCreate,
  onSaveDraft,
  customers,
}: CreateOrderStepperProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Customer
  const [customerMode, setCustomerMode] = useState<"search" | "create">(
    "search"
  );
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  // Step 2: Garment Intake & Pricing
  const [garmentQuantities, setGarmentQuantities] = useState<{ [key: string]: number; }>({});

  const [orderDetails, setOrderDetails] = useState({
    dueDate: "",
    notes: "",
    weight: 0,
  });

  const handleGarmentQuantityChange = (garmentId: string, quantity: number) => {
    setGarmentQuantities(prev => ({ ...prev, [garmentId]: quantity }))
  }

  const calculatedItems = useMemo(() => {
    return DEFAULT_GARMENTS.filter(g => (garmentQuantities[g.id] || 0) > 0).map(g => ({
      ...g,
      quantity: garmentQuantities[g.id]
    }))
  }, [garmentQuantities])

  const calculatedTotal = useMemo(() => {
    return calculatedItems.reduce((total, item) => total + (item.basePrice * item.quantity), 0)
  }, [calculatedItems])

  // Step 5: Finalization
  const [finalizationDetails, setFinalizationDetails] = useState({
    assignedStaff: "",
  });

  // State for barcode generation in finalization step
  const [manualBarcode, setManualBarcode] = useState('');
  const [generatedBarcodeImage, setGeneratedBarcodeImage] = useState('');

  // Step 5: Payment
  const [paymentDetails, setPaymentDetails] = useState({
    paymentMethod: "cash" as Order["paymentMethod"],
    paymentStatus: "pay-on-delivery" as Order["paymentStatus"],
    transactionId: "",
  });

  // Memoize generated order for the final step
  const generatedOrder = useMemo(() => {
    const customer = selectedCustomer || {
      id: `CUST-${Date.now()}`,
      name: newCustomer.name,
      phone: newCustomer.phone,
    };

    const orderId = `ORD-${String(Math.floor(Math.random() * 10000)).padStart(
      4,
      "0"
    )}`;

    return {
      orderId,
      orderBarcode: generateOrderBarcode(orderId),
      customer,
      items: calculatedItems.map((item, i) => ({
        ...item,
        id: `${orderId}-ITM-${i + 1}`,
      })),
    } as any;
  }, [calculatedItems, selectedCustomer, newCustomer]);

  const searchedCustomer = useMemo(
    () =>
      customerSearch
        ? customers.find(
          (c) =>
            c.phone === customerSearch ||
            c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
            (c.email &&
              c.email.toLowerCase().includes(customerSearch.toLowerCase()))
        )
        : null,
    [customerSearch, customers]
  );

  if (!isOpen) return null;

  const handleNext = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const customer = selectedCustomer || {
      id: `CUST-${Date.now()}`,
      name: newCustomer.name,
      phone: newCustomer.phone,
      email: newCustomer.email,
      address: newCustomer.address,
      createdAt: new Date(),
      totalOrders: 0,
      totalSpent: 0,
    };

    const newOrder: Order = {
      id: generatedOrder.orderId,
      barcode: generatedOrder.orderBarcode,
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerAddress: customer.address,
      items: calculatedItems.map((item, i): GarmentItem => ({
        id: generatedOrder.items[i].id,
        barcode: generateItemBarcode(generatedOrder.items[i].id),
        name: item.name,
        quantity: item.quantity,
        // garmentType: item.type, // map `type` to `garmentType`
        trackingHistory: [],
        serviceType: "wash", // set default or choose dynamically
        status: "pending",   // initial status
      })),
      status: "pending",
      totalPrice: calculatedTotal,
      paymentMethod: paymentDetails.paymentMethod,
      weight: orderDetails.weight,
      paymentStatus: paymentDetails.paymentStatus,
      notes: orderDetails.notes,
      dueDate: orderDetails.dueDate
        ? new Date(orderDetails.dueDate)
        : undefined,
      transactionId: paymentDetails.transactionId,
      createdAt: new Date(),
      trackingHistory: onSaveDraft
        ? []
        : [{ status: "received", timestamp: new Date(), staffName: "Staff" }],
    };

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onCreate(newOrder);
      onClose();
      // Reset state for next time
    } catch (error) {
      console.error("Failed to create order:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateBarcode = (type: 'order' | 'item') => {
    // This is a mock function. In a real app, you'd use a library to generate a barcode image.
    setGeneratedBarcodeImage(`https://barcode.tec-it.com/barcode.ashx?data=${manualBarcode}&code=Code128&imagetype=svg`);
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Customer Identification
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {customerMode === "search"
                  ? "Find Existing Customer"
                  : "Create New Customer"}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCustomerMode(
                    customerMode === "search" ? "create" : "search"
                  )
                }
              >
                {customerMode === "search" ? "Add New" : "Search"}
              </Button>
            </div>

            {customerMode === "search" ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Search Customer (Phone, Name, or Email)
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., +254712345678, John Doe, or john@example.com"
                    value={customerSearch}
                    onChange={(e) => {
                      setCustomerSearch(e.target.value);
                      setSelectedCustomer(null);
                    }}
                  />
                </div>
                {customerSearch && searchedCustomer && (
                  <Card className="p-4 bg-green-50 border-green-200">
                    <p className="font-semibold">{searchedCustomer.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {searchedCustomer.phone}
                    </p>
                    <Button
                      size="sm"
                      className="mt-2"
                      onClick={() => setSelectedCustomer(searchedCustomer)}
                    >
                      Confirm Customer
                    </Button>
                  </Card>
                )}
              </div>
            ) : (
              <Card className="p-4 space-y-3">
                <h4 className="font-semibold">New Customer</h4>
                <Input
                  placeholder="Customer Name *"
                  required
                  value={newCustomer.name}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, name: e.target.value })
                  }
                />
                <Input
                  placeholder="Phone Number *"
                  required
                  value={newCustomer.phone}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, phone: e.target.value })
                  }
                />
                <Input
                  type="email"
                  placeholder="Email (Optional)"
                  value={newCustomer.email}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, email: e.target.value })
                  }
                />
                <Textarea
                  placeholder="Address (Optional)"
                  value={newCustomer.address}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, address: e.target.value })
                  }
                  rows={2}
                />
              </Card>
            )}
          </div>
        );
      case 2: // Garment Intake & Pricing
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Due Date & Time
              </label>
              <Input
                type="datetime-local"
                value={orderDetails.dueDate}
                onChange={(e) =>
                  setOrderDetails({ ...orderDetails, dueDate: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Total Weight (kg)
              </label>
              <Input
                type="number"
                placeholder="e.g., 5.5"
                value={orderDetails.weight}
                onChange={(e) =>
                  setOrderDetails({
                    ...orderDetails,
                    weight: Number(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Order Notes
              </label>
              <Textarea
                placeholder="e.g., Allergy: Use non-scented detergent"
                value={orderDetails.notes}
                onChange={(e) =>
                  setOrderDetails({ ...orderDetails, notes: e.target.value })
                }
              />
            </div>
            {/* <GarmentList
              onQuantityChange={handleGarmentQuantityChange}
            /> */}
          </div>
        );
      case 3: // Review
        const customer = selectedCustomer || newCustomer;
        return (
          <div className="space-y-4 text-sm">
            <h3 className="font-semibold text-lg">Review & Confirmation</h3>
            <Card className="p-4">
              <p className="font-medium">{customer.name}</p>
              <p className="text-muted-foreground">{customer.phone}</p>
              <p className="text-muted-foreground">
                {customer.email || "No email"}
              </p>
            </Card>
            <Card className="p-4">
              <p>
                <span className="text-muted-foreground">Address: </span>
                {customer.address || "N/A"}
              </p>
              <p>
                <span className="text-muted-foreground">Due: </span>
                {orderDetails.dueDate
                  ? new Date(orderDetails.dueDate).toLocaleString()
                  : "N/A"}
              </p>
              <p>
                <span className="text-muted-foreground">Notes: </span>
                {orderDetails.notes || "None"}
              </p>
            </Card>
            <Card className="p-4">
              <span className="text-muted-foreground">Weight: </span>
              {orderDetails.weight > 0 ? `${orderDetails.weight} kg` : "N/A"}
            </Card>
            <div className="space-y-2">
              <h4 className="font-medium">
                Items (
                {calculatedItems.reduce((acc, item) => acc + item.quantity, 0)})
              </h4>
              {calculatedItems.map((item, i) => (
                <div key={i} className="p-2 border rounded-md">
                  <p className="font-medium">
                    {item.quantity}x {item.name}
                  </p>
                </div>
              ))}
            </div>
            <div className="text-right font-bold text-lg">
              Total: KES {calculatedTotal.toLocaleString()}
            </div>
          </div>
        );
      case 4: // Payment & Receipt
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Payment & Receipt</h3>
            <div className="text-center p-4 bg-secondary rounded-lg">
              <p className="text-muted-foreground">Total Amount</p>
              <p className="text-3xl font-bold">
                KES {calculatedTotal.toLocaleString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Payment Status
              </label>
              <Select
                value={paymentDetails.paymentStatus}
                onValueChange={(v) =>
                  setPaymentDetails({
                    ...paymentDetails,
                    paymentStatus: v as Order["paymentStatus"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pay-on-delivery">
                    Pay on Delivery
                  </SelectItem>
                  <SelectItem value="completed">Paid Now</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Payment Method
              </label>
              <Select
                value={paymentDetails.paymentMethod}
                onValueChange={(v: Order["paymentMethod"]) =>
                  setPaymentDetails({
                    ...paymentDetails,
                    paymentMethod: v as Order["paymentMethod"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="mpesa">M-Pesa</SelectItem>
                  <SelectItem value="airtel-money">Airtel Money</SelectItem>
                  <SelectItem value="pesapal">Pesa Pal</SelectItem>
                  <SelectItem value="visa">VISA</SelectItem>
                  <SelectItem value="pdq">PDQ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {paymentDetails.paymentStatus === "completed" && (
              <div className="space-y-4 p-4 border rounded-lg">
                {(paymentDetails.paymentMethod === "mpesa" ||
                  paymentDetails.paymentMethod === "airtel-money") && (
                    <div className="space-y-3 pt-2">
                      <Button className="w-full">
                        <Send className="w-4 h-4 mr-2" />
                        Send STK Push
                      </Button>
                      <div>
                        <label className="text-sm font-medium text-foreground block mb-2">
                          Transaction ID (Optional)
                        </label>
                        <Input
                          placeholder="e.g., RKI456ABC789"
                          value={paymentDetails.transactionId}
                          onChange={(e) =>
                            setPaymentDetails({
                              ...paymentDetails,
                              transactionId: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  )}
                {paymentDetails.paymentMethod !== "mpesa" && paymentDetails.paymentMethod !== "airtel-money" && (
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      Transaction ID (Optional)
                    </label>
                    <Input
                      placeholder="e.g., RKI456ABC789"
                      value={paymentDetails.transactionId}
                      onChange={(e) =>
                        setPaymentDetails({
                          ...paymentDetails,
                          transactionId: e.target.value,
                        })
                      }
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        );
      case 5: // Finalization
        return (
          <div className="space-y-6">
            <h3 className="font-semibold text-lg">Finalization</h3>
            <p className="text-sm text-muted-foreground">
              Review the generated barcodes below. Once confirmed, the order
              will be created.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Barcode Generation */}
              <div className="space-y-4">
                <Card className="p-4">
                  <h4 className="font-semibold mb-3">Generate Barcode</h4>
                  <div className="space-y-2">
                    <Input
                      placeholder="Enter code to generate"
                      value={manualBarcode}
                      onChange={(e) => setManualBarcode(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1" onClick={() => handleGenerateBarcode('order')}>Generate Order Code</Button>
                      <Button variant="outline" className="flex-1" onClick={() => handleGenerateBarcode('item')}>Generate Item Code</Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-semibold mb-3">Generated Barcode Image</h4>
                  <div className="flex items-center justify-center bg-muted rounded-lg h-24">
                    {generatedBarcodeImage ? (
                      <img src={generatedBarcodeImage} alt="Generated Barcode" className="h-20" />
                    ) : (
                      <p className="text-sm text-muted-foreground">Image will appear here</p>
                    )}
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-semibold mb-3">Bulk Actions</h4>
                  <div className="flex flex-col gap-2">
                    <Button variant="secondary">Generate All Codes</Button>
                    <Button variant="secondary">Print All Generated Codes</Button>
                  </div>
                </Card>
              </div>

              {/* All Codes List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">All Codes</h4>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Printer className="w-4 h-4 mr-2" />
                        Print
                        <ChevronDown className="w-4 h-4 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Print Order Barcode</DropdownMenuItem>
                      <DropdownMenuItem>Print Item Barcodes</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Card className="p-4 max-h-80 overflow-y-auto space-y-3">
                  <div className="flex items-center gap-3">
                    <Checkbox id="order-barcode" />
                    <label htmlFor="order-barcode" className="font-mono text-sm">{generatedOrder.orderBarcode}</label>
                  </div>
                  {generatedOrder.items.map((item: any, i: any) => (
                    <div key={i} className="flex items-center gap-3">
                      <Checkbox id={`item-barcode-${i}`} />
                      <label htmlFor={`item-barcode-${i}`} className="font-mono text-sm">{item.barcode || generateItemBarcode(item.id)}</label>
                    </div>
                  ))}
                </Card>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Create New Order</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          disabled={isSubmitting}
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Stepper Navigation */}
        <div className="w-1/4 border-r p-6">
          <nav className="space-y-1">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                disabled={step.id > currentStep}
                className={`w-full flex items-center gap-3 p-3 rounded-md text-left text-sm font-medium transition-colors ${currentStep === step.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent disabled:opacity-50"
                  }`}
              >
                <step.icon className="w-5 h-5" />
                <span>{step.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Form Content */}
        <div className="w-3/4 flex flex-col">
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {renderStepContent()}
          </div>

          {/* Actions */}
          <div className="p-6 border-t flex justify-between items-center">
            <div className="flex gap-2">
              {onSaveDraft && (
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Save Draft
                </Button>
              )}
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
            <div>
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="mr-2"
                >
                  Back
                </Button>
              )}
              {currentStep < steps.length ? (
                <Button onClick={handleNext}>
                  {currentStep === 3 ? "Confirm" : "Next"}
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Creating Order..." : "Submit Order"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
