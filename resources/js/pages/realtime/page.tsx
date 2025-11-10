"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useOfflineQueue } from "@/hooks/use-offline-queue"
import { useRealtimeUpdates } from "@/hooks/use-realtime-updates"
import { ConnectionStatus } from "@/components/realtime/connection-status"
import { OfflineQueueMonitor } from "@/components/realtime/offline-queue-monitor"
import { Wifi, WifiOff, Activity } from "lucide-react"

export default function RealtimePage() {
  const { queue, isOnline, syncInProgress, addAction, syncQueue } = useOfflineQueue()
  const { updates, isConnected } = useRealtimeUpdates()
  const [testMode, setTestMode] = useState(false)

  const handleTestAction = () => {
    addAction({
      type: "scan",
      data: {
        barcode: `TEST-${Date.now()}`,
        timestamp: new Date().toISOString(),
      },
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Real-time & Offline Features</h1>
          <p className="text-gray-600 mt-2">Monitor connection status and manage offline queue</p>
        </div>

        {/* Connection Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Connection Status</p>
                <p className="text-2xl font-bold mt-2">{isOnline ? "Online" : "Offline"}</p>
              </div>
              {isOnline ? <Wifi className="w-8 h-8 text-green-600" /> : <WifiOff className="w-8 h-8 text-red-600" />}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Realtime Connection</p>
                <p className="text-2xl font-bold mt-2">{isConnected ? "Connected" : "Disconnected"}</p>
              </div>
              <Activity className={`w-8 h-8 ${isConnected ? "text-green-600" : "text-gray-400"}`} />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Actions</p>
                <p className="text-2xl font-bold mt-2">{queue.filter((a) => a.status === "pending").length}</p>
              </div>
              <div className="text-3xl font-bold text-amber-600">⏳</div>
            </div>
          </Card>
        </div>

        {/* Offline Queue Monitor */}
        <OfflineQueueMonitor />

        {/* Test Controls */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Test Offline Features</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={testMode}
                  onChange={(e) => setTestMode(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Simulate Offline Mode</span>
              </label>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleTestAction} variant="outline">
                Add Test Action
              </Button>
              <Button
                onClick={syncQueue}
                disabled={syncInProgress || queue.filter((a) => a.status === "pending").length === 0}
              >
                {syncInProgress ? "Syncing..." : "Sync Queue"}
              </Button>
            </div>
          </div>
        </Card>

        {/* Recent Updates */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Updates</h2>
          {updates.length === 0 ? (
            <p className="text-gray-500 text-sm">No updates yet</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {updates.map((update, idx) => (
                <div key={idx} className="text-sm p-2 bg-gray-50 rounded border border-gray-200">
                  <div className="font-medium text-gray-900">{update.type}</div>
                  <div className="text-xs text-gray-600">Order: {update.orderId}</div>
                  <div className="text-xs text-gray-500">{new Date(update.timestamp).toLocaleTimeString()}</div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Connection Status Indicator */}
        <ConnectionStatus />
      </div>
    </DashboardLayout>
  )
}
