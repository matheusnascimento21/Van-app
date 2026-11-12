import React from 'react';
import { Navigate } from 'react-router-dom';

export default function RotaProtegida({ children }) {
  const sessaoSalva = localStorage.getItem('fretech_sessao') || localStorage.getItem('expresstour_sessao');

  if (!sessaoSalva) {
    return <Navigate to="/login" replace />;
  }

  try {
    const sessao = JSON.parse(sessaoSalva);
    
    // Se tiver tempo deexpiração configurado, valida se já passaram 24 horas
    if (sessao.expiraEm) {
      const agora = new Date().getTime();
      if (agora > sessao.expiraEm) {
        localStorage.removeItem('fretech_sessao');
        localStorage.removeItem('expresstour_sessao');
        return <Navigate to="/login?expirado=true" replace />;
      }
    }
  } catch (e) {
    return <Navigate to="/login" replace />;
  }

  return children;
}