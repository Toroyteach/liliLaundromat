import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { Staff } from "@/lib/types"

interface StaffDetailsModalProps {
  staff: Staff
  isOpen: boolean
  onClose: () => void
}

export function StaffDetailsModal({ staff, isOpen, onClose }: StaffDetailsModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        {/* Header */}
        <div className="bg-card border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Staff Details</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Name</p>
            <p className="font-medium text-foreground">{staff.name}</p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1">Email</p>
            <p className="font-medium text-foreground">{staff.email}</p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1">Phone</p>
            <p className="font-medium text-foreground">{staff.phone}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Role</p>
              <p className="font-medium text-foreground capitalize">{staff.role}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <p className={`font-medium capitalize ${staff.status === "active" ? "text-green-600" : "text-red-600"}`}>
                {staff.status}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1">Join Date</p>
            <p className="font-medium text-foreground">{new Date(staff.joinDate).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-card border-t border-border p-6">
          <Button onClick={onClose} className="w-full bg-primary hover:bg-primary/90">
            Close
          </Button>
        </div>
      </Card>
    </div>
  )
}
