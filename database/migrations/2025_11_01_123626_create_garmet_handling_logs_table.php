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
        Schema::create('garmet_handling_logs', function (Blueprint $table) {
            $table->increments('id');
            $table->foreignId('order_item_id')->constrained()->cascadeOnDelete();
            $table->foreignId('handled_by_user_id')->constrained('users')->cascadeOnDelete();
            $table->string('stage')->index();
            $table->timestamp('scanned_at')->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('garmet_handling_logs');
    }
};
