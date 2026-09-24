import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, QrCode, FileText, Shield, ArrowRight, Bus, Users, Sparkles } from 'lucide-react';

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
              Ver Recursos
            </a>
          </div>
        </div>
      </section>

      {/* RECURSOS */}
      <section className="py-12 bg-slate-900/50 border-y border-slate-800/60 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Tudo o que sua agência precisa</h2>
            <p className="text-xs text-slate-400">Desenvolvido sob medida para motoristas autônomos, agências de turismo e empresas de fretamento.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="bg-blue-600/20 p-3 rounded-xl w-fit text-blue-400">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base">QR Code de Embarque</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Envie o link ou QR Code no grupo da excursão. Cada passageiro preenche seu CPF e nome pelo celular antes da viagem.
              </p>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="bg-emerald-600/20 p-3 rounded-xl w-fit text-emerald-400">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base">Manifesto ANTT e DER</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Emita e imprima o documento oficial com a lista completa de passageiros e dados do veículo em segundos.
              </p>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="bg-purple-600/20 p-3 rounded-xl w-fit text-purple-400">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base">Validação na Receita Federal</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Garantia de que os CPFs digitados pelos passageiros realmente existem e estão regulares para embarque.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PLANOS */}
      <section id="planos" className="py-16 px-4 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white">Planos e Assinaturas</h2>
          <p className="text-xs sm:text-sm text-slate-400">Escolha o plano ideal para o tamanho da sua frota.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* PLANO INICIANTE */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Iniciante</h3>
              <p className="text-xs text-slate-400">Para quem está começando com 1 van ou micro-ônibus.</p>
              <div className="text-3xl font-black text-white">R$ 49,90 <span className="text-xs font-normal text-slate-500">/mês</span></div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Até 2 Veículos</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Manifestos Ilimitados</li>
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

          {/* PLANO PROFISSIONAL (DESTAQUE) */}
          <div className="bg-slate-900 p-6 rounded-3xl border-2 border-blue-500 shadow-2xl shadow-blue-500/10 flex flex-col justify-between space-y-6 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full">
              Mais Vendido
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Profissional</h3>
              <p className="text-xs text-slate-400">Ideal para pequenas agências de turismo e frotas médias.</p>
              <div className="text-3xl font-black text-white">R$ 89,90 <span className="text-xs font-normal text-slate-500">/mês</span></div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Até 5 Veículos</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Validação CPF Receita Federal</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Gestão de Motoristas</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Relatório Financeiro Mensal</li>
              </ul>
            </div>
            <button
              onClick={() => handleAssinarPlano('profissional')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs transition shadow-lg"
            >
              Assinar Plano Profissional
            </button>
          </div>

          {/* PLANO EMPRESARIAL */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Empresarial</h3>
              <p className="text-xs text-slate-400">Para grandes empresas de fretamento e frotas pesadas.</p>
              <div className="text-3xl font-black text-white">R$ 149,90 <span className="text-xs font-normal text-slate-500">/mês</span></div>
              <ul className="space-y-2 text-slate-300 text-xs">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Frota Ilimitada</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Múltiplos Usuários</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Suporte Prioritário WhatsApp</li>
              </ul>
            </div>
            <button
              onClick={() => handleAssinarPlano('empresarial')}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl text-xs transition"
            >
              Assinar Plano Empresarial
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