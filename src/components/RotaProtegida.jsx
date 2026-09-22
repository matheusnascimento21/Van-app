import React from 'react';
import { Navigate } from 'react-router-dom';

export default function RotaProtegida({ children }) {
  const sessao = localStorage.getItem('expresstour_sessao');
  const dadosSessao = sessao ? JSON.parse(sessao) : null;

  // Se não fez login com e-mail e senha, redireciona para o Login
  if (!dadosSessao || !dadosSessao.email) {
    return <Navigate to="/login" replace />;
  }

  return children;
}