<?php

namespace App\Http\Controllers\Order;

use App\Http\Controllers\Controller;

use App\Models\OrderItem;
use App\Http\Requests\StoreOrderItemRequest;
use App\Http\Requests\UpdateOrderItemRequest;
use App\Services\BarcodeService;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class OrderItemController extends Controller
{
    public function index(): Response|RedirectResponse
    {
        try {
            if (!Gate::allows('viewAny', OrderItem::class)) {
                abort(403, __('Unauthorized Action'));
            }

            return Inertia::render('orderItem/index', [
                'data' => OrderItem::all()
            ]);
        } catch (\Throwable $e) {
            return back()->with(['error' => $e->getMessage()], 500);
        }
    }

    public function store(StoreOrderItemRequest $request): Response|RedirectResponse
    {
        try {
            if (!Gate::allows('create', OrderItem::class)) {
                abort(403, __('Unauthorized Action'));
            }

            $item = OrderItem::create($request->validated());

            return back()->with(['data' => $item], 201);
        } catch (\Throwable $e) {
            return back()->with(['error' => $e->getMessage()], 500);
        }
    }

    public function show(OrderItem $order_item): Response|RedirectResponse
    {
        if (!Gate::allows('view', $order_item)) {
            abort(403, __('Unauthorized Action'));
        }

        return back()->with(['data' => $order_item]);
    }

    public function update(UpdateOrderItemRequest $request, OrderItem $order_item): Response|RedirectResponse
    {
        try {
            if (!Gate::allows('update', $order_item)) {
                abort(403, __('Unauthorized Action'));
            }

            $order_item->update($request->validated());

            return back()->with(['data' => $order_item]);
        } catch (\Throwable $e) {
            return back()->with(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy(OrderItem $order_item): Response|RedirectResponse
    {
        try {
            if (!Gate::allows('delete', $order_item)) {
                abort(403, __('Unauthorized Action'));
            }

            $order_item->delete();

            return back()->with(['message' => 'Order item deleted successfully']);
        } catch (\Throwable $e) {
            return back()->with(['error' => $e->getMessage()], 500);
        }
    }

    public function generateBarcodeForItem($id, BarcodeService $barcode)
    {
        $item = OrderItem::findOrFail($id);

        $result = $barcode->generateForOrderItem($item, request('type', 'qr'));

        return back()->with($result);
    }
}
