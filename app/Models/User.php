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
        'phone',
        'is_active'
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
        // Get all permission IDs from roles the user has
        $roleIds = $this->roles()->pluck('id');

        return Permission::query()
            ->whereIn('id', function ($query) use ($roleIds) {
                $query->select('permission_id')
                    ->from('role_permission')
                    ->whereIn('role_id', $roleIds);
            });
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
        // Direct user permissions (if you have any)
        $userPermissions = $this->permissions()->pluck('name');

        // Role-based permissions
        $rolePermissions = Permission::query()
            ->whereIn('id', function ($query) {
                $query->select('permission_id')
                    ->from('role_permission')
                    ->whereIn('role_id', function ($subQuery) {
                        $subQuery->select('roles.id') // prefix with table to avoid ambiguity
                            ->from('roles')
                            ->join('user_role', 'roles.id', '=', 'user_role.role_id')
                            ->where('user_role.user_id', $this->id);
                    });
            })
            ->pluck('name');

        // Merge + remove duplicates
        return $userPermissions
            ->merge($rolePermissions)
            ->unique()
            ->values();
    }
}
