<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Payment;
use Exception;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class MpesaService
{
    protected $config;
    public function __construct()
    {
        $this->config = config('mpesa');
    }

    /**
     * Get OAuth token from MPESA (handshake).
     */
    public function getAccessToken(): string
    {
        $url = rtrim($this->config['base_url'], '/') . '/oauth/v1/generate?grant_type=client_credentials';

        try {
            $response = Http::withBasicAuth($this->config['consumer_key'], $this->config['consumer_secret'])
                ->timeout($this->config['timeout'])
                ->get($url);

            $response->throw();

            $data = $response->json();

            return $data['access_token'] ?? throw new Exception('No access token returned');
        } catch (RequestException $e) {
            Log::error('Mpesa access token failed', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    /**
     * Initiate STK Push for an order.
     *
     * @param Order $order
     * @param string $phone E.164 format e.g. 2547XXXXXXXX
     * @param float $amount
     * @return array response from mpesa
     */
    public function stkPush(Order $order, string $phone, float $amount): array
    {
        // idempotency: use order id + timestamp bucket
        $checkoutRequestId = 'CHK_' . $order->id . '_' . Str::random(8);

        try {
            $token = $this->getAccessToken();

            $url = rtrim($this->config['base_url'], '/') . '/mpesa/stkpush/v1/processrequest';

            $timestamp = Carbon::now()->format('YmdHis');
            $passkey = $this->config['lipa_na_mpesa_passkey'];
            $shortcode = $this->config['shortcode'];
            $password = base64_encode($shortcode . $passkey . $timestamp);

            $payload = [
                'BusinessShortCode' => $shortcode,
                'Password' => $password,
                'Timestamp' => $timestamp,
                'TransactionType' => 'CustomerPayBillOnline',
                'Amount' => (int) round($amount),
                'PartyA' => $this->normalizePhone($phone),
                'PartyB' => $shortcode,
                'PhoneNumber' => $this->normalizePhone($phone),
                'CallBackURL' => $this->config['callback_url'],
                'AccountReference' => 'ORDER-' . $order->id,
                'TransactionDesc' => 'Payment for order #' . $order->id,
            ];

            $response = Http::withToken($token)
                ->acceptJson()
                ->timeout($this->config['timeout'])
                ->post($url, $payload);

            $response->throw();

            $data = $response->json();

            // store a pending payment record to match callback later (idempotency)
            DB::transaction(function () use ($order, $amount, $data, $checkoutRequestId) {
                $order->payments()->create([
                    'customer_id' => $order->customer_id,
                    'amount' => $amount,
                    'method' => 'mpesa_stk',
                    'mpesa_reference' => $data['CheckoutRequestID'] ?? $checkoutRequestId,
                    'status' => 'pending',
                    'processed_by_user_id' => auth()->id() ?? null,
                ]);
            });

            return $data;
        } catch (Exception $e) {
            Log::error('Mpesa STK push failed', [
                'order_id' => $order->id,
                'phone' => $phone,
                'amount' => $amount,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Normalize phone numbers to MPESA format (2547XXXXXXXX)
     */
    protected function normalizePhone(string $phone): string
    {
        $phone = preg_replace('/[^0-9]/', '', $phone);

        if (strlen($phone) == 9 && substr($phone, 0, 1) === '7') {
            return '254' . $phone;
        }

        if (strlen($phone) == 10 && substr($phone, 0, 2) === '07') {
            return '254' . substr($phone, 1);
        }

        if (strlen($phone) == 12 && substr($phone, 0, 3) === '254') {
            return $phone;
        }

        return $phone;
    }

    /**
     * Handle MPESA callback. This method expects the raw MPESA callback JSON array.
     *
     * Returns boolean true on success.
     */
    public function handleCallback(array $payload): bool
    {
        // mpesa returns nested JSON - defend with try/catch
        try {
            // save raw callback for audit
            DB::transaction(function () use ($payload) {
                // Optional: store callback raw in a log table for later audit (not implemented here)
            });

            // Example payload structure:
            // $payload['Body']['stkCallback'] => ['MerchantRequestID','CheckoutRequestID','ResultCode','ResultDesc','CallbackMetadata' => ['Item' => [...]]]
            $body = $payload['Body'] ?? null;
            if (! $body || ! isset($body['stkCallback'])) {
                Log::warning('Mpesa callback missing stkCallback', ['payload' => $payload]);
                return false;
            }

            $stk = $body['stkCallback'];
            $checkoutRequestID = $stk['CheckoutRequestID'] ?? null;
            $resultCode = $stk['ResultCode'] ?? null;
            $resultDesc = $stk['ResultDesc'] ?? null;

            // find the pending payment by CheckoutRequestID or mpesa_reference
            $payment = Payment::where('mpesa_reference', $checkoutRequestID)->lockForUpdate()->first();

            // if not found, try to match by account ref in description or create new record
            if (! $payment) {
                // sometimes Mpesa gives TransactionID only in metadata; create safe record
                $payment = Payment::create([
                    'order_id' => null,
                    'customer_id' => null,
                    'amount' => 0,
                    'method' => 'mpesa_stk',
                    'mpesa_reference' => $checkoutRequestID ?? ('unknown_' . Str::random(8)),
                    'status' => 'unknown',
                ]);
            }

            // If resultCode is 0 => success
            if ((int)$resultCode === 0) {
                // extract callback metadata items
                $items = collect($stk['CallbackMetadata']['Item'] ?? []);

                $amount = (float) ($items->firstWhere('Name', 'Amount')['Value'] ?? 0);
                $mpesaReceipt = $items->firstWhere('Name', 'MpesaReceiptNumber')['Value'] ?? null;
                $transactionDate = $items->firstWhere('Name', 'TransactionDate')['Value'] ?? null;
                $phone = $items->firstWhere('Name', 'PhoneNumber')['Value'] ?? null;

                // avoid duplicates by checking receipt
                $existing = Payment::where('mpesa_reference', $mpesaReceipt)->first();
                if ($existing && $existing->id !== $payment->id) {
                    Log::info('Duplicate mpesa callback detected', ['receipt' => $mpesaReceipt]);
                    // mark incoming as duplicate and stop
                    $payment->update(['status' => 'duplicate']);
                    return true;
                }

                // persist reliable info atomically
                DB::transaction(function () use ($payment, $amount, $mpesaReceipt, $transactionDate, $phone) {
                    $payment->amount = $amount;
                    $payment->mpesa_reference = $mpesaReceipt ?? $payment->mpesa_reference;
                    $payment->status = 'successful';
                    $payment->paid_at = $transactionDate ? Carbon::createFromFormat('YmdHis', (string)$transactionDate) : Carbon::now();
                    $payment->save();
                });

                // update order if available
                if ($payment->order_id) {
                    $order = $payment->order()->lockForUpdate()->first();
                    if ($order) {
                        // recalc order payments total and adjust status
                        $totalPaid = $order->payments()->where('status', 'successful')->sum('amount');
                        if ($totalPaid >= $order->total_amount) {
                            $order->status = 'paid';
                            $order->save();
                        } else {
                            $order->status = 'partially_paid';
                            $order->save();
                        }
                    }
                }

                Log::info('Mpesa callback processed (success)', ['receipt' => $mpesaReceipt, 'amount' => $amount, 'phone' => $phone]);
                return true;
            }

            // non-zero result code => failed or cancelled
            $payment->status = 'failed';
            $payment->save();

            Log::warning('Mpesa callback result not successful', [
                'checkoutRequestID' => $checkoutRequestID,
                'resultCode' => $resultCode,
                'resultDesc' => $resultDesc,
            ]);

            return true;
        } catch (Exception $e) {
            Log::error('Mpesa callback processing failed', [
                'error' => $e->getMessage(),
                'payload' => $payload,
            ]);
            return false;
        }
    }
}