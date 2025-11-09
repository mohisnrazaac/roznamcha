<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('ration_prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ration_item_id')->constrained('ration_items')->cascadeOnDelete();
            $table->foreignId('household_id')->nullable()->constrained('households')->nullOnDelete();
            $table->decimal('price', 12, 2);
            $table->date('priced_at');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ration_prices');
    }
};
