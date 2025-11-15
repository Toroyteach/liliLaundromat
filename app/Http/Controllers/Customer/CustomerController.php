<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Models\Customer;
use App\Models\Payment;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(): Response|RedirectResponse
    {
        try {
            if (!Gate::allows('viewAny', Customer::class)) {
                abort(403, __('Unauthorized Action'));
            }

            $totalCustomers = Customer::count();

            $totalRevenue = Payment::sum('amount');

            $avgPerCustomer = Customer::withSum('payments', 'amount')
                ->get()
                ->avg('payments_sum_amount');

            $customers = Customer::select('id', 'name', 'phone', 'email', 'created_at')
                ->orderByDesc('created_at')
                ->paginate(20);

            return Inertia::render('customers/page', [
                'stats' => [
                    'total_customers' => $totalCustomers,
                    'total_revenue'   => $totalRevenue,
                    'avg_per_customer' => $avgPerCustomer,
                ],
                'customers' => $customers
            ]);
        } catch (\Throwable $e) {
            return back()->with(['error' => $e->getMessage()], 500);
        }
    }

    public function store(StoreCustomerRequest $request): Response|RedirectResponse
    {
        try {
            if (!Gate::allows('update', Customer::class)) {
                abort(403, __('Unauthorized Action'));
            }

            $customer = Customer::create($request->validated());
            return back()->with(['message' => 'Customer created successfully', 'data' => $customer], 201);
        } catch (\Throwable $e) {
            return back()->with(['error' => $e->getMessage()], 500);
        }
    }

    public function show(Customer $customer): Response|RedirectResponse
    {
        try {

            if (!Gate::allows('create', $customer)) {
                abort(403, __('Unauthorized Action'));
            }

            return back()->with($customer);
        } catch (\Throwable $e) {
            return back()->with(['error' => $e->getMessage()], 500);
        }
    }

    public function update(UpdateCustomerRequest $request, Customer $customer): Response|RedirectResponse
    {
        try {

            if (!Gate::allows('update', $customer)) {
                abort(403, __('Unauthorized Action'));
            }

            $customer->update($request->validated());
            return back()->with(['message' => 'Customer updated successfully', 'data' => $customer]);
        } catch (\Throwable $e) {
            return back()->with(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Customer $customer): Response|RedirectResponse
    {
        try {
            if (!Gate::allows('delete', $customer)) {
                abort(403, __('Unauthorized Action'));
            }


            $customer->delete();
            return back()->with(['message' => 'Customer deleted successfully']);
        } catch (\Throwable $e) {
            return back()->with(['error' => $e->getMessage()], 500);
        }
    }
}
