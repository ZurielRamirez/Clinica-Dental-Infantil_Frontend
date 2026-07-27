
import api from './api/axios';

import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './router';

// Mantenemos la API global
window.api = api;

// Montamos la aplicación de React
const rootElement = document.getElementById('app');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <AppRouter />
    </React.StrictMode>
  );
}