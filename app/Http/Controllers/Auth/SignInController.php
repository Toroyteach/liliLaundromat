<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\SignInRequest;
use App\Http\Requests\SignInWith2FARequest;
use App\Models\TwoFactorAuth;
use App\Models\User;
use App\Notifications\Auth\SendUserSignIn2fa;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class SignInController extends Controller
{

    // Sign In with email and password
    public function showSignInForm(): Response
    {
        return Inertia::render('login/page');
    }

    public function signIn(SignInRequest $request): RedirectResponse|Response
    {
        try {
            $credentials = $request->only('email', 'password');
            $remember = $request->boolean('remember');
    
            if (Auth::attempt($credentials, $remember)) {
    
                $user = User::where('email', $credentials['email'])->firstOrFail();
    
                if ($user->disabled) {
                    $request->session()->invalidate();
                    $request->session()->regenerateToken();
    
                    return back()->withErrors(['error' => __('Your account is disabled. Please contact the administrator.')]);
                }
    
                if ($user->two_fa_enabled) {
                    $request->session()->put('2fa_start_time', now());
                    $twoFactorAuth = TwoFactorAuth::createTokenForUser($user->id);
                    $user->notify(new SendUserSignIn2fa($user, $twoFactorAuth->token));
    
                    return redirect('/complete-2fa-challenge')->with([
                        'message' => __('2FA token generated. Please use the token to complete your login.')
                    ]);
                } else {
                    return redirect()->route('dashboard');
                }
            }
    
            return back()->withErrors(['email' => __('Invalid credentials')]);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => __('An error occurred: ') . $e->getMessage()]);
        }
    }

    //Sign In with email, password, and 2FA token
    public function showSignInWith2FAForm(): Response
    {
        return Inertia::render('auth/complete-2fa-challenge');
    }

    public function signInWith2FA(SignInWith2FARequest $request): RedirectResponse|Response
    {

        try {
            $validated = $request->validated();

            $user = Auth::user();

            if ($user->disabled) {
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                return back()->withErrors(['error' => __('Your account is disabled. Please contact the administrator.')]);
            }

            $token = $validated['2fa_token'];

            if (TwoFactorAuth::validateToken($user->id, $token)) {
                $request->session()->forget('2fa_start_time');
                TwoFactorAuth::deleteTokenForUser($user->id);
                Auth::login($user);
                return redirect()->route('dashboard');
            }

            return back()->withErrors(['error' => __('Invalid 2FA token')]);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => __('An error occurred: ') . $e->getMessage()]);
        }
    }

    public function resendTwoFAToken()
    {
        try {
            $user = User::find(Auth::user()->id);
            $twoFactorAuth = TwoFactorAuth::createTokenForUser($user->id);

            // Send the notification
            $user->notify(new SendUserSignIn2fa($user, $twoFactorAuth->token));

            return back()->with([
                'message' => __('2FA token generated. Please use the token to complete your login.')
            ]);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => __('An error occurred: ') . $e->getMessage()]);
        }
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
