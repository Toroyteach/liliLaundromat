<?php

namespace App\Http\Controllers\Order;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Models\Customer;
use App\Services\BarcodeService;
use App\Services\MpesaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    protected $barcodeService;

    public function __construct(BarcodeService $barcodeService)
    {
        $this->barcodeService = $barcodeService;
    }

    public function index(): Response|RedirectResponse
    {
        try {
            // if (!Gate::allows('viewAny', Order::class)) {
            //     abort(403, __('Unauthorized Action'));
            // }

            $orders = Order::with([
                'customer',
                'items',
                'payments',
                'branch',
            ])
                ->orderBy('created_at', 'asc')
                ->get();

            // format to match frontend structure
            $payload = $orders->map(function ($order) {
                return [
                    'id' => $order->id,
                    'customerId' => $order->customer_id,
                    'customerName' => $order->customer->name ?? '',
                    'customerPhone' => $order->customer->phone ?? '',
                    'customerEmail' => $order->customer->email ?? '',
                    'status' => $order->status,
                    'totalPrice' => $order->total_amount,
                    'weight' => $order->items->sum('weight_kg'),
                    'paymentMethod' => optional($order->payments->last())->method ?? '',
                    'paymentStatus' => optional($order->payments->last())->status ?? '',
                    'createdAt' => $order->created_at,
                    'barcode' => $order->barcode_number ?? '',

                    'items' => $order->items->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'barcode' => $item->barcode_number,
                            'name' => $item->garment_type,
                            'quantity' => $item->quantity,
                            'serviceType' => $item->pricing_mode,
                            'status' => $item->status,
                            'trackingHistory' => [], // fill later once implemented
                        ];
                    }),
                ];
            });

            // customers list for modal + stats
            $customers = Customer::withCount('orders as totalOrders')
                ->withSum('orders as totalSpent', 'total_amount')
                ->get();

            return Inertia::render('orders/page', [
                'orders' => $payload,
                'customers' => $customers
            ]);
        } catch (\Throwable $e) {
            return back()->with(['error' => $e->getMessage()], 500);
        }
    }

    public function create(): Response|RedirectResponse
    {
        try {
            // if (!Gate::allows('create', Order::class)) {
            //     abort(403, __('Unauthorized Action'));
            // }

            $customers = Customer::select('id', 'name', 'phone', 'email', 'address')
                ->get()
                ->map(fn($user) => [
                    'id' => (string) $user->id,
                    'name' => $user->name,
                    'phone' => $user->phone,
                    'email' => $user->email,
                    'address' => $user->address,
                ])
                ->values();

            return Inertia::render('orders/create/page', [
                'customers' => $customers,
            ]);
        } catch (\Throwable $e) {
            return back()->with(['error' => $e->getMessage()], 500);
        }
    }

    public function tracking(): Response|RedirectResponse
    {
        try {
            // if (!Gate::allows('viewAny', Order::class)) {
            //     abort(403, __('Unauthorized Action'));
            // }

            $orders = Order::with(['customer', 'branch', 'items', 'payments'])
                ->orderByDesc('created_at')
                ->get();

            // fetch logs for all orders/items in one query to avoid N+1
            $orderIds = $orders->pluck('id')->all();
            $logs = DB::table('garmet_handling_logs')
                ->whereIn('order_item_id', $orderIds)
                ->orderBy('scanned_at', 'desc')
                ->get()
                ->groupBy(function ($row) {
                    // group by order_item_id if present else by order_id
                    return $row->order_item_id ?? ('order_' . $row->order_id);
                });

            $payload = $orders->map(function ($order) use ($logs) {
                // latest payment (if any)
                $latestPayment = $order->payments->sortByDesc('paid_at')->first();

                $items = collect($order->items)->map(function ($it) use ($logs) {
                    $key = $it->id;
                    $itemLogs = isset($logs[$key]) ? $logs[$key] : collect();

                    return [
                        'id' => (string) $it->id,
                        'barcode' => $it->barcode_number ?? null,
                        'name' => $it->garment_type ?? ($it->garmet_type_name ?? 'Item'),
                        'quantity' => (int) ($it->quantity ?? 1),
                        'serviceType' => $it->pricing_mode ?? null,
                        'status' => $it->status ?? null,
                        'trackingHistory' => $itemLogs->map(function ($l) {
                            return [
                                'status' => $l->stage,
                                'timestamp' => $l->scanned_at,
                                'staffName' => $l->staff_name ?? null,
                            ];
                        })->values()->all(),
                    ];
                })->values()->all();

                // order-level logs (those that don't have order_item_id)
                $orderLogsKey = 'order_' . $order->id;
                $orderLogs = isset($logs[$orderLogsKey]) ? $logs[$orderLogsKey] : collect();

                return [
                    'id' => 'ORD-' . $order->id,
                    'barcode' => $order->barcode ?? ('ORD-' . $order->id . '-' . Str::random(6)),
                    'customerId' => $order->customer_id ? 'CUST-' . $order->customer_id : null,
                    'customerName' => $order->customer->name ?? null,
                    'customerPhone' => $order->customer->phone ?? null,
                    'items' => $items,
                    'status' => $order->status,
                    'totalPrice' => $order->total_amount ?? $order->orderItems->sum('total_price'),
                    'paymentMethod' => $latestPayment->method ?? null,
                    'paymentStatus' => $latestPayment->status ?? null,
                    'createdAt' => $order->created_at,
                    'trackingHistory' => $orderLogs->map(function ($l) {
                        return [
                            'status' => $l->stage,
                            'timestamp' => $l->scanned_at,
                            'staffName' => $l->staff_name ?? null,
                        ];
                    })->values()->all(),
                    'branch' => [
                        'id' => $order->branch->id ?? null,
                        'name' => $order->branch->name ?? null,
                    ],
                ];
            })->values()->all();

            return Inertia::render('tracking/page', [
                'data' => $payload,
            ]);
        } catch (\Throwable $e) {
            return back()->with(['error' => $e->getMessage()], 500);
        }
    }

    public function trackDetails($order): Response|RedirectResponse
    {
        try {
            $order = Order::with([
                'customer',
                'user',
                'branch',
                'items',
                'items.handlingLogs'
            ])->findOrFail($order);

            if (!Gate::allows('view', $order)) {
                abort(403, __('Unauthorized Action'));
            }

            return Inertia::render('tracking/show', [
                'data' => $order
            ]);
        } catch (\Throwable $e) {
            return back()->with(['error' => $e->getMessage()], 500);
        }
    }

    public function store(StoreOrderRequest $request, MpesaService $mpesaService): Response|RedirectResponse
    {
        try {
            $validated = $request->validated();

            // dd($validated);

            /** CUSTOMER (reuse or create) */
            if (!empty($validated['customer_id'])) {
                $customer = Customer::findOrFail($validated['customer_id']);
            } else {
                $customer = Customer::firstOrCreate(
                    ['phone' => $validated['customer']['phone']],
                    [
                        'name'  => $validated['customer']['name'],
                        'email' => $validated['customer']['email'] ?? null,
                        'address' => $validated['customer']['address'] ?? null,
                    ]
                );
            }


            /** ORDER */
            $order = Order::create([
                'customer_id'  => $customer->id,
                'user_id'      => $validated['user_id'],
                'total_amount' => $validated['total_amount'],
                'status'       => $validated['status'],
                'due_date'     => $validated['due_date'],
                'weight_kg'    => $validated['weight_kg'],
            ]);

            /** ORDER ITEMS */
            foreach ($validated['items'] as $item) {
                $order->items()->create([
                    'garment_type'   => $item['garment_type'] ?? null,
                    'quantity'       => $item['quantity'],
                    'unit_price'     => $item['unit_price'],
                    'total_price'    => $item['total_price'],
                    'color'          => $item['color'] ?? null,
                    'material'       => $item['material'] ?? null,
                    'barcode_number' => $item['barcode'] ?? null,
                    'status'         => $item['status'],
                    'notes'          => $item['notes'] ?? null,
                ]);
            }

            // 3. Handle M-Pesa Logic
            if ($request->payment_method === 'mpesa') {
                try {
                    $mpesaService->stkPush($order, $request->customer_phone, $request->total_amount);
                    return redirect()->back()->with('order_id', $order->id);
                } catch (\Exception $e) {
                    // We still flash the order_id so the UI knows which order to retry
                    return redirect()->back()
                        ->with('order_id', $order->id)
                        ->with('error', 'M-Pesa service unavailable.');
                }
            }

            $processedData = [
                'id' => rand(1, 1000),
                'original' => $validated['input_string'],
                'timestamp' => now()->toDateTimeString(),
                'status' => 'success'
            ];


            return back()->with('result', $processedData);
        } catch (\Throwable $e) {
            return back()->with(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Endpoint for polling order status
     */
    public function checkStatus(Order $order)
    {
        return response()->json([
            'status' => $order->status, // 'pending', 'completed', 'failed'
            'payment_status' => $order->payments()->latest()->first()?->status ?? 'none'
        ]);
    }

    /**
     * Explicit retry for M-Pesa
     */
    public function retryPayment(Order $order, MpesaService $mpesaService)
    {
        try {
            $mpesaService->stkPush($order, $order->customer_phone, $order->total_amount);
            return response()->json(['message' => 'STK Push resent']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to resend STK Push'], 500);
        }
    }

    public function getDraft(): Response
    {
        // $sampleDraft = [
        //     'id' => 'ORD-789',
        //     'customerName' => 'John Doe',
        //     'due_date' => now(),
        //     'items' => [
        //         [
        //             'id' => 'ITEM-1',
        //             'name' => 'Cotton Shirt',
        //             'quantity' => 2,
        //             'serviceType' => 'wash-dry-iron',
        //             'status' => 'pending',
        //             'pricingMode' => 'per_item',
        //             'unitPrice' => 150,
        //             'totalPrice' => 300,
        //             'createdAt' => now(),
        //         ],
        //         [
        //             'id' => 'ITEM-2',
        //             'name' => 'Heavy Blanket',
        //             'quantity' => 1,
        //             'serviceType' => 'dry-cleaning',
        //             'status' => 'pending',
        //             'pricingMode' => 'by_weight',
        //             'unitPrice' => 200,
        //             'totalPrice' => 1100,
        //             'createdAt' => now(),
        //         ]
        //     ],
        //     'totalAmount' => 1400,
        //     'weight' => 5.5,
        //     'createdAt' => now(),
        // ];

        // session(['order_draft' => $sampleDraft]);

        $draft = session('order_draft', []);
        $count = count($draft['items'] ?? []);


        return inertia()->render('orders/create/page', [
            'draft' => $draft,
            'message' => $count > 0 ? "Retrieved {$count} items from draft." : "No drafts found.",
            'status' => $count > 0 ? 'success' : 'info'
        ]);
    }


    /**
     * Update order details or items
     */
    public function updateDraft(Request $request)
    {
        $draft = session('order_draft', []);

        // Merge incoming data (order details or items array)
        $newDraft = array_merge($draft, $request->input('order', []));

        session(['order_draft' => $newDraft]);

        return back();
    }

    /**
     * Specifically delete an item from the draft items array
     */
    public function deleteDraftItem($itemId)
    {
        $draft = session('order_draft', []);

        if (isset($draft['items'])) {
            // Filter out the item with the matching ID
            $draft['items'] = array_values(array_filter($draft['items'], function ($item) use ($itemId) {
                return $item['id'] !== $itemId;
            }));

            // Recalculate total amount after deletion
            $draft['totalAmount'] = collect($draft['items'])->sum('totalPrice');

            session(['order_draft' => $draft]);
        }

        return back();
    }

    public function show(Order $order): Response|RedirectResponse
    {
        if (!Gate::allows('view', $order)) {
            abort(403, __('Unauthorized Action'));
        }

        return Inertia::render('order/edit', [
            'data' => $order
        ]);
    }

    public function update(UpdateOrderRequest $request, Order $order): Response|RedirectResponse
    {
        try {

            // if (!Gate::allows('update', $order)) {
            //     abort(403, __('Unauthorized Action'));
            // }

            $order->update($request->validated());

            return back()->with(['data' => $order]);
        } catch (\Throwable $e) {
            return back()->with(['error' => $e->getMessage()], 500);
        }
    }

    public function updateStatus(Request $request, Order $order): Response|RedirectResponse
    {
        try {

            // if (!Gate::allows('update', $order)) {
            //     abort(403, __('Unauthorized Action'));
            // }

            $order->update(['status' => $request->status]);

            return back()->with(['data' => $order]);
        } catch (\Throwable $e) {
            return back()->with(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Order $order): Response|RedirectResponse
    {
        try {

            // if (!Gate::allows('delete', $order)) {
            //     abort(403, __('Unauthorized Action'));
            // }
            $order->delete();

            return back()->with(['message' => 'Order deleted successfully']);
        } catch (\Throwable $e) {
            return back()->with(['error' => $e->getMessage()], 500);
        }
    }

    // Example: generate labels for all items in an order (POST /orders/{order}/generate-labels)
    public function generateLabels(Request $request, Order $order)
    {
        // Type comes from request: 'qr' or 'barcode'
        $type = $request->input('type', 'qr');
        $force = (bool) $request->input('force', false);

        $results = [];
        foreach ($order->items as $item) {
            $res = $this->barcodeService->generateForOrderItem($item, $type, ['force' => $force]);
            $results[] = [
                'item_id' => $item->id,
                'success' => $res['success'],
                'path' => $res['path'],
                'barcode_number' => $res['barcode_number'],
                'error' => $res['error']
            ];
        }

        return back()->with([
            'order_id' => $order->id,
            'type' => $type,
            'results' => $results
        ]);
    }
}
