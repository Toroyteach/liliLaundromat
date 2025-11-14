<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Role extends Model
{
    /** @use HasFactory<\Database\Factories\RolesFactory> */
    use HasFactory, Auditable;

    protected $fillable = ['name', 'description'];

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($role) {
            if (strtolower($role->name) === 'super-admin') {
                throw new \Exception('The super-admin role cannot be deleted.');
            }
        });
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }

    public function permissions(): HasMany
    {
        return $this->hasMany(Permission::class);
    }

    public function logs(): MorphMany
    {
        return $this->morphMany(Audit::class, 'subject');
    }
}
