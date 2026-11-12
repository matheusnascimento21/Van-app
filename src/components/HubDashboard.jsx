import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus, Users, DollarSign, Plus, LogOut, QrCode, Calendar, Trash2, UserCheck, Shield, FileText, Printer } from 'lucide-react';

function obterSessaoAtiva() {
  const sessaoSalva = localStorage.getItem('fretech_sessao') || localStorage.getItem('expresstour_sessao');
  if (!sessaoSalva) return null;
  try {
    return JSON.parse(sessaoSalva);
  } catch (e) {
    return null;
  }
}

function obterChaveIsolada(prefixo) {
  const sessao = obterSessaoAtiva();
  const identificador = sessao?.email || sessao?.id || 'visitante_padrao';
  return `${prefixo}_${identificador}`;
}

export default function HubDashboard() {
  const navigate = useNavigate();
  const sessao = obterSessaoAtiva();

  const [abaAtiva, setAbaAtiva] = useState('viagens');

  const chaveViagens = obterChaveIsolada('fretech_viagens');
  const chaveMotoristas = obterChaveIsolada('fretech_motoristas');
  const chaveVeiculos = obterChaveIsolada('fretech_veiculos');

  const [viagens, setViagens] = useState(() => {
    const salvas = localStorage.getItem(chaveViagens);
    return salvas ? JSON.parse(salvas) : [];
  });

  const [motoristas, setMotoristas] = useState(() => {
    const salvos = localStorage.getItem(chaveMotoristas);
    return salvos ? JSON.parse(salvos) : [];
  });

  const [veiculos, setVeiculos] = useState(() => {
    const salvos = localStorage.getItem(chaveVeiculos);
    return salvos ? JSON.parse(salvos) : [];
  });

  const [modalViagemAberto, setModalViagemAberto] = useState(false);
  const [modalMotoristaAberto, setModalMotoristaAberto] = useState(false);
  const [modalVeiculoAberto, setModalVeiculoAberto] = useState(false);
  
  // Modal de Manifesto ANTT / DER para impressão
  const [manifestoModalViagem, setManifestoModalViagem] = useState(null);

  const [novaViagem, setNovaViagem] = useState({ local: '', dataIda: '', capacidade: 17, valorPassagem: 100, motorista: '', veiculo: '' });
  const [novoMotorista, setNovoMotorista] = useState({ nome: '', cnh: '', telefone: '' });
  const [novoVeiculo, setNovoVeiculo] = useState({ modelo: '', placa: '', lugares: 17 });

  useEffect(() => {
    localStorage.setItem(chaveViagens, JSON.stringify(viagens));
  }, [viagens, chaveViagens]);

  useEffect(() => {
    localStorage.setItem(chaveMotoristas, JSON.stringify(motoristas));
  }, [motoristas, chaveMotoristas]);

  useEffect(() => {
    localStorage.setItem(chaveVeiculos, JSON.stringify(veiculos));
  }, [veiculos, chaveVeiculos]);

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
      valorPassagem: Number(novaViagem.valorPassagem) || 0,
      motorista: novaViagem.motorista || 'Não definido',
      veiculo: novaViagem.veiculo || 'Não definido'
    };

    setViagens([viagemObj, ...viagens]);
    setNovaViagem({ local: '', dataIda: '', capacidade: 17, valorPassagem: 100, motorista: '', veiculo: '' });
    setModalViagemAberto(false);
  };

  const handleCriarMotorista = (e) => {
    e.preventDefault();
    if (!novoMotorista.nome) return;
    setMotoristas([{ id: Date.now(), ...novoMotorista }, ...motoristas]);
    setNovoMotorista({ nome: '', cnh: '', telefone: '' });
    setModalMotoristaAberto(false);
  };

  const handleCriarVeiculo = (e) => {
    e.preventDefault();
    if (!novoVeiculo.modelo || !novoVeiculo.placa) return;
    setVeiculos([{ id: Date.now(), ...novoVeiculo }, ...veiculos]);
    setNovoVeiculo({ modelo: '', placa: '', lugares: 17 });
    setModalVeiculoAberto(false);
  };

  const excluirViagem = (id) => {
    if (window.confirm('Deseja realmente excluir esta viagem?')) {
      setViagens(viagens.filter(v => v.id !== id));
    }
  };

  const totalPassageiros = viagens.reduce((acc, v) => {
    const pass = localStorage.getItem(`passageiros_${v.id}`) ? JSON.parse(localStorage.getItem(`passageiros_${v.id}`)) : [];
    return acc + pass.length;
  }, 0);

  const faturamentoTotal = viagens.reduce((acc, v) => {
    const pass = localStorage.getItem(`passageiros_${v.id}`) ? JSON.parse(localStorage.getItem(`passageiros_${v.id}`)) : [];
    const assentos = pass.filter(p => !p.isCriancaColo).length;
    return acc + (assentos * v.valorPassagem);
  }, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* HEADER DO PAINEL */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Fretech Logo" className="w-9 h-9 object-contain rounded-xl shadow-md" />
            <div>
              <h1 className="font-bold text-base text-white">Painel Fretech</h1>
              <p className="text-[10px] text-blue-400">Conta: {sessao?.email || 'Visitante (Teste 24h)'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-bold px-3 py-2 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>

        {/* ABAS */}
        <div className="max-w-7xl mx-auto px-4 flex gap-2 border-t border-slate-800/60 overflow-x-auto py-2">
          <button onClick={() => setAbaAtiva('viagens')} className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${abaAtiva === 'viagens' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}>
            <Bus className="w-4 h-4" /> Viagens
          </button>
          <button onClick={() => setAbaAtiva('motoristas')} className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${abaAtiva === 'motoristas' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}>
            <UserCheck className="w-4 h-4" /> Motoristas
          </button>
          <button onClick={() => setAbaAtiva('veiculos')} className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${abaAtiva === 'veiculos' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}>
            <Shield className="w-4 h-4" /> Frota / Veículos
          </button>
          <button onClick={() => setAbaAtiva('financeiro')} className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${abaAtiva === 'financeiro' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}>
            <DollarSign className="w-4 h-4" /> Financeiro e Relatórios
          </button>
        </div>
      </header>

      {/* CONTEÚDO */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        {/* CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl"><Bus className="w-6 h-6" /></div>
            <div><p className="text-xs text-slate-400">Viagens Ativas</p><h3 className="text-xl font-bold text-white">{viagens.length}</h3></div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl"><Users className="w-6 h-6" /></div>
            <div><p className="text-xs text-slate-400">Passageiros Registrados</p><h3 className="text-xl font-bold text-white">{totalPassageiros}</h3></div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl"><DollarSign className="w-6 h-6" /></div>
            <div><p className="text-xs text-slate-400">Faturamento Estimado</p><h3 className="text-xl font-bold text-white">R$ {faturamentoTotal.toFixed(2)}</h3></div>
          </div>
        </div>

        {/* ABA VIAGENS */}
        {abaAtiva === 'viagens' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Gerenciamento de Viagens e Manifestos</h2>
              <button onClick={() => setModalViagemAberto(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition flex items-center gap-2 shadow-lg cursor-pointer">
                <Plus className="w-4 h-4" /> Nova Viagem
              </button>
            </div>

            {viagens.length === 0 ? (
              <div className="bg-slate-900/50 border border-slate-800 p-12 rounded-3xl text-center space-y-3">
                <Bus className="w-12 h-12 text-slate-600 mx-auto" />
                <p className="text-sm font-bold text-slate-300">Nenhuma viagem cadastrada nesta conta ainda.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {viagens.map((viagem) => (
                  <div key={viagem.id} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">Ativa</span>
                        <button onClick={() => excluirViagem(viagem.id)} className="text-slate-500 hover:text-red-400 transition cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <h3 className="font-bold text-base text-white">{viagem.local}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Data: {viagem.dataIda}</p>
                      <p className="text-xs text-slate-400">Motorista: {viagem.motorista}</p>
                      <p className="text-xs text-slate-400">Veículo: {viagem.veiculo}</p>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-slate-800">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Capacidade: <strong className="text-white">{viagem.capacidade}</strong></span>
                        <button onClick={() => navigate(`/cadastro/${viagem.id}`)} className="text-blue-400 font-bold hover:underline flex items-center gap-1">
                          <QrCode className="w-3.5 h-3.5" /> QR Code
                        </button>
                      </div>
                      <button
                        onClick={() => setManifestoModalViagem(viagem)}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <FileText className="w-4 h-4 text-blue-400" /> Manifesto ANTT / DER (Imprimir)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ABA MOTORISTAS */}
        {abaAtiva === 'motoristas' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Motoristas Cadastrados</h2>
              <button onClick={() => setModalMotoristaAberto(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition flex items-center gap-2 cursor-pointer">
                <Plus className="w-4 h-4" /> Cadastrar Motorista
              </button>
            </div>
            {motoristas.length === 0 ? (
              <div className="bg-slate-900/50 border border-slate-800 p-12 rounded-3xl text-center"><p className="text-xs text-slate-500">Nenhum motorista cadastrado.</p></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {motoristas.map((m) => (
                  <div key={m.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
                    <h3 className="font-bold text-white text-base">{m.nome}</h3>
                    <p className="text-xs text-slate-400">CNH: {m.cnh}</p>
                    <p className="text-xs text-slate-400">Telefone: {m.telefone}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ABA VEÍCULOS */}
        {abaAtiva === 'veiculos' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Frota / Veículos Cadastrados</h2>
              <button onClick={() => setModalVeiculoAberto(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition flex items-center gap-2 cursor-pointer">
                <Plus className="w-4 h-4" /> Cadastrar Veículo
              </button>
            </div>
            {veiculos.length === 0 ? (
              <div className="bg-slate-900/50 border border-slate-800 p-12 rounded-3xl text-center"><p className="text-xs text-slate-500">Nenhum veículo cadastrado.</p></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {veiculos.map((v) => (
                  <div key={v.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
                    <h3 className="font-bold text-white text-base">{v.modelo}</h3>
                    <p className="text-xs text-slate-400">Placa: <strong className="text-white">{v.placa}</strong></p>
                    <p className="text-xs text-slate-400">Lugares: {v.lugares}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ABA FINANCEIRO E RELATÓRIO MENSAL */}
        {abaAtiva === 'financeiro' && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-bold text-white">Relatório Financeiro e Fechamento</h2>
                <p className="text-xs text-slate-400">Acompanhe o faturamento mensal e imprima o balanço para controle.</p>
              </div>
              <button
                onClick={() => window.print()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Printer className="w-4 h-4" /> Imprimir Relatório Financeiro
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-1">
                <p className="text-xs text-slate-400">Faturamento Bruto Total</p>
                <h3 className="text-2xl font-black text-emerald-400">R$ {faturamentoTotal.toFixed(2)}</h3>
              </div>
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-1">
                <p className="text-xs text-slate-400">Total de Viagens Registradas</p>
                <h3 className="text-2xl font-black text-blue-400">{viagens.length} viagens</h3>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <h3 className="text-sm font-bold text-white">Detalhamento por Viagem</h3>
              <div className="space-y-2">
                {viagens.map(v => {
                  const pass = localStorage.getItem(`passageiros_${v.id}`) ? JSON.parse(localStorage.getItem(`passageiros_${v.id}`)) : [];
                  const assentosOcupados = pass.filter(p => !p.isCriancaColo).length;
                  const faturamentoViagem = assentosOcupados * v.valorPassagem;
                  return (
                    <div key={v.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-white text-sm">{v.local}</p>
                        <p className="text-slate-400">Data: {v.dataIda} | Passageiros: {pass.length} ({assentosOcupados} assentos)</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-400 text-sm">R$ {faturamentoViagem.toFixed(2)}</p>
                        <p className="text-slate-500">R$ {v.valorPassagem} / assento</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: MANIFESTO ANTT / DER PARA IMPRESSÃO */}
      {manifestoModalViagem && (() => {
        const passageirosViagem = localStorage.getItem(`passageiros_${manifestoModalViagem.id}`) 
          ? JSON.parse(localStorage.getItem(`passageiros_${manifestoModalViagem.id}`)) 
          : [];
        const assentosOcupados = passageirosViagem.filter(p => !p.isCriancaColo).length;

        return (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white text-slate-900 w-full max-w-3xl rounded-3xl p-8 space-y-6 shadow-2xl relative my-8 print:m-0 print:shadow-none print:w-full">
              
              {/* CABEÇALHO DO MANIFESTO PARA FISCALIZAÇÃO */}
              <div className="text-center border-b pb-4 space-y-1">
                <h1 className="text-xl font-bold uppercase tracking-wide">Manifesto de Passageiros - Fretamento</h1>
                <p className="text-xs text-slate-600">Documento de Porte Obrigatório (Padrão ANTT / DER)</p>
              </div>

              {/* DADOS DA VIAGEM */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <p><strong>Destino / Excursão:</strong> {manifestoModalViagem.local}</p>
                  <p><strong>Data da Viagem:</strong> {manifestoModalViagem.dataIda}</p>
                  <p><strong>Veículo / Placa:</strong> {manifestoModalViagem.veiculo}</p>
                </div>
                <div>
                  <p><strong>Motorista:</strong> {manifestoModalViagem.motorista}</p>
                  <p><strong>Total de Passageiros:</strong> {assentosOcupados} / {manifestoModalViagem.capacidade}</p>
                  <p><strong>Crianças de Colo:</strong> {passageirosViagem.filter(p => p.isCriancaColo).length}</p>
                </div>
              </div>

              {/* TABELA DE PASSAGEIROS */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase text-slate-700">Relação Oficial de Embarque</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b-2 border-slate-300 bg-slate-100">
                        <th className="p-2">Poltrona</th>
                        <th className="p-2">Nome Completo</th>
                        <th className="p-2">CPF</th>
                        <th className="p-2">RG</th>
                        <th className="p-2">Nascimento</th>
                      </tr>
                    </thead>
                    <tbody>
                      {passageirosViagem.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="p-4 text-center text-slate-500 italic">Nenhum passageiro cadastrado nesta viagem ainda.</td>
                        </tr>
                      ) : (
                        passageirosViagem.map((p, idx) => (
                          <tr key={idx} className="border-b border-slate-200">
                            <td className="p-2 font-bold">{p.poltrona}</td>
                            <td className="p-2 font-medium">{p.nome}</td>
                            <td className="p-2 font-mono">{p.cpf}</td>
                            <td className="p-2">{p.rg}</td>
                            <td className="p-2">{p.dataNascimento}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ASSINATURA */}
              <div className="pt-12 grid grid-cols-2 gap-8 text-center text-xs">
                <div className="border-t border-slate-400 pt-2">
                  <p>Assinatura da Empresa / Responsável</p>
                </div>
                <div className="border-t border-slate-400 pt-2">
                  <p>Assinatura do Motorista</p>
                </div>
              </div>

              {/* BOTÕES DE AÇÃO DO MODAL */}
              <div className="flex gap-3 pt-4 print:hidden">
                <button
                  onClick={() => window.print()}
                  className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <Printer className="w-4 h-4" /> Imprimir / Salvar PDF
                </button>
                <button
                  onClick={() => setManifestoModalViagem(null)}
                  className="w-1/2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-3 rounded-xl text-xs transition cursor-pointer"
                >
                  Fechar
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* MODAL: NOVA VIAGEM */}
      {modalViagemAberto && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Criar Nova Viagem</h3>
            <form onSubmit={handleCriarViagem} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Destino / Excursão</label>
                <input type="text" required placeholder="Ex: Rio de Janeiro - RJ" value={novaViagem.local} onChange={(e) => setNovaViagem({ ...novaViagem, local: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Data</label>
                  <input type="date" required value={novaViagem.dataIda} onChange={(e) => setNovaViagem({ ...novaViagem, dataIda: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Assentos</label>
                  <input type="number" value={novaViagem.capacidade} onChange={(e) => setNovaViagem({ ...novaViagem, capacidade: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Valor Passagem (R$)</label>
                <input type="number" value={novaViagem.valorPassagem} onChange={(e) => setNovaViagem({ ...novaViagem, valorPassagem: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Motorista</label>
                <select value={novaViagem.motorista} onChange={(e) => setNovaViagem({ ...novaViagem, motorista: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none">
                  <option value="">Selecione o motorista</option>
                  {motoristas.map(m => <option key={m.id} value={m.nome}>{m.nome}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Veículo / Frota</label>
                <select value={novaViagem.veiculo} onChange={(e) => setNovaViagem({ ...novaViagem, veiculo: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none">
                  <option value="">Selecione o veículo</option>
                  {veiculos.map(v => <option key={v.id} value={`${v.modelo} (${v.placa})`}>{v.modelo} - {v.placa}</option>)}
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setModalViagemAberto(false)} className="w-1/2 bg-slate-800 text-slate-300 font-bold py-2.5 rounded-xl text-xs cursor-pointer">Cancelar</button>
                <button type="submit" className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer">Salvar Viagem</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NOVO MOTORISTA */}
      {modalMotoristaAberto && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Cadastrar Motorista</h3>
            <form onSubmit={handleCriarMotorista} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Nome</label>
                <input type="text" required placeholder="Nome completo" value={novoMotorista.nome} onChange={(e) => setNovoMotorista({ ...novoMotorista, nome: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">CNH</label>
                <input type="text" placeholder="Número CNH" value={novoMotorista.cnh} onChange={(e) => setNovoMotorista({ ...novoMotorista, cnh: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Telefone</label>
                <input type="text" placeholder="Telefone" value={novoMotorista.telefone} onChange={(e) => setNovoMotorista({ ...novoMotorista, telefone: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white outline-none" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setModalMotoristaAberto(false)} className="w-1/2 bg-slate-800 text-slate-300 font-bold py-2.5 rounded-xl text-xs cursor-pointer">Cancelar</button>
                <button type="submit" className="w-1/2 bg-blue-600 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NOVO VEÍCULO */}
      {modalVeiculoAberto && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Cadastrar Veículo</h3>
            <form onSubmit={handleCriarVeiculo} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Modelo</label>
                <input type="text" required placeholder="Ex: Sprinter" value={novoVeiculo.modelo} onChange={(e) => setNovoVeiculo({ ...novoVeiculo, modelo: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Placa</label>
                <input type="text" required placeholder="ABC-1234" value={novoVeiculo.placa} onChange={(e) => setNovoVeiculo({ ...novoVeiculo, placa: e.target.value.toUpperCase() })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Lugares</label>
                <input type="number" value={novoVeiculo.lugares} onChange={(e) => setNovoVeiculo({ ...novoVeiculo, lugares: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white outline-none" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setModalVeiculoAberto(false)} className="w-1/2 bg-slate-800 text-slate-300 font-bold py-2.5 rounded-xl text-xs cursor-pointer">Cancelar</button>
                <button type="submit" className="w-1/2 bg-blue-600 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}