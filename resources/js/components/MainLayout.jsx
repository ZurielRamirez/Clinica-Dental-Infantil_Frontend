import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const MainLayout = ({ user: customUser }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Obtener usuario
  const storedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  const user = customUser || storedUser || {
    name: 'David Santiago',
    role: 'tutor',
    email: 'tutor@gmail.com',
    phone: '+52 951 123 4567'
  };

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      
      {/* Sidebar Global */}
      <Sidebar 
        user={user} 
        isMobileOpen={isMobileOpen} 
        setIsMobileOpen={setIsMobileOpen} 
      />

      {/* Área Contenedora Principal */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        
        {/* Navbar Global */}
        <Navbar 
          user={user} 
          isMobileOpen={isMobileOpen} 
          setIsMobileOpen={setIsMobileOpen} 
        />

        {/* Contenido Dinámico con Scroll Interno */}
        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          <Outlet context={{ user }} />
        </main>

        {/* Widget WhatsApp */}
        <a
          href="https://wa.me/529513928808?text=Hola,%20necesito%20asistencia%20en%20el%20sistema%20de%20odontopediatr%C3%ADa"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-full shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2 font-bold text-xs"
          title="Hablar con la clínica por WhatsApp"
        >
          <span className="text-lg">💬</span>
          <span className="hidden md:inline">¿Dudas? Contactar Clínica</span>
        </a>

      </div>

    </div>
  );
};

export default MainLayout;