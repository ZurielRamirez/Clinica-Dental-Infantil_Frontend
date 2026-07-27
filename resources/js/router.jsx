import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Importamos los componentes reales
import Login from './components/Login';
import Register from './components/Register';

// Placeholders para los Dashboards (se reemplazarán en pasos posteriores)
const AdminDashboard = () => <div className="p-8"><h1 className="text-2xl font-bold text-emerald-800">Dashboard de Administrador</h1></div>;
const DoctorDashboard = () => <div className="p-8"><h1 className="text-2xl font-bold text-emerald-800">Dashboard de Doctor / Odontólogo</h1></div>;
const TutorDashboard = () => <div className="p-8"><h1 className="text-2xl font-bold text-emerald-800">Portal del Tutor / Padre</h1></div>;
const NotFound = () => <div className="p-8 text-center text-red-600 font-bold">404 - Página No Encontrada</div>;

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas Protegidas por Rol */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['tutor']} />}>
          <Route path="/tutor/dashboard" element={<TutorDashboard />} />
        </Route>

        {/* Redirecciones y 404 */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;