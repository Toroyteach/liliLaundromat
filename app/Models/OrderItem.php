<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    /** @use HasFactory<\Database\Factories\OrderItemFactory> */
    use HasFactory, Auditable;

    protected $fillable = [
        'order_id',
        'garment_type',
        'pricing_mode',
        'quantity',
        'weight_kg',
        'unit_price',
        'total_price',
        'color',
        'material',
        'barcode_number',
        'status',
        'notes'
    ];

    protected $casts = [
        'quantity' => 'integer',
        'weight_kg' => 'decimal:2',
        'unit_price' => 'decimal:2',
        'total_price' => 'decimal:2',
    ];

    // belongs to order
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    // item can have many handling logs
    public function handlingLogs()
    {
        return $this->hasMany(GarmetHandlingLog::class); // table garmet_handling_logs
    }
}
