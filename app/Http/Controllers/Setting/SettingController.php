<?php

namespace App\Http\Controllers\Setting;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Setting;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\RedirectResponse;
use App\Http\Requests\UpdateSettingsRequest;

class SettingController extends Controller
{
    public function index(): Response|RedirectResponse
    {
        try {
            if (!Gate::allows('viewAny', Setting::class)) {
                abort(403, __('Unauthorized Action'));
            }

            $settings = Setting::all()->pluck('value', 'key');

            return Inertia::render('settings/index', [
                'data' => $settings
            ]);
        } catch (\Throwable $e) {
            return back()->withErrors([
                'error' => __('Failed to retrieve settings.') . ' ' . $e->getMessage()
            ]);
        }
    }

    public function update(UpdateSettingsRequest $request): RedirectResponse
    {
        try {
            if (!Gate::allows('update', Setting::class)) {
                abort(403, __('Unauthorized Action'));
            }

            $data = $request->all();

            DB::transaction(function () use ($data) {
                foreach ($data as $key => $value) {
                    if (is_null($value) || $value === '') {
                        Setting::where('key', $key)->delete();
                    } else {
                        Setting::updateOrCreate(
                            ['key' => $key],
                            ['value' => $value]
                        );
                    }
                }
            });

            return redirect()->back()
                ->with('success', __('Settings updated successfully'));
        } catch (\Throwable $e) {
            return back()->withErrors([
                'error' => __('Failed to update settings.') . ' ' . $e->getMessage()
            ]);
        }
    }
}
