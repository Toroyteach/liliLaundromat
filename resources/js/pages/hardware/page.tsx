"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Card } from "@/components/ui/card"
import { PrinterSettings } from "@/components/hardware/printer-settings"
import { ScannerSettings } from "@/components/hardware/scanner-settings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle } from "lucide-react"
import type { PrinterConfig, ScannerConfig } from "@/lib/types"

export default function HardwarePage() {
  const [printers, setPrinters] = useState<PrinterConfig[]>([
    {
      id: "PRINTER-001",
      name: "Receipt Printer 1",
      type: "thermal",
      status: "connected",
      lastUsed: new Date(Date.now() - 30 * 60 * 1000),
    },
  ])

  const [scanners, setScanners] = useState<ScannerConfig[]>([
    {
      id: "SCANNER-001",
      name: "Barcode Scanner 1",
      type: "barcode",
      status: "connected",
      lastUsed: new Date(Date.now() - 5 * 60 * 1000),
    },
  ])

  const handleAddPrinter = (printer: PrinterConfig) => {
    setPrinters([...printers, printer])
  }

  const handleRemovePrinter = (printerId: string) => {
    setPrinters(printers.filter((p) => p.id !== printerId))
  }

  const handleTestPrinter = (printerId: string) => {
    setPrinters(printers.map((p) => (p.id === printerId ? { ...p, lastUsed: new Date(), status: "connected" } : p)))
    alert("Test print sent to printer!")
  }

  const handleAddScanner = (scanner: ScannerConfig) => {
    setScanners([...scanners, scanner])
  }

  const handleRemoveScanner = (scannerId: string) => {
    setScanners(scanners.filter((s) => s.id !== scannerId))
  }

  const handleTestScanner = (scannerId: string) => {
    setScanners(scanners.map((s) => (s.id === scannerId ? { ...s, lastUsed: new Date(), status: "connected" } : s)))
    alert("Scanner test initiated!")
  }

  const connectedDevices = [...printers, ...scanners].filter((d) => d.status === "connected").length
  const totalDevices = printers.length + scanners.length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Hardware Integration</h1>
          <p className="text-muted-foreground mt-1">Manage printers and barcode scanners</p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Connected Devices</p>
                <p className="text-2xl font-bold text-foreground mt-2">
                  {connectedDevices}/{totalDevices}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Devices</p>
                <p className="text-2xl font-bold text-foreground mt-2">{totalDevices}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-blue-600" />
            </div>
          </Card>
        </div>

        {/* Hardware Settings */}
        <Card className="p-6">
          <Tabs defaultValue="printers" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="printers">Printers</TabsTrigger>
              <TabsTrigger value="scanners">Scanners</TabsTrigger>
            </TabsList>

            <TabsContent value="printers" className="mt-6">
              <PrinterSettings
                printers={printers}
                onAdd={handleAddPrinter}
                onRemove={handleRemovePrinter}
                onTest={handleTestPrinter}
              />
            </TabsContent>

            <TabsContent value="scanners" className="mt-6">
              <ScannerSettings
                scanners={scanners}
                onAdd={handleAddScanner}
                onRemove={handleRemoveScanner}
                onTest={handleTestScanner}
              />
            </TabsContent>
          </Tabs>
        </Card>

        {/* Integration Guide */}
        <Card className="p-6 bg-blue-50 border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3">Integration Guide</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>
              • <strong>Barcode Scanners:</strong> Connect via USB or Bluetooth. Scanners will automatically send data
              when triggered.
            </li>
            <li>
              • <strong>Receipt Printers:</strong> Configure thermal printers for fast receipt printing. Supports
              ESC/POS protocol.
            </li>
            <li>
              • <strong>Testing:</strong> Use the test buttons to verify device connectivity and functionality.
            </li>
            <li>
              • <strong>Troubleshooting:</strong> Check device drivers and USB connections if devices show as
              disconnected.
            </li>
          </ul>
        </Card>
      </div>
    </DashboardLayout>
  )
}
