import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { Staff } from "@/lib/types";
import { StaffForm } from "@/components/staff/staff-form";
import { router } from '@inertiajs/react';
import { toast } from 'react-hot-toast';

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (staff: Staff) => void;
}

export function AddStaffModal({ isOpen, onClose, onAdd }: AddStaffModalProps) {
  const [formData, setFormData] = useState<Partial<Staff>>({
    name: "",
    email: "",
    phone: "",
    role: "staff",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    toast.loading("Adding staff...", { id: "staff-add" });

    try {
      const payload: Omit<Staff, "id" | "joinDate"> = {
        name: formData.name || "",
        email: formData.email || "",
        phone: formData.phone || "",
        password: formData.password || "",
        role: formData.role || "staff",
        status: "active",
      };

      router.post("/users", payload, {
        onSuccess: () => {
          toast.success("Staff added successfully", { id: "staff-add" });
          onClose()
        },
        onError: () => toast.error("Failed to add staff", { id: "staff-add" }),
      });
    } catch {
      toast.error("Unexpected error", { id: "staff-add" });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <div className="bg-card border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">
            Add Staff Member
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <StaffForm
          formData={formData}
          setFormData={setFormData}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onClose={onClose}
          submitButtonText={isSubmitting ? "Adding..." : "Add Staff"}
        />
      </Card>
    </div>
  );
}
