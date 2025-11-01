<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Models\Customer;
use Illuminate\Support\Facades\Gate;

class CustomerConroller extends Controller
{
    public function index()
    {
        try {

            if (!Gate::allows('viewAny', Customer::class)) {
                abort(403, __('Unauthorized Action'));
            }

            $customers = Customer::orderBy('created_at', 'desc')->paginate(20);
            return response()->json($customers);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(StoreCustomerRequest $request)
    {
        try {
            if (!Gate::allows('update', Customer::class)) {
                abort(403, __('Unauthorized Action'));
            }

            $customer = Customer::create($request->validated());
            return response()->json(['message' => 'Customer created successfully', 'data' => $customer], 201);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show(Customer $customer)
    {
        try {

            if (!Gate::allows('create', $customer)) {
                abort(403, __('Unauthorized Action'));
            }

            return response()->json($customer);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(UpdateCustomerRequest $request, Customer $customer)
    {
        try {

            if (!Gate::allows('update', $customer)) {
                abort(403, __('Unauthorized Action'));
            }

            $customer->update($request->validated());
            return response()->json(['message' => 'Customer updated successfully', 'data' => $customer]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Customer $customer)
    {
        try {
            if (!Gate::allows('delete', $customer)) {
                abort(403, __('Unauthorized Action'));
            }


            $customer->delete();
            return response()->json(['message' => 'Customer deleted successfully']);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
