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

class PaymentConroller extends Controller
{
    public function index(): Response|RedirectResponse
    {
        try {
            if (!Gate::allows('viewAny', Payment::class)) {
                abort(403, __('Unauthorized Action'));
            }

            return Inertia::render('payment/index', [
                'data' => Payment::all()
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
