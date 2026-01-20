<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Daily snapshot table keeps CMS text that powers the home + blog hooks.
     * Each row represents one day's public copy so marketing can refresh without deployments.
     */
    public function up(): void
    {
        Schema::create('daily_money_snapshots', function (Blueprint $table) {
            $table->id();
            $table->date('snapshot_date')->unique();
            $table->text('expense_summary_text')->nullable();
            $table->text('inflation_status_text')->nullable();
            $table->text('saving_tip_text')->nullable();
            $table->text('today_update_line')->nullable();
            $table->text('yesterday_change_line')->nullable();
            $table->text('kharcha_cta_label')->nullable();
            $table->text('kharcha_cta_url')->nullable();
            $table->text('ration_cta_label')->nullable();
            $table->text('ration_cta_url')->nullable();
            $table->timestamp('last_updated_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * The hooks need to stay queryable even if rollback happens, hence matching cleanup.
     */
    public function down(): void
    {
        Schema::dropIfExists('daily_money_snapshots');
    }
};
