import { useState, useEffect, useCallback } from "react"
import type { RealtimeUpdate } from "@/lib/types"

export function useRealtimeUpdates() {
  const [updates, setUpdates] = useState<RealtimeUpdate[]>([])
  const [isConnected, setIsConnected] = useState(false)

  // Simulate WebSocket connection
  useEffect(() => {
    setIsConnected(true)

    // Simulate receiving updates
    const interval = setInterval(() => {
      // This would be replaced with actual WebSocket listener
      // For now, we just maintain the connection state
    }, 5000)

    return () => {
      clearInterval(interval)
      setIsConnected(false)
    }
  }, [])

  // Add update to list
  const addUpdate = useCallback((update: RealtimeUpdate) => {
    setUpdates((prev) => [update, ...prev].slice(0, 50)) // Keep last 50 updates
  }, [])

  // Clear updates
  const clearUpdates = useCallback(() => {
    setUpdates([])
  }, [])

  // Subscribe to specific order updates
  const subscribeToOrder = useCallback((orderId: string, callback: (update: RealtimeUpdate) => void) => {
    const handleUpdate = (update: RealtimeUpdate) => {
      if (update.orderId === orderId) {
        callback(update)
      }
    }

    // In a real implementation, this would set up a WebSocket listener
    return () => {
      // Cleanup
    }
  }, [])

  return {
    updates,
    isConnected,
    addUpdate,
    clearUpdates,
    subscribeToOrder,
  }
}
