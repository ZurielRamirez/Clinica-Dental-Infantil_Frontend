import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Cargar usuario desde LocalStorage
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : { name: 'Usuario Registrado', role: 'tutor', email: 'usuario@kiddiedent.com' };

  // Helper para iniciales
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Formatear etiquetas de rol
  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': return 'Administración';
      case 'doctor': return 'Especialista';
      case 'tutor': return 'Padre / Tutor';
      default: return role;
    }
  };

  // Cierre al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
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
    <header className="navbar-custom">
      {/* Brand / Logo Oficial */}
      <div className="navbar-brand">
        <img 
          src="/logo.png" 
          alt="Logo Clínica Dental Infantil" 
          style={{ width: '32px', height: '32px', objectFit: 'contain' }} 
        />
        <span>Clínica Dental Infantil</span>
      </div>

      {/* Perfil & Menú Desplegable */}
      <div className="navbar-user-menu" ref={dropdownRef}>
        <div 
          className="user-profile-trigger" 
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <span className="user-role">{getRoleLabel(user.role)}</span>
          </div>

          <div className="user-avatar">
            {getInitials(user.name)}
          </div>
        </div>

        {/* Tarjeta Ejecutiva Desplegable */}
        {dropdownOpen && (
          <div className="profile-dropdown">
            {/* Header del Menú */}
            <div className="dropdown-header-card">
              <div className="dropdown-avatar-large">
                {getInitials(user.name)}
              </div>
              <div className="dropdown-user-details">
                <p className="dropdown-user-name" title={user.name}>{user.name}</p>
                <p className="dropdown-user-email" title={user.email}>{user.email || 'correo@kiddiedent.com'}</p>
                <span className={`role-badge ${user.role}`}>
                  {getRoleLabel(user.role)}
                </span>
              </div>
            </div>

            {/* Opciones (Solo Mi Perfil y Cerrar Sesión) */}
            <div className="dropdown-body">
              <button 
                onClick={() => {
                  setDropdownOpen(false);
                  navigate('/profile');
                }} 
                className="dropdown-item-btn"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Mi Perfil
              </button>

              <div className="dropdown-divider-line"></div>

              <button onClick={handleLogout} className="dropdown-item-btn logout-btn-item">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;