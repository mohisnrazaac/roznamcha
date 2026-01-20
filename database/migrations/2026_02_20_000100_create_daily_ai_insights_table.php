<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Caches the once-per-day AI line per user to avoid regenerating on every visit.
     */
    public function up(): void
    {
        Schema::create('daily_ai_insights', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('insight_date');
            $table->text('ai_text');
            $table->timestamps();

            $table->unique(['user_id', 'insight_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_ai_insights');
    }
};
