import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const CATALOG = ['Limpieza Dental Profunda', 'Aplicación de Flúor', 'Selladores de Fosetas y Fisuras', 'Resina / Calza Estética', 'Pulpotomía Infantil', 'Corona Pediatrica', 'Extracción Pieza Temporal'];

const STATUS_LABELS = {
  pending: { label: 'Pendiente', style: 'bg-slate-100 text-slate-600' },
  confirmed: { label: 'Confirmada', style: 'bg-sky-100 text-sky-800' },
  completed: { label: 'Atendido', style: 'bg-emerald-100 text-emerald-800' },
  cancelled: { label: 'Cancelada', style: 'bg-red-100 text-red-700' },
};

export default function DoctorDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [activeAppointment, setActiveAppointment] = useState(null);
  const [confirmCancel, setConfirmCancel] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role;

  const fetchAppointments = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await api.get('/appointments');
      const ordenadas = (response.data.data || []).sort(
        (a, b) => new Date(a.appointment_date) - new Date(b.appointment_date)
      );
      setAppointments(ordenadas);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'No se pudieron cargar las citas.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleCancelConfirmed = async (appointment) => {
    try {
      await api.patch(`/appointments/${appointment.id}/cancel`);
      setAppointments(prev => prev.map(a => a.id === appointment.id ? { ...a, status: 'cancelled' } : a));
    } catch (err) {
      alert(err.response?.data?.message || 'No se pudo cancelar la cita.');
    } finally {
      setConfirmCancel(null);
    }
  };

  const handleSaveConsultation = async (appointmentId, updatedData) => {
    try {
      const response = await api.patch(`/appointments/${appointmentId}`, {
        status: 'completed',
        notes: updatedData.notes,
      });
      setAppointments(prev => prev.map(a => a.id === appointmentId ? response.data.data : a));
    } catch (err) {
      alert(err.response?.data?.message || 'No se pudo guardar la consulta.');
    } finally {
      setActiveAppointment(null);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#0B5B42] text-white p-6 rounded-2xl shadow-lg">
        <div>
          <h1 className="text-2xl font-bold">{role === 'tutor' ? 'Mis Citas' : 'Módulo Odontopediatría'}</h1>
          <p className="text-emerald-200 text-sm mt-1">
            {role === 'tutor' ? 'Consulta el estado de las citas de tus pacientes.' : 'Consulta y registro clínico de citas.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {role === 'tutor' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2.5 bg-white text-[#0B5B42] font-bold text-xs rounded-xl shadow-md hover:bg-emerald-50 transition"
            >
              + Agendar Cita
            </button>
          )}
          <div className="bg-emerald-800/80 px-4 py-2 rounded-xl text-center border border-emerald-700/50">
            <p className="text-xs text-emerald-200 uppercase font-semibold">Citas</p>
            <p className="text-xl font-bold">{appointments.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
        {isLoading && <div className="absolute top-0 inset-x-0 h-1 bg-emerald-100"><div className="h-full bg-emerald-600 animate-pulse w-full" /></div>}

        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Citas</h2>
          <span className="text-xs font-medium text-slate-500">{new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>

        {errorMessage && (
          <div className="p-5 text-sm text-red-600 bg-red-50">⚠️ {errorMessage}</div>
        )}

        {!isLoading && !errorMessage && appointments.length === 0 && (
          <div className="p-8 text-center text-slate-500 text-sm">No hay citas registradas.</div>
        )}

        <div className="divide-y divide-slate-100">
          {appointments.map(app => (
            <AppointmentRow
              key={app.id}
              app={app}
              role={role}
              onOpenModal={setActiveAppointment}
              onRequestCancel={setConfirmCancel}
            />
          ))}
        </div>
      </div>

      {activeAppointment && (
        <ClinicalModal
          appointment={activeAppointment}
          onClose={() => setActiveAppointment(null)}
          onSave={(data) => handleSaveConsultation(activeAppointment.id, data)}
        />
      )}

      {confirmCancel && (
        <ConfirmModal
          message={`¿Seguro que quieres cancelar la cita de ${confirmCancel.patient?.first_name}?`}
          onCancel={() => setConfirmCancel(null)}
          onConfirm={() => handleCancelConfirmed(confirmCancel)}
        />
      )}

      {showCreateModal && (
        <CreateAppointmentModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false);
            fetchAppointments();
          }}
        />
      )}
    </div>
  );
}

