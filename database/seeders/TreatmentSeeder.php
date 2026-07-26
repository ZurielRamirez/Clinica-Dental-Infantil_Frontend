<?php

namespace Database\Seeders;

use App\Models\Treatment;
use Illuminate\Database\Seeder;

class TreatmentSeeder extends Seeder
{
    public function run(): void
    {
        Treatment::create(['name' => 'Limpieza Dental Infantil', 'description' => 'Profilaxis y aplicación de flúor', 'price' => 500.00]);
        Treatment::create(['name' => 'Resina Fotocurable', 'description' => 'Restauración por caries', 'price' => 800.00]);
        Treatment::create(['name' => 'Pulpotomía', 'description' => 'Tratamiento pulpar para dientes de leche', 'price' => 1200.00]);
        Treatment::create(['name' => 'Extracción Simple', 'description' => 'Extracción de diente caduco', 'price' => 450.00]);
        Treatment::create(['name' => 'Sellador de Fosetas', 'description' => 'Prevención de caries en molares', 'price' => 350.00]);
    }
}