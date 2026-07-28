import React, { useState } from 'react';
import '../../css/patients.css';

const PatientForm = ({ onSavePatient, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    gender: 'masculino',
    allergies: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Reglas de validación en tiempo real
  const validateField = (name, value) => {
    let error = '';

    if (name === 'fullName') {
      if (!value.trim()) {
        error = 'El nombre completo del paciente es obligatorio.';
      } else if (value.trim().length < 3) {
        error = 'El nombre debe tener al menos 3 caracteres.';
      } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
        error = 'El nombre solo puede contener letras.';
      }
    }

    if (name === 'birthDate') {
      if (!value) {
        error = 'La fecha de nacimiento es obligatoria.';
      } else {
        const birth = new Date(value);
        const today = new Date();
        if (birth > today) {
          error = 'La fecha no puede ser futura.';
        }
      }
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validar en tiempo real si el campo ya fue tocado
    if (touched[name]) {
      const fieldError = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar todos los campos al intentar enviar
    const fullNameError = validateField('fullName', formData.fullName);
    const birthDateError = validateField('birthDate', formData.birthDate);

    setTouched({ fullName: true, birthDate: true });
    setErrors({ fullName: fullNameError, birthDate: birthDateError });

    if (!fullNameError && !birthDateError) {
      onSavePatient(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Campo: Nombre Completo */}
      <div className="form-group-custom">
        <label className="form-label-custom">Nombre Completo del Paciente *</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Ej. Mateo Santiago Pérez"
          className={`input-custom ${
            touched.fullName ? (errors.fullName ? 'is-invalid' : 'is-valid') : ''
          }`}
        />
        {touched.fullName && errors.fullName && (
          <span className="error-feedback">⚠️ {errors.fullName}</span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Campo: Fecha de Nacimiento */}
        <div className="form-group-custom">
          <label className="form-label-custom">Fecha de Nacimiento *</label>
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`input-custom ${
              touched.birthDate ? (errors.birthDate ? 'is-invalid' : 'is-valid') : ''
            }`}
          />
          {touched.birthDate && errors.birthDate && (
            <span className="error-feedback">⚠️ {errors.birthDate}</span>
          )}
        </div>

        {/* Campo: Género */}
        <div className="form-group-custom">
          <label className="form-label-custom">Género</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="input-custom"
          >
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
          </select>
        </div>
      </div>

      {/* Campo: Alergias o Condiciones */}
      <div className="form-group-custom">
        <label className="form-label-custom">Alergias o Medicamentos</label>
        <input
          type="text"
          name="allergies"
          value={formData.allergies}
          onChange={handleChange}
          placeholder="Ej. Alérgico a la Penicilina / Ninguna"
          className="input-custom"
        />
      </div>

      {/* Botones de Acción */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-5 py-2 text-sm font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition"
        >
          Guardar Paciente
        </button>
      </div>
    </form>
  );
};

export default PatientForm;