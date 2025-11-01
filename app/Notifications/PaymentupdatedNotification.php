<?php

namespace App\Notifications;

use App\Models\Payment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentupdatedNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    protected $payment;

    public function __construct(Payment $payment)
    {
        $this->payment = $payment;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'payment_id'     => $this->payment->id,
            'order_id'       => $this->payment->order_id,
            'customer_id'    => $this->payment->customer_id,
            'amount'         => $this->payment->amount,
            'method'         => $this->payment->method,
            'mpesa_reference'=> $this->payment->mpesa_reference,
            'status'         => $this->payment->status,
            'processed_by'   => $this->payment->processed_by_user_id,
            'paid_at'        => optional($this->payment->paid_at)->toDateTimeString(),
            'message'        => 'Payment updated' // display text
        ];
    }
}
