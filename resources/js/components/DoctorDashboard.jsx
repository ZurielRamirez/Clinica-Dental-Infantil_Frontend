import React, { useState, useEffect } from 'react';

const INITIAL_APPOINTMENTS = [
  { id: 1, time: '09:00 AM', patientName: 'Mateo Hernández', age: '6 años', tutorName: 'Sofia Gómez', reason: 'Revisión general y limpieza', status: 'completed', treatments: ['Limpieza Dental', 'Aplicación de Flúor'], notes: 'Paciente cooperativo. Mantiene buena higiene.' },
  { id: 2, time: '10:30 AM', patientName: 'Camila Torres', age: '8 años', tutorName: 'Jorge Torres', reason: 'Molestia en molar inferior derecho', status: 'in_progress', treatments: [], notes: '' },
  { id: 3, time: '12:00 PM', patientName: 'Lucas Ramírez', age: '4 años', tutorName: 'Mariana López', reason: 'Primera visita / Valoración', status: 'pending', treatments: [], notes: '' },
  { id: 4, time: '04:00 PM', patientName: 'Valentina Díaz', age: '7 años', tutorName: 'Carla Díaz', reason: 'Colocación de selladores', status: 'pending', treatments: [], notes: '' }
];

const CATALOG = ['Limpieza Dental Profunda', 'Aplicación de Flúor', 'Selladores de Fosetas y Fisuras', 'Resina / Calza Estética', 'Pulpotomía Infantil', 'Corona Pediatrica', 'Extracción Pieza Temporal'];

export default function DoctorDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [activeAppointment, setActiveAppointment] = useState(null);
  const [notification, setNotification] = useState({ id: null, type: null, status: null });

  useEffect(() => {
    const timer = setTimeout(() => { setAppointments(INITIAL_APPOINTMENTS); setIsLoading(false); }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleSendNotification = (id, type) => {
    setNotification({ id, type, status: 'sending' });
    setTimeout(() => {
      setNotification({ id, type, status: 'success' });
      setTimeout(() => setNotification({ id: null, type: null, status: null }), 2500);
    }, 1200);
  };

  const handleSaveConsultation = (updatedData) => {
    setAppointments(prev => prev.map(a => a.id === activeAppointment.id ? { ...a, ...updatedData, status: 'completed' } : a));
    setActiveAppointment(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#0B5B42] text-white p-6 rounded-2xl shadow-lg">
        <div>
          <h1 className="text-2xl font-bold">Módulo Odontopediatría</h1>
          <p className="text-emerald-200 text-sm mt-1">Consulta y registro clínico de citas para el día de hoy.</p>
        </div>
        <div className="bg-emerald-800/80 px-4 py-2 rounded-xl text-center border border-emerald-700/50">
          <p className="text-xs text-emerald-200 uppercase font-semibold">Citas Programadas</p>
          <p className="text-xl font-bold">{appointments.length} Pacientes</p>
        </div>
      </div>

      {/* Agenda */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
        {isLoading && <div className="absolute top-0 inset-x-0 h-1 bg-emerald-100"><div className="h-full bg-emerald-600 animate-pulse w-full" /></div>}
        
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Citas de Hoy</h2>
          <span className="text-xs font-medium text-slate-500">{new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>

        <div className="divide-y divide-slate-100">
          {appointments.map(app => (
            <AppointmentRow 
              key={app.id} 
              app={app} 
              notification={notification}
              onNotify={handleSendNotification}
              onOpenModal={setActiveAppointment}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {activeAppointment && (
        <ClinicalModal 
          appointment={activeAppointment} 
          onClose={() => setActiveAppointment(null)} 
          onSave={handleSaveConsultation} 
        />
      )}
    </div>
  );
}

// Subcomponente de Fila de Cita
function AppointmentRow({ app, notification, onNotify, onOpenModal }) {
  const getBadge = (status) => {
    if (status === 'completed') return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800">Atendido</span>;
    if (status === 'in_progress') return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800 animate-pulse">En Consulta</span>;
    return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-600">Pendiente</span>;
  };

  const notifConfig = [
    { type: 'whatsapp', label: '💬 Recordatorio WhatsApp', style: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200', text: 'WhatsApp' },
    { type: 'sms', label: '📱 Notificar SMS', style: 'bg-sky-50 hover:bg-sky-100 text-sky-800 border-sky-200', text: 'SMS' },
    { type: 'email', label: '✉️ Enviar Ficha por Correo', style: 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200', text: 'Correo' }
  ];

  return (
    <div className="p-5 hover:bg-slate-50/80 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-start gap-4 flex-1">
        <div className="bg-emerald-50 text-emerald-800 font-bold px-3 py-2 rounded-xl text-sm border border-emerald-100 whitespace-nowrap">{app.time}</div>
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-slate-800 text-base">{app.patientName}</h3>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{app.age}</span>
            {getBadge(app.status)}
          </div>
          <p className="text-xs text-slate-500"><span className="font-medium text-slate-600">Tutor:</span> {app.tutorName} | <span className="font-medium text-slate-600">Motivo:</span> {app.reason}</p>

          {app.treatments.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {app.treatments.map((t, idx) => (
                <span key={idx} className="bg-emerald-50 text-emerald-700 text-[11px] font-semibold px-2 py-0.5 rounded-md border border-emerald-200">✓ {t}</span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-2">
            {notifConfig.map(btn => {
              const isCurrent = notification.id === app.id && notification.type === btn.type;
              return (
                <button
                  key={btn.type}
                  type="button"
                  onClick={() => onNotify(app.id, btn.type)}
                  disabled={notification.id === app.id}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition flex items-center gap-1 cursor-pointer disabled:opacity-50 ${btn.style}`}
                >
                  {isCurrent ? (notification.status === 'sending' ? `⏳ Enviando ${btn.text}...` : `✓ ¡${btn.text} Enviado!`) : btn.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <button
        onClick={() => onOpenModal(app)}
        className={`w-full md:w-auto px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer ${
          app.status === 'completed' ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200' : 'bg-[#0B5B42] hover:bg-emerald-800 text-white'
        }`}
      >
        {app.status === 'completed' ? 'Editar Expediente' : 'Atender / Registrar Tratamiento'}
      </button>
    </div>
  );
}

// Subcomponente Modal
function ClinicalModal({ appointment, onClose, onSave }) {
  const [selectedTreatments, setSelectedTreatments] = useState(appointment.treatments || []);
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

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onSave({ treatments: selectedTreatments, notes: clinicalNotes });
      setIsSaving(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="fixed inset-0" onClick={() => !isSaving && onClose()} />
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 border border-slate-100 flex flex-col max-h-[90vh]">
        <div className="bg-[#0B5B42] text-white p-5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Consulta Clínica Pedriática</h3>
            <p className="text-emerald-200 text-xs mt-0.5">Paciente: <span className="font-semibold text-white">{appointment.patientName}</span> ({appointment.age})</p>
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
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Notas Clínicas u Observaciones del Odontopediatra</label>
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
            {isSaving ? 'Guardando Expediente...' : 'Finalizar Consulta y Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}