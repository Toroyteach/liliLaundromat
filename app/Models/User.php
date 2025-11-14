<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Auditable;

    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory;
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_recovery_codes',
        'two_factor_secret',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = [
        'profile_photo_url',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_role');
    }

    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'role_permission', 'role_id', 'permission_id')
            ->whereIn('role_id', $this->roles());
    }

    // check if user is admin
    public function isAdmin(): bool
    {
        return $this->roles()->where('name', 'admin')->exists();
    }

    // hasRole
    public function hasRole($role): bool
    {
        return $this->roles()->where('name', $role)->exists();
    }

    // hasPermission
    public function hasPermission($permission): bool
    {
        if ($this->isAdmin()) return true;

        return $this->getAllPermissions()->contains($permission);
    }

    public function getAllPermissions()
    {
        // // Direct user permissions
        // $userPermissions = $this->permissions()->pluck('name');

        // // Role-based permissions
        // $rolePermissions = Permission::query()
        //     ->whereIn('id', function ($query) {
        //         $query->select('permission_id')
        //             ->from('role_permission')
        //             ->whereIn('role_id', function ($subQuery) {
        //                 $subQuery->select('role_id')
        //                     ->from('user_role')
        //                     ->where('user_id', $this->id);
        //             });
        //     })
        //     ->pluck('name');

        // // Merge + remove duplicates
        // return $userPermissions
        //     ->merge($rolePermissions)
        //     ->unique()
        //     ->values();
        return collect([
            'dashboard.view',
            'orders.read',
            'orders.create',
            'payments.read',
            'customers.read',
            'staff.manage',
            'settings.read',
        ]);
    }
}
