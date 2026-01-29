<?php

// Purpose: Add default flags and nullable owner to ration items. Date: 2026-02-22. Author: Codex.

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ration_items', function (Blueprint $table) {
            if (! Schema::hasColumn('ration_items', 'is_default')) {
                $positionColumn = Schema::hasColumn('ration_items', 'is_active') ? 'is_active' : 'unit';
                $table->boolean('is_default')->default(false)->after($positionColumn);
            }

            $table->unsignedBigInteger('user_id')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('ration_items', function (Blueprint $table) {
            if (Schema::hasColumn('ration_items', 'is_default')) {
                DB::table('ration_items')->where('is_default', true)->delete();
                $table->dropColumn('is_default');
            }

            $table->unsignedBigInteger('user_id')->nullable(false)->change();
        });
    }
};
