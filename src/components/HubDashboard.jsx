import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus, Users, DollarSign, Plus, LogOut, QrCode, FileText, Calendar, Trash2 } from 'lucide-react';
import { obterChaveIsolada, obterSessaoAtiva } from '../utils/storage';

export default function HubDashboard() {
  const navigate = useNavigate();
  const sessao = obterSessaoAtiva();

  // Chaves isoladas para este usuário específico
  const chaveViagens = obterChaveIsolada('fretech_viagens');

  const [viagens, setViagens] = useState(() => {
    const salvas = localStorage.getItem(chaveViagens);
    return salvas ? JSON.parse(salvas) : [
      { id: 1, local: 'Excursão Rio de Janeiro - RJ', dataIda: '2026-11-20', capacidade: 18, valorPassagem: 120 }
    ];
  });

  const [novaViagem, setNovaViagem] = useState({ local: '', dataIda: '', capacidade: 17, valorPassagem: 100 });
  const [modalAberto, setModalAberto] = useState(false);

  // Sempre que as viagens mudarem, salva na chave isolada do usuário
  useEffect(() => {
    localStorage.setItem(chaveViagens, JSON.stringify(viagens));
  }, [viagens, chaveViagens]);

  const handleLogout = () => {
    localStorage.removeItem('fretech_sessao');
    localStorage.removeItem('expresstour_sessao');
    navigate('/login');
  };

  const handleCriarViagem = (e) => {
    e.preventDefault();
    if (!novaViagem.local || !novaViagem.dataIda) return;

    const viagemObj = {
      id: Date.now(),
      local: novaViagem.local,
      dataIda: novaViagem.dataIda,
      capacidade: Number(novaViagem.capacidade) || 17,
      valorPassagem: Number(novaViagem.valorPassagem) || 0
    };

    setViagens([viagemObj, ...viagens]);
    setNovaViagem({ local: '', dataIda: '', capacidade: 17, valorPassagem: 100 });
    setModalAberto(false);
  };

  const excluirViagem = (id) => {
    if (window.confirm('Deseja realmente excluir esta viagem?')) {
      const filtradas = viagens.filter(v => v.id !== id);
      setViagens(filtradas);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* HEADER DO PAINEL */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Fretech Logo" className="w-9 h-9 object-contain rounded-xl shadow-md" />
            <div>
              <h1 className="font-bold text-base text-white">Painel Fretech</h1>
              <p className="text-[10px] text-blue-400">Logado como: {sessao?.email || 'Visitante (Teste 24h)'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-bold px-3 py-2 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        {/* CARDS DE RESUMO */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
              <Bus className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Viagens Ativas</p>
              <h3 className="text-xl font-bold text-white">{viagens.length}</h3>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Passageiros Registrados</p>
              <h3 className="text-xl font-bold text-white">
                {viagens.reduce((acc, v) => acc + (localStorage.getItem(`passageiros_${v.id}`) ? JSON.parse(localStorage.getItem(`passageiros_${v.id}`)).length : 0), 0)}
              </h3>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Faturamento Estimado</p>
              <h3 className="text-xl font-bold text-white">
                R$ {viagens.reduce((acc, v) => {
                  const pass = localStorage.getItem(`passageiros_${v.id}`) ? JSON.parse(localStorage.getItem(`passageiros_${v.id}`)) : [];
                  const assentos = pass.filter(p => !p.isCriancaColo).length;
                  return acc + (assentos * v.valorPassagem);
                }, 0).toFixed(2)}
              </h3>
            </div>
          </div>
        </div>

        {/* LISTAGEM DE VIAGENS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Suas Viagens e Excursões</h2>
            <button
              onClick={() => setModalAberto(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Nova Viagem
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {viagens.map((viagem) => (
              <div key={viagem.id} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">Ativa</span>
                    <button onClick={() => excluirViagem(viagem.id)} className="text-slate-500 hover:text-red-400 transition cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="font-bold text-base text-white">{viagem.local}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Data: {viagem.dataIda}</p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500">Capacidade: </span>
                    <span className="font-bold text-white">{viagem.capacidade} assentos</span>
                  </div>
                  <button
                    onClick={() => navigate(`/cadastro/${viagem.id}`)}
                    className="bg-slate-800 hover:bg-slate-700 text-blue-400 font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <QrCode className="w-4 h-4" /> Link QR Code
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* MODAL CRIAR VIAGEM */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Criar Nova Viagem</h3>
            <form onSubmit={handleCriarViagem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Destino / Nome da Excursão</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Excursão Rio de Janeiro - RJ"
                  value={novaViagem.local}
                  onChange={(e) => setNovaViagem({ ...novaViagem, local: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Data da Viagem</label>
                  <input
                    type="date"
                    required
                    value={novaViagem.dataIda}
                    onChange={(e) => setNovaViagem({ ...novaViagem, dataIda: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Capacidade (Assentos)</label>
                  <input
                    type="number"
                    value={novaViagem.capacidade}
                    onChange={(e) => setNovaViagem({ ...novaViagem, capacidade: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Valor da Passagem (R$)</label>
                <input
                  type="number"
                  value={novaViagem.valorPassagem}
                  onChange={(e) => setNovaViagem({ ...novaViagem, valorPassagem: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="w-1/2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl text-xs transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs transition cursor-pointer"
                >
                  Salvar Viagem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}