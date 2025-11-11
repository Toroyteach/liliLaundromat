<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{__('Invitation Request Confirmation')}}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Algreya+Sans:wght@700&display=swap');
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: 0 auto; background-color: white; border: 1px solid #ddd; border-radius: 5px; overflow: hidden;">
        <!-- Header Section -->
        <div style="background-color: #70bbd9; text-align: center; padding: 20px 0;">
            <img src="{{ asset('images/eazy_online_logo.png') }}" alt="Company Logo" style="height: auto; max-width: 100px;">
            <p style="margin: 0; font-size: 18px; color: white; font-weight: bold; font-family: 'Inter', Arial, sans-serif;">{{ config('app.name') }}</p>
        </div>

        <!-- Content Section -->
        <div style="padding: 30px; text-align: center; font-size: 16px; color: #333;">
            <h1 style="font-size: 24px; color: #333; margin-bottom: 20px; font-family: 'Algreya Sans', Arial, sans-serif;">{{__('Invitation Request Confirmation')}}</h1>
            <p style="margin: 0 0 15px; font-family: 'Inter', Arial, sans-serif;">{{__('Hello')}} {{ $userName }},</p>
            <p style="margin: 0 0 15px; font-family: 'Inter', Arial, sans-serif;">{{__('We`ve received your request for an invitation to register with')}} {{ config('app.name') }}. {{__('Thank you for your interest!')}}</p>
            <div style="margin: 20px 0; background-color: #f2f2f2; padding: 20px; text-align: center; border-radius: 4px; font-size: 18px; font-weight: bold; font-family: 'Inter', Arial, sans-serif;">
            {{__('Your request is being processed')}}
            </div>
            <p style="margin: 0 0 15px; font-family: 'Inter', Arial, sans-serif;">{{__('We`ll review your request and send you an invitation as soon as possible. This process may take up to')}} <strong>{{ config('app.invitation_processing_time', '3-5') }}</strong> {{__('business days.')}}</p>
            <p style="margin: 0 0 15px; font-family: 'Inter', Arial, sans-serif;">{{__('If you have any questions or didn`t request this invitation, please contact our support team.')}}</p>
            <a href="{{ url('/support') }}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-family: 'Inter', Arial, sans-serif;">{{__('Contact Support')}}</a>
        </div>

        <!-- Footer Section -->
        <div style="background-color: #ee4c50; text-align: center; padding: 20px; color: white; font-size: 14px;">
            <p style="margin: 0 0 10px; font-family: 'Inter', Arial, sans-serif;">&copy; {{ config('app.name') }}, {{ date('Y') }}</p>
            <div style="padding: 10px 0;">
                <a href="{{ config('social.twitter') }}" style="margin: 0 10px;">
                    <img src="{{ asset('images/twitter-icon.png') }}" alt="Twitter" style="width: 24px; height: 24px; border: none;">
                </a>
                <a href="{{ config('social.facebook') }}" style="margin: 0 10px;">
                    <img src="{{ asset('images/facebook-icon.png') }}" alt="Facebook" style="width: 24px; height: 24px; border: none;">
                </a>
            </div>
        </div>
    </div>
</body>
</html>

