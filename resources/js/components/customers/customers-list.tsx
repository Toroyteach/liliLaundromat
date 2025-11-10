import type { Customer } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";

interface CustomersListProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (customerId: string) => void;
}

export function CustomersList({
  customers,
  onEdit,
  onDelete,
}: CustomersListProps) {
  if (customers.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">No customers found</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {customers.map((customer) => (
        <Card key={customer.id} className="p-4 flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={customer.avatar as string | undefined} />
                <AvatarFallback>
                  {customer.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">
                  {customer.name}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {customer.email || "No email"}
                </p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(customer)}>
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(customer)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(customer.id)}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-2 text-sm mt-auto">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phone</span>
              <span className="font-medium">{customer.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Orders</span>
              <span className="font-medium">{customer.totalOrders}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Spent</span>
              <span className="font-medium">
                KES {customer.totalSpent.toLocaleString()}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
