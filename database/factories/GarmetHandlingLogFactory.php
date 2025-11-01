<?php

namespace Database\Factories;

use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\GarmetHandlingLog>
 */
class GarmetHandlingLogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
    return [
        'order_item_id'=>OrderItem::factory(),
        'handled_by_user_id'=>User::factory(),
        'stage'=>'received',
        'scanned_at'=>now(),
    ];
    }
}
