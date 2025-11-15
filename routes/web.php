<?php

use App\Http\Controllers\GarmetType\GarmetTypeController;
use App\Http\Controllers\Customer\CustomerController;
use App\Http\Controllers\Invoice\InvoiceController;
use App\Http\Controllers\Order\OrderController;
use App\Http\Controllers\Order\OrderItemController;
use App\Http\Controllers\Payment\PaymentController;
use App\Http\Controllers\Setting\SettingController;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\Branch\BranchController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\Auth\SignInController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Role\RolePermissionController;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

Route::get('/', function () {
    if (Auth::check()) {
        return redirect('/dashboard');
    }
    return Inertia::render('welcome');
})->name('home');


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


Route::middleware(['auth'])->group(function () {

    Route::post('/logout', [SignInController::class, 'logout']);

    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Track Laundry
    Route::get('/tracking', [OrderController::class, 'tracking'])->name('tracking.index');
    Route::get('/tracking/{order}', [OrderController::class, 'trackDetails']);

    // Reports
    Route::get('/reports', fn() => Inertia::render('Reports/Index'))->name('reports.index');

    // Customers
    Route::prefix('customers')->group(function () {
        Route::get('/', [CustomerController::class, 'index'])->name('customers.index');
        Route::get('/{customer}', [CustomerController::class, 'show'])->name('customers.show');
    });

    Route::put('roles/{role}/permissions', [RolePermissionController::class, 'updateRolePermissions'])
        ->name('admin.roles.updatePermissions');

    // Hardware
    Route::get('/hardware', fn() => Inertia::render('Hardware/Index'))->name('hardware.index');

    Route::prefix('branches')->group(function () {
        Route::get('/', [BranchController::class, 'index']);
        Route::post('/', [BranchController::class, 'store']);
        Route::get('/{branch}', [BranchController::class, 'show']);
        Route::put('/{branch}', [BranchController::class, 'update']);
        Route::delete('/{branch}', [BranchController::class, 'destroy']);
    });

    Route::prefix('garmet-types')->group(function () {
        Route::get('/', [GarmetTypeController::class, 'index']);
        Route::post('/', [GarmetTypeController::class, 'store']);
        Route::put('/{id}', [GarmetTypeController::class, 'update']);
        Route::delete('/{id}', [GarmetTypeController::class, 'destroy']);
    });

    Route::prefix('invoices')->group(function () {
        Route::get('/', [InvoiceController::class, 'index']);
        Route::post('/', [InvoiceController::class, 'store']);
        Route::get('/{invoice}', [InvoiceController::class, 'show']);
        Route::put('/{invoice}', [InvoiceController::class, 'update']);
        Route::delete('/{invoice}', [InvoiceController::class, 'destroy']);
    });

    Route::prefix('orders')->group(function () {
        Route::get('/', [OrderController::class, 'index']);
        Route::get('/create', [OrderController::class, 'create']);
        Route::post('/', [OrderController::class, 'store']);
        Route::get('/{order}', [OrderController::class, 'show']);
        Route::put('/{order}', [OrderController::class, 'update']);
        Route::delete('/{order}', [OrderController::class, 'destroy']);
        Route::post('/{order}/generate-labels', [OrderController::class, 'generateLabels']);
    });

    Route::prefix('order-items')->group(function () {
        Route::get('/', [OrderItemController::class, 'index']);
        Route::post('/', [OrderItemController::class, 'store']);
        Route::get('/{order_item}', [OrderItemController::class, 'show']);
        Route::put('/{order_item}', [OrderItemController::class, 'update']);
        Route::delete('/{order_item}', [OrderItemController::class, 'destroy']);
        Route::post('/{id}/generate-barcode', [OrderItemController::class, 'generateBarcodeForItem']);
    });

    Route::prefix('payments')->group(function () {
        Route::get('/', [PaymentController::class, 'index']);
        Route::post('/', [PaymentController::class, 'store']);
        Route::get('/{payment}', [PaymentController::class, 'show']);
        Route::put('/{payment}', [PaymentController::class, 'update']);
        Route::delete('/{payment}', [PaymentController::class, 'destroy']);
    });

    Route::prefix('settings')->group(function () {
        Route::get('/', [SettingController::class, 'index']);
        Route::put('/', [SettingController::class, 'update']);
    });

    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::post('/', [UserController::class, 'store']);
        Route::put('/{id}', [UserController::class, 'update']);
        Route::delete('/{id}', [UserController::class, 'destroy']);
    });
});
