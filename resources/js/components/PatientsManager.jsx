import React, { useState } from 'react';
import PatientForm from './PatientForm';
import '../../css/patients.css';

const PatientsManager = () => {
  const [showModal, setShowModal] = useState(false);
  const [patients, setPatients] = useState([
    {
      id: 1,
      fullName: 'Lucas Santiago',
      birthDate: '2019-05-12',
      gender: 'masculino',
      allergies: 'Ninguna'
    }
  ]);

  const handleAddPatient = (newPatient) => {
    setPatients([...patients, { ...newPatient, id: Date.now() }]);
    setShowModal(false);
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return '';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return `${age} años`;
  };

  return (
    <div className="patients-container space-y-6">
      {/* Encabezado */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-emerald-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-emerald-900">Gestión de Pacientes / Hijos</h1>
          <p className="text-sm text-gray-600 mt-1">Registra y administra las fichas pediátricas de los pacientes.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-4 py-2.5 rounded-lg shadow transition flex items-center gap-2 text-sm"
        >
          <span>➕</span> Registrar Nuevo Paciente
        </button>
      </div>

      {/* Tarjetas de Pacientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {patients.map((patient) => (
          <div key={patient.id} className="patient-card">
            <div className="flex justify-between items-start mb-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                👶
              </div>
              <span className="badge-age">{calculateAge(patient.birthDate)}</span>
            </div>

            <h3 className="font-bold text-gray-800 text-base mb-1">{patient.fullName}</h3>
            <p className="text-xs text-gray-500 mb-3">Nacimiento: {patient.birthDate}</p>

            <div className="text-xs bg-gray-50 p-2.5 rounded-lg border border-gray-100 space-y-1">
              <p className="text-gray-600">
                <span className="font-semibold text-emerald-800">Género:</span> {patient.gender}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold text-emerald-800">Alergias:</span> {patient.allergies || 'Sin registrar'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Registro */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-emerald-100">
            <h2 className="text-xl font-bold text-emerald-900 mb-4 border-b border-gray-100 pb-2">
              Registrar Nuevo Paciente
            </h2>
            <PatientForm onSavePatient={handleAddPatient} onClose={() => setShowModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientsManager;