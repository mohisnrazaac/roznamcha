<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('ration_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('item_name');
            $table->string('unit')->nullable();
            $table->decimal('stock_quantity', 10, 2)->default(0);
            $table->decimal('daily_usage', 10, 2)->default(0);
            $table->decimal('price_per_unit', 12, 2)->nullable();
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('ration_items');
    }
};
