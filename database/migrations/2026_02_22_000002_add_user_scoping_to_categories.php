<?php

// Purpose: Introduce user ownership and default flags for categories. Date: 2026-02-22. Author: Codex.

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            if (! Schema::hasColumn('categories', 'is_default')) {
                $table->boolean('is_default')->default(false)->after('description');
            }

            if (! Schema::hasColumn('categories', 'user_id')) {
                $table->unsignedBigInteger('user_id')->nullable()->after('is_default');
                $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            }
        });

        DB::table('categories')->update(['is_default' => true]);
    }

    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            if (Schema::hasColumn('categories', 'user_id')) {
                $table->dropConstrainedForeignId('user_id');
            }

            if (Schema::hasColumn('categories', 'is_default')) {
                $table->dropColumn('is_default');
            }
        });
    }
};
