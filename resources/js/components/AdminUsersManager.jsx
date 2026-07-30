import React, { useState } from 'react';
import api from '../api/axios';
import ServerSideTable from '../components/ServerSideTable';

const AdminUsersManager = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [confirmToggle, setConfirmToggle] = useState(null);

  const handleToggleActive = async (user) => {
    try {
      await api.patch(`/users/${user.id}/toggle-active`);
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      alert(err.response?.data?.message || 'No se pudo actualizar el estado del usuario.');
    } finally {
      setConfirmToggle(null);
    }
  };

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
    {
      header: 'Rol',
      accessorKey: 'roles',
      cell: (row) => (
        <span className="capitalize bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-md text-[10px] font-bold">
          {row.roles && row.roles.length > 0 ? row.roles[0] : 'Sin rol'}
        </span>
      ),
    },
    {
      header: 'Estado',
      accessorKey: 'active',
      cell: (row) => (
        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${row.active ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {row.active ? 'Activo' : 'Desactivado'}
        </span>
      ),
    },
    {
      header: 'Acciones',
      id: 'actions',
      cell: (row) => (
        <div className="text-right">
          <button
            onClick={() => setConfirmToggle(row)}
            className={`font-bold hover:underline text-xs ${row.active ? 'text-red-600' : 'text-emerald-700'}`}
          >
            {row.active ? 'Desactivar' : 'Activar'}
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

      <ServerSideTable
        key={refreshKey}
        endpoint="/users"
        columns={columns}
      />

      {confirmToggle && (
        <ConfirmToggleModal
          user={confirmToggle}
          onCancel={() => setConfirmToggle(null)}
          onConfirm={() => handleToggleActive(confirmToggle)}
        />
      )}
    </div>
  );
};

function ConfirmToggleModal({ user, onCancel, onConfirm }) {
  const activar = !user.active;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-800">
          {activar ? 'Activar cuenta' : 'Desactivar cuenta'}
        </h3>
        <p className="text-sm text-slate-600">
          ¿Seguro que quieres {activar ? 'activar' : 'desactivar'} la cuenta de <strong>{user.name}</strong>?
          {!activar && ' No podrá iniciar sesión mientras esté desactivada.'}
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl cursor-pointer">Cancelar</button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white text-xs font-bold rounded-xl cursor-pointer ${activar ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-red-600 hover:bg-red-700'}`}
          >
            Sí, {activar ? 'activar' : 'desactivar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminUsersManager;