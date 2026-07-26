<?php

namespace Database\Seeders;

use App\Models\Patient;
use App\Models\User;
use Illuminate\Database\Seeder;

class PatientSeeder extends Seeder
{
    public function run(): void
    {
        $tutor = User::where('email', 'tutor@gmail.com')->first();

        if ($tutor) {
            Patient::create([
                'tutor_id' => $tutor->id,
                'first_name' => 'Mateo',
                'last_name' => 'Perez',
                'birth_date' => '2018-05-14',
                'allergies' => 'Penicilina',
                'medical_notes' => 'Paciente colaborador'
            ]);

            Patient::create([
                'tutor_id' => $tutor->id,
                'first_name' => 'Sofía',
                'last_name' => 'Perez',
                'birth_date' => '2020-09-21',
                'allergies' => 'Ninguna',
                'medical_notes' => 'Miedo a los ruidos fuertes'
            ]);
        }
    }
}