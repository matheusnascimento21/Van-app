import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import dos seus componentes
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import CheckoutPagamento from './components/CheckoutPagamento';
import HubDashboard from './components/HubDashboard';
import CadastroPassageiro from './components/CadastroPassageiro';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota da Landing Page (Página Inicial) */}
        <Route path="/" element={<LandingPage />} />

        {/* Rota do Login e Cadastro de Usuário */}
        <Route path="/login" element={<Login />} />

        {/* ROTA DO CHECKOUT/PAGAMENTO (Garante que abre ao clicar no plano) */}
        <Route path="/checkout" element={<CheckoutPagamento />} />

        {/* Rota do Painel Principal */}
        <Route path="/hub" element={<HubDashboard />} />

        {/* Rota do QR Code / Cadastro de Passageiro */}
        <Route path="/cadastro/:viagemId" element={<CadastroPassageiro />} />
      </Routes>
    </BrowserRouter>
  );
}