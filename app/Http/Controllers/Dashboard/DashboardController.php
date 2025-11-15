<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $today = Carbon::today();

        $totalRevenueToday = DB::table('payments')
            ->whereDate('paid_at', $today)
            ->where('status', 'success')
            ->sum('amount');

        $totalOrdersToday = DB::table('orders')
            ->whereDate('created_at', $today)
            ->count();

        $completedOrders = DB::table('orders')
            ->where('status', 'completed')
            ->count();

        $pendingInvoices = DB::table('invoices')
            ->where('sent_to_customer', false)
            ->count();

        $lostDamagedItems = DB::table('garmet_handling_logs')
            ->whereIn('stage', ['lost', 'damaged'])
            ->count();

        $newCustomersToday = DB::table('customers')
            ->whereDate('created_at', $today)
            ->count();

        $totalCustomers = DB::table('customers')->count();

        // weekly revenue actual last 7 days
        $weeklyRevenue = DB::table('payments')
            ->select(DB::raw('DATE(paid_at) as day'), DB::raw('SUM(amount) as total'))
            ->where('status', 'success')
            ->whereDate('paid_at', '>=', $today->copy()->subDays(7))
            ->groupBy('day')
            ->orderBy('day')
            ->get();

        $recentOrders = DB::table('orders')
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get();

        $lostItemsList = DB::table('garmet_handling_logs')
            ->where('stage', 'lost')
            ->orderBy('scanned_at', 'desc')
            ->limit(20)
            ->get();

        $topCustomers = DB::table('payments')
            ->join('customers', 'payments.customer_id', '=', 'customers.id')
            ->select('customers.id', 'customers.name', 'customers.phone', DB::raw('SUM(payments.amount) as total_spent'))
            ->where('payments.status', 'success')
            ->groupBy('customers.id', 'customers.name', 'customers.phone')
            ->orderBy('total_spent', 'desc')
            ->limit(10)
            ->get();

        // WEEKLY REVENUE (ADD day_label)
        $weeklyRevenue = DB::table('payments')
            ->select(
                DB::raw('DATE(paid_at) as day'),
                DB::raw('SUM(amount) as total'),
                DB::raw('DATE_FORMAT(paid_at, "%a") as day_label')
            )
            ->where('status', 'success')
            ->whereDate('paid_at', '>=', $today->copy()->subDays(7))
            ->groupBy('day', DB::raw('DATE_FORMAT(paid_at, "%a")'))
            ->orderBy('day')
            ->get();

        // RECENT ORDERS (ADD customer name, total price)
        $recentOrders = DB::table('orders')
            ->join('customers', 'orders.customer_id', '=', 'customers.id')
            ->select(
                'orders.*',
                'customers.name as customer_name',
                DB::raw('(select sum(total_price) from order_items where order_id = orders.id) as total_price')
            )
            ->orderBy('orders.created_at', 'desc')
            ->limit(20)
            ->get();

        // dd($recentOrders);


        // INVOICES
        $outstandingInvoices = DB::table('invoices')
            ->join('customers', 'invoices.customer_id', '=', 'customers.id')
            ->select(
                'invoices.*',
                'customers.name as customer_name'
            )
            ->where('sent_to_customer', false)
            ->get();


        // RECENT PAYMENTS
        $recentPayments = DB::table('payments')
            ->orderBy('paid_at', 'desc')
            ->limit(20)
            ->get();

        // LOST ITEMS
        $lostItemsList = DB::table('garmet_handling_logs')
            ->join('users', 'garmet_handling_logs.handled_by_user_id', '=', 'users.id')
            ->select(
                'garmet_handling_logs.*',
                'users.name as staff_name'
            )
            ->where('stage', 'lost')
            ->orderBy('scanned_at', 'desc')
            ->limit(20)
            ->get();

        // TOP CUSTOMERS (Add orders + percentage)
        $totalRevenue = DB::table('payments')
            ->where('status', 'success')
            ->sum('amount');

        $topCustomers = DB::table('payments')
            ->join('customers', 'payments.customer_id', '=', 'customers.id')
            ->select(
                'customers.id',
                'customers.name',
                DB::raw('COUNT(payments.id) as order_count'),
                DB::raw('SUM(payments.amount) as total_spent'),
                DB::raw('(SUM(payments.amount) / ' . $totalRevenue . ') * 100 as percentage')
            )
            ->where('payments.status', 'success')
            ->groupBy('customers.id', 'customers.name')
            ->orderBy('total_spent', 'desc')
            ->limit(10)
            ->get();

        return Inertia::render('dashboard/page', [
            'total_revenue_today' => $totalRevenueToday,
            'total_orders_today' => $totalOrdersToday,
            'completed_orders' => $completedOrders,
            'pending_invoices' => $pendingInvoices,
            'lost_damaged_items' => $lostDamagedItems,
            'new_customers_today' => $newCustomersToday,
            'total_customers' => $totalCustomers,
            'weekly_revenue' => $weeklyRevenue,
            'payment_methods' => $this->getScaledPaymentMethodsBreakdown(),
            'recent_orders' => $recentOrders,
            'outstanding_invoices' => $outstandingInvoices,
            'recent_payments' => $recentPayments,
            'lost_items_list' => $lostItemsList,
            'top_customers' => $topCustomers,
        ]);
    }

    protected function getScaledPaymentMethodsBreakdown()
    {
        // 1. Calculate the Grand Total of all successful payments
        $grandTotal = DB::table('payments')
            ->where('status', 'success')
            ->sum('amount');

        $paymentMethods = DB::table('payments')
            ->select('method', DB::raw('SUM(amount) as total'))
            ->where('status', 'success')
            ->groupBy('method')
            ->get();

        $scaledMethods = $paymentMethods->map(function ($method) use ($grandTotal) {
            $scaledValue = 0;

            if ($grandTotal > 0) {
                $scaledValue = ($method->total / $grandTotal) * 1000;
            }

            return [
                'method' => $method->method,
                'value' => round($scaledValue, 0)
            ];
        });

        return $scaledMethods;
    }
}
