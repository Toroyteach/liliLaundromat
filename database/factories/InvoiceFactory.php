<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Invoice>
 */
class InvoiceFactory extends Factory
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
            'invoice_number' => fake()->unique()->numerify('INV####'),
            'subtotal' => 2000,
            'discount' => 0,
            'tax' => 200,
            'total' => 2200,
            'sent_to_customer' => false,
            'generated_at' => now(),
        ];
    }
}
