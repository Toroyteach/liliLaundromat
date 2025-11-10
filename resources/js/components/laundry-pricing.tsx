import { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  WashingMachine,
  Shirt,
  BedDouble,
  PersonStanding,
  Home,
  ShoppingBag,
  Plus,
  Minus,
  RotateCcw,
} from "lucide-react";

const CATEGORY_ICONS: Record<PricingCategory, React.ElementType> = {
  bulk: WashingMachine,
  clothing: Shirt,
  beddings: BedDouble,
  personal: PersonStanding,
  household: Home,
  extras: ShoppingBag,
};

const PRICING_DATA = {
  bulk: {
    perLoad: { label: "Per Load (8Kg)", price: 1000, unit: "load" },
    washDryFold: { label: "Wash, Dry, Fold", price: 150, unit: "Kg" },
  },
  clothing: {
    blazer: { label: "Blazer", price: 400, unit: "piece" },
    jacket: { label: "Jacket / Trench Coat", price: 400, unit: "piece" },
    gown: { label: "Graduation Gown", price: 1000, unit: "piece" },
    suit: { label: "Suit (Blazer & Trouser)", price: 500, unit: "piece" },
    socks: { label: "Socks", price: 100, unit: "pair" },
    shirt: { label: "Shirt / Blouse", price: 150, unit: "piece" },
    trouser: { label: "Official Trouser", price: 200, unit: "piece" },
  },
  beddings: {
    duvetSmall: { label: "Duvet 4x6 / Kids", price: 500, unit: "each" },
    duvetLarge: { label: "Duvet 6x6 / 5x6", price: 1000, unit: "each" },
    throwBlanket: { label: "Throw Blanket", price: 400, unit: "each" },
    normalBlanket: { label: "Normal Blanket", price: 600, unit: "each" },
    bedsheets: { label: "Bedsheets", price: 300, unit: "piece" },
    smallTowel: { label: "Small Towel", price: 200, unit: "piece" },
    largeTowel: { label: "Large Towel", price: 300, unit: "piece" },
    pillows: { label: "Pillows", price: 300, unit: "piece" },
    mattressCover: { label: "Mattress Cover", price: 300, unit: "piece" },
  },
  personal: {
    underwear: { label: "Bras / Panties / Boxers", price: 200, unit: "piece" },
  },
  household: {
    sheers: { label: "Sheers (per unit of 2)", price: 200, unit: "unit" },
    curtains: { label: "Curtains", price: 300, unit: "Kg" },
    teddySmall: { label: "Teddy Bear (Small)", price: 300, unit: "each" },
    teddyBig: { label: "Teddy Bear (Big)", price: 400, unit: "each" },
  },
  extras: {
    largeBag: { label: "Laundry Bag (Large)", price: 100, unit: "bag" },
    mediumBag: { label: "Laundry Bag (Medium)", price: 50, unit: "bag" },
  },
};

export type PricingCategory = keyof typeof PRICING_DATA;
type PricingItem<T extends PricingCategory> = keyof (typeof PRICING_DATA)[T];

export type Quantities = {
  [category in PricingCategory]?: {
    [item in PricingItem<category>]?: number;
  };
};

const initialQuantities: Quantities = {};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
  }).format(amount);
};

interface LaundryCalculatorProps {
  onCalculationChange?: (
    quantities: Quantities,
    totalCost: number,
    items: any[]
  ) => void;
  isEditable?: boolean;
  pricingData?: typeof PRICING_DATA;
  onPriceChange?: (
    category: PricingCategory,
    item: string,
    newPrice: number
  ) => void;
}

