import { useState, useMemo, useRef, useEffect } from "react";
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
import { router, usePage } from "@inertiajs/react";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import axios from "axios";

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

type GarmentMeta = {
  notes?: string;
};

interface SharedProps {
  result?: {
    id: number;
    original: string;
    timestamp: string;
    status: string;
  };
  errors: Record<string, string>;
}

export function CreateOrderStepper({
  isOpen,
  onClose,
  onCreate,
  onSaveDraft,
  customers,
}: CreateOrderStepperProps) {
  const { result } = usePage<any>().props as SharedProps;
  const { auth, flash } = usePage().props as any;
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showDrafts, setShowDrafts] = useState(false);
  const [drafts, setDrafts] = useState<any[]>([]);

  const [orderDraft, setOrderDraft] = useState<Partial<Order>>({});
  const [customerMode, setCustomerMode] = useState<"search" | "create">("search");
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const loadDrafts = () => {
    const toastId = toast.loading("Checking for drafts...");

    router.get("/orders/draft", {}, {
      onSuccess: (page: any) => {
        const draftData = page.props.draft;
        const items = draftData?.items ?? [];

        if (items.length > 0) {
          // setDrafts([draftData]);
          setShowDrafts(true);
          console.log(draftData)
          console.log(showDrafts)
          toast.success(`Loaded draft`, { id: toastId });
        } else {
          setDrafts([]);
          toast.error("No drafts found", { id: toastId });
        }
      },
      onError: () => {
        toast.error("Failed to load drafts", { id: toastId });
      }
    });
  };

  const selectDraft = (draft: Partial<Order>) => {
    setOrderDraft(draft);
    toast.success("Draft loaded");
    setShowDrafts(false);
  };

  const updateDraft = () => {
    toast.loading('Saving draft...', { id: 'save-draft' });

    router.post(
      '/orders/draft/update',
      {
        order: orderDraft, // use existing local draft state
      },
      {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          toast.success('Draft saved', { id: 'save-draft' });
        },
        onError: () => {
          toast.error('Failed to save draft', { id: 'save-draft' });
        },
      },
    );
  };

  const deleteDraft = (key: number) => {
    toast.loading("Deleting draft...", { id: "delete-draft" });

    router.delete(`/orders/draft/${key}`, {
      onSuccess: () => {
        setDrafts((prev) => prev.filter((_, i) => i !== key));
        toast.success("Draft deleted", { id: "delete-draft" });
      },
    });
  };

  const handleGarmentQuantityChange = (
    garmentId: string,
    quantity: number,
    meta?: GarmentMeta
  ) => {
    setOrderDraft((prev): Partial<Order> => {
      const items = Array.isArray(prev.items) ? [...prev.items] : [];
      const index = items.findIndex((i) => i.id === garmentId);

      if (quantity === 0) {
        if (index !== -1) items.splice(index, 1);
      } else {
        const unitPrice =
          DEFAULT_GARMENTS.find((g) => g.id === garmentId)?.basePrice ?? 0;

        const payload: GarmentItem = {
          id: garmentId,
          name: garmentId,
          barcode: items[index]?.barcode ?? "",
          quantity,
          unitPrice,
          totalPrice: unitPrice * quantity,
          notes: meta?.notes ?? "",
          serviceType: items[index]?.serviceType ?? "wash",
          status: items[index]?.status ?? "pending",
          trackingHistory: items[index]?.trackingHistory ?? [],
          pricingMode: "per_item",
          createdAt: items[index]?.createdAt ?? new Date(),
          orderId: items[index]?.orderId ?? "",
        };

        if (index !== -1) {
          items[index] = payload;
        } else {
          items.push({
            ...payload,
            barcode: "",
            serviceType: "wash",
            status: "pending",
            trackingHistory: [],
            pricingMode: "per_item",
            createdAt: new Date(),
            orderId: "",
          });
        }
      }

      return { ...prev, items };
    });
  };

  const searchedCustomers = useMemo(() => {
    if (!customerSearch || !Array.isArray(customers) || customers.length === 0) {
      return [];
    }

    const term = customerSearch.toLowerCase();

    return customers.filter(
      (c) =>
        c.phone?.includes(term) ||
        c.email?.toLowerCase().includes(term) ||
        c.name.toLowerCase().includes(term)
    );
  }, [customerSearch, customers]);

  const calculatedItems = useMemo(() => {
    if (!Array.isArray(orderDraft.items)) return [];

    return orderDraft.items.map((item) => ({
      id: item.id,
      name: item.name,
      notes: item.notes,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
    }));
  }, [orderDraft.items]);

  const calculatedTotal = useMemo(() => {
    return calculatedItems.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );
  }, [calculatedItems]);

  // Step 5: Finalization
  const [finalizationDetails, setFinalizationDetails] = useState({
    assignedStaff: "",
  });

  // State for barcode generation in finalization step
  const [manualBarcode, setManualBarcode] = useState('');
  const [generatedBarcodeImage, setGeneratedBarcodeImage] = useState('');

  // Step 5: Payment
  // Inside your component
  const [activeOrderId, setActiveOrderId] = useState<number | null>(null);
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);
  const [paymentDetails, setPaymentDetails] = useState({
    paymentMethod: "cash" as Order["paymentMethod"],
    paymentStatus: "pay-on-delivery" as Order["paymentStatus"],
    transactionId: "",
  });

  // helpers (inside component)
  const [stkStatus, setStkStatus] = useState<
    "idle" | "sending" | "pending" | "success" | "failed"
  >("idle");

  const submitPayment = () => {
    const payload = {
      user_id: auth.user.id,
      total_amount: calculatedTotal,
      status: paymentDetails.paymentMethod === "mpesa" ? "pending" : "completed",
      due_date: orderDraft.dueDate ?? null,
      weight_kg: orderDraft.weight ?? null,
      customer_id: orderDraft.customerId ?? null,
      customer_phone: orderDraft.customerPhone ?? null,
      customer_email: orderDraft.customerEmail ?? null,
      customer_address: orderDraft.customerAddress ?? null,
      customer_name: orderDraft.customerName ?? null,


      payment_method: paymentDetails.paymentMethod,
      payment_status:
        paymentDetails.paymentMethod === "mpesa" ? "pending" : "completed",
      transaction_id: paymentDetails.transactionId ?? null,

      items: orderDraft.items?.map((item) => ({
        barcode: item.barcode,
        name: item.name,
        quantity: item.quantity,
        service_type: item.serviceType,
        pricing_mode: item.pricingMode,
        unit_price: item.unitPrice,
        total_price: item.totalPrice,
        garment_type: item.garmentType ?? null,
        material: item.material ?? null,
        color: item.color ?? null,
        notes: item.notes ?? null,
        status: item.status,
      })),
    };

    setStkStatus("sending");

    toast.loading("Submitting order...", { id: "order" });

    router.post("/orders", payload, {
      onSuccess: (page: any) => {
        const orderId = page.props.flash?.order_id;
        console.log(page.props)

        if (paymentDetails.paymentMethod === "mpesa") {
          if (orderId) {
            startPolling(orderId);
            toast.success("Order recorded successfully. Check payment", { id: "order" });
          } else {
            // Fallback: Check if we have an activeOrderId from a previous attempt
            setStkStatus("failed");
            toast.error("Order created but payment initiation failed. Please retry.", { id: "order" });
          }
        } else {
          toast.success("Order recorded successfully", { id: "order" });
        }
      },
      onError: (errors) => {
        toast.error("Failed to submit order", { id: "order" });
        setStkStatus("failed");
      },
    });
  };

  // Function to stop polling
  const stopPolling = () => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
      pollingInterval.current = null;
    }
  };

  // Polling Logic
  const startPolling = (orderId: number) => {
    setActiveOrderId(orderId);
    setStkStatus("pending");

    stopPolling(); // Clear existing

    pollingInterval.current = setInterval(async () => {
      try {
        const response = await axios.get(`/orders/${orderId}/status`);
        const { status } = response.data;

        if (status === "completed") {
          setStkStatus("success");
          toast.success("Payment confirmed!", { id: "order" });
          stopPolling();
        } else if (status === "failed") {
          setStkStatus("failed");
          toast.error("Payment failed or cancelled.", { id: "order" });
          stopPolling();
        }
      } catch (error) {
        console.error("Polling error", error);
      }
    }, 3000); // Poll every 3 seconds
  };

  const handleRetry = async () => {
    if (!activeOrderId) return;
    setStkStatus("sending");
    try {
      await axios.post(`/orders/${activeOrderId}/retry-payment`);
      startPolling(activeOrderId);
      toast.loading("Retry sent. Awaiting confirmation...", { id: "order" });
    } catch (error) {
      setStkStatus("failed");
      toast.error("Retry failed.");
    }
  };

  // const submitPayment = () => {
  //   // ... your existing payload logic ...
  //   setStkStatus("sending");
  //   toast.loading("Submitting order...", { id: "order" });

  //   router.post("/orders", payload, {
  //     onSuccess: (page: any) => {
  //       const orderId = page.props.flash.order_id;
  //       if (paymentDetails.paymentMethod === "mpesa" && orderId) {
  //         startPolling(orderId);
  //       } else {
  //         setStkStatus("success");
  //         toast.success("Order completed successfully", { id: "order" });
  //       }
  //     },
  //     onError: () => {
  //       setStkStatus("failed");
  //       toast.error("Submission failed", { id: "order" });
  //     },
  //   });
  // };

  // Memoize generated order for the final step
  const generatedOrder = useMemo(() => {
    const customer = selectedCustomer || {
      id: `CUST-${Date.now()}`,
      name: orderDraft.customerName,
      phone: orderDraft.customerPhone,
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

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);

    setOrderDraft({
      customerId: customer.id ?? null,
      customerName: customer.name ?? "",
      customerPhone: customer.phone ?? "",
      customerEmail: customer.email ?? "",
      customerAddress: customer.address ?? "",
    });

    setCustomerMode("create"); // go back to form view
  };

  if (!isOpen) return null;

  const handleNext = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

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
              <Button variant="secondary" size="sm" onClick={loadDrafts}>
                Continue Draft
              </Button>
            </div>

            {/* Draft selector */}
            {showDrafts && drafts.length > 0 && (
              <div className="max-h-64 overflow-y-auto space-y-2 border rounded-md p-2">
                {drafts.map((draft, index) => (
                  <Card
                    key={index}
                    className="p-3 cursor-pointer hover:bg-muted"
                    onClick={() => selectDraft(draft)}
                  >
                    <p className="font-semibold">
                      {draft.customerName ?? 'Unnamed Customer'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {draft.items?.length ?? 0} items • KES {draft.totalAmount ?? 0}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {draft.createdAt
                        ? new Date(draft.createdAt).toLocaleString()
                        : 'Draft'}
                    </p>
                  </Card>
                ))}
              </div>
            )}

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
                {customerSearch && searchedCustomers.length > 0 && (
                  <div className="max-h-64 overflow-y-auto space-y-2 border rounded-md p-2">
                    {searchedCustomers.map((customer) => (
                      <Card
                        key={customer.id}
                        className="p-3 cursor-pointer hover:bg-muted"
                        onClick={() => handleSelectCustomer(customer)}
                      >
                        <p className="font-semibold">{customer.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {customer.phone} • {customer.email}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {customer.address}
                        </p>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Card className="p-4 space-y-3">
                <h4 className="font-semibold">New Customer</h4>
                <Input
                  placeholder="Customer Name *"
                  required
                  value={orderDraft.customerName}
                  onChange={(e) =>
                    setOrderDraft({ ...orderDraft, customerName: e.target.value })
                  }
                />
                <Input
                  placeholder="Phone Number *"
                  required
                  value={orderDraft.customerPhone}
                  onChange={(e) =>
                    setOrderDraft({ ...orderDraft, customerPhone: e.target.value })
                  }
                />
                <Input
                  type="email"
                  placeholder="Email (Optional)"
                  value={orderDraft.customerEmail}
                  onChange={(e) =>
                    setOrderDraft({ ...orderDraft, customerEmail: e.target.value })
                  }
                />
                <Textarea
                  placeholder="Address (Optional)"
                  value={orderDraft.customerAddress}
                  onChange={(e) =>
                    setOrderDraft({ ...orderDraft, customerAddress: e.target.value })
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
                value={
                  orderDraft.dueDate
                    ? new Date(orderDraft.dueDate).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  setOrderDraft({
                    ...orderDraft,
                    dueDate: e.target.value ? new Date(e.target.value) : undefined,
                  })
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
                value={orderDraft.weight}
                onChange={(e) =>
                  setOrderDraft({
                    ...orderDraft,
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
                value={orderDraft.notes}
                onChange={(e) =>
                  setOrderDraft({ ...orderDraft, notes: e.target.value })
                }
              />
            </div>
            <GarmentList
              onQuantityChange={handleGarmentQuantityChange}
            />
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
                {orderDraft.dueDate
                  ? new Date(orderDraft.dueDate).toLocaleString()
                  : "N/A"}
              </p>
              <p>
                <span className="text-muted-foreground">Notes: </span>
                {orderDraft.notes || "None"}
              </p>
            </Card>
            <Card className="p-4">
              <span className="text-muted-foreground">Weight: </span>
              {(orderDraft?.weight ?? 0) > 0 ? `${orderDraft.weight} kg` : "N/A"}
            </Card>
            <div className="space-y-2">
              <h4 className="font-medium">
                Items (
                {calculatedItems.reduce((acc, item) => acc + item.quantity, 0)})
              </h4>

              {calculatedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between p-2 border rounded-md"
                >
                  <div>
                    <p className="font-medium">
                      {item.quantity} × {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Notes: {item.notes ?? " "}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      KES {item.unitPrice.toLocaleString()} each
                    </p>
                  </div>
                  <p className="font-semibold">
                    KES {item.totalPrice.toLocaleString()}
                  </p>
                </div>
              ))}
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
              <label className="text-sm font-medium block mb-2">Payment Method</label>
              <Select
                value={paymentDetails.paymentMethod}
                onValueChange={(v) =>
                  setPaymentDetails({ ...paymentDetails, paymentMethod: v as Order["paymentMethod"] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="mpesa">M-Pesa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {paymentDetails.paymentMethod === "mpesa" && (
              <div>
                <label className="text-sm font-medium block mb-2">
                  Customer Phone Number
                </label>
                <Input
                  placeholder="2547XXXXXXXX"
                  value={orderDraft.customerPhone}
                  onChange={(e) =>
                    setOrderDraft({ ...orderDraft, customerPhone: e.target.value })
                  }
                />
              </div>
            )}

            {paymentDetails.paymentMethod === "cash" && (
              <div>
                <label className="text-sm font-medium block mb-2">
                  Cash Received By
                </label>
                <Input
                  placeholder="Admin name"
                  value={orderDraft.customerName}
                  onChange={(e) =>
                    setOrderDraft({
                      ...orderDraft,
                      customerName: e.target.value,
                    })
                  }
                />
              </div>
            )}

            <div className="space-y-3">
              {stkStatus === "failed" ? (
                <Button
                  variant="outline"
                  className="w-full border-red-500 text-red-600"
                  onClick={handleRetry}
                >
                  Retry M-Pesa Payment
                </Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={submitPayment}
                  disabled={stkStatus === "sending" || stkStatus === "pending"}
                >
                  {stkStatus === "sending" ? "Processing..." :
                    stkStatus === "pending" ? "Awaiting M-Pesa..." :
                      paymentDetails.paymentMethod === "mpesa" ? "Send STK Push" : "Confirm Cash Payment"}
                </Button>
              )}

              {stkStatus !== "idle" && (
                <div className={`p-3 rounded-md text-sm text-center ${stkStatus === "success" ? "bg-green-100 text-green-800" : "bg-blue-50 text-blue-800"
                  }`}>
                  {stkStatus === "sending" && "Initializing secure connection..."}
                  {stkStatus === "pending" && "Check your phone for the M-Pesa PIN prompt"}
                  {stkStatus === "success" && "Transaction Verified! Order is now complete."}
                  {stkStatus === "failed" && "Transaction unsuccessful. You can try again above."}
                </div>
              )}
            </div>

            {stkStatus !== "idle" && (
              <p className="text-sm text-center text-muted-foreground">
                {stkStatus === "sending" && "Sending STK push…"}
                {stkStatus === "pending" && "Waiting for customer confirmation…"}
                {stkStatus === "success" && "Payment received successfully"}
                {stkStatus === "failed" && "Payment failed"}
              </p>
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

  useEffect(() => {
    if (!selectedCustomer) return;

    setOrderDraft((prev) => ({
      ...prev,
      customer: {
        id: selectedCustomer.id,
        name: selectedCustomer.name,
        phone: selectedCustomer.phone,
        email: selectedCustomer.email,
        address: selectedCustomer.address,
        is_new: false,
      },
    }));
  }, [selectedCustomer]);

  useEffect(() => {
    if (customerMode !== "create") return;
    if (!newCustomer.name || !newCustomer.phone) return;

    setOrderDraft((prev) => ({
      ...prev,
      customer: {
        ...newCustomer,
        is_new: true,
      },
    }));
  }, [newCustomer, customerMode]);

  // useEffect(() => {
  //   // setOrderDraft((prev) => ({
  //   //   ...prev,
  //   //   order_details: orderDraft,
  //   // }));
  // }, [orderDraft]);

  useEffect(() => {
    if (!Array.isArray(orderDraft.items)) return;

    orderDraft.items.forEach((item) => {
      handleGarmentQuantityChange(item.id, item.quantity);
    });
  }, []);

  return (
    <>
      {/* <Dialog open={showDrafts} onOpenChange={setShowDrafts}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Saved Draft Orders</DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            {drafts.length === 0 && (
              <p className="text-sm text-muted-foreground">No saved drafts</p>
            )}

            {drafts.map((draft, index) => (
              <div
                key={index}
                className="flex items-center justify-between border rounded p-2"
              >
                <div
                  className="cursor-pointer"
                  onClick={() => selectDraft(draft)}
                >
                  <p className="font-medium">
                    {draft.customer?.name ?? "Unnamed Customer"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {draft.items?.length ?? 0} items
                  </p>
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteDraft(index)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog> */}
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
                    onClick={updateDraft}
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
                  <Button disabled={isSubmitting}>
                    {isSubmitting ? "Creating Order..." : "Submit Order"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
