import React from 'react';

const Profile = () => {
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : { name: 'Usuario', role: 'Invitado', email: 'correo@kiddiedent.com' };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': return 'Administrador / Recepción';
      case 'doctor': return 'Especialista / Odontopediatra';
      case 'tutor': return 'Padre de Familia / Tutor';
      default: return role;
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-emerald-100 overflow-hidden mt-4">
      {/* Cabecera del Perfil */}
      <div className="bg-emerald-800 p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white text-emerald-800 font-bold text-2xl flex items-center justify-center shadow">
            {user.name ? user.name.slice(0, 2).toUpperCase() : 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-emerald-100 text-sm">{getRoleLabel(user.role)}</p>
          </div>
        </div>
      </div>

      {/* Detalles de la Cuenta */}
      <div className="p-6 space-y-6">
        <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2">Información de la Cuenta</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">Nombre Completo</span>
            <p className="text-gray-800 font-medium">{user.name}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">Correo Electrónico</span>
            <p className="text-gray-800 font-medium">{user.email || 'No registrado'}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">Rol Asignado</span>
            <p className="text-gray-800 font-medium">{getRoleLabel(user.role)}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">Estado de la Cuenta</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mt-1">
              • Activo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;