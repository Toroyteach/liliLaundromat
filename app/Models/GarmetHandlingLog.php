<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GarmetHandlingLog extends Model
{
    /** @use HasFactory<\Database\Factories\GarmetHandlingLogFactory> */
    use HasFactory, Auditable;

    protected $fillable = ['order_item_id', 'handled_by_user_id', 'stage', 'scanned_at'];

    protected $casts = [
        'scanned_at' => 'datetime',
    ];

    // belongs to order item
    public function orderItem()
    {
        return $this->belongsTo(OrderItem::class);
    }

    // belongs to user who handled this stage
    public function handler()
    {
        return $this->belongsTo(User::class, 'handled_by_user_id');
    }
}