export function LaundryCalculator({
  onCalculationChange,
  isEditable = false,
  pricingData = PRICING_DATA,
  onPriceChange,
}: LaundryCalculatorProps) {
  const [quantities, setQuantities] = useState<Quantities>(initialQuantities);
  const [calculatedItems, setCalculatedItems] = useState<any[]>([]);

  const handleQuantityChange = (
    category: PricingCategory,
    item: string,
    value: string
  ) => {
    const quantity = Number(value);
    setQuantities((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [item]: quantity >= 0 ? quantity : 0,
      },
    }));
  };

  const handleStepperChange = (
    category: PricingCategory,
    item: string,
    change: number
  ) => {
    const itemKey = item as PricingItem<typeof category>;
    const currentValue = quantities[category]?.[itemKey] || 0;
    const newValue = Math.max(0, currentValue + change);
    handleQuantityChange(category, item, String(newValue));
  };

  function calculateCategoryTotal<T extends PricingCategory>(catKey: T) {
    let categoryTotal = 0;
    const categoryItems = quantities[catKey];
    if (!categoryItems) return 0;

    for (const item in categoryItems) {
      const itemKey = item as PricingItem<T>;
      const quantity = categoryItems[itemKey];
      const priceInfo = pricingData[catKey][itemKey];
      if (quantity !== undefined && quantity > 0 && priceInfo) {
        categoryTotal += quantity * (priceInfo as any).price;
      }
    }
    return categoryTotal;
  }

  const totalCost = useMemo(() => {
    let total = 0;
    for (const category in quantities) {
      const catKey = category as PricingCategory;
      total += calculateCategoryTotal(catKey);
    }
    return total;
  }, [quantities]);

  function processCategory<T extends PricingCategory>(
    catKey: T,
    newItems: any[]
  ) {
    const categoryQuantities = quantities[catKey];
    if (!categoryQuantities) return;

    for (const item in categoryQuantities) {
      const itemKey = item as PricingItem<typeof catKey>;
      const quantity = categoryQuantities[itemKey];
      const priceInfo = pricingData[catKey][itemKey]; // Access using itemKey
      if (quantity !== undefined && quantity > 0 && priceInfo) {
        newItems.push({ ...priceInfo, quantity, category: catKey });
      }
    }
  }

  useEffect(() => {
    const newItems: any[] = [];
    for (const category in quantities) {
      const catKey = category as PricingCategory;
      processCategory(catKey, newItems);
    }
    setCalculatedItems(newItems);
    onCalculationChange?.(quantities, totalCost, newItems);
  }, [quantities, totalCost, onCalculationChange]);

  const resetCalculator = () => {
    setQuantities(initialQuantities);
  };

  const renderCategory = (category: PricingCategory, title: string) => {
    const Icon = CATEGORY_ICONS[category];
    const items = pricingData[category];
    const hasItems = Object.keys(items).some((itemKey) => {
      const key = itemKey as PricingItem<typeof category>;
      const qty = quantities[category]?.[key];
      return qty !== undefined && qty > 0;
    });

    return (
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle className="flex items-center gap-3 text-lg">
            <Icon className="w-6 h-6 text-primary" />
            <span>{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 p-6">
          {Object.entries(items).map(([key, value]) => (
            <div key={key} className="space-y-2 flex flex-col">
              <div className="grow">
                <Label htmlFor={`${category}-${key}`} className="font-medium">
                  {value.label}
                </Label>
                {isEditable ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">KES</span>
                    <Input
                      type="number"
                      value={value.price}
                      onChange={(e) =>
                        onPriceChange?.(category, key, Number(e.target.value))
                      }
                      className="h-7 w-24 text-xs"
                    />
                    <span className="text-xs text-muted-foreground">
                      / {value.unit}
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(value.price)} / {value.unit}
                  </p>
                )}
              </div>
              {!isEditable && (
                <div className="flex items-center gap-2 mt-2">
                  {value.unit !== "Kg" && (
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => handleStepperChange(category, key, -1)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  )}
                  <Input
                    id={`${category}-${key}`}
                    type="number"
                    min="0"
                    step={value.unit === "Kg" ? "0.1" : "1"}
                    placeholder={`Qty in ${value.unit}s`}
                    value={
                      quantities[category]?.[
                        key as PricingItem<typeof category>
                      ] || ""
                    }
                    onChange={(e) =>
                      handleQuantityChange(category, key, e.target.value)
                    }
                    className={`w-full text-center ${
                      value.unit !== "Kg" ? "h-9" : ""
                    }`}
                  />
                  {value.unit !== "Kg" && (
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => handleStepperChange(category, key, 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </CardContent>
        {hasItems && (
          <CardFooter className="bg-muted/50 p-4 rounded-b-lg">
            <div className="w-full">
              <h4 className="font-semibold mb-2 text-sm">'{title}' Subtotal</h4>
              <ul className="text-sm space-y-1">
                {Object.entries(items).map(([key, value]) => {
                  const itemKey = key as PricingItem<typeof category>;
                  const qty = quantities[category]?.[itemKey] ?? 0;
                  if (qty > 0) {
                    const subtotal = qty * value.price;
                    return (
                      <li
                        key={`${key}-subtotal`}
                        className="flex justify-between"
                      >
                        <span>
                          {value.label}: {qty} {value.unit}(s)
                        </span>
                        <span>{formatCurrency(subtotal)}</span>
                      </li>
                    );
                  }
                  return null;
                })}
              </ul>
            </div>
          </CardFooter>
        )}
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {renderCategory("bulk", "Bulk Laundry Services")}
      {renderCategory("clothing", "Clothing Items")}
      {renderCategory("beddings", "Beddings & Towels")}
      {renderCategory("personal", "Personal Items")}
      {renderCategory("household", "Household Items")}
      {renderCategory("extras", "Extras")}

      <Card className=" shadow-2xl bg-linear-to-br from-background to-secondary/50 border-primary/20">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-xl">Total Estimated Cost</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetCalculator}
            className="text-muted-foreground"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold tracking-tight">
            {formatCurrency(totalCost)}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2"></CardFooter>
      </Card>
    </div>
  );
}
