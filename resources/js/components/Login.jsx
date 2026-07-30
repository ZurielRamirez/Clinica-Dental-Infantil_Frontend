import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Logo from './Logo';
import '../../css/auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
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
      // 1. Enviamos solo email y password a la API de Laravel
      const response = await api.post('/login', {
        email: formData.email,
        password: formData.password
      });

      // 2. Extraemos access_token y el objeto user
      const { access_token, user } = response.data;

      // 3. Obtenemos el nombre del rol desde el backend
      const roleFromBackend = user?.roles?.[0]?.name || user?.role?.name || user?.role || 'tutor';

      // Mapeamos 'dentist' a 'doctor' para React
      const normalizedRole = roleFromBackend === 'dentist' ? 'doctor' : roleFromBackend;

      // 4. Guardamos un objeto user estructurado en el LocalStorage
      const userToSave = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: normalizedRole
      };

      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(userToSave));

      // 5. Redireccionamos al Dashboard según el rol devuelto por la BD
      if (normalizedRole === 'admin') {
        navigate('/admin/dashboard');
      } else if (normalizedRole === 'doctor' || roleFromBackend === 'dentist') {
        navigate('/doctor/dashboard');
      } else {
        navigate('/tutor/dashboard');
      }

    } catch (err) {
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        setGeneralError(err.response?.data?.message || 'Credenciales incorrectas o error de conexión.');
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
          
          {/* Correo Electrónico */}
          <div className="form-group">
            <label className="form-label">Correo Electrónico</label>
            <input
              type="email"
              name="email"
              className={`form-input ${errors.email ? 'input-error' : ''}`}
              placeholder="usuario@admin.com"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <span className="error-msg">
                {Array.isArray(errors.email) ? errors.email[0] : errors.email}
              </span>
            )}
          </div>

          {/* Contraseña con ojito toggle */}
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className={`form-input ${errors.password ? 'input-error' : ''}`}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                style={{ paddingRight: '2.5rem', width: '100%' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  color: '#666',
                  padding: '0 5px'
                }}
                title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            <span className="hint-text">
              Mínimo 8 caracteres, 1 mayúscula, 1 número y 1 carácter especial.
            </span>
            {errors.password && (
              <span className="error-msg">
                {Array.isArray(errors.password) ? errors.password[0] : errors.password}
              </span>
            )}
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Ingresando...' : 'Ingresar al Sistema'}
          </button>
        </form>

        <div className="footer-links">
          <p>
            ¿No tienes cuenta?{' '}
            <button type="button" onClick={() => navigate('/register')}>
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;