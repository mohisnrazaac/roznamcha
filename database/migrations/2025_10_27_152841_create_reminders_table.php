<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('reminders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['bill', 'school_fee', 'medicine', 'fuel', 'other'])->default('other');
            $table->string('title');
            $table->text('description')->nullable();
            $table->dateTime('next_due')->nullable();
            $table->string('frequency')->default('monthly');
            $table->enum('status', ['pending', 'done'])->default('pending');
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('reminders');
    }
};
