<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $user->roles()->attach($request->role_id);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Usuario registrado exitosamente',
            'user' => $user->load('roles'),
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales proporcionadas son incorrectas.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Inicio de sesión exitoso',
            'user' => $user->load('roles'),
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user()->load('roles'),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Sesión cerrada correctamente',
        ]);
    }
}