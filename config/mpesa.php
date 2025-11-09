<?php
// config/mpesa.php

return [
    'consumer_key' => env('MPESA_CONSUMER_KEY'),
    'consumer_secret' => env('MPESA_CONSUMER_SECRET'),
    'base_url' => env('MPESA_BASE_URL', 'https://api.safaricom.co.ke'), // sandbox or production
    'shortcode' => env('MPESA_SHORTCODE'),
    'lipa_na_mpesa_passkey' => env('MPESA_PASSKEY'),
    'callback_url' => env('MPESA_CALLBACK_URL'), // public callback URL
    'timeout' => 10,
];