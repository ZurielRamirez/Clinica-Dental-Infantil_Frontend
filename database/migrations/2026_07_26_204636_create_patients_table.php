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
    Schema::create('patients', function (Blueprint $table) {
        $table->id();
        $table->foreignId('tutor_id')->constrained('users')->onDelete('cascade');
        $table->string('first_name');
        $table->string('last_name');
        $table->date('birth_date');
        $table->text('allergies')->nullable();
        $table->text('medical_notes')->nullable();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
