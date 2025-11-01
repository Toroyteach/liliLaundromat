<?php

namespace App\Traits;

use App\Models\Audit;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\PersonalAccessToken;

trait Auditable
{
    public static function bootAuditable()
    {

        if (app()->runningInConsole()) {
            return; // Do not execute any auditing logic in console mode
        }

        static::created(function (Model $model) {
            self::audit('created', $model);
        });

        static::updated(function (Model $model) {
            self::audit('updated', $model);
        });

        static::deleted(function (Model $model) {
            self::audit('deleted', $model);
        });
    }

    protected static function audit($description, $model)
    {
        $token = PersonalAccessToken::findToken(request()->bearerToken());

        Audit::create([
            'description' => $description,
            'subject_id' => $model->id ?? null,
            'subject_type' => get_class($model) ?? null,
            'user_id' => $token->tokenable_id ?? auth()->id(),
            'properties' => $model ?? null,
            'host' => request()->ip() ?? null,
            'user_agent' => request()->header('User-Agent') ?? null, // Device and browser details
            'referer' => request()->header('Referer') ?? null, // The previous URL
            'request_method' => request()->method() ?? null, // HTTP request method
            'headers' => json_encode(self::filterHeaders(request()->headers->all())), // Important headers
            'url' => request()->fullUrl() ?? null, // The URL accessed
            'query_params' => json_encode(request()->query()) ?? null, // Query parameters
        ]);
    }

    protected static function filterHeaders(array $headers)
    {
        $allowedHeaders = [
            'authorization', // Tokens, if applicable
            'x-forwarded-for', // Client IP if behind a proxy
            'content-type', // Request content type
            'accept-language', // Language preference
        ];

        return array_filter($headers, function ($key) use ($allowedHeaders) {
            return in_array(strtolower($key), $allowedHeaders);
        }, ARRAY_FILTER_USE_KEY);
    }
}