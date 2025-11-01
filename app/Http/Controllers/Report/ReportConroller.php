<?php

namespace App\Http\Controllers\Report;

use App\Http\Controllers\Controller;
use App\Services\AuditLogService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Throwable;

class ReportsController extends Controller
{
    /**
     * get general report for a model by date range
     */
    public function generateReport(Request $request)
    {
        try {
            $modelName = $request->input('model'); // eg: "customers"
            $startDate = $request->input('start_date') ? Carbon::parse($request->start_date) : now()->subDays(7);
            $endDate   = $request->input('end_date')   ? Carbon::parse($request->end_date)   : now();

            $modelClass = "\\App\\Models\\" . ucfirst($modelName);

            if (!class_exists($modelClass)) {
                return response()->json(['status' => false, 'message' => "Model not found"], 404);
            }

            $records = $modelClass::whereBetween('created_at', [$startDate, $endDate])->get();

            return response()->json([
                'status' => true,
                'message' => 'Report loaded',
                'data' => $records,
            ], 200);

        } catch (Throwable $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * export report csv/pdf/excel
     */
    public function export(Request $request)
    {
        try {
            $modelName = $request->input('model');
            $format    = $request->input('format', 'csv'); // csv | pdf | excel
            $startDate = $request->input('start_date') ? Carbon::parse($request->start_date) : now()->subDays(7);
            $endDate   = $request->input('end_date')   ? Carbon::parse($request->end_date)   : now();

            $modelClass = "\\App\\Models\\" . ucfirst($modelName);

            if (!class_exists($modelClass)) {
                return response()->json(['status' => false, 'message' => "Model not found"], 404);
            }

            $records = $modelClass::whereBetween('created_at', [$startDate, $endDate])->get()->toArray();

            if (empty($records)) {
                return response()->json(['status' => false, 'message' => "No data found"], 404);
            }

            // here we can plug export library (maatwebsite/excel)
            // but skeleton only:
            return response()->json([
                'status' => true,
                'message' => "export ready",
                'data' => $records,
            ]);

        } catch (Throwable $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * get audit logs for a model or user
     */
    public function auditLogs(Request $request)
    {
        try {
            $modelName = $request->input('model');
            $recordId  = $request->input('record_id');

            if (!$modelName || !$recordId) {
                return response()->json(['status' => false, 'message' => "Model & record_id required"], 422);
            }

            $modelClass = "\\App\\Models\\" . ucfirst($modelName);

            if (!class_exists($modelClass)) {
                return response()->json(['status' => false, 'message' => "Model not found"], 404);
            }

            $record = $modelClass::find($recordId);

            if (!$record) {
                return response()->json(['status' => false, 'message' => "Record not found"], 404);
            }

            $logs = AuditLogService::generateLogs($record);

            return response()->json([
                'status' => true,
                'message' => 'Audit logs loaded',
                'data' => $logs
            ], 200);

        } catch (Throwable $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }


    /**
     * bulk upload preview
     * show dataset before final commit
     */
    public function bulkUploadPreview(Request $request)
    {
        try {
            $file = $request->file('file');

            $data = []; // read excel → convert to array using maatwebsite/excel

            return response()->json([
                'status' => true,
                'message' => "Preview generated",
                'data' => $data,
            ]);

        } catch (Throwable $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * final commit bulk upload
     */
    public function bulkUploadCommit(Request $request)
    {
        try {
            DB::beginTransaction();

            $records = $request->input('records', []);

            foreach ($records as $row) {
                // insert into proper model
            }

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => "Bulk upload complete",
            ]);

        } catch (Throwable $e) {
            DB::rollBack();
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }
}