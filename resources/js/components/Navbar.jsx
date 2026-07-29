import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ContactClinicModal from './ContactClinicModal'; // <-- Importamos el nuevo modal

const Navbar = ({ user, isMobileOpen, setIsMobileOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false); // <-- Estado para el modal de contacto
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  return (
    <>
      <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between shadow-sm sticky top-0 z-30">
        
        {/* Título de la Clínica */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden text-slate-600 hover:text-slate-900 font-bold p-1 cursor-pointer"
          >
            ☰
          </button>
          <span className="text-xs font-black text-slate-700 uppercase tracking-wider hidden sm:inline-block">
            CLÍNICA DE ODONTOPEDIATRÍA
          </span>
        </div>

        {/* Acciones de Contacto del Cliente + Rol + Perfil */}
        <div className="flex items-center gap-3">
          
          {/* Botón rápido para que el Tutor/Cliente contacte a la clínica */}
          <button
            type="button"
            onClick={() => setIsContactOpen(true)}
            className="hidden sm:flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#0B5B42] border border-emerald-200 px-3 py-1.5 rounded-full text-xs font-extrabold transition cursor-pointer shadow-2xs"
            title="Contactar con la clínica por WhatsApp o Correo"
          >
            <span>💬</span>
            <span>Ayuda / Contacto</span>
          </button>

          {/* Badge de Rol */}
          <span className="px-3 py-1 text-[11px] font-bold rounded-full bg-emerald-100 text-[#0B5B42] uppercase tracking-wide">
            {user?.role || 'TUTOR'}
          </span>

          {/* Avatar y Menú de Usuario */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 transition cursor-pointer focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-[#0B5B42] text-white font-bold flex items-center justify-center text-xs shadow-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>

              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-800 leading-none">
                  {user?.name || 'Usuario'}
                </p>
                <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                  Ver opciones
                </p>
              </div>

              <span className="text-slate-400 text-[10px] ml-0.5">
                {isDropdownOpen ? '▲' : '▼'}
              </span>
            </button>

            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                <div className="px-4 py-3 border-b border-slate-100 space-y-1">
                  <p className="text-xs font-bold text-slate-800 truncate">{user?.name}</p>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1.5 truncate">
                    <span>✉️</span>
                    <span>{user?.email || 'Sin correo registrado'}</span>
                  </p>
                </div>

                {/* Opción de contacto dentro del menú también */}
                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsContactOpen(true);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs text-emerald-800 hover:bg-emerald-50 font-bold flex items-center gap-2 transition cursor-pointer"
                >
                  <span>💬</span>
                  <span>Soporte por WhatsApp / Correo</span>
                </button>

                <Link
                  to="/profile"
                  onClick={() => setIsDropdownOpen(false)}
                  className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-emerald-50 hover:text-[#0B5B42] font-semibold flex items-center gap-2 transition"
                >
                  <span>👤</span>
                  <span>Mi Perfil</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 font-semibold flex items-center gap-2 transition cursor-pointer border-t border-slate-100 mt-1"
                >
                  <span>🚪</span>
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Modal de Contacto para el Cliente */}
      <ContactClinicModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </>
  );
};

export default Navbar;