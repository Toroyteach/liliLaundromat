import { useEffect, useState, useCallback } from "react"

export function useBarcodeScanner(onScan: (data: string) => void) {
  const [isListening, setIsListening] = useState(false)
  const [lastScan, setLastScan] = useState<string>("")
  const [scanBuffer, setScanBuffer] = useState<string>("")

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }

      // Build up the scan buffer
      if (event.key === "Enter") {
        if (scanBuffer.length > 0) {
          setLastScan(scanBuffer)
          onScan(scanBuffer)
          setScanBuffer("")
        }
      } else if (event.key.length === 1) {
        setScanBuffer((prev) => prev + event.key)
      }
    },
    [scanBuffer, onScan],
  )

  useEffect(() => {
    if (isListening) {
      window.addEventListener("keydown", handleKeyPress)
      return () => {
        window.removeEventListener("keydown", handleKeyPress)
      }
    }
  }, [isListening, handleKeyPress])

  return {
    isListening,
    setIsListening,
    lastScan,
    scanBuffer,
  }
}
