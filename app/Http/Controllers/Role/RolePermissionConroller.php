<?php

namespace App\Http\Controllers\Role;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Gate;

class RolePermissionController extends Controller
{

    /**
     * show all roles
     */

    public function allRoles(Request $request): Response|RedirectResponse
    {
        try {
            if (!Gate::allows('create', Role::class)) {
                return back()->with('error', __('You do not have the right permissions'));
            }

            $query = Role::withCount(['users', 'permissions']);

            if ($request->filled('search')) {
                $search = $request->input('search');
                $query->where('name', 'like', "%{$search}%");
            }

            $sort = $request->input('sort', 'created_at:desc');
            [$sortField, $sortDirection] = array_pad(explode(':', $sort), 2, 'desc');

            $allowedSorts = ['created_at', 'name'];
            if (!in_array($sortField, $allowedSorts)) {
                $sortField = 'created_at';
            }
            $sortDirection = strtolower($sortDirection) === 'asc' ? 'asc' : 'desc';
            $query->orderBy($sortField, $sortDirection);


            $pageSize = $request->input('pageSize', 10);
            $roles = $query->paginate($pageSize)->withQueryString();

            return Inertia::render('admin/roles/index', [
                'roles' => $roles,
                'pageSize' => $roles->perPage(),
                'filters' => $request->only(['search', 'sort']),
            ]);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => __('Failed to fetch roles: ') . $e->getMessage()]);
        }
    }


    /**
     * show create role page
     */
    public function showCreateRolePage(): Response|RedirectResponse
    {
        try {
            if (!Gate::allows('create', Role::class)) {
                return back()->with('error', __('You do not have the right permissions'));
            }

            return Inertia::render('admin/roles/create');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => __('Failed to fetch create role page') . $e->getMessage()]);
        }
    }

    /**
     * Create a new role.
     */
    public function createRole(Request $request): RedirectResponse
    {
        try {

            if (!Gate::allows('create', Role::class)) {
                return back()->with('error', __('You do not have the right permissions'));
            }

            $data = $request->validate([
                'name' => 'required|string|unique:roles,name|max:255',
                'description' => 'required|string|max:255',
            ]);

            Role::create($data);
            return redirect()->back()->with('success', __('Role created successfully'));
        } catch (\Exception $e) {
            return back()->withErrors(['error' => __('Failed to create a Role') . $e->getMessage()]);
        }
    }

    /**
     * Show a role.
     */
    public function showRoleUsers($roleId): Response|RedirectResponse
    {
        try {
            $role = Role::findOrFail($roleId);

            if (!Gate::allows('create', $role)) {
                return back()->with('error', __('You do not have the right permissions'));
            }

            $users = $role->users()->select('id', 'name', 'email')->get();

            return Inertia::render('admin/roles/users', [
                'role' => $role,
                'users' => $users,
            ]);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => __('Failed to show selected role') . $e->getMessage()]);
        }
    }

    /**
     * Edit a role
     */
    public function edit(Role $role)
    {

        if (!Gate::allows('update', $role)) {
            return back()->with('error', __('You do not have permission to edit this role'));
        }


        try {

            $permissions = Permission::all()->map(function ($permission) {
                return [
                    'id' => $permission->id,
                    'name' => $permission->name,
                    'description' => $permission->description,
                ];
            });

            return Inertia::render('admin/roles/edit', [
                'role' => $role->load('permissions'),
                'permissions' => $permissions,
            ]);
        } catch (\Exception $e) {
            return back()->with('error', __('Failed to fetch role view') . $e->getMessage());
        }
    }

    /**
     * Update a role
     */
    public function update(Request $request, Role $role)
    {

        if (!Gate::allows('update', $role)) {
            return back()->with('error', __('You do not have permission to edit this role'));
        }

        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
                'permissions' => 'required|array',
                'permissions.*' => 'exists:permissions,id',
            ]);

            $role->update([
                'name' => $validated['name'],
            ]);

            $role->permissions()->sync($validated['permissions']);

            return redirect()->route('admin.roles.index')
                ->with('success', __('Role updated successfully'));
        } catch (\Exception $e) {
            return back()->with('error', __('Failed to update role') . $e->getMessage());
        }
    }

    /**
     * show all Permissions
     */
    public function allPermissions(Request $request): Response|RedirectResponse
    {
        try {
            $pageSize = $request->input('pageSize', 10);

            if (!Gate::allows('create', Permission::class)) {
                return back()->with('error', __('You do not have the right permissions'));
            }

            $query = Permission::query();

            if ($request->filled('search')) {
                $search = $request->input('search');
                $query->where('name', 'like', "%{$search}%");
            }


            $sort = $request->input('sort', 'created_at:desc');
            [$sortField, $sortDirection] = array_pad(explode(':', $sort), 2, 'desc');

            $allowedSorts = ['created_at', 'name'];
            if (!in_array($sortField, $allowedSorts)) {
                $sortField = 'created_at';
            }
            $sortDirection = strtolower($sortDirection) === 'asc' ? 'asc' : 'desc';
            $query->orderBy($sortField, $sortDirection);


            $permissions = $query->paginate($pageSize)->withQueryString();

            return Inertia::render('admin/permissions/index', [
                'permissions' => $permissions,
                'pageSize' => $permissions->perPage(),
                'filters' => $request->only(['search', 'sort']),
            ]);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => __('Failed to fetch permissions: ') . $e->getMessage()]);
        }
    }

    /**
     * show create Permission page
     */
    public function showCreatePermissionPage(): Response|RedirectResponse
    {
        try {
            if (!Gate::allows('create', Permission::class)) {
                return back()->with('error', __('You do not have the right permissions'));
            }
            return Inertia::render('admin/permissions/create');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => __('Failed to fetch create permission page') . $e->getMessage()]);
        }
    }

    /**
     * Create a new permission.
     */
    public function createPermission(Request $request): RedirectResponse
    {
        try {
            $data = $request->validate([
                'name' => 'required|string|unique:permissions,name|max:255',
                'description' => 'required|string|max:255',
            ]);

            if (!Gate::allows('create', Permission::class)) {
                return back()->with('error', __('You do not have the right permissions'));
            }

            Permission::create($data);
            return redirect()->back()->with('success', __('Permission created successfully'));
        } catch (\Exception $e) {
            return back()->withErrors(['error' => __('Failed to create a permission') . $e->getMessage()]);
        }
    }

    public function showPermission($permissionId): Response|RedirectResponse
    {
        $permission = Permission::findOrFail($permissionId);
        try {
            if (!Gate::allows('create', $permission)) {
                return back()->with('error', __('You do not have the right permissions'));
            }
            return Inertia::render('admin/permissions/show');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => __('Failed to show selected permission') . $e->getMessage()]);
        }
    }

    public function showPermissionUsers($permissionId): Response|RedirectResponse
    {
        try {
            $permission = Permission::findOrFail($permissionId);

            if (!Gate::allows('create', $permission)) {
                return back()->with('error', __('You do not have the right permissions'));
            }

            $users = $permission->users()->select('id', 'name', 'email')->get();

            return Inertia::render('admin/permissions/users', [
                'permission' => $permission,
                'users' => $users,
            ]);
        } catch (\Exception $e) {
            return back()->with('error', __('Failed to show selected role') . $e->getMessage());
        }
    }

    /** 
     * Edit a permission
     */
    public function editPermission(Permission $permission)
    {

        if (!Gate::allows('update', $permission)) {
            return back()->with('error', __('You do not have the right permissions'));
        }

        return Inertia::render('admin/permissions/edit', [
            'permission' => [
                'id' => $permission->id,
                'name' => $permission->name,
                'description' => $permission->description,
            ]
        ]);
    }

    /** 
     * Update a permission
     */
    public function updatePermission(Request $request, Permission $permission)
    {

        try {
            if (!Gate::allows('removePermission', Permission::class)) {
                return back()->with('error', __('You do not have the right permissions'));
            }

            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:permissions,name,' . $permission->id,
                'description' => 'nullable|string|max:1000',
            ]);

            $permission->update($validated);

            return redirect()->route('permissions.index')->with('success', __('Permission updated successfully.'));
        } catch (\Exception $e) {
            return back()->with('error', __('Failed to update permission') . $e->getMessage());
        }
    }


    /**
     * Attach a permission to a role.
     */
    public function attachPermissionToRole(Request $request): RedirectResponse
    {
        try {
            if (!Gate::allows('attachPermission', Role::class)) {
                return back()->with('error', __('You do not have the right permissions'));
            }


            $data = $request->validate([
                'role_id' => 'required|exists:roles,id',
                'permission_id' => 'required|exists:permissions,id',
            ]);

            $role = Role::findOrFail($data['role_id']);
            $permission = Permission::findOrFail($data['permission_id']);


            $role->permissions()->attach($permission);
            return redirect()->back()->with('success', __('Permission attached to role successfully'));
        } catch (\Exception $e) {
            return back()->withErrors(['error' => __('Failed to attach permission to a role') . $e->getMessage()]);
        }
    }

    /**
     * Detach a permission from a role.
     */
    public function detachPermissionFromRole(Request $request): RedirectResponse
    {
        try {
            if (!Gate::allows('detachPermission', Role::class)) {
                return back()->with('error', __('You do not have the right permissions'));
            }

            $data = $request->validate([
                'role_id' => 'required|exists:roles,id',
                'permission_id' => 'required|exists:permissions,id',
            ]);

            $role = Role::findOrFail($data['role_id']);
            $permission = Permission::findOrFail($data['permission_id']);

            $role->permissions()->detach($permission);
            return redirect()->back()->with('success', __('Permission detached from role successfully'));
        } catch (\Exception $e) {
            return back()->withErrors(['error' => __('Failed to detach permission from a role') . $e->getMessage()]);
        }
    }

    /**
     * Delete a role.
     */
    public function deleteRole($roleId): RedirectResponse
    {
        try {
            if (!Gate::allows('delete', Role::class)) {
                return back()->with('error', __('You do not have the right permissions'));
            }

            $role = Role::findOrFail($roleId);

            $role->delete();

            return redirect()->back()->with('success', __('Role deleted successfully'));
        } catch (\Exception $e) {
            return back()->withErrors(['error' => __('Failed to delete a role') . $e->getMessage()]);
        }
    }

    /**
     * Delete a permission.
     */
    public function deletePermission($permissionId): RedirectResponse
    {
        try {
            if (!Gate::allows('delete', Permission::class)) {
                return back()->with('error', __('You do not have the right permissions'));
            }

            $permission = Permission::findOrFail($permissionId);

            $permission->delete();

            return redirect()->back()->with('success', __('Permission deleted successfully'));
        } catch (\Exception $e) {
            return back()->withErrors(['error' => __('Failed to delete permission') . $e->getMessage()]);
        }
    }

    /**
     * Attach a role to a user.
     */
    public function attachRoleToUser(Request $request): RedirectResponse
    {
        try {
            if (!Gate::allows('assignRoles', User::class)) {
                return back()->with('error', __('You do not have the right permissions'));
            }

            $data = $request->validate([
                'user_id' => 'required|exists:users,id',
                'role_id' => 'required|exists:roles,id',
            ]);

            $user = User::findOrFail($data['user_id']);
            $role = Role::findOrFail($data['role_id']);

            $user->roles()->attach($role);
            return redirect()->back()->with('success', __('Role attached to user successfully'));
        } catch (\Exception $e) {
            return back()->with('error', __('Failed to attach role to user') . $e->getMessage());
        }
    }

    /**
     * Detach a role from a user.
     */
    public function detachRoleFromUser(Request $request): RedirectResponse
    {
        try {
            if (!Gate::allows('removeRoles', User::class)) {
                return back()->with('error', __('You do not have the right permissions'));
            }


            $data = $request->validate([
                'user_id' => 'required|exists:users,id',
                'role_id' => 'required|exists:roles,id',
            ]);

            $user = User::findOrFail($data['user_id']);
            $role = Role::findOrFail($data['role_id']);

            $user->roles()->detach($role);
            return redirect()->back()->with('success', __('Role detached from user successfully'));
        } catch (\Exception $e) {
            return back()->withErrors(['error' => __('Failed to detach role from user') . $e->getMessage()]);
        }
    }

    /**
     * Attach a permission directly to a user.
     */
    public function attachPermissionToUser(Request $request): RedirectResponse
    {
        try {
            if (!Gate::allows('assignPermission', Permission::class)) {
                return back()->with('error', __('You do not have the right permissions'));
            }

            $data = $request->validate([
                'user_id' => 'required|exists:users,id',
                'permission_id' => 'required|exists:permissions,id',
            ]);

            $user = User::findOrFail($data['user_id']);
            $permission = Permission::findOrFail($data['permission_id']);

            $user->directPermissions()->attach($permission);

            return back()->with('success', __('Permission attached to user successfully'));
        } catch (\Exception $e) {
            return back()->withErrors(['error' => __('Failed to attach permission to user: ') . $e->getMessage()]);
        }
    }

    public function detachPermissionFromUser(Request $request): RedirectResponse
    {
        try {
            if (!Gate::allows('removePermission', Permission::class)) {
                return back()->with('error', __('You do not have the right permissions'));
            }

            $data = $request->validate([
                'user_id' => 'required|exists:users,id',
                'permission_id' => 'required|exists:permissions,id',
            ]);

            $user = User::findOrFail($data['user_id']);
            $permission = Permission::findOrFail($data['permission_id']);

            $user->directPermissions()->detach($permission);

            return back()->with('success', __('Permission detached from user successfully'));
        } catch (\Exception $e) {
            return back()->withErrors(['error' => __('Failed to detach permission from user: ') . $e->getMessage()]);
        }
    }
}
