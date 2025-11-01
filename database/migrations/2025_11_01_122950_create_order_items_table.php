<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->increments('id');
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();

            $table->string('garment_type'); // shirt / curtains / duvet etc

            $table->enum('pricing_mode', ['per_piece', 'per_kg'])->default('per_piece');

            $table->integer('quantity')->default(1); // pieces count
            $table->decimal('weight_kg', 8, 2)->nullable(); // only used when per_kg

            $table->decimal('unit_price', 10, 2); // store actual price at time of order
            $table->decimal('total_price', 10, 2); // system calculates = (qty * unit_price) OR (weight * unit_price)

            $table->string('color')->nullable();
            $table->string('material')->nullable();
            $table->string('barcode_number')->unique();
            $table->string('status')->index();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
