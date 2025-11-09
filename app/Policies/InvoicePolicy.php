<?php

namespace App\Policies;

use App\Models\Invoice;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class InvoicePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->hasPermission('invoices.read');
    }

    public function view(User $user, Invoice $invoice): bool
    {
        return $user->isAdmin() || $user->hasPermission('invoices.read');
    }

    public function create(User $user): bool
    {
        return $user->isAdmin() || $user->hasPermission('invoices.create');
    }

    public function update(User $user, Invoice $invoice): bool
    {
        return $user->isAdmin() || $user->hasPermission('invoices.update');
    }

    public function delete(User $user, Invoice $invoice): bool
    {
        return $user->isAdmin() || $user->hasPermission('invoices.delete');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Invoice $invoice): bool
    {
        return true;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Invoice $invoice): bool
    {
        return true;
    }
}
