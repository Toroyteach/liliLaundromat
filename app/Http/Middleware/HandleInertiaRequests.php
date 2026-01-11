<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();


        // Fetch user permissions based on their roles directly
        $permissions = [];
        if ($user) {
            $permissions = DB::table('permissions')
                ->join('role_permission', 'permissions.id', '=', 'role_permission.permission_id')
                ->join('user_role', 'role_permission.role_id', '=', 'user_role.role_id')
                ->where('user_role.user_id', $user->id)
                ->pluck('permissions.name')
                ->unique()
                ->values()
                ->toArray();
        }

        return array_merge(parent::share($request), [
            'app_name' => config('app.name'),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'status' => $user->status,
                    'role' => $user->role, // PRIMARY ROLE
                    'profile_photo_path' => $user->profile_photo_path,
                ] : null,
                'permissions' => $permissions,
                'primaryRole' => $user ? $user->role : '',
            ],
            'flash' => [
                'order_id' => $request->session()->get('order_id'),
                'success'  => $request->session()->get('success'),
                'error'    => $request->session()->get('error'),
            ],
        ]);
    }
}
