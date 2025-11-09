<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class OrderPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->hasPermission('orders.read');
    }

    public function view(User $user, Order $order): bool
    {
        return $user->isAdmin() || $user->hasPermission('orders.read');
    }

    public function create(User $user): bool
    {
        return $user->isAdmin() || $user->hasPermission('orders.create');
    }

    public function update(User $user, Order $order): bool
    {
        return $user->isAdmin() || $user->hasPermission('orders.update');
    }

    public function delete(User $user, Order $order): bool
    {
        return $user->isAdmin() || $user->hasPermission('orders.delete');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Order $order): bool
    {
        return true;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Order $order): bool
    {
        return true;
    }
}
