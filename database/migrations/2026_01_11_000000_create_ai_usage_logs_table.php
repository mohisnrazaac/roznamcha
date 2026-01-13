<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_usage_logs', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('module');
            $table->date('used_on_date');
            $table->unsignedInteger('request_count')->default(0);
            $table->timestamps();

            $table->unique(['user_id', 'module', 'used_on_date'], 'ai_usage_logs_unique');
            $table->index(['used_on_date', 'module']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_usage_logs');
    }
};
