"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Upload, Download, FileUp } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

// Mock data for preview
const mockUserData = [
  { name: "John Doe", email: "john.doe@example.com", role: "customer" },
  { name: "Jane Smith", email: "jane.smith@example.com", role: "customer" },
];

const mockOrderData = [
  { orderId: "ORD-101", customer: "John Doe", amount: 1500, status: "pending" },
  {
    orderId: "ORD-102",
    customer: "Jane Smith",
    amount: 2500,
    status: "completed",
  },
];

export function BulkUploadCard() {
  const [uploadType, setUploadType] = useState("users");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setUploadedFile(event.target.files[0]);
      setIsPreviewOpen(true);
    }
  };

  const handleDownloadTemplate = () => {
    let headers: string[];
    let filename: string;

    if (uploadType === "users") {
      headers = ["Name", "Email", "Role"];
      filename = "users_template.csv";
    } else if (uploadType === "orders") {
      headers = ["OrderID", "CustomerName", "Amount", "Status"];
      filename = "orders_template.csv";
    } else {
      alert("Please select a data type to download a template.");
      return;
    }

    const csvContent = headers.join(",") + "\n";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleFinalUpload = () => {
    alert(`Uploading ${uploadedFile?.name} for ${uploadType}...`);
    setIsPreviewOpen(false);
    setUploadedFile(null);
    // In a real app, this would trigger the actual upload to the database.
  };

  const previewData = uploadType === "users" ? mockUserData : mockOrderData;
  const previewHeaders = Object.keys(previewData[0] || {});

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileUp className="w-5 h-5 mr-2" />
          Bulk Upload Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={uploadType} onValueChange={setUploadType}>
          <SelectTrigger>
            <SelectValue placeholder="Select data type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="users">User Data</SelectItem>
            <SelectItem value="orders">Orders</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          className="w-full"
          onClick={handleDownloadTemplate}
        >
          <Download className="w-4 h-4 mr-2" />
          Download Sample
        </Button>

        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <label htmlFor="file-upload" className="w-full">
            <Button asChild variant="outline" className="w-full cursor-pointer">
              <div>
                <Upload className="w-4 h-4 mr-2" />
                Upload File
              </div>
            </Button>
          </label>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileChange}
          />

          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Preview: {uploadedFile?.name}</DialogTitle>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {previewHeaders.map((header) => (
                      <TableHead key={header} className="capitalize">
                        {header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {Object.values(row).map((cell, cellIndex) => (
                        <TableCell key={cellIndex}>{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleFinalUpload}>Confirm & Upload</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
