import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, ArrowRight, Sparkles, Shield, QrCode, FileText, Zap } from 'lucide-react';

export default function HomeLanding() {
  const navigate = useNavigate();

  const handleTestarPainel = (e) => {
    e.preventDefault();
    
    // Define o tempo atual + 24 horas em milissegundos
    const expiraEm = new Date().getTime() + 24 * 60 * 60 * 1000;
    const sessaoTeste = {
      tipo: 'teste_gratuito',
      expiraEm: expiraEm,
      email: 'visitante@fretech.com'
    };

    localStorage.setItem('fretech_sessao', JSON.stringify(sessaoTeste));
    navigate('/hub');
  };

  const handleAssinarPlano = (plano, e) => {
    if (e) e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/checkout?plano=${plano}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      {/* HEADER */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Fretech Logo" className="w-9 h-9 object-contain rounded-xl shadow-md" />
            <span className="font-bold text-xl text-white tracking-tight">Fretech</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-slate-300 hover:text-white text-xs sm:text-sm font-semibold transition">
              Entrar
            </Link>
            <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm transition flex items-center gap-1.5 shadow-lg">
              Painel <ArrowRight className="w-4 h-4" />
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
            {/* BOTÃO DE TESTE DE 24 HORAS */}
            <button
              onClick={handleTestarPainel}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3.5 rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-xl cursor-pointer"
            >
              Testar Painel Agora (24h Grátis) <ArrowRight className="w-4 h-4" />
            </button>
            <a href="#planos" className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold px-6 py-3.5 rounded-xl text-sm transition flex items-center justify-center">
              Ver Planos
            </a>
          </div>
        </div>
      </section>

      {/* SEÇÃO DE RECURSOS / APRESENTAÇÃO */}
      <section className="py-16 px-4 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-white">Tudo o que sua empresa de fretamento precisa</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">Elimine planilhas complexas e papéis soltos. Automatize suas viagens do início ao fim.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Manifesto ANTT / DER</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Geração automática do documento oficial de porte obrigatório para fiscalização nas rodovias.</p>
          </div>
          <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold">
              <QrCode className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Check-in por QR Code</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Compartilhe o link de cadastro com os passageiros para preenchimento antecipado e organizado.</p>
          </div>
          <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Controle Financeiro</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Acompanhe recebimentos, despesas de viagens, fluxo de caixa e status de pagamentos dos passageiros.</p>
          </div>
        </div>
      </section>

      {/* PLANOS E ASSINATURAS */}
      <section id="planos" className="py-16 px-4 max-w-6xl mx-auto space-y-12 border-t border-slate-900">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white">Planos e Assinaturas</h2>
          <p className="text-sm text-slate-400">Escolha o plano ideal para o tamanho da sua frota</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Iniciante</h3>
              <div className="text-3xl font-black text-white">R$ 49,90 <span className="text-xs font-normal text-slate-500">/mês</span></div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-500" /> Até 5 viagens ativas/mês</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-500" /> Manifesto digital básico</li>
              </ul>
            </div>
            <button type="button" onClick={(e) => handleAssinarPlano('iniciante', e)} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl text-xs transition cursor-pointer">
              Assinar Iniciante
            </button>
          </div>
          
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Intermediário</h3>
              <div className="text-3xl font-black text-white">R$ 69,90 <span className="text-xs font-normal text-slate-500">/mês</span></div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-500" /> Viagens ilimitadas</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-500" /> QR Code de embarque</li>
              </ul>
            </div>
            <button type="button" onClick={(e) => handleAssinarPlano('intermediario', e)} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl text-xs transition cursor-pointer">
              Assinar Intermediário
            </button>
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl border-2 border-blue-500 flex flex-col justify-between space-y-6 relative shadow-xl">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Mais Popular</div>
            <div className="space-y-4 pt-2">
              <h3 className="text-lg font-bold text-white">Profissional (Pro)</h3>
              <div className="text-3xl font-black text-white">R$ 89,90 <span className="text-xs font-normal text-slate-500">/mês</span></div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-500" /> Frota e motoristas ilimitados</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-500" /> Suporte prioritário 24/7</li>
              </ul>
            </div>
            <button type="button" onClick={(e) => handleAssinarPlano('profissional', e)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs transition cursor-pointer">
              Assinar Profissional
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-4 text-center border-t border-slate-900 text-xs text-slate-500">
        <p>&copy; 2026 Fretech. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}