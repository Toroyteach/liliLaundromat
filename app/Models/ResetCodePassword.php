<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResetCodePassword extends Model
{
    protected $fillable = [
        'email',
        'token',
        'created_at',
    ];
    
    protected $table = 'password_reset_tokens';

    /**
     * The name of the "updated at" column.
     *
     * @var string
     */
    const UPDATED_AT = null;
}
