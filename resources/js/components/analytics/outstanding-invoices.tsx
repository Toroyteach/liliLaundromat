import { Card } from "@/components/ui/card";

interface Invoice {
  id: string;
  customerName: string;
  amount: number;
  dueDate: Date;
}

interface OutstandingInvoicesProps {
  invoices: Invoice[];
}

export function OutstandingInvoices({ invoices }: OutstandingInvoicesProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Outstanding Invoices
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                Customer
              </th>
              <th className="text-right py-3 px-4 font-semibold text-muted-foreground">
                Amount
              </th>
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                Due Date
              </th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr
                key={invoice.id}
                className="border-b border-border hover:bg-secondary/50 transition-colors"
              >
                <td className="py-3 px-4 font-medium text-foreground">
                  {invoice.customerName}
                </td>
                <td className="py-3 px-4 text-right font-semibold text-foreground">
                  KES {invoice.amount}
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  {invoice.dueDate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
