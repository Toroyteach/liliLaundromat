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
        Schema::create('audits', function (Blueprint $table) {
            $table->increments('id');
            $table->text('description'); // Action performed (e.g., created, updated, deleted)
            $table->unsignedInteger('subject_id')->nullable(); // ID of the model being audited
            $table->string('subject_type')->nullable(); // Type of the model being audited (e.g., App\Models\User)
            $table->unsignedInteger('user_id')->nullable(); // ID of the user who performed the action
            $table->json('properties')->nullable(); // Properties or changes made to the model
            $table->string('host', 45)->nullable(); // IP address of the request
            $table->string('user_agent')->nullable(); // Device and browser details
            $table->string('referer')->nullable(); // The previous URL
            $table->string('request_method', 10)->nullable(); // HTTP request method (e.g., GET, POST)
            $table->json('headers')->nullable(); // Important request headers
            $table->string('url')->nullable(); // Full URL accessed during the action
            $table->json('query_params')->nullable(); // Query parameters passed in the URL
            $table->timestamps(); // Created at and updated at timestamps
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audits');
    }
};
