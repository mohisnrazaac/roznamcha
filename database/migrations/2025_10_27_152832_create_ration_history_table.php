<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('ration_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ration_item_id')->constrained('ration_items')->onDelete('cascade');
            $table->date('change_date');
            $table->enum('change_type', ['add_stock', 'consume', 'adjustment']);
            $table->decimal('quantity_change', 10, 2);
            $table->string('notes')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('ration_history');
    }
};
