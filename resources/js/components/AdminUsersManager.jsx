import React from 'react';
import ServerSideTable from './ServerSideTable';

const AdminUsersManager = () => {
  const columns = [
    {
      header: 'Usuario',
      accessorKey: 'name',
      cell: (row) => (
        <div className="flex items-center gap-3 font-bold text-slate-800">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#0B5B42] font-black flex items-center justify-center text-xs border border-emerald-200">
            {row.name ? row.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <span>{row.name || 'Usuario'}</span>
        </div>
      ),
    },
    {
      header: 'Correo Electrónico',
      accessorKey: 'email',
    },
    {
      header: 'Rol',
      accessorKey: 'role',
      cell: (row) => (
        <span className="capitalize bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-md text-[10px] font-bold">
          {row.role || 'Usuario'}
        </span>
      ),
    },
    {
      header: 'Acciones',
      id: 'actions',
      cell: (row) => (
        <div className="text-right">
          <button
            onClick={() => alert(`Editar usuario ID: ${row.id}`)}
            className="text-[#0B5B42] font-bold hover:underline text-xs"
          >
            Editar
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">👥</span>
            <h2 className="text-xl font-bold text-slate-800">Gestión de Usuarios</h2>
          </div>
          <p className="text-xs text-slate-500">
            Administra los roles, accesos y permisos de doctores, tutores y administradores.
          </p>
        </div>
        <button className="px-4 py-2.5 bg-[#0B5B42] hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2">
          <span>+</span> Registrar Nuevo Usuario
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <ServerSideTable
          endpoint="/api/users"
          columns={columns}
          placeholderSearch="Buscar por nombre o correo..."
        />
      </div>
    </div>
  );
};

export default AdminUsersManager;