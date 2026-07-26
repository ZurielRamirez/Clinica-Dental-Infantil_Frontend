<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::where('name', 'admin')->first();
        $dentistRole = Role::where('name', 'dentist')->first();
        $tutorRole = Role::where('name', 'tutor')->first();

        // 1. Usuario Administrador
        $admin = User::create([
            'name' => 'Administrador General',
            'email' => 'admin@clinicadental.com',
            'password' => Hash::make('password123'),
        ]);
        $admin->roles()->attach($adminRole);

        // 2. Usuario Odontopediatra
        $dentist = User::create([
            'name' => 'Dra. María González',
            'email' => 'dentista@clinicadental.com',
            'password' => Hash::make('password123'),
        ]);
        $dentist->roles()->attach($dentistRole);

        // 3. Usuario Tutor (Padre de familia)
        $tutor = User::create([
            'name' => 'Juan Perez',
            'email' => 'tutor@gmail.com',
            'password' => Hash::make('password123'),
        ]);
        $tutor->roles()->attach($tutorRole);
    }
}