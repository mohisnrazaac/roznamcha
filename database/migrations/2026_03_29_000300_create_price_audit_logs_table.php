<?php
// Purpose: Store audit comparisons between fallback fuel sources for manual review and alerting. Date: 2026-03-29. Author: Mohsin.

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('price_audit_logs', function (Blueprint $table) {
            $table->id();
            $table->string('source', 100);
            $table->string('fuel_type', 100);
            $table->decimal('scraped_price', 12, 2)->nullable();
            $table->decimal('stored_price', 12, 2)->nullable();
            $table->decimal('difference', 12, 2)->nullable();
            $table->timestamp('checked_at');
            $table->timestamps();

            $table->index(['source', 'checked_at']);
            $table->index(['fuel_type', 'checked_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('price_audit_logs');
    }
};
