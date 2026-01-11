<?php

namespace App\Http\Controllers\Report;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\AuditLogService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\RedirectResponse;
use Throwable;
use Inertia\Inertia;
use Inertia\Response;

class ReportsController extends Controller
{
    public function index(): Response|RedirectResponse
    {
        try {
            $models = [
                new Order(),
            ];

            $auditTrailData = collect($models)
                ->flatMap(fn($model) => AuditLogService::generateLogs($model))
                ->sortByDesc('created_at')
                ->values()
                ->map(fn($log) => [
                    'id' => $log['id'],
                    'user' => $log['user'],
                    'action' => $log['action'],
                    'timestamp' => $log['created_at']->toISOString(),
                    'changes' => $log['changes'],
                ]);

            return Inertia::render('reports/page', [
                'auditTrailData' => $auditTrailData,
            ]);
        } catch (\Throwable $e) {
            return back()->with(['error' => $e->getMessage()], 500);
        }
    }

    public function bulkUpload(Request $request)
    {
        $data = $request->validate([
            'type' => 'required|in:users,orders,customers',
            'rows' => 'required|array|min:1',
            'rows.*' => 'array',
        ]);

        DB::transaction(function () use ($data, $request) {
            match ($data['type']) {
                'orders' => $this->insertOrders($data['rows']),
            };
        });

        return back()->with('success', 'Bulk upload completed');
    }

    private function insertOrders(array $rows)
    {
        foreach ($rows as $row) {
            Order::create([
                'order_id' => $row['OrderID'] ?? null,
                'customer_name' => $row['CustomerName'] ?? 'n/a',
                'amount' => $row['Amount'] ?? 0,
                'status' => $row['Status'] ?? 'pending',
            ]);
        }
    }

    /**
     * get general report for a model by date range
     */
    public function generateReport(Request $request): Response|RedirectResponse
    {
        try {
            $modelName = $request->input('model'); // eg: "customers"
            $startDate = $request->input('start_date') ? Carbon::parse($request->start_date) : now()->subDays(7);
            $endDate   = $request->input('end_date')   ? Carbon::parse($request->end_date)   : now();

            $modelClass = "\\App\\Models\\" . ucfirst($modelName);

            if (!class_exists($modelClass)) {
                return back()->with(['status' => false, 'message' => "Model not found"], 404);
            }

            $records = $modelClass::whereBetween('created_at', [$startDate, $endDate])->get();

            return Inertia::render('/index', [
                'status' => true,
                'message' => 'Report loaded',
                'data' => $records,
            ], 200);
        } catch (Throwable $e) {
            return back()->with(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * export report csv/pdf/excel
     */
    public function export(Request $request): Response|RedirectResponse
    {
        try {
            $modelName = $request->input('model');
            $format    = $request->input('format', 'csv'); // csv | pdf | excel
            $startDate = $request->input('start_date') ? Carbon::parse($request->start_date) : now()->subDays(7);
            $endDate   = $request->input('end_date')   ? Carbon::parse($request->end_date)   : now();

            $modelClass = "\\App\\Models\\" . ucfirst($modelName);

            if (!class_exists($modelClass)) {
                return back()->with(['status' => false, 'message' => "Model not found"], 404);
            }

            $records = $modelClass::whereBetween('created_at', [$startDate, $endDate])->get()->toArray();

            if (empty($records)) {
                return back()->with(['status' => false, 'message' => "No data found"], 404);
            }

            // here we can plug export library (maatwebsite/excel)
            // but skeleton only:
            return Inertia::render('/index', [
                'status' => true,
                'message' => "export ready",
                'data' => $records,
            ]);
        } catch (Throwable $e) {
            return back()->with(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * get audit logs for a model or user
     */
    public function auditLogs(Request $request): Response|RedirectResponse
    {
        try {
            $modelName = $request->input('model');
            $recordId  = $request->input('record_id');

            if (!$modelName || !$recordId) {
                return back()->with(['status' => false, 'message' => "Model & record_id required"], 422);
            }

            $modelClass = "\\App\\Models\\" . ucfirst($modelName);

            if (!class_exists($modelClass)) {
                return back()->with(['status' => false, 'message' => "Model not found"], 404);
            }

            $record = $modelClass::find($recordId);

            if (!$record) {
                return back()->with(['status' => false, 'message' => "Record not found"], 404);
            }

            $logs = AuditLogService::generateLogs($record);

            return back()->with([
                'status' => true,
                'message' => 'Audit logs loaded',
                'data' => $logs
            ], 200);
        } catch (Throwable $e) {
            return back()->with(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }


    /**
     * bulk upload preview
     * show dataset before final commit
     */
    public function bulkUploadPreview(Request $request): Response|RedirectResponse
    {
        try {
            $file = $request->file('file');

            $data = []; // read excel → convert to array using maatwebsite/excel

            return back()->with([
                'status' => true,
                'message' => "Preview generated",
                'data' => $data,
            ]);
        } catch (Throwable $e) {
            return back()->with(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * final commit bulk upload
     */
    public function bulkUploadCommit(Request $request): Response|RedirectResponse
    {
        try {
            DB::beginTransaction();

            $records = $request->input('records', []);

            foreach ($records as $row) {
                // insert into proper model
            }

            DB::commit();

            return back()->with([
                'status' => true,
                'message' => "Bulk upload complete",
            ]);
        } catch (Throwable $e) {
            DB::rollBack();
            return back()->with(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
