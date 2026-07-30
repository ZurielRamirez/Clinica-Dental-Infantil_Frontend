import React from 'react';
import ServerSideTable from '../components/ServerSideTable'; // Ajusta la ruta a tu componente de tabla

const AdminUsersManager = () => {
  // Configuración de columnas adaptada a la respuesta de la API
  const columns = [
    {
      header: 'Usuario',
      accessorKey: 'name',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#0B5B42] font-bold flex items-center justify-center text-xs">
            👤
          </div>
          <div>
            <p className="font-bold text-slate-800">{row.name}</p>
            <p className="text-[11px] text-slate-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Teléfono',
      accessorKey: 'phone',
      cell: (row) => (
        <span className="text-slate-600 text-xs font-medium">
          {row.phone || 'N/A'}
        </span>
      ),
    },
    // 2. Columna de Rol mapeando el array 'roles'
    {
      header: 'Rol',
      accessorKey: 'roles',
      cell: (row) => (
        <span className="capitalize bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-md text-[10px] font-bold">
          {row.roles && row.roles.length > 0 ? row.roles[0] : 'Sin rol'}
        </span>
      ),
    },
    // 3. Columna de Acciones sin usar alert() nativo
    {
      header: 'Acciones',
      id: 'actions',
      cell: (row) => (
        <div className="text-right">
          <button
            onClick={() => console.log('Editar usuario ID:', row.id)}
            className="text-[#0B5B42] font-bold hover:underline text-xs"
          >
            Editar
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#004D40]">Gestión de Usuarios</h1>
          <p className="text-sm text-slate-500">Administra cuentas, roles y accesos a la plataforma.</p>
        </div>
      </div>

      {/* 1. Endpoint corregido a /users */}
      <ServerSideTable
        endpoint="/users"
        columns={columns}
      />
    </div>
  );
};

export default AdminUsersManager;