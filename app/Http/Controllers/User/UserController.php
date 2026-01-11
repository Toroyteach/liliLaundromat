<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\Role;
use Illuminate\Http\Request;
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

        $staff = User::with('roles')
            ->select('id', 'name', 'email', 'phone', 'is_active', 'created_at')
            ->get()
            ->map(fn($u) => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'phone' => $u->phone,
                'role' => $u->roles->first()?->name ?? null, // get role names as array
                'status' => $u->is_active ? 'active' : 'inactive',
                'joinDate' => $u->created_at->toDateString(),
            ]);

        return Inertia::render('staff/page', [
            'stats' => [
                'total_staff' => $totalStaff,
                'active_staff' => $activeStaff,
                'average_orders_processed' => round($avgHandled, 2),
                'top_performance_staff' => $topPerformers,
            ],
            'staff' => $staff,
        ]);
    }

    public function store(Request $request)
    {
        try {
            if (!Gate::allows('create', User::class)) {
                abort(403, __('Unauthorized Action'));
            }

            $data = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'phone' => 'required|string|max:20',
                'role' => 'required|in:staff,cashier,admin',
                'status' => 'required|in:active,inactive',
                'password' => 'required|string|min:6', // password_confirmation expected
            ]);

            $data['is_active'] = $data['status'] === 'active';

            if (!empty($data['password'])) {
                $data['password'] = Hash::make($data['password']);
            } else {
                unset($data['password']);
            }

            $user = User::create($data);

            $role = Role::where('name', $data['role'])->first();
            if ($role) {
                $user->roles()->sync([$role->id]); // detach old, attach new
            }

            return back()->with([
                'success' => true,
                'message' => 'User created successfully',
                'data' => $user
            ], 201);
        } catch (\Exception $e) {

            return back()->with([
                'success' => false,
                'message' => 'Error creating user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);

            if (!Gate::allows('update', $user)) {
                return back()->with('error', __('You do not have the right permissions'));
            }

            $data = $request->validate([
                'name' => 'required|string|max:255',
                'email' => "required|email|unique:users,email,$id",
                'phone' => 'required|string|max:20',
                'role' => 'required|in:staff,cashier,admin',
                'status' => 'required|in:active,inactive',
                'password' => 'nullable|string|min:6',
            ]);

            $data['is_active'] = $data['status'] === 'active';

            if (!empty($data['password'])) {
                $data['password'] = Hash::make($data['password']);
            } else {
                unset($data['password']);
            }

            $user->update($data);

            // Sync role in roles table
            $role = Role::where('name', $data['role'])->first();
            if ($role) {
                $user->roles()->sync([$role->id]); // detach old, attach new
            }

            return back()->with([
                'success' => true,
                'message' => 'User updated successfully',
                'data' => $user
            ], 200);
        } catch (\Exception $e) {
            return back()->with([
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

            return back()->with([
                'success' => false,
                'message' => 'Error deleting user',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
