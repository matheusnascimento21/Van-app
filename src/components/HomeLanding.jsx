import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function HomeLanding() {
  const navigate = useNavigate();

  const handleTestarPainel = (e) => {
    e.preventDefault();
    
    // Cria a sessão de teste válida por 24 horas (24 * 60 * 60 * 1000 ms)
    const expiraEm = new Date().getTime() + 24 * 60 * 60 * 1000;
    const sessaoTeste = {
      tipo: 'teste_gratuito',
      expiraEm: expiraEm,
      email: 'visitante@fretech.com'
    };

    localStorage.setItem('fretech_sessao', JSON.stringify(sessaoTeste));
    
    // Redireciona direto para o hub sem precisar de login/senha
    navigate('/hub');
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
          <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm transition flex items-center gap-1.5 shadow-lg">
            Acessar com Senha <ArrowRight className="w-4 h-4" />
          </Link>
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
            Gere o manifesto formatado no padrão da fiscalização (ANTT / DER) e controle todo o financeiro da sua frota em um só lugar.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
            {/* BOTÃO QUE LIBERA O ACESSO POR 24 HORAS SEM LOGIN */}
            <button
              onClick={handleTestarPainel}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3.5 rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-xl cursor-pointer"
            >
              Testar Painel Agora <ArrowRight className="w-4 h-4" />
            </button>
            <a href="#planos" className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold px-6 py-3.5 rounded-xl text-sm transition flex items-center justify-center">
              Ver Planos
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}