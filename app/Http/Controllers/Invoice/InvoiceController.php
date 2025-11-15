<?php

namespace App\Http\Controllers\Invoice;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Http\Requests\StoreInvoiceRequest;
use App\Http\Requests\UpdateInvoiceRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class InvoiceController extends Controller
{
    public function index(): Response|RedirectResponse
    {
        try {
            if (!Gate::allows('viewAny', Invoice::class)) {
                abort(403, __('Unauthorized Action'));
            }

            return Inertia::render('invoice/index', [
                'data' => Invoice::all()
            ]);
        } catch (\Throwable $e) {
            return back()->with(['error' => $e->getMessage()], 500);
        }
    }

    public function store(StoreInvoiceRequest $request): Response|RedirectResponse
    {
        try {
            if (!Gate::allows('create', Invoice::class)) {
                abort(403, __('Unauthorized Action'));
            }

            $invoice = Invoice::create($request->validated());

            return back()->with(['data' => $invoice], 201);
        } catch (\Throwable $e) {
            return back()->with(['error' => $e->getMessage()], 500);
        }
    }

    public function show(Invoice $invoice): Response|RedirectResponse
    {
        if (!Gate::allows('view', $invoice)) {
            abort(403, __('Unauthorized Action'));
        }

        return Inertia::render('invoice/edit', [
            'data' => $invoice
        ]);
    }

    public function update(UpdateInvoiceRequest $request, Invoice $invoice): Response|RedirectResponse
    {
        try {
            if (!Gate::allows('update', $invoice)) {
                abort(403, __('Unauthorized Action'));
            }

            $invoice->update($request->validated());

            return back()->with(['data' => $invoice]);
        } catch (\Throwable $e) {
            return back()->with(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Invoice $invoice): Response|RedirectResponse
    {
        try {
            if (!Gate::allows('delete', $invoice)) {
                abort(403, __('Unauthorized Action'));
            }

            $invoice->delete();

            return back()->with(['message' => 'Invoice deleted successfully']);
        } catch (\Throwable $e) {
            return back()->with(['error' => $e->getMessage()], 500);
        }
    }
}
