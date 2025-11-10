import { useState, useCallback, useEffect } from "react"
import type { QueuedAction } from "@/lib/types"

const STORAGE_KEY = "laundromat-offline-queue"

export function useOfflineQueue() {
  const [queue, setQueue] = useState<QueuedAction[]>([])
  const [isOnline, setIsOnline] = useState(true)
  const [syncInProgress, setSyncInProgress] = useState(false)

  // Load queue from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setQueue(JSON.parse(stored))
      } catch (error) {
        console.error("[v0] Failed to load queue:", error)
      }
    }

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Persist queue to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue))
  }, [queue])

  // Add action to queue
  const addAction = useCallback((action: Omit<QueuedAction, "id" | "timestamp" | "status" | "retries">) => {
    const newAction: QueuedAction = {
      ...action,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      status: "pending",
      retries: 0,
    }
    setQueue((prev) => [...prev, newAction])
    return newAction.id
  }, [])

  // Sync queue with server
  const syncQueue = useCallback(async () => {
    if (syncInProgress || queue.length === 0) return

    setSyncInProgress(true)
    const pendingActions = queue.filter((a) => a.status === "pending")

    for (const action of pendingActions) {
      try {
        // Simulate API call - replace with actual endpoint
        await new Promise((resolve) => setTimeout(resolve, 500))

        setQueue((prev) => prev.map((a) => (a.id === action.id ? { ...a, status: "synced" as const } : a)))
      } catch (error) {
        console.error("[v0] Sync failed for action:", action.id, error)
        setQueue((prev) =>
          prev.map((a) =>
            a.id === action.id ? { ...a, retries: a.retries + 1, status: a.retries >= 3 ? "failed" : "pending" } : a,
          ),
        )
      }
    }

    setSyncInProgress(false)
  }, [queue, syncInProgress])

  // Auto-sync when online
  useEffect(() => {
    if (isOnline && !syncInProgress) {
      syncQueue()
    }
  }, [isOnline, syncInProgress, syncQueue])

  // Remove action from queue
  const removeAction = useCallback((id: string) => {
    setQueue((prev) => prev.filter((a) => a.id !== id))
  }, [])

  // Clear all synced actions
  const clearSynced = useCallback(() => {
    setQueue((prev) => prev.filter((a) => a.status !== "synced"))
  }, [])

  return {
    queue,
    isOnline,
    syncInProgress,
    addAction,
    syncQueue,
    removeAction,
    clearSynced,
    pendingCount: queue.filter((a) => a.status === "pending").length,
  }
}
