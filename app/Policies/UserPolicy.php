<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\Response;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        if ($user->isAdmin()) return true;
        return $user->hasPermission('users.read');
    }

    public function view(User $user, User $payment): bool
    {
        if ($user->isAdmin()) return true;
        return $user->hasPermission('users.read');
    }

    public function create(User $user): bool
    {
        if ($user->isAdmin()) return true;
        return $user->hasPermission('users.create');
    }

    public function update(User $user, User $payment): bool
    {
        if ($user->isAdmin()) return true;
        return $user->hasPermission('users.update');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, User $model): bool
    {
        return true;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, User $model): bool
    {
        return true;
    }
}
