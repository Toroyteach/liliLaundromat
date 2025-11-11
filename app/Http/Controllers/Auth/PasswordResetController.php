<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\ChangePasswordRequest;
use App\Http\Requests\ForgotPasswordRequest;
use App\Models\ResetCodePassword;
use App\Models\User;
use App\Notifications\Auth\SendUserConfirmPasswordChange;
use App\Notifications\Auth\SendUserForgotPasswordTokens;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;

class PasswordResetController extends Controller
{
    public function resetPassword(ChangePasswordRequest $request): RedirectResponse|Response
    {
        try {
            $validated = $request->validated();

            // Check if the token is valid
            $resetToken = ResetCodePassword::where('email', $validated['email'])
                ->where('token', $validated['token'])
                ->where('created_at', '>=', Carbon::now()->subMinutes(20))
                ->first();

            if (!$resetToken) {
                return back()->withErrors([
                    'error' => __('Invalid or expired token')
                ]);
            }

            // Reset the password
            $user = User::where('email', $validated['email'])->firstOrFail();
            $user->update(['password' => bcrypt($validated['password'])]);

            // Delete the used reset token
            ResetCodePassword::where('email', $validated['email'])->delete();

            // Send the notification
            $user->notify(new SendUserConfirmPasswordChange($user));

            Auth::login($user);

            return redirect('dashboard')->with([
                'message' => __('Password has been reset successfully')
            ]);
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => __('An error occurred: ') . $e->getMessage()
            ]);
        }
    }

    public function showResetPasswordForm(Request $request): RedirectResponse|Response
    {
        if (!$request['email'] | !$request['token']) {
            return back()->withErrors([
                'error' => __('Not authorized')
            ]);
        }

        return Inertia::render('auth/reset-password', [
            'email' => $request['email'],
            'token' => $request['token']
        ]);
    }

    // Forgot Password: Generate token and send to user vis email
    public function showForgotPasswordForm(): Response
    {
        return Inertia::render('auth/forgot-password');
    }

    public function forgotPassword(ForgotPasswordRequest $request): RedirectResponse|Response
    {
        try {
            $request = $request->validated();

            // Check if user exists
            $user = User::where('email', $request['email'])->first();

            if (!$user) {
                return back()->withErrors(["error" => __('User not Found.')]);
            }

            // Generate a password reset token using the PasswordReset model
            ResetCodePassword::where('email', $user->email)->delete();

            // Create a new code
            $codeData = ResetCodePassword::create([
                'email' => $user->email,
                'token' => Str::random(12),
            ]);

            // Send the notification
            $user->notify(new SendUserForgotPasswordTokens($user, $codeData->token));

            return back()->with(["message" => 'Password reset link sent to your email']);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => __('An error occurred: ') . $e->getMessage()]);
        }
    }
}
