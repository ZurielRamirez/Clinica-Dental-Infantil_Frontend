import React, { useState } from 'react';
import api from '../api/axios';
import ServerSideTable from '../components/ServerSideTable';

const PatientsManager = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

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
          <button
            onClick={() => setSelectedPatient(row)}
            className="text-[#0B5B42] font-bold hover:underline text-xs"
          >
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
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-[#0B5B42] hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition"
        >
          + Registrar Nuevo Paciente
        </button>
      </div>

      <ServerSideTable
        key={refreshKey}
        endpoint="/patients"
        columns={columns}
      />

      {selectedPatient && (
        <PatientFichaModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}

      {showCreateModal && (
        <CreatePatientModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false);
            setRefreshKey(prev => prev + 1);
          }}
        />
      )}
    </div>
  );
};

function CreatePatientModal({ onClose, onCreated }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    birth_date: '',
    allergies: '',
    medical_notes: '',
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    setErrors({});
    setLoading(true);

    try {
      await api.post('/patients', formData);
      onCreated();
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        setGeneralError(err.response?.data?.message || 'No se pudo registrar el paciente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="fixed inset-0" onClick={() => !loading && onClose()} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden z-10">
        <div className="bg-[#0B5B42] text-white p-5 flex items-center justify-between">
          <h3 className="text-lg font-bold">Registrar Nuevo Paciente</h3>
          <button onClick={onClose} className="text-emerald-200 hover:text-white text-xl font-bold px-2 cursor-pointer">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {generalError && (
            <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">{generalError}</div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Nombre(s)</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className={`w-full text-sm p-2.5 rounded-xl border ${errors.first_name ? 'border-red-400' : 'border-slate-200'} focus:outline-none focus:border-emerald-500`}
              placeholder="Ej. Mateo"
            />
            {errors.first_name && <span className="text-xs text-red-600">{errors.first_name[0]}</span>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Apellido(s)</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className={`w-full text-sm p-2.5 rounded-xl border ${errors.last_name ? 'border-red-400' : 'border-slate-200'} focus:outline-none focus:border-emerald-500`}
              placeholder="Ej. Pérez"
            />
            {errors.last_name && <span className="text-xs text-red-600">{errors.last_name[0]}</span>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Fecha de nacimiento</label>
            <input
              type="date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className={`w-full text-sm p-2.5 rounded-xl border ${errors.birth_date ? 'border-red-400' : 'border-slate-200'} focus:outline-none focus:border-emerald-500`}
            />
            {errors.birth_date && <span className="text-xs text-red-600">{errors.birth_date[0]}</span>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Alergias (opcional)</label>
            <input
              type="text"
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              className="w-full text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
              placeholder="Ej. Ninguna, Penicilina..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Notas médicas (opcional)</label>
            <textarea
              name="medical_notes"
              value={formData.medical_notes}
              onChange={handleChange}
              rows="2"
              className="w-full text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
              placeholder="Antecedentes, observaciones..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={loading} className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl cursor-pointer">Cancelar</button>
            <button type="submit" disabled={loading} className="px-5 py-2 bg-[#0B5B42] hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer disabled:opacity-50">
              {loading ? 'Guardando...' : 'Registrar Paciente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PatientFichaModal({ patient, onClose }) {
  const calcularEdad = (fechaNac) => {
    if (!fechaNac) return '-';
    const hoy = new Date();
    const nacimiento = new Date(fechaNac);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
    return edad;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden z-10">
        <div className="bg-[#0B5B42] text-white p-5 flex items-center justify-between">
          <h3 className="text-lg font-bold">Ficha del Paciente</h3>
          <button onClick={onClose} className="text-emerald-200 hover:text-white text-xl font-bold px-2 cursor-pointer">✕</button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Nombre completo</p>
            <p className="text-base font-bold text-slate-800">{patient.first_name} {patient.last_name}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Fecha de nacimiento</p>
              <p className="text-sm text-slate-700">{patient.birth_date}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Edad</p>
              <p className="text-sm text-slate-700">{calcularEdad(patient.birth_date)} años</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Alergias</p>
            <p className={`text-sm ${patient.allergies && patient.allergies !== 'Ninguna' ? 'text-red-600 font-bold' : 'text-slate-700'}`}>
              {patient.allergies || 'Ninguna'}
            </p>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Notas médicas</p>
            <p className="text-sm text-slate-700">{patient.medical_notes || 'Sin notas registradas.'}</p>
          </div>

          {patient.tutor && (
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Tutor</p>
              <p className="text-sm text-slate-700">{patient.tutor.name}</p>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl cursor-pointer">Cerrar</button>
        </div>
      </div>
    </div>
  );
}

export default PatientsManager;