import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Logo from './Logo';
import '../../css/auth.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
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

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres.';
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
      // Forzamos internamente que el registro público asignador sea 'tutor'
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        role: 'tutor'
      };

      const response = await api.post('/register', payload);

      // Si el backend retorna token e inicio de sesión automático:
      if (response.data.access_token) {
        const { access_token, user } = response.data;
        const userToSave = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: 'tutor'
        };

        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(userToSave));
        navigate('/tutor/dashboard');
      } else {
        // Si requiere ir a login primero
        navigate('/login');
      }

    } catch (err) {
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        setGeneralError(err.response?.data?.message || 'Error al registrar la cuenta. Inténtalo nuevamente.');
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
              placeholder="usuario@tutor.com"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <span className="error-msg">
                {Array.isArray(errors.email) ? errors.email[0] : errors.email}
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