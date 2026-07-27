import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Logo from './Logo';
import '../../css/auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ role: 'tutor', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
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
      const response = await api.post('/login', formData);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      const role = user?.role || formData.role;
      navigate(`/${role}/dashboard`);
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        setGeneralError('Credenciales incorrectas o error de conexión.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <Logo subtitle="Sonrisas felices desde el primer diente" />

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
            <span className="hint-text">Mínimo 8 caracteres, 1 mayúscula, 1 número y 1 carácter especial.</span>
            {errors.password && <span className="error-msg">{Array.isArray(errors.password) ? errors.password[0] : errors.password}</span>}
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Ingresando...' : 'Ingresar al Sistema'}
          </button>
        </form>

        <div className="footer-links">
          <p>¿No tienes cuenta? <button onClick={() => navigate('/register')}>Regístrate aquí</button></p>
        </div>
      </div>
    </div>
  );
};

export default Login;