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
        Schema::create('garmet_types', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name')->unique();
            $table->enum('default_pricing_mode', ['per_piece', 'per_kg'])->default('per_piece');
            $table->decimal('default_price', 10, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('garmet_types');
    }
};
