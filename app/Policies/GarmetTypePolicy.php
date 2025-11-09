<?php

namespace App\Policies;

use App\Models\GarmetType;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class GarmetTypePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->hasPermission('garmet_types.read');
    }

    public function view(User $user, GarmetType $garmetType): bool
    {
        return $user->isAdmin() || $user->hasPermission('garmet_types.read');
    }

    public function create(User $user): bool
    {
        return $user->isAdmin() || $user->hasPermission('garmet_types.create');
    }

    public function update(User $user, GarmetType $garmetType): bool
    {
        return $user->isAdmin() || $user->hasPermission('garmet_types.update');
    }

    public function delete(User $user, GarmetType $garmetType): bool
    {
        return $user->isAdmin() || $user->hasPermission('garmet_types.delete');
    }

    public function restore(User $user, GarmetType $garmetType): bool
    {
        return $user->isAdmin() || $user->hasPermission('garmet_types.update');
    }

    public function forceDelete(User $user, GarmetType $garmetType): bool
    {
        return $user->isAdmin() || $user->hasPermission('garmet_types.delete');
    }
}
