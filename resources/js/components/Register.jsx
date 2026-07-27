import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Logo from './Logo';
import '../../css/auth.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    role: 'tutor',
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'El nombre completo es requerido.';
    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Correo no válido.';
    }
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Mínimo 8 caracteres.';
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
      const response = await api.post('/register', formData);
      const { token, user } = response.data;

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/tutor/dashboard');
      } else {
        navigate('/login');
      }
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        setGeneralError('Ocurrió un error al registrar la cuenta.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <Logo subtitle="Registro de Nuevo Usuario" />

        {generalError && <div className="alert-general">{generalError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Perfil de Usuario</label>
            <select name="role" className="form-select" value={formData.role} onChange={handleChange}>
              <option value="tutor">Padre de Familia / Tutor</option>
              <option value="doctor">Odontopediatra / Especialista</option>
              <option value="admin">Administrador / Recepción</option>
            </select>
          </div>

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
            {errors.name && <span className="error-msg">{Array.isArray(errors.name) ? errors.name[0] : errors.name}</span>}
          </div>

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
            {errors.email && <span className="error-msg">{Array.isArray(errors.email) ? errors.email[0] : errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              name="password"
              className={`form-input ${errors.password ? 'input-error' : ''}`}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <span className="error-msg">{Array.isArray(errors.password) ? errors.password[0] : errors.password}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Confirmar Contraseña</label>
            <input
              type="password"
              name="password_confirmation"
              className={`form-input ${errors.password_confirmation ? 'input-error' : ''}`}
              placeholder="••••••••"
              value={formData.password_confirmation}
              onChange={handleChange}
            />
            {errors.password_confirmation && <span className="error-msg">{errors.password_confirmation}</span>}
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="footer-links">
          <p>¿Ya tienes cuenta? <button onClick={() => navigate('/login')}>Inicia sesión</button></p>
        </div>
      </div>
    </div>
  );
};

export default Register;