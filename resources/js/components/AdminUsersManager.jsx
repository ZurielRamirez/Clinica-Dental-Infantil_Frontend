import React from 'react';
import ServerSideTable from './ServerSideTable';

const AdminUsersManager = () => {
  const columns = [
    { header: 'ID', accessor: 'id' },
    { 
      header: 'Nombre', 
      accessor: 'name',
      render: (row) => <span className="font-bold text-gray-800">{row.name}</span>
    },
    { header: 'Correo Electrónico', accessor: 'email' },
    {
      header: 'Rol',
      accessor: 'role',
      render: (row) => (
        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
          row.role === 'admin' ? 'bg-purple-100 text-purple-800' :
          row.role === 'doctor' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
        }`}>
          {row.role ? row.role.toUpperCase() : 'TUTOR'}
        </span>
      )
    }
  ];

  const roleFilters = [
    { label: 'Administradores', value: 'admin' },
    { label: 'Doctores / Especialistas', value: 'doctor' },
    { label: 'Padres / Tutores', value: 'tutor' }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl border border-emerald-100 shadow-sm">
        <h1 className="text-2xl font-bold text-emerald-900">Gestión de Usuarios del Sistema</h1>
        <p className="text-sm text-gray-600 mt-1">Tabla conectada a API REST de Laravel con búsqueda y paginación server-side.</p>
      </div>

      <ServerSideTable
        columns={columns}
        fetchUrl="/api/users"
        filterOptions={roleFilters}
        placeholderSearch="Buscar por nombre o correo..."
      />
    </div>
  );
};

export default AdminUsersManager;