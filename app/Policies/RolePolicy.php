<?php

namespace App\Policies;

use App\Models\Role;
use App\Models\User;

class RolePolicy
{
    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermission('roles.create');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user): bool
    {
        return $user->hasPermission('roles.update');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user): bool
    {
        return $user->hasPermission('roles.delete');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function attachPermission(User $user): bool
    {
        return $user->hasPermission('roles.attach_permission');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function detachPermission(User $user): bool
    {
        return $user->hasPermission('roles.detach_permission');
    }
}
