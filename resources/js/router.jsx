import React from 'react';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts y Guardián
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';

// Vistas Públicas
import Login from './components/Login';
import Register from './components/Register';

// Vistas Existentes
import AdminUsersManager from './components/AdminUsersManager';
import DoctorDashboard from './components/DoctorDashboard';
import PatientsManager from './components/PatientsManager';
import Profile from './components/Profile';

// Componentes con fallback seguro para el Admin
const AdminAppointmentsView = () => (
  <div className="space-y-4">
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">📅</span>
        <h2 className="text-xl font-bold text-slate-800">Citas Globales de la Clínica</h2>
      </div>
      <p className="text-xs text-slate-500 mb-4">
        Panel de administración general para consultar, reprogramar o cancelar citas de todos los doctores.
      </p>
      {/* Cargar el Dashboard de citas en modo global */}
      <DoctorDashboard />
    </div>
  </div>
);

const NotFound = () => (
  <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
    <div className="text-6xl mb-4">🩺</div>
    <h1 className="text-3xl font-black text-slate-800 mb-2">404 - Página No Encontrada</h1>
    <a href="/login" className="px-5 py-2.5 bg-[#0B5B42] text-white font-bold text-xs rounded-xl shadow-md">
      Volver al Inicio
    </a>
  </div>
);

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTAS PÚBLICAS */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* RUTAS PROTEGIDAS CON MAINLAYOUT */}
        <Route element={<MainLayout />}>
          
          {/* PERFIL */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'doctor', 'dentist', 'tutor', 'ADMIN', 'DOCTOR', 'TUTOR']} />}>
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* ROL ADMINISTRADOR */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminUsersManager />} />
            <Route path="/admin/users" element={<AdminUsersManager />} />
          </Route>

          {/* ROL DOCTOR / ODONTOPEDIATRA */}
          <Route element={<ProtectedRoute allowedRoles={['doctor', 'dentist', 'DOCTOR', 'DENTIST']} />}>
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor/patients" element={<PatientsManager />} />
          </Route>

          {/* ROL TUTOR / PADRE */}
          <Route element={<ProtectedRoute allowedRoles={['tutor', 'TUTOR']} />}>
            <Route path="/tutor/dashboard" element={<PatientsManager />} />
            <Route path="/tutor/patients" element={<PatientsManager />} />
          </Route>

          {/* RUTAS COMPARTIDAS (Pacientes y Citas) */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'doctor', 'dentist', 'tutor', 'ADMIN', 'DOCTOR', 'TUTOR']} />}>
            <Route path="/patients" element={<PatientsManager />} />
            <Route path="/appointments" element={<AdminAppointmentsView />} />
            <Route path="/history" element={<PatientsManager />} />
          </Route>

        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;