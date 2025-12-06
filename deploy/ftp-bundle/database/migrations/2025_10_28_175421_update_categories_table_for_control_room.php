<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            if (Schema::hasColumn('categories', 'description')) {
                $table->dropColumn('description');
            }

            if (! Schema::hasColumn('categories', 'color')) {
                $table->string('color')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            if (Schema::hasColumn('categories', 'color')) {
                $table->dropColumn('color');
            }

            if (! Schema::hasColumn('categories', 'description')) {
                $table->text('description')->nullable();
            }
        });
    }
};
