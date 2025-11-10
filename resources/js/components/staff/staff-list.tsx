import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye } from "lucide-react";
import { useState } from "react";
import { StaffDetailsModal } from "./staff-details-modal";
import type { Staff } from "@/lib/types";

interface StaffListProps {
  staff: Staff[];
  onEdit: (staff: Staff) => void;
  onDelete: (staffId: string) => void;
}

export function StaffList({ staff, onEdit, onDelete }: StaffListProps) {
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  if (staff.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">No staff members found</p>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map((member) => (
          <Card
            key={member.id}
            className="p-4 hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center justify-between gap-4">
              {/* Staff Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-foreground">
                    {member.name}
                  </h3>
                  <Badge
                    variant={
                      member.status === "active" ? "default" : "secondary"
                    }
                  >
                    {member.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {member.email} • {member.phone}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Role:{" "}
                  <span className="capitalize font-medium">{member.role}</span>{" "}
                  • Joined {new Date(member.joinDate).toLocaleDateString()}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedStaff(member);
                    setIsDetailsOpen(true);
                  }}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(member)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(member.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Staff Details Modal */}
      {selectedStaff && (
        <StaffDetailsModal
          staff={selectedStaff}
          isOpen={isDetailsOpen}
          onClose={() => {
            setIsDetailsOpen(false);
            setSelectedStaff(null);
          }}
        />
      )}
    </>
  );
}
