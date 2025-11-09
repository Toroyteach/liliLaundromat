<?php

namespace App\Policies;

use App\Models\Permission;
use App\Models\User;

class PermissionPolicy
{
    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermission('permissions.create');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function update(User $user): bool
    {
        return $user->hasPermission('permissions.update');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user): bool
    {
        return $user->hasPermission('permissions.delete');
    }

    /**
     * Determine if the user can assign roles to a user.
     *
     * @param  \App\Models\Permission $permission
     * @return bool
     */
    public function assignPermission(User $user): bool
    {
        return $user->hasPermission('permissions.attach_permission');
    }

    /**
     * Determine if the user can remove roles from a user.
     *
     * @param  \App\Models\User  $user
     * @return bool
     */
    public function removePermission(User $user): bool
    {
        return $user->hasPermission('permissions.detach_permission');
    }
}
