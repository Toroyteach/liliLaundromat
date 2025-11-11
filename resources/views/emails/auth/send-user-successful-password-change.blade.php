<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ __('Password Updated Successfully') }}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Algreya+Sans:wght@700&display=swap');
    </style>
</head>

<body style="margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; background-color: #f4f4f4;">
    <div
        style="max-width: 600px; margin: 0 auto; background-color: white; border: 1px solid #ddd; border-radius: 5px; overflow: hidden;">
        <!-- Header Section -->
        <div style="background-color: #70bbd9; text-align: center; padding: 20px 0;">
            <img src="path/to/eazy_online_logo.png" alt="Company Logo" style="height: auto; max-width: 100px;">
            <p
                style="margin: 0; font-size: 18px; color: white; font-weight: bold; font-family: 'Inter', Arial, sans-serif;">
                {{ __('Eazy Online') }}</p>
        </div>

        <!-- Content Section -->
        <div style="padding: 30px; text-align: left; font-size: 16px; color: #333;">
            <h1
                style="font-size: 24px; color: #333; margin-bottom: 20px; font-family: 'Algreya Sans', Arial, sans-serif; text-align: center;">
                {{ __('Password Updated Successfully') }}</h1>

            <p style="margin: 0 0 15px; font-family: 'Inter', Arial, sans-serif;">{{ __('Dear') }}
                {{ $userName }},</p>

            <p style="margin: 0 0 15px; font-family: 'Inter', Arial, sans-serif;">
                {{ __('We`re writing to confirm that your password has been successfully updated. Your account security is important to us, and we`re glad you`ve taken this step to protect your information.') }}
            </p>

            <p style="margin: 0 0 15px; font-family: 'Inter', Arial, sans-serif;">
                {{ __('Here`s what you need to know:') }}</p>

            <ul style="margin: 0 0 15px; padding-left: 20px; font-family: 'Inter', Arial, sans-serif;">
                <li>{{ __('Your password has been changed') }}</li>
                <li>{{ __('You can now log in with your new password') }}</li>
                <li>{{ __('If you didn`t make this change, please contact our support team immediately') }}</li>
            </ul>

            <p style="margin: 0 0 15px; font-family: 'Inter', Arial, sans-serif;">
                {{ __('If you have any questions or concerns about your account, please don`t hesitate to reach out to our support team.') }}
            </p>

        </div>

        <!-- Footer Section -->
        <div style="background-color: #ee4c50; text-align: center; padding: 20px; color: white; font-size: 14px;">
            <p style="margin: 0 0 10px; font-family: 'Inter', Arial, sans-serif;">&copy; {{ date('Y') }}
                {{ __('Eazy Online. All rights reserved.') }}</p>
            <div style="padding: 10px 0;">
                <a href="https://twitter.com" style="margin: 0 10px;">
                    <img src="https://assets.codepen.io/210284/tw_1.png" alt="Twitter"
                        style="width: 24px; height: 24px; border: none;">
                </a>
                <a href="https://facebook.com" style="margin: 0 10px;">
                    <img src="https://assets.codepen.io/210284/fb_1.png" alt="Facebook"
                        style="width: 24px; height: 24px; border: none;">
                </a>
            </div>
        </div>
    </div>
</body>

</html>
