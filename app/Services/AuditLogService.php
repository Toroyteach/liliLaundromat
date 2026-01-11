<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class AuditLogService
{
    public static function generateLogs(Model $model): array
    {
        $activities = [];
        $fillable = $model->getFillable();
        $logs = $model->logs()->whereIn('description', ['created', 'updated'])->orderBy('created_at')->get();
        $previous = [];

        foreach ($logs as $log) {
            $current = json_decode(json_encode($log->properties), true) ?: [];
            $current = array_intersect_key($current, array_flip($fillable));

            $changes = self::getChanges($log, $current, $previous, $fillable);

            if (!empty($changes)) {
                $activities[] = [
                    'user' => $log->user->name ?? 'System',
                    'action' => Str::title($log->description),
                    'created_at' => $log->created_at,
                    'changes' => $changes,
                    'id' => $log->id,
                ];
            }

            $previous = $current;
        }

        return $activities;
    }

    protected static function getChanges($log, array $current, array $previous, array $fillable): array
    {
        $changes = [];

        if ($log->description === 'created') {
            foreach ($fillable as $key) {
                if (isset($current[$key]) && $current[$key] !== '') {
                    $changes[] = [
                        'field' => Str::of($key)->replace('_', ' ')->title()->toString(),
                        'from' => null,
                        'to' => $current[$key],
                        'type' => 'created',
                        'changed_by' => $log->user->name ?? 'System',
                    ];
                }
            }
        } elseif ($log->description === 'updated') {
            foreach ($fillable as $key) {
                $old = $previous[$key] ?? null;
                $new = $current[$key] ?? null;
                if ($old !== $new) {
                    $changes[] = [
                        'field' => Str::of($key)->replace('_', ' ')->title()->toString(),
                        'from' => $old,
                        'to' => $new,
                        'type' => 'updated',
                        'changed_by' => $log->user->name ?? 'System',
                    ];
                }
            }
        }

        return $changes;
    }
}
