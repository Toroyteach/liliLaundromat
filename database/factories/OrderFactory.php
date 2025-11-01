<?php

namespace Database\Factories;

use App\Models\Branch;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'customer_id' => Customer::factory(),
            'user_id' => User::factory(),
            'branch_id' => Branch::factory(),
            'total_amount' => 0,
            'status' => 'pending',
            'due_date' => now()->addDays(3),
        ];
    }
}
