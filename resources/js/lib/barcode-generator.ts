// Utility to generate unique barcodes
export function generateBarcode(prefix: string, id: string): string {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `${prefix}-${id}-${timestamp}-${random}`
}

export function generateOrderBarcode(orderId: string): string {
  return generateBarcode("ORD", orderId)
}

export function generateItemBarcode(itemId: string): string {
  return generateBarcode("ITM", itemId)
}

// Format barcode for display
export function formatBarcode(barcode: string): string {
  return barcode.replace(/-/g, " ")
}
