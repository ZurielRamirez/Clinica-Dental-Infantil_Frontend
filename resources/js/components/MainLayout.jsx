import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const MainLayout = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      {/* Navbar persiste arriba */}
      <Navbar />

      {/* Renderiza el contenido específico de cada ruta (/admin/dashboard, /tutor/dashboard, etc.) */}
      <main className="container mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;