<?php

namespace App\Http\Controllers\Order;

use App\Http\Controllers\Controller;

use App\Models\OrderItem;
use App\Http\Requests\StoreOrderItemRequest;
use App\Http\Requests\UpdateOrderItemRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class OrderItemConroller extends Controller
{
    public function index(): JsonResponse
    {
        try {
            if (!Gate::allows('viewAny', OrderItem::class)) {
                abort(403, __('Unauthorized Action'));
            }

            return response()->json(['data' => OrderItem::all()]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(StoreOrderItemRequest $request): JsonResponse
    {
        try {
            if (!Gate::allows('create', OrderItem::class)) {
                abort(403, __('Unauthorized Action'));
            }

            $item = OrderItem::create($request->validated());

            return response()->json(['data' => $item], 201);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show(OrderItem $order_item): JsonResponse
    {
        if (!Gate::allows('view', $order_item)) {
            abort(403, __('Unauthorized Action'));
        }

        return response()->json(['data' => $order_item]);
    }

    public function update(UpdateOrderItemRequest $request, OrderItem $order_item): JsonResponse
    {
        try {
            if (!Gate::allows('update', $order_item)) {
                abort(403, __('Unauthorized Action'));
            }

            $order_item->update($request->validated());

            return response()->json(['data' => $order_item]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy(OrderItem $order_item): JsonResponse
    {
        try {
            if (!Gate::allows('delete', $order_item)) {
                abort(403, __('Unauthorized Action'));
            }

            $order_item->delete();

            return response()->json(['message' => 'Order item deleted successfully']);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
