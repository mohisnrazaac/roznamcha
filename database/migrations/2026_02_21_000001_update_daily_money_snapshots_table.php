<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Daily snapshots keep Pakistan household guidance fresh each midnight so the Daily Return widget never feels stale.
 * This migration keeps the table automation-ready without deleting the manual CMS columns other teams still depend on.
 */
return new class extends Migration
{
    /**
     * Adding source metadata lets us track which public indicators generated each Urdu line without persisting raw payloads.
     * That transparency helps explain to users how the midnight snapshot supports their 12 AM return habit.
     */
    public function up(): void
    {
        if (! Schema::hasColumn('daily_money_snapshots', 'source_metadata')) {
            Schema::table('daily_money_snapshots', function (Blueprint $table) {
                $table->json('source_metadata')
                    ->nullable()
                    ->after('yesterday_change_line')
                    ->comment('Structured references that explain how the 12 AM automation built each Urdu line.');
            });
        }
    }

    /**
     * Rollback only drops the automation metadata so legacy manual workflows stay untouched.
     */
    public function down(): void
    {
        if (Schema::hasColumn('daily_money_snapshots', 'source_metadata')) {
            Schema::table('daily_money_snapshots', function (Blueprint $table) {
                $table->dropColumn('source_metadata');
            });
        }
    }
};
