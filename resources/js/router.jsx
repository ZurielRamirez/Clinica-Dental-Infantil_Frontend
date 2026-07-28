import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import PatientsManager from './components/PatientsManager';
import AdminUsersManager from './components/AdminUsersManager';

// Vistas Públicas
import Login from './components/Login';
import Register from './components/Register';

// Vista de Perfil
import Profile from './components/Profile';

const NotFound = () => <div className="p-8 text-center text-red-600 font-bold">404 - Página No Encontrada</div>;

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas Protegidas dentro del MainLayout */}
        <Route element={<MainLayout />}>
          
          {/* Ruta de Perfil común */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'doctor', 'tutor']} />}>
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Rutas ADMIN: Ahora la raíz del dashboard carga la tabla de usuarios */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminUsersManager />} />
            <Route path="/admin/users" element={<AdminUsersManager />} />
          </Route>

          {/* Rutas DOCTOR / DENTIST: Carga la gestión de pacientes y expedientes */}
          <Route element={<ProtectedRoute allowedRoles={['doctor', 'dentist']} />}>
            <Route path="/doctor/dashboard" element={<PatientsManager />} />
            <Route path="/doctor/patients" element={<PatientsManager />} />
          </Route>

          {/* Rutas TUTOR: Carga la gestión de pacientes (tarjetas de sus hijos) */}
          <Route element={<ProtectedRoute allowedRoles={['tutor']} />}>
            <Route path="/tutor/dashboard" element={<PatientsManager />} />
          </Route>
        </Route>

        {/* Redirecciones generales */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;