import { useState, useEffect, JSX } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { Staff } from "@/lib/types";
import { StaffForm } from "@/components/staff/staff-form";

interface EditStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (staff: Staff) => void;
  staffMember: Staff;
}

export function EditStaffModal({
  isOpen,
  onClose,
  onUpdate,
  staffMember, }: EditStaffModalProps): JSX.Element | null {
  const [formData, setFormData] = useState<Partial<Staff>>(staffMember);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData(staffMember);
  }, [staffMember]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      onUpdate(formData as Staff);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <div className="bg-card border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">
            Edit Staff Member
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
          submitButtonText={isSubmitting ? "Updating..." : "Update Staff"}
          isEditMode={true}
        />
      </Card>
    </div>
  );
}
