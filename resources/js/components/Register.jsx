import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Logo from './Logo';
import '../../css/auth.css';

const Register = () => {
  const navigate = useNavigate();
  
  // 1. Estado actualizado con el campo 'phone'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  // 2. Validación de cliente mejorada (Phone + Reglas de Password del Backend)
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre completo es requerido.';
    }

    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El formato del correo no es válido.';
    }

    // Validación de Teléfono
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido.';
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Ingresa un teléfono válido, ej. +5219511234567.';
    }

    // Validación estricta de Contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida.';
    } else {
      if (formData.password.length < 8) {
        newErrors.password = 'Mínimo 8 caracteres.';
      } else if (!/[A-Z]/.test(formData.password)) {
        newErrors.password = 'Debe incluir al menos una mayúscula.';
      } else if (!/[0-9]/.test(formData.password)) {
        newErrors.password = 'Debe incluir al menos un número.';
      } else if (!/[^A-Za-z0-9]/.test(formData.password)) {
        newErrors.password = 'Debe incluir al menos un carácter especial.';
      }
    }

    if (!formData.password_confirmation) {
      newErrors.password_confirmation = 'Debes confirmar la contraseña.';
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Las contraseñas no coinciden.';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      // 3. Payload ajustado a los campos exactos que espera el Backend
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      };

      const response = await api.post('/register', payload);

      if (response.data.access_token) {
        const { access_token, user } = response.data;
        
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/tutor/dashboard');
      } else {
        navigate('/login');
      }

    } catch (err) {
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        setGeneralError(
          err.response?.data?.message || 'Error al registrar la cuenta. Inténtalo nuevamente.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <Logo showText={true} />

        {generalError && <div className="alert-general">{generalError}</div>}

        <form onSubmit={handleSubmit} noValidate>

          {/* Nombre Completo */}
          <div className="form-group">
            <label className="form-label">Nombre Completo</label>
            <input
              type="text"
              name="name"
              className={`form-input ${errors.name ? 'input-error' : ''}`}
              placeholder="Ej. Juan Pérez"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && (
              <span className="error-msg">
                {Array.isArray(errors.name) ? errors.name[0] : errors.name}
              </span>
            )}
          </div>

          {/* Correo Electrónico */}
          <div className="form-group">
            <label className="form-label">Correo Electrónico</label>
            <input
              type="email"
              name="email"
              className={`form-input ${errors.email ? 'input-error' : ''}`}
              placeholder="usuario@kiddiedent.com"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <span className="error-msg">
                {Array.isArray(errors.email) ? errors.email[0] : errors.email}
              </span>
            )}
          </div>

          {/* 4. Campo de Teléfono agregando la clase de formulario */}
          <div className="form-group">
            <label className="form-label">Teléfono</label>
            <input
              type="tel"
              name="phone"
              className={`form-input ${errors.phone ? 'input-error' : ''}`}
              placeholder="+5219511234567"
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && (
              <span className="error-msg">
                {Array.isArray(errors.phone) ? errors.phone[0] : errors.phone}
              </span>
            )}
          </div>

          {/* Contraseña con Ojito */}
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className={`form-input ${errors.password ? 'input-error' : ''}`}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && (
              <span className="error-msg">
                {Array.isArray(errors.password) ? errors.password[0] : errors.password}
              </span>
            )}
          </div>

          {/* Confirmar Contraseña con Ojito */}
          <div className="form-group">
            <label className="form-label">Confirmar Contraseña</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="password_confirmation"
                className={`form-input ${errors.password_confirmation ? 'input-error' : ''}`}
                placeholder="••••••••"
                value={formData.password_confirmation}
                onChange={handleChange}
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                title={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password_confirmation && (
              <span className="error-msg">
                {Array.isArray(errors.password_confirmation) ? errors.password_confirmation[0] : errors.password_confirmation}
              </span>
            )}
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="footer-links">
          <p>
            ¿Ya tienes cuenta?{' '}
            <button type="button" onClick={() => navigate('/login')}>
              Inicia sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;