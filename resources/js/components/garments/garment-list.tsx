import type React from "react";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * Type definitions for garment items
 */
export interface Garment {
  id: string;
  name: string;
  type:
    | "shirt"
    | "pants"
    | "jacket"
    | "underwear"
    | "socks"
    | "dress"
    | "skirt"
    | "coat"
    | "sweater"
    | "tie";
  icon: React.ComponentType<{ className?: string }>;
  basePrice: number;
}

export interface GarmentListProps {
  /**
   * Array of garment items to display
   */
  items: Garment[];
  /**
   * Callback when quantity changes for an item
   */
  onQuantityChange?: (garmentId: string, quantity: number) => void;
  /**
   * Title for the component
   */
  title?: string;
  /**
   * Subtitle/description
   */
  subtitle?: string;
}

interface GarmentQuantity {
  [key: string]: number;
}

/**
 * Icon components for different garment types
 */
const ShirtIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M6 4h12M8 4v4h8V4M6 8h4v8H6M14 8h4v8h-4M8 16h8v4H8Z" />
  </svg>
);

const PantsIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M6 4h12M6 4v8H9v8h2v-8h4v8h2v-8h3V4M6 12h12" />
  </svg>
);

const JacketIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M4 6l3 2v10H4M20 6l-3 2v10h3M7 8v10h10V8M8 8l4-3 4 3" />
  </svg>
);

const UnderwearIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M6 6h12v6c0 2-1 4-3 4H9c-2 0-3-2-3-4V6Z" />
  </svg>
);

const SocksIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M7 4c0 0-1 4-1 6 0 2 1 3 2 5s1 5 2 6h6c1-1 1-4 2-6s2-3 2-5c0-2-1-6-1-6" />
  </svg>
);

const DressIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M8 4h8M8 4v5h8V4M8 9h8v8c0 2-1 3-2 3h-4c-1 0-2-1-2-3V9Z" />
  </svg>
);

const SkirtIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M7 6h10M7 6v2h2l-2 10h6l-2-10h2V6M8 16l1 4M16 16l-1 4" />
  </svg>
);

const CoatIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M5 6l3 2v10H5M19 6l-3 2v10h3M8 8v10h8V8M9 6l3-2 3 2" />
  </svg>
);

const SweaterIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M7 4v4h3v6h4V8h3V4M7 4l-2 3h4V4M17 4l2 3h-4V4M8 10h8M8 14h8" />
  </svg>
);

const TieIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 2l2 3h-4l2-3M10 5h4l2 5h-8l2-5M9 10h6l-1 8h-4l-1-8Z" />
  </svg>
);

/**
 * Mapping of garment types to their corresponding icons
 */
const garmentIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  shirt: ShirtIcon,
  pants: PantsIcon,
  jacket: JacketIcon,
  underwear: UnderwearIcon,
  socks: SocksIcon,
  dress: DressIcon,
  skirt: SkirtIcon,
  coat: CoatIcon,
  sweater: SweaterIcon,
  tie: TieIcon,
};

/**
 * Default garment items with pricing structure
 */
export const DEFAULT_GARMENTS: Garment[] = [
  {
    id: "shirt",
    name: "Shirts",
    type: "shirt",
    icon: ShirtIcon,
    basePrice: 2.5,
  },
  {
    id: "pants",
    name: "Trousers",
    type: "pants",
    icon: PantsIcon,
    basePrice: 4.0,
  },
  {
    id: "jacket",
    name: "Jackets",
    type: "jacket",
    icon: JacketIcon,
    basePrice: 6.0,
  },
  {
    id: "underwear",
    name: "Underwear",
    type: "underwear",
    icon: UnderwearIcon,
    basePrice: 1.5,
  },
  {
    id: "socks",
    name: "Socks",
    type: "socks",
    icon: SocksIcon,
    basePrice: 1.0,
  },
  {
    id: "dress",
    name: "Dresses",
    type: "dress",
    icon: DressIcon,
    basePrice: 5.5,
  },
  {
    id: "skirt",
    name: "Skirts",
    type: "skirt",
    icon: SkirtIcon,
    basePrice: 3.5,
  },
  { id: "coat", name: "Coats", type: "coat", icon: CoatIcon, basePrice: 7.0 },
  {
    id: "sweater",
    name: "Sweaters",
    type: "sweater",
    icon: SweaterIcon,
    basePrice: 3.5,
  },
  { id: "tie", name: "Ties", type: "tie", icon: TieIcon, basePrice: 1.25 },
];

/**
 * GarmentList Component
 * Displays a grid of garment items with quantity selectors
 */
export function GarmentList({
  items = DEFAULT_GARMENTS,
  onQuantityChange,
  title = "Garments",
  subtitle = "Select and manage laundry items",
}: GarmentListProps) {
  const [quantities, setQuantities] = useState<GarmentQuantity>(() => {
    const initial: GarmentQuantity = {};
    items.forEach((item) => {
      initial[item.id] = 0;
    });
    return initial;
  });

  const handleQuantityChange = (garmentId: string, newQuantity: number) => {
    const quantity = Math.max(0, newQuantity);
    setQuantities((prev) => ({
      ...prev,
      [garmentId]: quantity,
    }));
    onQuantityChange?.(garmentId, quantity);
  };

  const handleIncrement = (garmentId: string) => {
    handleQuantityChange(garmentId, (quantities[garmentId] || 0) + 1);
  };

  const handleDecrement = (garmentId: string) => {
    handleQuantityChange(
      garmentId,
      Math.max(0, (quantities[garmentId] || 0) - 1)
    );
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>

      {/* Garment Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((garment) => {
          const IconComponent = garment.icon;
          const currentQuantity = quantities[garment.id] || 0;

          return (
            <Card
              key={garment.id}
              className="flex flex-col items-center gap-4 rounded-lg border p-6 transition-all hover:shadow-md"
            >
              {/* Icon */}
              <div className="rounded-lg bg-muted p-3">
                <IconComponent className="h-8 w-8 text-foreground" />
              </div>

              {/* Garment Name */}
              <h3 className="text-center text-sm font-semibold">
                {garment.name}
              </h3>

              {/* Price */}
              <p className="text-xs text-muted-foreground">
                KES {garment.basePrice.toFixed(2)} each
              </p>

              {/* Quantity Counter */}
              <div className="flex items-center gap-2 rounded-md border border-border bg-background p-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleDecrement(garment.id)}
                  aria-label={`Decrease ${garment.name} quantity`}
                  disabled={currentQuantity === 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>

                <div className="min-w-8 text-center text-sm font-semibold">
                  {currentQuantity}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleIncrement(garment.id)}
                  aria-label={`Increase ${garment.name} quantity`}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Total Price for this item */}
              {currentQuantity > 0 && (
                <p className="text-xs font-medium text-primary">
                  Total: KES {(garment.basePrice * currentQuantity).toFixed(2)}
                </p>
              )}
            </Card>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="mt-8 rounded-lg border-t pt-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">
            Total Items Selected:
          </p>
          <p className="text-xl font-bold">
            {Object.values(quantities).reduce((sum, q) => sum + q, 0)}
          </p>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">
            Estimated Total:
          </p>
          <p className="text-xl font-bold text-primary">
            KES{" "}
            {items
              .reduce((sum, garment) => {
                return sum + garment.basePrice * (quantities[garment.id] || 0);
              }, 0)
              .toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default GarmentList;
