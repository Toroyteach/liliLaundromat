<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderCreatedNotification extends Notification
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
    public function via($notifiable)
    {
        return ['database']; // in future also add mail/sms if needed
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'order_created',
            'order_id' => $this->order->id,
            'customer_id' => $this->order->customer_id,
            'total_amount' => $this->order->total_amount,
            'status' => $this->order->status,
            'title' => 'New Order Created',
            'message' => "Order #{$this->order->id} was created.",
        ];
    }
}
