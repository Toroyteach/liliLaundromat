import { useOfflineQueue } from "@/hooks/use-offline-queue"
import { useRealtimeUpdates } from "@/hooks/use-realtime-updates"
import { AlertCircle, WifiOff, Loader2 } from "lucide-react"

export function ConnectionStatus() {
  const { isOnline, syncInProgress, pendingCount } = useOfflineQueue()
  const { isConnected } = useRealtimeUpdates()

  if (isOnline && isConnected && !syncInProgress) {
    return null // Don't show when everything is normal
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOnline && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center gap-2 text-yellow-800">
          <WifiOff className="w-4 h-4" />
          <span className="text-sm font-medium">Offline Mode</span>
          {pendingCount > 0 && <span className="text-xs bg-yellow-200 px-2 py-1 rounded">{pendingCount} pending</span>}
        </div>
      )}

      {isOnline && syncInProgress && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2 text-blue-800">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm font-medium">Syncing...</span>
        </div>
      )}

      {isOnline && !isConnected && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-800">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Connection Lost</span>
        </div>
      )}
    </div>
  )
}
