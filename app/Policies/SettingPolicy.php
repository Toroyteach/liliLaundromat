<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class SettingPolicy
{
    use HandlesAuthorization;
    /**
     * Determine if the user can view any settings.
     *
     * @param  \App\Models\User  $user
     * @return bool
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('settings.read');
    }

    /**
     * Determine if the user can create settings.
     *
     * @param  \App\Models\User  $user
     * @return bool
     */
    public function create(User $user): bool
    {
        return $user->hasPermission('settings.create');
    }

    /**
     * Determine if the user can update a specific user.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\User  $model
     * @return bool
     */
    public function update(User $user): bool
    {
        return $user->hasPermission('settings.update');
    }

    /**
     * Determine if the user can delete a specific user.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\User  $model
     * @return bool
     */
    public function delete(User $user): bool
    {
        return $user->hasPermission('settings.delete');
    }
}
