<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ __('Your Password Reset Code') }}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Algreya+Sans:wght@700&display=swap');
    </style>
</head>

<body style="margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; background-color: #f4f4f4;">
    <div
        style="max-width: 600px; margin: 0 auto; background-color: white; border: 1px solid #ddd; border-radius: 5px; overflow: hidden;">
        <!-- Header Section -->
        <div style="background-color: #70bbd9; text-align: center; padding: 20px 0;">
            <img src="{{ asset('images/eazy_online_logo.png') }}" alt="Company Logo"
                style="height: auto; max-width: 100px;">
            <p
                style="margin: 0; font-size: 18px; color: white; font-weight: bold; font-family: 'Inter', Arial, sans-serif;">
                {{ __('Eazy Online') }}</p>
        </div>

        <!-- Content Section -->
        <div style="padding: 30px; text-align: center; font-size: 16px; color: #333;">
            <h1
                style="font-size: 24px; color: #333; margin-bottom: 20px; font-family: 'Algreya Sans', Arial, sans-serif;">
                {{ __('Your Password Reset Code') }}</h1>
            <p style="margin: 0 0 15px; font-family: 'Inter', Arial, sans-serif;">{{ __('Hello') }}
                {{ $userName }},</p>
            <p style="margin: 0 0 15px; font-family: 'Inter', Arial, sans-serif;">
                {{ __('You`ve requested to reset your password for the account associated with') }} {{ $email }}.
                {{ __('Click on the link bellow to complete the password reset process:') }}</p>
            <a href="{{ route('password.reset', ['token' => $token, 'email' => $email]) }}"
                style="margin: 20px 0; background-color: #f2f2f2; padding: 20px; text-align: center; border-radius: 4px; font-size: 36px; font-weight: bold; letter-spacing: 5px; font-family: 'Inter', Arial, sans-serif;">
                {{ __('Reset your password') }}
            </a>
            <p style="margin: 0 0 15px; font-family: 'Inter', Arial, sans-serif;">
                {{ __('This code will expire in 60 minutes. If you didn`t request this code, please ignore this email or contact support if you have concerns.') }}
            </p>
        </div>

        <!-- Footer Section -->
        <div style="background-color: #ee4c50; text-align: center; padding: 20px; color: white; font-size: 14px;">
            <p style="margin: 0 0 10px; font-family: 'Inter', Arial, sans-serif;">&copy; {{ __('Eazy Online,') }}
                {{ date('Y') }}</p>
            <div style="padding: 10px 0;">
                <a href="#" style="margin: 0 10px;">
                    <img src="{{ asset('images/twitter-icon.png') }}" alt="Twitter"
                        style="width: 24px; height: 24px; border: none;">
                </a>
                <a href="#" style="margin: 0 10px;">
                    <img src="{{ asset('images/facebook-icon.png') }}" alt="Facebook"
                        style="width: 24px; height: 24px; border: none;">
                </a>
            </div>
        </div>
    </div>
</body>

</html>
