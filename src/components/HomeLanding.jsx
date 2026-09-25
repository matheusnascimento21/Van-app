import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, QrCode, FileText, Shield, ArrowRight, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleAssinarPlano = (plano) => {
    navigate(`/checkout?plano=${plano}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      
      {/* NAVBAR */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Fretech Logo" className="w-9 h-9 object-contain rounded-xl shadow-md" />
            <span className="font-bold text-xl text-white tracking-tight">Fretech</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm transition flex items-center gap-1.5 shadow-lg shadow-blue-600/20"
            >
              Acessar Painel <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="py-16 sm:py-24 px-4 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Sistema Completo para Fretamento e Excursões
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            Gestão de Viagens, Passageiros e Manifestos de Porte Obrigatório
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Gere o manifesto formatado no padrão da fiscalização (ANTT / DER), disponibilize cadastro simplificado de passageiros via QR Code e controle todo o financeiro da sua frota em um só lugar.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3.5 rounded-xl text-sm transition shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2"
            >
              Testar Painel Agora <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#planos"
              className="bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold px-6 py-3.5 rounded-xl text-sm border border-slate-800 transition flex items-center justify-center"
            >
              Ver Planos
            </a>
          </div>
        </div>
      </section>

      {/* PLANOS DE ASSINATURA */}
      <section id="planos" className="py-16 px-4 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white">Planos e Assinaturas</h2>
          <p className="text-xs sm:text-sm text-slate-400">Escolha o plano com a quantidade de viagens ideal para a sua rotina.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* 1. PLANO INICIANTE */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Iniciante</h3>
              <p className="text-xs text-slate-400">Para quem faz poucas viagens ou viagens ocasionais.</p>
              <div className="text-3xl font-black text-white">R$ 49,90 <span className="text-xs font-normal text-slate-500">/mês</span></div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2 font-bold text-blue-400"><Check className="w-4 h-4 text-blue-400" /> Até 5 Viagens por mês</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Até 2 Veículos e Motoristas</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Manifestos ANTT / DER</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> QR Code de Passageiros</li>
              </ul>
            </div>
            <button
              onClick={() => handleAssinarPlano('iniciante')}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl text-xs transition"
            >
              Assinar Plano Iniciante
            </button>
          </div>

          {/* 2. PLANO INTERMEDIÁRIO (NOVO) */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Intermediário</h3>
              <p className="text-xs text-slate-400">Ideal para quem tem viagens quase todos os fins de semana.</p>
              <div className="text-3xl font-black text-white">R$ 69,90 <span className="text-xs font-normal text-slate-500">/mês</span></div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2 font-bold text-blue-400"><Check className="w-4 h-4 text-blue-400" /> Até 10 Viagens por mês</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Validação CPF na Receita Federal</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Até 4 Veículos e Motoristas</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Relatório Financeiro Básico</li>
              </ul>
            </div>
            <button
              onClick={() => handleAssinarPlano('intermediario')}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl text-xs transition"
            >
              Assinar Plano Intermediário
            </button>
          </div>

          {/* 3. PLANO PROFISSIONAL (PRO / DESTAQUE) */}
          <div className="bg-slate-900 p-6 rounded-3xl border-2 border-blue-500 shadow-2xl shadow-blue-500/10 flex flex-col justify-between space-y-6 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full">
              Mais Vendido (Pro)
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Profissional (Pro)</h3>
              <p className="text-xs text-slate-400">Para agências de turismo e frotas ativas com agenda cheia.</p>
              <div className="text-3xl font-black text-white">R$ 89,90 <span className="text-xs font-normal text-slate-500">/mês</span></div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2 font-bold text-emerald-400"><Check className="w-4 h-4 text-emerald-400" /> Viagens Ilimitadas</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Validação CPF Receita Federal</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Frota e Motoristas Ampliados</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Relatório Financeiro Mensal Completo</li>
              </ul>
            </div>
            <button
              onClick={() => handleAssinarPlano('profissional')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs transition shadow-lg"
            >
              Assinar Plano Profissional
            </button>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/80 py-8 text-center text-xs text-slate-500 space-y-2">
        <div className="flex items-center justify-center gap-2">
          <img src="/logo.png" alt="Fretech Logo" className="w-5 h-5 object-contain" />
          <span className="font-bold text-slate-400">Fretech</span>
        </div>
        <p>© 2026 Fretech - Todos os direitos reservados.</p>
      </footer>

    </div>
  );
}