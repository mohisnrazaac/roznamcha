<?php
// Purpose: Track saved budget templates and premium unlock state per user household. Date: 2026-03-27. Author: Codex.

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('budget_template_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('budget_template_id')->constrained('budget_templates')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('household_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamp('saved_at')->nullable();
            $table->timestamp('last_viewed_at')->nullable();
            $table->timestamp('last_downloaded_at')->nullable();
            $table->timestamp('pro_unlocked_at')->nullable();
            $table->string('purchase_provider')->nullable();
            $table->string('purchase_reference')->nullable();
            $table->timestamps();

            $table->unique(['budget_template_id', 'user_id']);
            $table->index(['user_id', 'saved_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('budget_template_user');
    }
};
