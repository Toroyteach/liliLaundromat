<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderUpdatedNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    protected $order;

    public function __construct($order)
    {
        $this->order = $order;
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

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray($notifiable): array
    {
        return [
            'type' => 'order_updated',
            'order_id' => $this->order->id,
            'customer_id' => $this->order->customer_id,
            'user_id' => $this->order->user_id,
            'branch_id' => $this->order->branch_id,
            'total_amount' => $this->order->total_amount,
            'status' => $this->order->status,
            'due_date' => $this->order->due_date, // nullable
            'message' => "Order #{$this->order->id} was updated."
        ];
    }
}
