<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        if (!Gate::allows('viewAny', User::class)) {
            abort(403, __('Unauthorized Action'));
        }

        $today = now()->toDateString();

        // all staff
        $totalStaff = DB::table('users')
            ->where('role', 'staff')
            ->count();

        // active staff = handled something today
        $activeStaff = DB::table('garmet_handling_logs')
            ->whereDate('scanned_at', $today)
            ->distinct('handled_by_user_id')
            ->count('handled_by_user_id');

        // top performers = most items handled last 30 days
        $topPerformers = DB::table('garmet_handling_logs')
            ->join('users', 'users.id', '=', 'garmet_handling_logs.handled_by_user_id')
            ->select('users.id', 'users.name', DB::raw('COUNT(garmet_handling_logs.id) as handled_count'))
            ->whereDate('garmet_handling_logs.scanned_at', '>=', now()->subDays(30))
            ->groupBy('users.id', 'users.name')
            ->orderBy('handled_count', 'desc')
            ->limit(10)
            ->get();

        // average orders processed per staff (last 30 days)
        $totalHandledLast30 = DB::table('garmet_handling_logs')
            ->whereDate('scanned_at', '>=', now()->subDays(30))
            ->count();

        $avgHandled = $totalStaff > 0 ? $totalHandledLast30 / $totalStaff : 0;

        return Inertia::render('/index', [
            'total_staff' => $totalStaff,
            'active_staff' => $activeStaff,
            'top_performance_staff' => $topPerformers,
            'average_orders_processed' => round($avgHandled, 2),
            'success' => true,
            'data' => User::all()
        ]);
    }

    public function store(StoreUserRequest $request)
    {
        try {
            if (!Gate::allows('create', User::class)) {
                abort(403, __('Unauthorized Action'));
            }

            $data = $request->validated();
            $data['password'] = Hash::make($data['password']);

            $user = User::create($data);

            return response()->json([
                'success' => true,
                'message' => 'User created successfully',
                'data' => $user
            ], 201);
        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => 'Error creating user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(UpdateUserRequest $request, $id)
    {
        try {
            $user = User::findOrFail($id);

            if (!Gate::allows('update', $user)) {
                return back()->with('error', __('You do not have the right permissions'));
            }

            $data = $request->validated();

            if (!empty($data['password'])) {
                $data['password'] = Hash::make($data['password']);
            } else {
                unset($data['password']);
            }

            $user->update($data);

            return response()->json([
                'success' => true,
                'message' => 'User updated successfully',
                'data' => $user
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);

            if (!Gate::allows('delete', $user)) {
                return back()->with('error', __('You do not have the right permissions'));
            }

            $user->delete();

            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully'
            ]);
        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => 'Error deleting user',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
