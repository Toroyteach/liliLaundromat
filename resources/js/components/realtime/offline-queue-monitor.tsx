import { useOfflineQueue } from "@/hooks/use-offline-queue"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trash2, RefreshCw } from "lucide-react"

export function OfflineQueueMonitor() {
  const { queue, isOnline, syncInProgress, syncQueue, removeAction, clearSynced } = useOfflineQueue()

  const pendingActions = queue.filter((a) => a.status === "pending")
  const failedActions = queue.filter((a) => a.status === "failed")

  if (queue.length === 0) {
    return null
  }

  return (
    <Card className="p-4 bg-amber-50 border-amber-200">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-amber-900">Offline Queue</h3>
          <div className="flex gap-2">
            {!isOnline && pendingActions.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={syncQueue}
                disabled={syncInProgress}
                className="gap-2 bg-transparent"
              >
                <RefreshCw className="w-4 h-4" />
                Sync Now
              </Button>
            )}
            {queue.filter((a) => a.status === "synced").length > 0 && (
              <Button size="sm" variant="ghost" onClick={clearSynced} className="gap-2">
                <Trash2 className="w-4 h-4" />
                Clear
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="bg-white rounded p-2">
            <div className="text-amber-600 font-semibold">{pendingActions.length}</div>
            <div className="text-xs text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded p-2">
            <div className="text-green-600 font-semibold">{queue.filter((a) => a.status === "synced").length}</div>
            <div className="text-xs text-gray-600">Synced</div>
          </div>
          <div className="bg-white rounded p-2">
            <div className="text-red-600 font-semibold">{failedActions.length}</div>
            <div className="text-xs text-gray-600">Failed</div>
          </div>
        </div>

        {failedActions.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded p-2 text-xs text-red-700">
            {failedActions.length} action(s) failed. Please check your connection and retry.
          </div>
        )}
      </div>
    </Card>
  )
}
