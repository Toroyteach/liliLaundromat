<?php

namespace App\Models;

use App\Services\AuditLogService;
use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Order extends Model
{
    /** @use HasFactory<\Database\Factories\OrderFactory> */
    use HasFactory, Auditable;

    protected $fillable = ['customer_id', 'user_id', 'branch_id', 'total_amount', 'status', 'due_date'];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'due_date' => 'datetime',
    ];

    public function getActivitiesAttribute()
    {
        return AuditLogService::generateLogs($this);
    }

    public function logs(): MorphMany
    {
        return $this->morphMany(Audit::class, 'subject');
    }

    // belongs to the customer who owns the order
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    // belongs to the user who created / processed the order
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // belongs to branch location
    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    // order has many order items
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    // order has one invoice (normally one)
    public function invoice()
    {
        return $this->hasOne(Invoice::class);
    }

    // order has many payments
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
