import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { Staff } from "@/lib/types"

interface AddStaffModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (staff: Staff) => void
}

export function AddStaffModal({ isOpen, onClose, onAdd }: AddStaffModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "staff" as const,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const newStaff: Staff = {
        id: `STAFF-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        status: "active",
        joinDate: new Date(),
      }

      onAdd(newStaff)
      setFormData({ name: "", email: "", phone: "", role: "staff" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        {/* Header */}
        <div className="bg-card border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Add Staff Member</h2>
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Email *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Phone *</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="+254712345678"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="staff">Staff</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Staff"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
