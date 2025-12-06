<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('reminders', function (Blueprint $table) {
            if (! Schema::hasColumn('reminders', 'type')) {
                $table->string('type')->default('other')->after('title');
            }

            if (! Schema::hasColumn('reminders', 'schedule_cron')) {
                $table->string('schedule_cron')->nullable()->after('type');
            }

            if (! Schema::hasColumn('reminders', 'starts_on')) {
                $table->date('starts_on')->nullable()->after('schedule_cron');
            }

            if (! Schema::hasColumn('reminders', 'ends_on')) {
                $table->date('ends_on')->nullable()->after('starts_on');
            }

            if (! Schema::hasColumn('reminders', 'timezone')) {
                $table->string('timezone')->default(config('app.timezone'))->after('ends_on');
            }

            if (! Schema::hasColumn('reminders', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('timezone');
            }

            if (! Schema::hasColumn('reminders', 'household_id')) {
                $table->foreignId('household_id')
                    ->nullable()
                    ->after('user_id')
                    ->constrained('households')
                    ->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('reminders', function (Blueprint $table) {
            if (Schema::hasColumn('reminders', 'household_id')) {
                $table->dropForeign(['household_id']);
                $table->dropColumn('household_id');
            }

            foreach (['is_active', 'timezone', 'ends_on', 'starts_on', 'schedule_cron', 'type'] as $column) {
                if (Schema::hasColumn('reminders', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
