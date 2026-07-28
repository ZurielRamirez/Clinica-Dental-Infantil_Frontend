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

// Vistas Temporales de Dashboards
const AdminDashboard = () => (
  <div className="p-6 bg-white rounded-lg shadow-sm border border-emerald-100">
    <h1 className="text-2xl font-bold text-emerald-800">Panel de Control General (Administración)</h1>
    <p className="text-gray-600 mt-2">Bienvenido al sistema de administración de la Clínica Dental Infantil.</p>
  </div>
);

const DoctorDashboard = () => (
  <div className="p-6 bg-white rounded-lg shadow-sm border border-emerald-100">
    <h1 className="text-2xl font-bold text-emerald-800">Módulo Odontopediatría</h1>
    <p className="text-gray-600 mt-2">Aquí gestionarás las consultas, diagnósticos e historias clínicas.</p>
  </div>
);

const TutorDashboard = () => <PatientsManager />;

const NotFound = () => <div className="p-8 text-center text-red-600 font-bold">404 - Página No Encontrada</div>;

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas Protegidas dentro del MainLayout (Navbar Persistente) */}
        <Route element={<MainLayout />}>
          
          {/* Ruta de Perfil común (Accesible para cualquier usuario autenticado) */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'doctor', 'tutor']} />}>
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Rutas con Control de Acceso Por Rol: ADMIN */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsersManager />} />
          </Route>

          {/* Rutas con Control de Acceso Por Rol: DOCTOR */}
          <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          </Route>

          {/* Rutas con Control de Acceso Por Rol: TUTOR */}
          <Route element={<ProtectedRoute allowedRoles={['tutor']} />}>
            <Route path="/tutor/dashboard" element={<TutorDashboard />} />
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