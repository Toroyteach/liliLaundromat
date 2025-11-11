<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{__('Password Change Request')}}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Algreya+Sans:wght@700&display=swap');
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: 0 auto; background-color: white; border: 1px solid #ddd; border-radius: 5px; overflow: hidden;">
        <!-- Header Section -->
        <div style="background-color: #70bbd9; text-align: center; padding: 20px 0;">
            <img src="images/eazy_online_logo.png" alt="Company Logo" style="height: auto; max-width: 100px;">
            <p style="margin: 0; font-size: 18px; color: white; font-weight: bold; font-family: 'Inter', Arial, sans-serif;">{{__('Eazy Online')}}</p>
        </div>

        <!-- Content Section -->
        <div style="padding: 30px; text-align: center; font-size: 16px; color: #333;">
            <h1 style="font-size: 24px; color: #333; margin-bottom: 20px; font-family: 'Algreya Sans', Arial, sans-serif;">{{__('Password Change Request')}}</h1>
            
            <p style="margin: 0 0 15px; font-family: 'Inter', Arial, sans-serif;">{{__('Hello')}} [User's Name],</p>
            
            <p style="margin: 0 0 15px; font-family: 'Inter', Arial, sans-serif;">{{__('We received a request to change the password for your account. If you made this request, please click the button below to proceed with the password change process.')}}</p>
            
            <div style="margin: 25px 0;">
                <a href="#" style="display: inline-block; background-color: #70bbd9; color: white; text-decoration: none; padding: 12px 30px; border-radius: 4px; font-weight: 500; font-family: 'Inter', Arial, sans-serif;">{{__('Change Password')}}</a>
            </div>
            
            <p style="margin: 0 0 15px; font-family: 'Inter', Arial, sans-serif;">{{__('If you didn`t request a password change, please ignore this email or contact our support team immediately if you have any concerns.')}}</p>
            
            <p style="margin: 0 0 15px; font-family: 'Inter', Arial, sans-serif;">{{__('This link will expire in')}} [X] {{__('hours for security reasons.')}}</p>
            
            <p style="margin: 0; font-size: 14px; color: #666; font-family: 'Inter', Arial, sans-serif;">{{__('For security reasons, we recommend using a strong, unique password that you don`t use for any other accounts.')}}</p>
        </div>

        <!-- Footer Section -->
        <div style="background-color: #ee4c50; text-align: center; padding: 20px; color: white; font-size: 14px;">
            <p style="margin: 0 0 10px; font-family: 'Inter', Arial, sans-serif;">&copy; {{__('Eazy Online,')}} [Current Year]</p>
            <div style="padding: 10px 0;">
                <a href="#" style="margin: 0 10px;">
                    <img src="images/twitter-icon.png" alt="Twitter" style="width: 24px; height: 24px; border: none;">
                </a>
                <a href="#" style="margin: 0 10px;">
                    <img src="images/facebook-icon.png" alt="Facebook" style="width: 24px; height: 24px; border: none;">
                </a>
            </div>
        </div>
    </div>
</body>
</html>