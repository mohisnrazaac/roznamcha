<?php
// Purpose: Create persisted smart budget templates and seed starter catalog records. Date: 2026-03-27. Author: Codex.

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('budget_templates', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('category')->index();
            $table->unsignedInteger('base_salary_target');
            $table->boolean('is_premium')->default(false)->index();
            $table->unsignedInteger('price')->nullable();
            $table->longText('template_json')->nullable();
            $table->timestamps();
        });

        DB::table('budget_templates')->insert([
            [
                'title' => '50k Salary Survival Guide',
                'slug' => '50k-salary-survival-guide',
                'category' => 'salary_based',
                'base_salary_target' => 50000,
                'is_premium' => false,
                'price' => null,
                'template_json' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => '100k Family Budget',
                'slug' => '100k-family-budget',
                'category' => 'family',
                'base_salary_target' => 100000,
                'is_premium' => true,
                'price' => 1499,
                'template_json' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Student Budget',
                'slug' => 'student-budget',
                'category' => 'student',
                'base_salary_target' => 25000,
                'is_premium' => false,
                'price' => null,
                'template_json' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Joint Family Budget',
                'slug' => 'joint-family-budget',
                'category' => 'joint_family',
                'base_salary_target' => 150000,
                'is_premium' => true,
                'price' => 2499,
                'template_json' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('budget_templates');
    }
};
