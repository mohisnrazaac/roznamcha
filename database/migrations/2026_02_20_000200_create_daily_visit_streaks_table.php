<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tracks quiet daily visits so we can surface streak copy without gamification.
     */
    public function up(): void
    {
        Schema::create('daily_visit_streaks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->date('last_visited_on')->nullable();
            $table->unsignedInteger('streak_count')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_visit_streaks');
    }
};
