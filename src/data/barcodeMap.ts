// src/data/barcodeMap.ts

/**
 * Map of barcode → food *name* (or id).
 *
 * You will fill this with real barcodes of products later.
 * For now, these are just EXAMPLES.
 */
export const barcodeToFoodName: Record<string, string> = {
  // E.g. scanned "8901234567890" should map to "Basmati Rice"
  "8901234567890": "Basmati Rice",
  "8901111111111": "Idli",
  "8902222222222": "Masala Dosa",
  "8903333333333": "Paneer Tikka",
};
