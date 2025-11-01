<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    /** @use HasFactory<\Database\Factories\InvoiceFactory> */
    use HasFactory, Auditable;

    protected $fillable = ['order_id', 'invoice_number', 'subtotal', 'discount', 'tax', 'total', 'sent_to_customer', 'generated_at'];


    protected $casts = [
        'subtotal'          => 'decimal:2',
        'discount'          => 'decimal:2',
        'tax'               => 'decimal:2',
        'total'             => 'decimal:2',
        'sent_to_customer'  => 'boolean',
        'generated_at'      => 'datetime',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
