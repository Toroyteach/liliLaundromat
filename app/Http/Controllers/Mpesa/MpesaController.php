<?php

namespace App\Http\Controllers\Mpesa;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\MpesaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class MpesaController extends Controller
{
    protected $mpesa;

    public function __construct(MpesaService $mpesa)
    {
        $this->mpesa = $mpesa;
    }

    /**
     * Initiate STK Push
     * POST /api/mpesa/stk-push
     * body: { order_id, phone, amount (optional) }
     */
    public function stkPush(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|integer|exists:orders,id',
            'phone' => [
                'required',
                'string',
                'regex:/(\+?254|0|^){1}[-. ]?([7]{1}([0-2]{1}[0-9]{1}|[4]{1}([0-3]{1}|[5-6]{1})|[5]{1}[7-9]{1}|[6]{1}[8-9]{1}|[9]{1}[0-9]{1})|[1]{2}[0-5]{1})[0-9]{6}\z/'
            ],
            'amount' => 'nullable|numeric|min:1',
        ]);

        $order = Order::findOrFail($validated['order_id']);
        $amount = $validated['amount'] ?? $order->total_amount;

        try {
            $response = $this->mpesa->stkPush($order, $validated['phone'], (float)$amount);
            return response()->json([
                'success' => true,
                'data' => $response,
            ]);
        } catch (\Exception $e) {
            Log::error('STK Push error', ['error' => $e->getMessage(), 'order_id' => $order->id]);
            return response()->json(['success' => false, 'message' => 'Failed to initiate payment.'], 500);
        }
    }

    /**
     * MPESA callback endpoint (public)
     * POST /api/mpesa/callback
     *
     * Safaricom will POST JSON to this endpoint. Return HTTP 200 quickly.
     */
    public function callback(Request $request)
    {
        $payload = $request->json()->all();

        // respond immediately 200 to avoid retries, but process payload
        // You can queue background job for heavier processing - here we handle inline but protected by try/catch.
        try {
            $processed = $this->mpesa->handleCallback($payload);

            // Always return required success format to MPESA (they expect HTTP 200)
            return response()->json(['ResultCode' => 0, 'ResultDesc' => 'Accepted']);
        } catch (\Exception $e) {
            Log::error('Mpesa callback handler threw', ['error' => $e->getMessage(), 'payload' => $payload]);
            // still return 200 to avoid repeated retries; but consider alerting on critical failures
            return response()->json(['ResultCode' => 0, 'ResultDesc' => 'Accepted with errors']);
        }
    }
}
