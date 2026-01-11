import { useState } from "react";
import { usePage } from '@inertiajs/react';
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { StaffList } from "@/components/staff/staff-list";
import { AddStaffModal } from "./add-staff-modal";
import { EditStaffModal } from "./edit-staff-modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Users, Star, TrendingUp } from "lucide-react";
import type { Staff } from "@/lib/types";
import { AppLayout } from "@/layouts/AppLayout"
import { toast } from 'react-hot-toast';

interface PageProps {
  [key: string]: unknown;
  staff: Staff[];
  stats: {
    total_staff: number;
    active_staff: number;
    average_orders_processed: number;
  };
}

export default function StaffPage() {

  const { staff, stats } = usePage<PageProps>().props;

  //   {
  //     id: "STAFF-001",
  //     name: "Alice Johnson",
  //     email: "alice@laundromat.com",
  //     phone: "+254712345678",
  //     role: "manager",
  //     status: "active",
  //     joinDate: new Date("2024-01-15"),
  //   },
  //   {
  //     id: "STAFF-002",
  //     name: "Bob Smith",
  //     email: "bob@laundromat.com",
  //     phone: "+254798765432",
  //     role: "staff",
  //     status: "active",
  //     joinDate: new Date("2024-02-20"),
  //   },
  //   {
  //     id: "STAFF-003",
  //     name: "Carol Davis",
  //     email: "carol@laundromat.com",
  //     phone: "+254723456789",
  //     role: "staff",
  //     status: "inactive",
  //     joinDate: new Date("2024-03-10"),
  //   },
  // ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<number | null>(null);

  const confirmDelete = (id: number) => {
    setStaffToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const handleAddStaff = (newStaff: Staff) => {
    setIsAddModalOpen(false);
  };
  const handleUpdateStaff = (updatedStaff: Staff) => {
    setIsEditModalOpen(false);
    setEditingStaff(null);
  };

  const handleDeleteStaff = (staffId: number) => {
    console.log(staffId);
    toast.error('ERROR DELETING')
    // setStaff(staff.filter((s) => s.id !== staffId));
  };

  const handleEditStaff = (staffMember: Staff) => {
    setEditingStaff({ ...staffMember }); // keeps role + status
    setIsEditModalOpen(true);
  };

  const activeStaff = staff.filter((s) => s.status === "active").length;
  const totalStaff = staff.length;

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStaff = staff.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(staff.length / itemsPerPage);

  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <AppLayout>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Staff Management
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your laundromat staff members
              </p>
            </div>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Staff
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-3 gap-3">
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Staff</p>
                  <p className="text-2xl font-bold text-foreground mt-2">
                    {totalStaff}
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Staff</p>
                  <p className="text-2xl font-bold text-foreground mt-2">
                    {activeStaff}
                  </p>
                </div>
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Avg. Orders Processed
                  </p>
                  <p className="text-2xl font-bold text-foreground mt-2">
                    0/day
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </Card>
          </div>

          {/* Staff List */}
          <StaffList
            staff={currentStaff}
            onEdit={handleEditStaff}
            onDelete={handleDeleteStaff}
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-end gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>

        {/* Add Staff Modal */}
        <AddStaffModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddStaff}
        />
        {editingStaff && (
          <EditStaffModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onUpdate={handleUpdateStaff}
            staffMember={editingStaff}
          />
        )}
      </DashboardLayout>
    </AppLayout>
  );
}
