<?php

namespace App\Http\Controllers\Order;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Services\BarcodeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderConroller extends Controller
{
    protected $barcodeService;

    public function __construct(BarcodeService $barcodeService)
    {
        $this->barcodeService = $barcodeService;
    }

    public function index(): Response|RedirectResponse
    {
        try {
            if (!Gate::allows('viewAny', Order::class)) {
                abort(403, __('Unauthorized Action'));
            }

            return Inertia::render('order/index', [
                'data' => Order::all()
            ]);
        } catch (\Throwable $e) {
            return back()->with(['error' => $e->getMessage()], 500);
        }
    }

    public function store(StoreOrderRequest $request): Response|RedirectResponse
    {
        try {
            if (!Gate::allows('create', Order::class)) {
                abort(403, __('Unauthorized Action'));
            }

            $order = Order::create($request->validated());

            return back()->with(['data' => $order], 201);
        } catch (\Throwable $e) {
            return back()->with(['error' => $e->getMessage()], 500);
        }
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

            if (!Gate::allows('update', $order)) {
                abort(403, __('Unauthorized Action'));
            }

            $order->update($request->validated());

            return back()->with(['data' => $order]);
        } catch (\Throwable $e) {
            return back()->with(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Order $order): Response|RedirectResponse
    {
        try {

            if (!Gate::allows('delete', $order)) {
                abort(403, __('Unauthorized Action'));
            }
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
