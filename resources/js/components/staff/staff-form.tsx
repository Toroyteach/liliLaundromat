import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import type { Staff } from "@/lib/types";

interface StaffFormProps {
  formData: Partial<Staff>;
  setFormData: (formData: Partial<Staff>) => void;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onClose: () => void;
  submitButtonText: string;
  isEditMode?: boolean;
}

export function StaffForm({
  formData,
  setFormData,
  isSubmitting,
  onSubmit,
  onClose,
  submitButtonText,
  isEditMode = false,
}: StaffFormProps) {
  return (
    <form onSubmit={onSubmit} className="p-6 space-y-4">
      <div>
        <label className="text-sm font-medium text-foreground block mb-2">
          Profile Image
        </label>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
            {/* Placeholder for image preview */}
          </div>
          <Button type="button" variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-foreground block mb-2">
          Name *
        </label>
        <input
          type="text"
          required
          value={formData.name || ""}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="John Doe"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground block mb-2">
          Email *
        </label>
        <input
          type="email"
          required
          value={formData.email || ""}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="john@example.com"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground block mb-2">
          Phone *
        </label>
        <input
          type="tel"
          required
          value={formData.phone || ""}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="+254712345678"
        />
      </div>
      <div className={`grid ${isEditMode ? "grid-cols-2" : ""} gap-4`}>
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            Role
          </label>
          <select
            value={formData.role}
            onChange={(e) =>
              setFormData({
                ...formData,
                role: e.target.value as "staff" | "manager",
              })
            }
            className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="staff">Staff</option>
            <option value="manager">Manager</option>
          </select>
        </div>
        {isEditMode && (
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as "active" | "inactive",
                })
              }
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        )}
      </div>
      <div className="flex gap-3 pt-4 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-primary hover:bg-primary/90 flex-1"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : submitButtonText}
        </Button>
      </div>
    </form>
  );
}
