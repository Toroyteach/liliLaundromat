<?php

namespace App\Http\Controllers\Order;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class OrderConroller extends Controller
{
    public function index(): JsonResponse
    {
        try {
            if (!Gate::allows('viewAny', Order::class)) {
                abort(403, __('Unauthorized Action'));
            }

            return response()->json([
                'data' => Order::all()
            ]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(StoreOrderRequest $request): JsonResponse
    {
        try {
            if (!Gate::allows('create', Order::class)) {
                abort(403, __('Unauthorized Action'));
            }

            $order = Order::create($request->validated());

            return response()->json(['data' => $order], 201);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show(Order $order): JsonResponse
    {
        if (!Gate::allows('view', $order)) {
            abort(403, __('Unauthorized Action'));
        }

        return response()->json(['data' => $order]);
    }

    public function update(UpdateOrderRequest $request, Order $order): JsonResponse
    {
        try {

            if (!Gate::allows('update', $order)) {
                abort(403, __('Unauthorized Action'));
            }

            $order->update($request->validated());

            return response()->json(['data' => $order]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Order $order): JsonResponse
    {
        try {

            if (!Gate::allows('delete', $order)) {
                abort(403, __('Unauthorized Action'));
            }
            $order->delete();

            return response()->json(['message' => 'Order deleted successfully']);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
