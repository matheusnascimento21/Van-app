import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomeLanding from './components/HomeLanding';
import HubDashboard from './components/HubDashboard';
import CadastroPassageiro from './components/CadastroPassageiro';
import CheckoutPagamento from './components/CheckoutPagamento';
import RotaProtegida from './components/RotaProtegida';

export default function App() {
  return (
    <Routes>
      {/* Landing Page Pública */}
      <Route path="/" element={<HomeLanding />} />

      {/* Rota de Pagamento via InfinitePay */}
      <Route path="/pagamento" element={<CheckoutPagamento />} />

      {/* Rota Protegida: Apenas utilizadores com plano assinado conseguem aceder */}
      <Route 
        path="/dashboard" 
        element={
          <RotaProtegida>
            <HubDashboard />
          </RotaProtegida>
        } 
      />

      {/* Rota Pública para Cadastro de Passageiro via QR Code */}
      <Route path="/cadastro/:viagemId" element={<CadastroPassageiro />} />
      <Route path="/cadastro" element={<CadastroPassageiro />} />

      {/* Redirecionamento padrão */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}