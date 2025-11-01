<?php

namespace App\Services;

use App\Models\User;
use App\Notifications\OrderCreatedNotification;
use App\Notifications\OrderUpdatedNotification;
use App\Notifications\InvoiceCreatedNotification;
use App\Notifications\InvoiceUpdatedNotification;
use App\Notifications\PaymentUpdatedNotification;

class NotificationService
{
    /**
     * get admins
     */
    protected static function admins()
    {
        return User::where('role', 'admin')->get();
    }

    /**
     * generic send helper
     */
    protected static function sendTo($recipients, $notification)
    {
        if (is_null($recipients)) {
            // default → all admins
            $recipients = self::admins();
        }

        if (is_array($recipients)) {
            // list of IDs
            $recipients = User::whereIn('id', $recipients)->get();
        }

        if ($recipients instanceof User) {
            // single user
            $recipients->notify($notification);
            return true;
        }

        // collection
        foreach ($recipients as $user) {
            $user->notify($notification);
        }

        return true;
    }

    public static function sendOrderCreated($order, $targets = null)
    {
        return self::sendTo($targets, new OrderCreatedNotification($order));
    }

    public static function sendOrderUpdated($order, $targets = null)
    {
        return self::sendTo($targets, new OrderUpdatedNotification($order));
    }

    public static function sendInvoiceCreated($invoice, $targets = null)
    {
        return self::sendTo($targets, new InvoiceCreatedNotification($invoice));
    }

    public static function sendInvoiceUpdated($invoice, $targets = null)
    {
        return self::sendTo($targets, new InvoiceUpdatedNotification($invoice));
    }

    public static function sendPaymentUpdated($payment, $targets = null)
    {
        return self::sendTo($targets, new PaymentUpdatedNotification($payment));
    }
}