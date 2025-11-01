<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Config;

class Setting extends Model
{
    /** @use HasFactory<\Database\Factories\SettingFactory> */
    use HasFactory, Auditable;

    /**
     * @var array
     */
    protected $fillable = ['key', 'value'];

    /**
     * Retrieve the value for a given key.
     * 
     * @param string $key
     * @return string|null
     */
    public static function get($key)
    {
        $setting = self::where('key', $key)->first();
        return $setting ? $setting->value : null;
    }

    /**
     * Set the value for a given key.
     * 
     * @param string $key
     * @param string|null $value
     * @return bool
     */
    public static function set($key, $value = null)
    {
        $setting = self::firstOrCreate(['key' => $key]);
        $setting->value = $value;
        $setting->save();

        // Update the application config
        Config::set($key, $value);

        return Config::get($key) === $value;
    }
}
