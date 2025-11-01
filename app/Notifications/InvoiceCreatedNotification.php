<?php

namespace App\Notifications;

use App\Models\Invoice;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class InvoiceCreatedNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    protected $invoice;

    public function __construct(Invoice $invoice)
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

    public function toArray(object $notifiable): array
    {
        return [
            'invoice_id'       => $this->invoice->id,
            'order_id'         => $this->invoice->order_id,
            'invoice_number'   => $this->invoice->invoice_number,
            'subtotal'         => $this->invoice->subtotal,
            'discount'         => $this->invoice->discount,
            'tax'              => $this->invoice->tax,
            'total'            => $this->invoice->total,
            'sent_to_customer' => $this->invoice->sent_to_customer,
            'generated_at'     => optional($this->invoice->generated_at)->toDateTimeString(),
            'message'          => 'Invoice created'
        ];
    }
}
