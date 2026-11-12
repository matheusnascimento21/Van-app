import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import HomeLanding from './components/HomeLanding';
import AuthLogin from './components/AuthLogin';
import CheckoutPagamento from './components/CheckoutPagamento';
import HubDashboard from './components/HubDashboard';
import CadastroPassageiro from './components/CadastroPassageiro';
import RotaProtegida from './components/RotaProtegida';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeLanding />} />
        <Route path="/login" element={<AuthLogin />} />
        <Route path="/checkout" element={<CheckoutPagamento />} />
        
        {/* Painel protegido com validade de 24 horas ou login padrão */}
        <Route path="/hub" element={
          <RotaProtegida>
            <HubDashboard />
          </RotaProtegida>
        } />
        <Route path="/dashboard" element={
          <RotaProtegida>
            <HubDashboard />
          </RotaProtegida>
        } />
        
        <Route path="/cadastro/:viagemId" element={<CadastroPassageiro />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}