<?php

namespace App\Policies;

use App\Models\Payment;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PaymentPolicy
{
    public function viewAny(User $user): bool
    {
        if ($user->isAdmin()) return true;
        return $user->hasPermission('payments.read');
    }

    public function view(User $user, Payment $payment): bool
    {
        if ($user->isAdmin()) return true;
        return $user->hasPermission('payments.read');
    }

    public function create(User $user): bool
    {
        if ($user->isAdmin()) return true;
        return $user->hasPermission('payments.create');
    }

    public function update(User $user, Payment $payment): bool
    {
        if ($user->isAdmin()) return true;
        return $user->hasPermission('payments.update');
    }

    public function delete(User $user, Payment $payment): bool
    {
        if ($user->isAdmin()) return true;
        return $user->hasPermission('payments.delete');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Payment $payment): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Payment $payment): bool
    {
        return false;
    }
}
