<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;

use App\Models\Payment;
use App\Http\Requests\StorePaymentRequest;
use App\Http\Requests\UpdatePaymentRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function index(): Response|RedirectResponse
    {
        try {
            if (!Gate::allows('viewAny', Payment::class)) {
                abort(403, __('Unauthorized Action'));
            }

            $payments = Payment::with(['order.customer'])
                ->orderByDesc('created_at')
                ->get()
                ->map(function ($payment) {
                    return [
                        'id' => $payment->id,
                        'orderId' => $payment->order?->id ?? null,
                        'customerName' => $payment->customer?->name ?? 'Unknown',
                        'amount' => $payment->amount,
                        'method' => $payment->method,
                        'status' => $payment->status,
                        'date' => $payment->paid_at ?? $payment->created_at,
                    ];
                });

            return Inertia::render('payments/page', [
                'transactions' => $payments,
            ]);
        } catch (\Throwable $e) {
            return back()->with(['error' => $e->getMessage()], 500);
        }
    }

    public function store(StorePaymentRequest $request): Response|RedirectResponse
    {
        try {

            if (!Gate::allows('create', Payment::class)) {
                abort(403, __('Unauthorized Action'));
            }


            $payment = Payment::create($request->validated());

            return back()->with(['data' => $payment], 201);
        } catch (\Throwable $e) {
            return back()->with(['error' => $e->getMessage()], 500);
        }
    }

    public function show(Payment $payment): Response|RedirectResponse
    {

        if (!Gate::allows('view', Payment::class)) {
            abort(403, __('Unauthorized Action'));
        }


        return back()->with(['data' => $payment]);
    }

    public function update(UpdatePaymentRequest $request, Payment $payment): Response|RedirectResponse
    {
        try {

            if (!Gate::allows('update', $payment)) {
                abort(403, __('Unauthorized Action'));
            }

            $payment->update($request->validated());

            return back()->with(['data' => $payment]);
        } catch (\Throwable $e) {
            return back()->with(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Payment $payment): Response|RedirectResponse
    {
        try {

            if (!Gate::allows('delete', $payment)) {
                abort(403, __('Unauthorized Action'));
            }

            $payment->delete();

            return back()->with(['message' => 'Payment deleted successfully']);
        } catch (\Throwable $e) {
            return back()->with(['error' => $e->getMessage()], 500);
        }
    }
}
