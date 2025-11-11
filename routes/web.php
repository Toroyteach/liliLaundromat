<?php

use App\Http\Controllers\GarmetType\GarmetTypeConroller;
use App\Http\Controllers\Invoice\InvoiceConroller;
use App\Http\Controllers\Order\OrderConroller;
use App\Http\Controllers\Order\OrderItemConroller;
use App\Http\Controllers\Payment\PaymentConroller;
use App\Http\Controllers\Setting\SettingConroller;
use App\Http\Controllers\User\UserConroller;
use App\Http\Controllers\Branch\BranchController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\SignInController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('dashboard/page');
});


Route::middleware('guest')->group(function () {
    // Login
    Route::get('sign-in', [SignInController::class, 'showSignInForm'])->name('login');
    Route::post('sign-in', [SignInController::class, 'signIn']);

    // Password Reset
    Route::get('forgot-password', [PasswordResetController::class, 'showForgotPasswordForm'])->name('password.request');
    Route::post('forgot-password', [PasswordResetController::class, 'forgotPassword']);

    Route::get('reset-password', [PasswordResetController::class, 'showResetPasswordForm'])->name('password.reset');
    Route::post('reset-password', [PasswordResetController::class, 'resetPassword']);
});

// Auth routes
Route::middleware('auth')->group(
    function () {
        Route::get('complete-2fa-challenge', [SignInController::class, 'showSignInWith2FAForm'])->name('login.2fa-challenge');
        Route::post('complete-2fa-challenge', [SignInController::class, 'signInWith2FA']);

        Route::post('resend-2fa-token', [SignInController::class, 'resendTwoFAToken']);
    }
);

Route::prefix('branches')->group(function () {
    Route::get('/', [BranchController::class, 'index']);
    Route::post('/', [BranchController::class, 'store']);
    Route::get('/{branch}', [BranchController::class, 'show']);
    Route::put('/{branch}', [BranchController::class, 'update']);
    Route::delete('/{branch}', [BranchController::class, 'destroy']);
});

Route::prefix('garmet-types')->group(function () {
    Route::get('/', [GarmetTypeConroller::class, 'index']);
    Route::post('/', [GarmetTypeConroller::class, 'store']);
    Route::put('/{id}', [GarmetTypeConroller::class, 'update']);
    Route::delete('/{id}', [GarmetTypeConroller::class, 'destroy']);
});

Route::prefix('invoices')->group(function () {
    Route::get('/', [InvoiceConroller::class, 'index']);
    Route::post('/', [InvoiceConroller::class, 'store']);
    Route::get('/{invoice}', [InvoiceConroller::class, 'show']);
    Route::put('/{invoice}', [InvoiceConroller::class, 'update']);
    Route::delete('/{invoice}', [InvoiceConroller::class, 'destroy']);
});

Route::prefix('orders')->group(function () {
    Route::get('/', [OrderConroller::class, 'index']);
    Route::post('/', [OrderConroller::class, 'store']);
    Route::get('/{order}', [OrderConroller::class, 'show']);
    Route::put('/{order}', [OrderConroller::class, 'update']);
    Route::delete('/{order}', [OrderConroller::class, 'destroy']);
    Route::post('/{order}/generate-labels', [OrderConroller::class, 'generateLabels']);
});

Route::prefix('order-items')->group(function () {
    Route::get('/', [OrderItemConroller::class, 'index']);
    Route::post('/', [OrderItemConroller::class, 'store']);
    Route::get('/{order_item}', [OrderItemConroller::class, 'show']);
    Route::put('/{order_item}', [OrderItemConroller::class, 'update']);
    Route::delete('/{order_item}', [OrderItemConroller::class, 'destroy']);
    Route::post('/{id}/generate-barcode', [OrderItemConroller::class, 'generateBarcodeForItem']);
});

Route::prefix('payments')->group(function () {
    Route::get('/', [PaymentConroller::class, 'index']);
    Route::post('/', [PaymentConroller::class, 'store']);
    Route::get('/{payment}', [PaymentConroller::class, 'show']);
    Route::put('/{payment}', [PaymentConroller::class, 'update']);
    Route::delete('/{payment}', [PaymentConroller::class, 'destroy']);
});

Route::prefix('settings')->group(function () {
    Route::get('/', [SettingConroller::class, 'index']);
    Route::put('/', [SettingConroller::class, 'update']);
});

Route::prefix('users')->group(function () {
    Route::get('/', [UserConroller::class, 'index']);
    Route::post('/', [UserConroller::class, 'store']);
    Route::put('/{id}', [UserConroller::class, 'update']);
    Route::delete('/{id}', [UserConroller::class, 'destroy']);
});
