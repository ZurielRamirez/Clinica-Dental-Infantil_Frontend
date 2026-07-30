import React from 'react';
import ServerSideTable from '../components/ServerSideTable'; // O la ruta correspondiente a tu tabla

const PatientsManager = () => {
  // Configuración de columnas sincronizada con los atributos del Backend
  const columns = [
    {
      header: 'Paciente / Hijo',
      accessorKey: 'first_name',
      cell: (row) => (
        <div className="flex items-center gap-3 font-bold text-slate-800">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#0B5B42] font-bold flex items-center justify-center text-xs">
            👶
          </div>
          <div>
            <p className="font-bold">{row.first_name} {row.last_name}</p>
            <p className="text-[10px] text-slate-400">Nacimiento: {row.birth_date}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Alergias',
      accessorKey: 'allergies',
      cell: (row) => (
        <span className={row.allergies && row.allergies !== 'Ninguna' ? 'text-red-600 font-bold' : 'text-slate-500'}>
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
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#004D40]">Mis Pacientes Registrados</h1>
          <p className="text-sm text-slate-500">Consulta la lista y ficha clínica de tus hijos/tutelados.</p>
        </div>
      </div>

      {/* Endpoint corregido a /patients */}
      <ServerSideTable
        endpoint="/patients"
        columns={columns}
      />
    </div>
  );
};

export default PatientsManager;