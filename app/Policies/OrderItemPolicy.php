<?php

namespace App\Policies;

use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class OrderItemPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->hasPermission('order_items.read');
    }

    public function view(User $user, OrderItem $orderItem): bool
    {
        return $user->isAdmin() || $user->hasPermission('order_items.read');
    }

    public function create(User $user): bool
    {
        return $user->isAdmin() || $user->hasPermission('order_items.create');
    }

    public function update(User $user, OrderItem $orderItem): bool
    {
        return $user->isAdmin() || $user->hasPermission('order_items.update');
    }

    public function delete(User $user, OrderItem $orderItem): bool
    {
        return $user->isAdmin() || $user->hasPermission('order_items.delete');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, OrderItem $orderItem): bool
    {
        return true;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, OrderItem $orderItem): bool
    {
        return true;
    }
}
