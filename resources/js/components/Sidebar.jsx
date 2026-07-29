import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ user, isMobileOpen, setIsMobileOpen }) => {
  const location = useLocation();

  // Normalizar rol a minúsculas y verificar si viene como string u objeto
  const rawRole = typeof user?.role === 'string' 
    ? user.role 
    : (user?.roles && user.roles[0]?.name) || 'tutor';
    
  const role = rawRole.toLowerCase();

  const getNavLinks = () => {
    switch (role) {
      case 'admin':
      case 'administrador':
        return [
          { name: 'Gestión de Usuarios', path: '/admin/users', icon: '👥' },
          { name: 'Pacientes', path: '/patients', icon: '👶' },
          { name: 'Citas Globales', path: '/appointments', icon: '📅' },
        ];

      case 'doctor':
      case 'dentist':
      case 'odontopediatra':
        return [
          { name: 'Mi Agenda', path: '/doctor/dashboard', icon: '🩺' },
          { name: 'Expedientes Pacientes', path: '/doctor/patients', icon: '📋' },
        ];

      case 'tutor':
      case 'padre':
      default:
        return [
          { name: 'Mis Pacientes (Hijos)', path: '/tutor/patients', icon: '👶' },
          { name: 'Citas Agendadas', path: '/appointments', icon: '📅' },
          { name: 'Historial Clínico', path: '/history', icon: '📑' },
        ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <aside
      className={`fixed md:relative inset-y-0 left-0 z-40 md:z-30 w-64 bg-[#0B5B42] text-white flex-shrink-0 p-5 flex flex-col justify-between shadow-xl transition-transform duration-300 transform ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      <div className="space-y-6">
        {/* Header / Logo */}
        <div className="flex items-center justify-between pb-4 border-b border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white text-[#0B5B42] font-black rounded-xl flex items-center justify-center text-xl shadow-sm">
              🦷
            </div>
            <div>
              <h2 className="font-bold text-sm leading-tight">Clínica Dental</h2>
              <p className="text-[11px] text-emerald-200 capitalize">
                Módulo {role}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden text-emerald-200 hover:text-white font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Links de Navegación */}
        <nav className="space-y-1.5 relative z-50">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileOpen(false)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer relative z-50 ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-emerald-100 hover:bg-emerald-900/50'
                }`}
              >
                <span className="pointer-events-none">{link.icon}</span>
                <span className="pointer-events-none">{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Perfil del Usuario */}
      <div className="pt-4 border-t border-emerald-800 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-emerald-700 flex items-center justify-center text-xs font-bold text-white border border-emerald-500">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="overflow-hidden flex-1">
          <p className="text-xs font-bold truncate">{user?.name || 'Usuario'}</p>
          <p className="text-[10px] text-emerald-300 truncate">{user?.email || 'sesion@clinica.com'}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;