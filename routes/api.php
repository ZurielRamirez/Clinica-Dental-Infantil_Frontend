<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController; // Importamos el controlador si existe
use Illuminate\Support\Facades\Route;

// Rutas públicas de Autenticación
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rutas protegidas con Sanctum
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // 👇 Ruta para la tabla server-side (Punto 8)
    Route::get('/users', function (\Illuminate\Http\Request $request) {
        $query = \App\Models\User::query();

        // Búsqueda server-side
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('email', 'LIKE', "%{$search}%");
            });
        }

        // Filtro por rol
        if ($request->has('filter') && $request->filter != '') {
            $query->where('role', $request->filter);
        }

        // Paginación nativa de Laravel
        return response()->json($query->paginate(10));
    });
});