function AppointmentRow({ app, role, onOpenModal, onRequestCancel }) {
  const badge = STATUS_LABELS[app.status] || STATUS_LABELS.pending;
  const fechaObj = new Date(app.appointment_date);
  const fecha = fechaObj.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
  const time = fechaObj.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  const paciente = app.patient ? `${app.patient.first_name} ${app.patient.last_name}` : 'Paciente';
  const canManage = role === 'admin' || role === 'doctor';
  const canCancel = app.status !== 'cancelled' && app.status !== 'completed';

  return (
    <div className="p-5 hover:bg-slate-50/80 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-start gap-4 flex-1">
        <div className="bg-emerald-50 text-emerald-800 font-bold px-3 py-2 rounded-xl text-sm border border-emerald-100 whitespace-nowrap text-center">
          <div>{fecha}</div>
          <div className="text-xs font-normal">{time}</div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-slate-800 text-base">{paciente}</h3>
            <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${badge.style}`}>{badge.label}</span>
          </div>
          <p className="text-xs text-slate-500">
            {app.dentist && <><span className="font-medium text-slate-600">Doctor:</span> {app.dentist.name} | </>}
            {app.notes && <><span className="font-medium text-slate-600">Notas:</span> {app.notes}</>}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        {canManage && app.status !== 'cancelled' && (
          <button
            onClick={() => onOpenModal(app)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer ${
              app.status === 'completed' ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200' : 'bg-[#0B5B42] hover:bg-emerald-800 text-white'
            }`}
          >
            {app.status === 'completed' ? 'Ver Expediente' : 'Atender / Registrar Tratamiento'}
          </button>
        )}

        {canCancel && (
          <button
            onClick={() => onRequestCancel(app)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition cursor-pointer"
          >
            Cancelar Cita
          </button>
        )}
      </div>
    </div>
  );
}

function ConfirmModal({ message, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-800">Confirmar cancelación</h3>
        <p className="text-sm text-slate-600">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl cursor-pointer">No, regresar</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl cursor-pointer">Sí, cancelar cita</button>
        </div>
      </div>
    </div>
  );
}

