<?php
// Purpose: Persist freshness-aware programmatic SEO snapshot rows without touching legacy tables. Date: 2026-03-29. Author: Mohsin.

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('seo_page_snapshots', function (Blueprint $table) {
            $table->id();
            $table->string('page_type', 50);
            $table->string('page_key', 100);
            $table->string('title');
            $table->decimal('value_1', 12, 2)->nullable();
            $table->decimal('value_2', 12, 2)->nullable();
            $table->decimal('value_3', 12, 2)->nullable();
            $table->text('summary_text')->nullable();
            $table->text('comparison_text')->nullable();
            $table->date('effective_date')->nullable();
            $table->string('source_label')->nullable();
            $table->json('extra_json')->nullable();
            $table->timestamps();

            $table->index(['page_type', 'page_key']);
            $table->index(['page_type', 'page_key', 'effective_date'], 'seo_page_snapshots_lookup_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('seo_page_snapshots');
    }
};
