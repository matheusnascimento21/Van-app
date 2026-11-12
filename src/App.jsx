import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomeLanding from './components/HomeLanding';
import AuthLogin from './components/AuthLogin';
import CheckoutPagamento from './components/CheckoutPagamento';
import HubDashboard from './components/HubDashboard';
import CadastroPassageiro from './components/CadastroPassageiro';
import FormularioPassageiro from './components/FormularioPassageiro';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeLanding />} />
        <Route path="/login" element={<AuthLogin />} />
        <Route path="/checkout" element={<CheckoutPagamento />} />
        <Route path="/hub" element={<HubDashboard />} />
        <Route path="/cadastro/:viagemId" element={<CadastroPassageiro />} />
        <Route path="/formulario/:viagemId" element={<FormularioPassageiro />} />
      </Routes>
    </BrowserRouter>
  );
}