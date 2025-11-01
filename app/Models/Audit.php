<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use \DateTimeInterface;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Audit extends Model
{
    /** @use HasFactory<\Database\Factories\AuditFactory> */
    use HasFactory;

    protected $fillable = [
        'description',
        'subject_id',
        'subject_type',
        'user_id',
        'properties',
        'host',
        'user_agent',
        'referer',
        'request_method',
        'headers',
        'url',
        'query_params'
    ];

    protected $casts = [
        'properties' => 'collection',
    ];

    protected function serializeDate(DateTimeInterface $date): string
    {
        return $date->format('Y-m-d H:i:s');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected static function boot()
    {
        parent::boot();

        // Enforce maximum range of one month for default queries
        static::addGlobalScope('recent', function ($query) {
            $query->where('created_at', '>=', now()->subMonth());
        });
    }
}
