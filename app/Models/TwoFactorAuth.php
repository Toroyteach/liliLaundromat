<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class TwoFactorAuth extends Model
{
    /** @use HasFactory<\Database\Factories\TwoFactorAuthFactory> */
    use HasFactory;

    protected $fillable = ['user_id', 'token', 'expires_at'];

    // Relationship to User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Generate a secure token
    public static function generateToken(): string
    {
        return Str::random(6); // A 6-character alphanumeric token
    }

    // Check if the token is valid
    public function isValid(): bool
    {
        return $this->expires_at > now();
    }

    public static function createTokenForUser($userId): TwoFactorAuth
    {
        // Ensure old tokens are deleted
        self::where('user_id', $userId)->delete();

        return self::create([
            'user_id' => $userId,
            'token' => self::generateToken(),
            'expires_at' => now()->addMinutes(10), // Token expires in 10 minutes
        ]);
    }

    public static function deleteTokenForUser($userId)
    {
        self::where('user_id', $userId)->delete();
    }

    public static function validateToken($userId, $token): bool
    {
        $record = self::where('user_id', $userId)
            ->where('token', $token)
            ->first();

        if (!$record || !$record->isValid()) {
            return false; // Token invalid or expired
        }

        return true; // Token is valid
    }
}
