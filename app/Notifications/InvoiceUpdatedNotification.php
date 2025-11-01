<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class InvoiceUpdatedNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */

    protected $invoice;

    public function __construct($invoice)
    {
        $this->invoice = $invoice;
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
            'type' => 'invoice_updated',
            'invoice_id' => $this->invoice->id,
            'order_id' => $this->invoice->order_id,
            'invoice_number' => $this->invoice->invoice_number,
            'subtotal' => $this->invoice->subtotal,
            'discount' => $this->invoice->discount,
            'tax' => $this->invoice->tax,
            'total' => $this->invoice->total,
            'sent_to_customer' => $this->invoice->sent_to_customer,
            'message' => "Invoice #{$this->invoice->invoice_number} was updated."
        ];
    }
}
