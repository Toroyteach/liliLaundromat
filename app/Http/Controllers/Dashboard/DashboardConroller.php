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

        // payment methods breakdown
        $paymentMethods = DB::table('payments')
            ->select('method', DB::raw('SUM(amount) as total'))
            ->where('status', 'success')
            ->groupBy('method')
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

        return Inertia::render('dashboard/index', [
            'total_revenue_today'   => $totalRevenueToday,
            'total_orders_today'    => $totalOrdersToday,
            'completed_orders'      => $completedOrders,
            'pending_invoices'      => $pendingInvoices,
            'lost_damaged_items'    => $lostDamagedItems,
            'new_customers_today'   => $newCustomersToday,
            'total_customers'       => $totalCustomers,
            'weekly_revenue'        => $weeklyRevenue,
            'payment_methods'       => $paymentMethods,
            'recent_orders'         => $recentOrders,
            'lost_items_list'       => $lostItemsList,
            'top_customers'         => $topCustomers,
        ]);
    }
}
