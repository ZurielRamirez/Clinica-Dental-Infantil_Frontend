import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import Logo from './Logo';
import '../../css/auth.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const emailFromLink = searchParams.get('email') || '';

  const [formData, setFormData] = useState({
    email: emailFromLink,
    password: '',
    password_confirmation: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida.';
    } else {
      if (formData.password.length < 8) newErrors.password = 'Mínimo 8 caracteres.';
      else if (!/[A-Z]/.test(formData.password)) newErrors.password = 'Debe incluir al menos una mayúscula.';
      else if (!/[0-9]/.test(formData.password)) newErrors.password = 'Debe incluir al menos un número.';
      else if (!/[^A-Za-z0-9]/.test(formData.password)) newErrors.password = 'Debe incluir al menos un carácter especial.';
    }
    if (formData.password !== formData.password_confirmation) {
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
      const response = await api.post('/reset-password', {
        token,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      });
      setSuccessMessage(response.data.message || 'Contraseña actualizada correctamente.');
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
        setGeneralError(err.response.data.message || '');
      } else {
        setGeneralError(err.response?.data?.message || 'No se pudo restablecer la contraseña.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="auth-wrapper">
        <div className="auth-card">
          <Logo subtitle="Enlace inválido" />
          <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-4">
            Este enlace no es válido o ha expirado. Solicita uno nuevo.
          </div>
          <button type="button" onClick={() => navigate('/forgot-password')} className="btn-primary" style={{ width: '100%', marginTop: '16px' }}>
            Solicitar nuevo enlace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <Logo subtitle="Establece tu nueva contraseña" />

        {successMessage ? (
          <div className="text-center space-y-4">
            <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              ✅ {successMessage}
            </div>
            <button type="button" onClick={() => navigate('/login')} className="btn-primary" style={{ width: '100%' }}>
              Ir a iniciar sesión
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            {generalError && <div className="alert-general">{generalError}</div>}

            <div className="form-group">
              <label className="form-label">Correo Electrónico</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="usuario@correo.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Nueva Contraseña</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className={`form-input ${errors.password ? 'input-error' : ''}`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button type="button" className="toggle-password-btn" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <span className="error-msg">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Confirmar Contraseña</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password_confirmation"
                className={`form-input ${errors.password_confirmation ? 'input-error' : ''}`}
                placeholder="••••••••"
                value={formData.password_confirmation}
                onChange={handleChange}
              />
              {errors.password_confirmation && <span className="error-msg">{errors.password_confirmation}</span>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Guardando...' : 'Restablecer Contraseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;