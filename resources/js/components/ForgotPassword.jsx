import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Logo from './Logo';
import '../../css/auth.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Ingresa un correo electrónico válido.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/forgot-password', { email });
      setSuccessMessage(response.data.message || 'Revisa tu correo para continuar.');
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo procesar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <Logo subtitle="Recupera el acceso a tu cuenta" />

        {successMessage ? (
          <div className="text-center space-y-4">
            <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              ✅ {successMessage}
            </div>
            <button type="button" onClick={() => navigate('/login')} className="btn-primary" style={{ width: '100%' }}>
              Volver al inicio de sesión
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '16px' }}>
              Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
            </p>

            {error && <div className="alert-general">{error}</div>}

            <div className="form-group">
              <label className="form-label">Correo Electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                className={`form-input ${error ? 'input-error' : ''}`}
                placeholder="usuario@correo.com"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
            </button>
          </form>
        )}

        <div className="footer-links">
          <p>
            <button type="button" onClick={() => navigate('/login')}>
              Volver al inicio de sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;