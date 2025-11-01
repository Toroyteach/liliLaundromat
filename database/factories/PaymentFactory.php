<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_id' => Order::factory(),
            'customer_id' => Customer::factory(),
            'amount' => 2200,
            'method' => 'mpesa',
            'mpesa_reference' => fake()->unique()->uuid(),
            'status' => 'success',
            'processed_by_user_id' => User::factory(),
            'paid_at' => now(),
        ];
    }
}
