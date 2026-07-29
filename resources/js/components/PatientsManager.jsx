import React from 'react';
import ServerSideTable from './ServerSideTable';

const PatientsManager = () => {
  const columns = [
    {
      header: 'Paciente / Hijo',
      accessorKey: 'name',
      cell: (row) => (
        <div className="flex items-center gap-3 font-bold text-slate-800">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#0B5B42] font-bold flex items-center justify-center text-xs">
            👶
          </div>
          <div>
            <p className="font-bold">{row.name}</p>
            <p className="text-[10px] text-slate-400">Nacimiento: {row.birthdate || '2019-05-12'}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Edad',
      accessorKey: 'age',
      cell: (row) => (
        <span className="bg-slate-100 px-2 py-1 rounded text-xs font-semibold text-slate-700">
          {row.age || '7'} años
        </span>
      ),
    },
    {
      header: 'Alergias',
      accessorKey: 'allergies',
      cell: (row) => (
        <span className={row.allergies ? 'text-red-600 font-bold' : 'text-slate-500'}>
          {row.allergies || 'Ninguna'}
        </span>
      ),
    },
    {
      header: 'Acciones',
      id: 'actions',
      cell: (row) => (
        <div className="text-right">
          <button className="text-[#0B5B42] font-bold hover:underline text-xs">
            Ver Ficha
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Gestión de Pacientes / Hijos</h2>
          <p className="text-xs text-slate-500">Registra y administra las fichas pediátricas de los pacientes.</p>
        </div>
        <button className="px-4 py-2.5 bg-[#0B5B42] text-white font-bold text-xs rounded-xl shadow-md transition">
          + Registrar Nuevo Paciente
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <ServerSideTable
          endpoint="/api/tutor/patients"
          columns={columns}
          placeholderSearch="Buscar paciente o alergia..."
        />
      </div>
    </div>
  );
};

export default PatientsManager;