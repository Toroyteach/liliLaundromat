<?php

namespace App\Services;

use App\Models\OrderItem;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use chillerlan\QRCode\{QROptions, QRCode};
use Picqer\Barcode\BarcodeGeneratorPNG;
use Exception;

class BarcodeService
{
    /**
     * Generate QR or barcode image for a single OrderItem.
     *
     * @param  OrderItem  $item
     * @param  string     $type  'qr'|'barcode'
     * @param  array      $options optional: ['force' => bool, 'text' => '...']
     * @return array  ['success' => bool, 'path' => string|null, 'barcode_number' => string|null, 'error' => string|null]
     */
    public function generateForOrderItem(OrderItem $item, string $type = 'qr', array $options = []): array
    {
        try {
            $force = $options['force'] ?? false;
            $providedText = $options['text'] ?? null;

            // If barcode exists and not forced, return existing
            if (! $force && $item->barcode_image && Storage::disk('public')->exists($item->barcode_image)) {
                return [
                    'success' => true,
                    'path' => $item->barcode_image,
                    'barcode_number' => $item->barcode_number,
                    'error' => null
                ];
            }

            // Build a stable, unique barcode_number (human readable)
            $barcodeNumber = $providedText ?? $this->generateBarcodeNumber($item);

            // Create folder path: orders/{order_id}/items/{item_id}/
            $folder = "orders/{$item->order_id}/items/{$item->id}";
            $filename = Str::slug($barcodeNumber) . '.png';
            $storagePath = "{$folder}/{$filename}";

            // Generate image bytes depending on type
            if ($type === 'qr') {
                $imageData = $this->generateQrPng($barcodeNumber, $options);
            } else {
                // Default to code128 1D barcode
                $imageData = $this->generateCode128Png($barcodeNumber, $options);
            }

            // Ensure storage folder exists and store
            Storage::disk('public')->put($storagePath, $imageData);

            // Update model fields
            $item->barcode_number = $barcodeNumber;
            $item->barcode_type = $type;
            $item->barcode_image = $storagePath;
            $item->save();

            return [
                'success' => true,
                'path' => $storagePath,
                'barcode_number' => $barcodeNumber,
                'error' => null
            ];
        } catch (Exception $e) {
            Log::error('BarcodeService generateForOrderItem error', [
                'item_id' => $item->id,
                'order_id' => $item->order_id,
                'type' => $type,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'success' => false,
                'path' => null,
                'barcode_number' => null,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Create a deterministic, readable barcode number.
     */
    protected function generateBarcodeNumber(OrderItem $item): string
    {
        // Pattern: ORD{order_id}-ITM{item_id}-{UTCtimestampShort}-{6char}
        $time = now()->format('YmdHis'); // deterministic timestamp
        $rand = strtoupper(Str::random(6));
        $garment = Str::upper(Str::substr(preg_replace('/\s+/', '', $item->garment_type ?: 'GN'), 0, 6));
        return "ORD{$item->order_id}-ITM{$item->id}-{$garment}-{$time}-{$rand}";
    }

    /**
     * Generate QR PNG bytes using chillerlan/php-qrcode.
     */
    protected function generateQrPng(string $text, array $options = []): string
    {
        $qrOptions = new QROptions([
            'outputType' => QROptions::OUTPUT_IMAGE_PNG,
            'eccLevel'   => QROptions::ECC_L,
            'scale'      => $options['scale'] ?? 5,    // size multiplier
            'imageBase64' => false,
        ]);

        $qrcode = new QRCode($qrOptions);
        return $qrcode->render($text);
    }

    /**
     * Generate Code128 PNG bytes using picqer/php-barcode-generator.
     */
    protected function generateCode128Png(string $text, array $options = []): string
    {
        $generator = new BarcodeGeneratorPNG();
        // widthFactor can be tuned; height in px
        $widthFactor = $options['width_factor'] ?? 2;
        $height = $options['height'] ?? 60;
        return $generator->getBarcode($text, $generator::TYPE_CODE_128, $widthFactor, $height);
    }
}