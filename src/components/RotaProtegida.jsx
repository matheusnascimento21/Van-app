import React from 'react';
import { Navigate } from 'react-router-dom';

export default function RotaProtegida({ children }) {
  // Verifica se a assinatura está salva e ativa no navegador
  const assinaturaSalva = localStorage.getItem('expresstour_assinatura');
  const dados = assinaturaSalva ? JSON.parse(assinaturaSalva) : null;

  const estaAtivo = dados && dados.status === 'ativo';

  // Se não possuir plano ativo, redireciona para a tela de pagamento
  if (!estaAtivo) {
    return <Navigate to="/pagamento" replace />;
  }

  return children;
}