function ClinicalModal({ appointment, onClose, onSave }) {
  const [selectedTreatments, setSelectedTreatments] = useState([]);
  const [clinicalNotes, setClinicalNotes] = useState(appointment.notes || '');
  const [customTreatment, setCustomTreatment] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const toggleTreatment = (t) => setSelectedTreatments(prev => prev.includes(t) ? prev.filter(item => item !== t) : [...prev, t]);

  const handleAddCustom = () => {
    if (customTreatment.trim() && !selectedTreatments.includes(customTreatment.trim())) {
      setSelectedTreatments(prev => [...prev, customTreatment.trim()]);
      setCustomTreatment('');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const notesFinal = selectedTreatments.length > 0
      ? `${clinicalNotes}\n\nTratamientos aplicados: ${selectedTreatments.join(', ')}`
      : clinicalNotes;
    await onSave({ notes: notesFinal });
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="fixed inset-0" onClick={() => !isSaving && onClose()} />
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 border border-slate-100 flex flex-col max-h-[90vh]">
        <div className="bg-[#0B5B42] text-white p-5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Consulta Clínica Pediátrica</h3>
            <p className="text-emerald-200 text-xs mt-0.5">
              Paciente: <span className="font-semibold text-white">{appointment.patient?.first_name} {appointment.patient?.last_name}</span>
            </p>
          </div>
          <button onClick={onClose} className="text-emerald-200 hover:text-white text-xl font-bold px-2 cursor-pointer">✕</button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Tratamientos Aplicados en la Sesión</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CATALOG.map((t, idx) => {
                const isSelected = selectedTreatments.includes(t);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleTreatment(t)}
                    className={`p-2.5 rounded-xl text-xs font-semibold text-left transition flex items-center justify-between border cursor-pointer ${
                      isSelected ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>{t}</span>
                    {isSelected && <span className="text-emerald-600 font-bold">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Otro Tratamiento o Procedimiento Específico</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customTreatment}
                onChange={e => setCustomTreatment(e.target.value)}
                placeholder="Ej. Pulpectomía con pasta Yodoformada..."
                className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
              />
              <button type="button" onClick={handleAddCustom} className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition cursor-pointer">Agregar</button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Notas Clínicas u Observaciones</label>
            <textarea
              rows="3"
              value={clinicalNotes}
              onChange={e => setClinicalNotes(e.target.value)}
              placeholder="Escriba aquí recomendaciones, comportamiento del paciente o detalles del tratamiento..."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button type="button" onClick={onClose} disabled={isSaving} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-xl transition cursor-pointer">Cancelar</button>
          <button type="button" onClick={handleSave} disabled={isSaving} className="px-5 py-2 bg-[#0B5B42] hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50">
            {isSaving ? 'Guardando...' : 'Finalizar Consulta y Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}

function CreateAppointmentModal({ onClose, onCreated }) {
  const [patients, setPatients] = useState([]);
  const [dentists, setDentists] = useState([]);
const [formData, setFormData] = useState({
  patient_id: '',
  dentist_id: '',
  appointment_date: '',
  appointment_hour: '',
  appointment_minute: '',
  notes: '',
});
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [patientsRes, dentistsRes] = await Promise.all([
          api.get('/patients'),
          api.get('/dentists'),
        ]);
        setPatients(patientsRes.data.data || []);
        setDentists(dentistsRes.data.data || []);
      } catch (err) {
        setGeneralError('No se pudieron cargar los datos necesarios.');
      } finally {
        setLoadingOptions(false);
      }
    };
    loadOptions();
  }, []);

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
      const appointment_date = `${formData.appointment_date} ${formData.appointment_hour}:${formData.appointment_minute}:00`;
      await api.post('/appointments', {
        patient_id: formData.patient_id,
        dentist_id: formData.dentist_id,
        appointment_date,
        notes: formData.notes,
      });
      onCreated();
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
        if (err.response.data.message) setGeneralError(err.response.data.message);
      } else {
        setGeneralError(err.response?.data?.message || 'No se pudo agendar la cita.');
      }
    } finally {
      setLoading(false);
    }
  };

  const hoy = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="fixed inset-0" onClick={() => !loading && onClose()} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden z-10">
        <div className="bg-[#0B5B42] text-white p-5 flex items-center justify-between">
          <h3 className="text-lg font-bold">Agendar Nueva Cita</h3>
          <button onClick={onClose} className="text-emerald-200 hover:text-white text-xl font-bold px-2 cursor-pointer">✕</button>
        </div>

        {loadingOptions ? (
          <div className="p-8 text-center text-sm text-slate-500">Cargando información...</div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {generalError && (
              <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">{generalError}</div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Paciente</label>
              <select
                name="patient_id"
                value={formData.patient_id}
                onChange={handleChange}
                className={`w-full text-sm p-2.5 rounded-xl border ${errors.patient_id ? 'border-red-400' : 'border-slate-200'} focus:outline-none focus:border-emerald-500`}
              >
                <option value="">Selecciona un paciente</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
                ))}
              </select>
              {errors.patient_id && <span className="text-xs text-red-600">{errors.patient_id[0]}</span>}
              {patients.length === 0 && (
                <span className="text-xs text-amber-600">Primero registra a un paciente.</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Odontopediatra</label>
              <select
                name="dentist_id"
                value={formData.dentist_id}
                onChange={handleChange}
                className={`w-full text-sm p-2.5 rounded-xl border ${errors.dentist_id ? 'border-red-400' : 'border-slate-200'} focus:outline-none focus:border-emerald-500`}
              >
                <option value="">Selecciona un doctor</option>
                {dentists.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              {errors.dentist_id && <span className="text-xs text-red-600">{errors.dentist_id[0]}</span>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Fecha</label>
                <input
                  type="date"
                  name="appointment_date"
                  value={formData.appointment_date}
                  onChange={handleChange}
                  min={hoy}
                  className={`w-full text-sm p-2.5 rounded-xl border ${errors.appointment_date ? 'border-red-400' : 'border-slate-200'} focus:outline-none focus:border-emerald-500`}
                />
                {errors.appointment_date && <span className="text-xs text-red-600">{errors.appointment_date[0]}</span>}
              </div>
<div>
  <label className="block text-xs font-bold text-slate-600 mb-1">Hora</label>
  <div className="flex gap-2">
    <select
      name="appointment_hour"
      value={formData.appointment_hour || ''}
      onChange={(e) => setFormData({ ...formData, appointment_hour: e.target.value })}
      className="w-full text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
    >
      <option value="">Hora</option>
      {Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0')).map(h => (
        <option key={h} value={h}>{h}</option>
      ))}
    </select>
    <select
      name="appointment_minute"
      value={formData.appointment_minute || ''}
      onChange={(e) => setFormData({ ...formData, appointment_minute: e.target.value })}
      className="w-full text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
    >
      <option value="">Min</option>
      {['00', '15', '30', '45'].map(m => (
        <option key={m} value={m}>{m}</option>
      ))}
    </select>
  </div>
</div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Motivo / Notas (opcional)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="2"
                className="w-full text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                placeholder="Ej. Revisión de rutina, dolor en molar..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={onClose} disabled={loading} className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl cursor-pointer">Cancelar</button>
              <button type="submit" disabled={loading || patients.length === 0} className="px-5 py-2 bg-[#0B5B42] hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer disabled:opacity-50">
                {loading ? 'Agendando...' : 'Agendar Cita'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}