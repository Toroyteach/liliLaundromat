<?php

namespace Database\Factories;

use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrderItem>
 */
class OrderItemFactory extends Factory
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
            'garment_type' => 'shirt',
            'pricing_mode' => 'per_piece',
            'quantity' => 2,
            'unit_price' => 150,
            'total_price' => 300,
            'barcode_number' => fake()->uuid(),
            'status' => 'received',
        ];
    }
}
