<?php

namespace App\Http\Controllers\Invoice;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Http\Requests\StoreInvoiceRequest;
use App\Http\Requests\UpdateInvoiceRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class InvoiceConroller extends Controller
{
    public function index(): JsonResponse
    {
        try {
            if (!Gate::allows('viewAny', Invoice::class)) {
                abort(403, __('Unauthorized Action'));
            }

            return response()->json(['data' => Invoice::all()]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(StoreInvoiceRequest $request): JsonResponse
    {
        try {
            if (!Gate::allows('create', Invoice::class)) {
                abort(403, __('Unauthorized Action'));
            }

            $invoice = Invoice::create($request->validated());

            return response()->json(['data' => $invoice], 201);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show(Invoice $invoice): JsonResponse
    {
        if (!Gate::allows('view', $invoice)) {
            abort(403, __('Unauthorized Action'));
        }

        return response()->json(['data' => $invoice]);
    }

    public function update(UpdateInvoiceRequest $request, Invoice $invoice): JsonResponse
    {
        try {
            if (!Gate::allows('update', $invoice)) {
                abort(403, __('Unauthorized Action'));
            }

            $invoice->update($request->validated());

            return response()->json(['data' => $invoice]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Invoice $invoice): JsonResponse
    {
        try {
            if (!Gate::allows('delete', $invoice)) {
                abort(403, __('Unauthorized Action'));
            }

            $invoice->delete();

            return response()->json(['message' => 'Invoice deleted successfully']);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
