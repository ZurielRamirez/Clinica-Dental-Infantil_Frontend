<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        Role::create(['name' => 'admin', 'display_name' => 'Administrador']);
        Role::create(['name' => 'dentist', 'display_name' => 'Odontopediatra']);
        Role::create(['name' => 'tutor', 'display_name' => 'Tutor / Padre']);
    }
}