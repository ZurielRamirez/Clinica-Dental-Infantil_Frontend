import React, { useState } from 'react';

const ContactClinicModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const clinicPhone = "9511234567";
  const clinicEmail = "contacto@clinicadental.com";

  const [message, setMessage] = useState("¡Hola! Me gustaría solicitar información sobre una consulta / cita.");

  const handleWhatsApp = (e) => {
    e.preventDefault();
    const cleanPhone = clinicPhone.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
    onClose();
  };

  const handleEmail = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent("Consulta / Dudas de Tutor");
    const body = encodeURIComponent(message);
    window.location.href = `mailto:${clinicEmail}?subject=${subject}&body=${body}`;
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-5 border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <span>🩺</span> Contactar a la Clínica
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              ¿Tienes dudas o necesitas reprogramar una cita?
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-700">
            Escribe tu mensaje o consulta:
          </label>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          />

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={handleWhatsApp}
              className="py-3 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
            >
              <span>💬</span>
              <span>WhatsApp Directo</span>
            </button>

            <button
              type="button"
              onClick={handleEmail}
              className="py-3 px-3 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
            >
              <span>✉️</span>
              <span>Enviar Correo</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContactClinicModal;