import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import HomeLanding from './components/HomeLanding';
import AuthLogin from './components/AuthLogin';
import CheckoutPagamento from './components/CheckoutPagamento';
import HubDashboard from './components/HubDashboard';
import CadastroPassageiro from './components/CadastroPassageiro';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeLanding />} />
        <Route path="/login" element={<AuthLogin />} />
        <Route path="/checkout" element={<CheckoutPagamento />} />
        
        {/* Atende tanto /hub quanto /dashboard para evitar a tela branca */}
        <Route path="/hub" element={<HubDashboard />} />
        <Route path="/dashboard" element={<HubDashboard />} />
        
        <Route path="/cadastro/:viagemId" element={<CadastroPassageiro />} />
        
        {/* Qualquer rota errada redireciona para a home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}