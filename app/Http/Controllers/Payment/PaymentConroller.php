<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;

use App\Models\Payment;
use App\Http\Requests\StorePaymentRequest;
use App\Http\Requests\UpdatePaymentRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class PaymentConroller extends Controller
{
    public function index(): JsonResponse
    {
        try {
            if (!Gate::allows('viewAny', Payment::class)) {
                abort(403, __('Unauthorized Action'));
            }

            return response()->json(['data' => Payment::all()]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(StorePaymentRequest $request): JsonResponse
    {
        try {

            if (!Gate::allows('create', Payment::class)) {
                abort(403, __('Unauthorized Action'));
            }


            $payment = Payment::create($request->validated());

            return response()->json(['data' => $payment], 201);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show(Payment $payment): JsonResponse
    {

        if (!Gate::allows('view', Payment::class)) {
            abort(403, __('Unauthorized Action'));
        }


        return response()->json(['data' => $payment]);
    }

    public function update(UpdatePaymentRequest $request, Payment $payment): JsonResponse
    {
        try {

            if (!Gate::allows('update', $payment)) {
                abort(403, __('Unauthorized Action'));
            }

            $payment->update($request->validated());

            return response()->json(['data' => $payment]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Payment $payment): JsonResponse
    {
        try {

            if (!Gate::allows('delete', $payment)) {
                abort(403, __('Unauthorized Action'));
            }

            $payment->delete();

            return response()->json(['message' => 'Payment deleted successfully']);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
