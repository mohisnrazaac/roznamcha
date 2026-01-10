<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('blog_posts')) {
            return;
        }

        Schema::table('blog_posts', function (Blueprint $table) {
            if (! Schema::hasColumn('blog_posts', 'feature_hooks')) {
                $table->json('feature_hooks')->nullable()->after('canonical_url');
            }
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('blog_posts')) {
            return;
        }

        Schema::table('blog_posts', function (Blueprint $table) {
            if (Schema::hasColumn('blog_posts', 'feature_hooks')) {
                $table->dropColumn('feature_hooks');
            }
        });
    }
};
