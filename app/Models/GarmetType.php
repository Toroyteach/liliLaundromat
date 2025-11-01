<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GarmetType extends Model
{
    /** @use HasFactory<\Database\Factories\GarmetTypeFactory> */
    use HasFactory, Auditable;

    protected $fillable=['name','default_pricing_mode','default_price'];
}
