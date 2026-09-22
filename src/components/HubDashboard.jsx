import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  QrCode, 
  Calendar, 
  Users, 
  Plus, 
  Trash2, 
  Bus, 
  Check, 
  Copy, 
  Car, 
  Printer, 
  Menu, 
  X, 
  FileText,
  LogOut
} from 'lucide-react';

export default function HubDashboard() {
  const navigate = useNavigate();

  // RECUPERA O USUÁRIO LOGADO NA SESSÃO
  const sessaoAtiva = (() => {
    const s = localStorage.getItem('expresstour_sessao');
    return s ? JSON.parse(s) : { email: 'matheusnascimento.mat@gmail.com', nome: 'Matheus Nascimento' };
  })();

  const userEmail = sessaoAtiva.email.toLowerCase().trim();

  // CHAVES ISOLADAS POR USUÁRIO NO LOCALSTORAGE
  const KEY_VEICULOS = `veiculos_${userEmail}`;
  const KEY_MOTORISTAS = `motoristas_${userEmail}`;
  const KEY_VIAGENS = `viagens_${userEmail}`;

  const [abaAtiva, setAbaAtiva] = useState('viagens');
  const [mesRelatorio, setMesRelatorio] = useState('2026-09');
  const [menuAberto, setMenuAberto] = useState(false);
  const [viagemSelecionadaNota, setViagemSelecionadaNota] = useState(null);

  const navegarPara = (aba) => {
    setAbaAtiva(aba);
    setMenuAberto(false);
  };

  // ==========================================
  // ESTADOS ISOLADOS DE VEÍCULOS
  // ==========================================
  const [veiculos, setVeiculos] = useState(() => {
    const salvos = localStorage.getItem(KEY_VEICULOS);
    return salvos ? JSON.parse(salvos) : [
      { id: 1, placa: 'ABC1D23', marca: 'Marcopolo', modelo: 'Paradiso G7 1200', ano: '2021', capacidade: 18 },
      { id: 2, placa: 'XYZ9876', marca: 'Scania', modelo: 'K360', ano: '2020', capacidade: 46 }
    ];
  });

  const [novoVeiculo, setNovoVeiculo] = useState({ placa: '', marca: '', modelo: '', ano: '', capacidade: '' });

  // ==========================================
  // ESTADOS ISOLADOS DE MOTORISTAS
  // ==========================================
  const [motoristas, setMotoristas] = useState(() => {
    const salvos = localStorage.getItem(KEY_MOTORISTAS);
    return salvos ? JSON.parse(salvos) : [
      { id: 1, nome: 'Carlos Eduardo Silva', cpf: '123.456.789-00', cnh: '09876543210', endereco: 'Rua Halfeld, 500 - Juiz de Fora / MG' },
      { id: 2, nome: 'Roberto Alves Santos', cpf: '987.654.321-11', cnh: '12345678901', endereco: 'Av. Rio Branco, 1200 - Juiz de Fora / MG' }
    ];
  });

  const [novoMotorista, setNovoMotorista] = useState({ nome: '', cpf: '', cnh: '', endereco: '' });

  // ==========================================
  // ESTADOS ISOLADOS DE VIAGENS
  // ==========================================
  const [viagens, setViagens] = useState(() => {
    const salvos = localStorage.getItem(KEY_VIAGENS);
    return salvos ? JSON.parse(salvos) : [
      {
        id: 'v1',
        nomeResponsavel: 'Matheus Bastos',
        cpfResponsavel: '111.222.333-44',
        valor: 4500,
        motoristaId: 1,
        motoristaNome: 'Carlos Eduardo Silva',
        veiculoId: 1,
        veiculoModelo: 'Marcopolo Paradiso G7 (ABC1D23)',
        capacidadeTotal: 18,
        limitePassageiros: 17,
        dataIda: '2026-09-25',
        dataVolta: '2026-09-27',
        local: 'Cabo Frio - RJ',
        status: 'agendada'
      }
    ];
  });

  const [novaViagem, setNovaViagem] = useState({
    nomeResponsavel: '',
    cpfResponsavel: '',
    valor: '',
    motoristaId: '',
    veiculoId: '',
    dataIda: '',
    dataVolta: '',
    local: ''
  });

  const [qrCodeGerado, setQrCodeGerado] = useState(null);
  const [copiado, setCopiado] = useState(false);

  // GUARDA ALTERAÇÕES NO LOCALSTORAGE ISOLADO POR E-MAIL
  useEffect(() => {
    localStorage.setItem(KEY_VEICULOS, JSON.stringify(veiculos));
  }, [veiculos, KEY_VEICULOS]);

  useEffect(() => {
    localStorage.setItem(KEY_MOTORISTAS, JSON.stringify(motoristas));
  }, [motoristas, KEY_MOTORISTAS]);

  useEffect(() => {
    localStorage.setItem(KEY_VIAGENS, JSON.stringify(viagens));
  }, [viagens, KEY_VIAGENS]);

  // LOGOUT
  const handleLogout = () => {
    if (confirm('Deseja sair da sua conta?')) {
      localStorage.removeItem('expresstour_sessao');
      navigate('/login');
    }
  };

  // EXCLUIR VIAGEM DO FINANCEIRO
  const handleExcluirViagem = (id) => {
    if (confirm('Tem certeza que deseja excluir esta viagem do seu registro?')) {
      const atualizadas = viagens.filter(v => v.id !== id);
      setViagens(atualizadas);
      localStorage.setItem(KEY_VIAGENS, JSON.stringify(atualizadas));
      localStorage.removeItem(`viagem_${id}`);
      localStorage.removeItem(`passageiros_${id}`);
    }
  };

  const handleAddVeiculo = (e) => {
    e.preventDefault();
    if (!novoVeiculo.placa || !novoVeiculo.marca || !novoVeiculo.modelo || !novoVeiculo.ano || !novoVeiculo.capacidade) return;
    const veiculoCriado = { id: Date.now(), placa: novoVeiculo.placa.toUpperCase(), marca: novoVeiculo.marca, modelo: novoVeiculo.modelo, ano: novoVeiculo.ano, capacidade: parseInt(novoVeiculo.capacidade) };
    setVeiculos([...veiculos, veiculoCriado]);
    setNovoVeiculo({ placa: '', marca: '', modelo: '', ano: '', capacidade: '' });
  };

  const handleExcluirVeiculo = (id) => {
    if (confirm('Deseja remover este veículo da sua frota?')) {
      setVeiculos(veiculos.filter(v => v.id !== id));
    }
  };

  const handleCriarViagem = (e) => {
    e.preventDefault();
    if (!novaViagem.motoristaId || !novaViagem.veiculoId) return alert('Selecione o motorista e o veículo.');

    const motoristaObj = motoristas.find(m => m.id === parseInt(novaViagem.motoristaId));
    const veiculoObj = veiculos.find(v => v.id === parseInt(novaViagem.veiculoId));
    const newId = `v-${Date.now()}`;

    const viagemCriada = {
      id: newId,
      nomeResponsavel: novaViagem.nomeResponsavel,
      cpfResponsavel: novaViagem.cpfResponsavel,
      valor: parseFloat(novaViagem.valor),
      motoristaId: parseInt(novaViagem.motoristaId),
      motoristaNome: motoristaObj ? motoristaObj.nome : 'Não informado',
      veiculoId: parseInt(novaViagem.veiculoId),
      veiculoModelo: veiculoObj ? `${veiculoObj.marca} ${veiculoObj.modelo} (${veiculoObj.placa})` : 'Não informado',
      capacidadeTotal: veiculoObj ? veiculoObj.capacidade : 0,
      limitePassageiros: veiculoObj ? veiculoObj.capacidade - 1 : 0,
      dataIda: novaViagem.dataIda,
      dataVolta: novaViagem.dataVolta,
      local: novaViagem.local,
      status: 'agendada'
    };

    setViagens([viagemCriada, ...viagens]);
    localStorage.setItem(`viagem_${newId}`, JSON.stringify(viagemCriada));

    const urlCadastro = `${window.location.origin}/cadastro/${newId}`;
    setQrCodeGerado({
      url: urlCadastro,
      viagem: viagemCriada,
      qrImageUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(urlCadastro)}`
    });

    setNovaViagem({ nomeResponsavel: '', cpfResponsavel: '', valor: '', motoristaId: '', veiculoId: '', dataIda: '', dataVolta: '', local: '' });
  };

  const handleAddMotorista = (e) => {
    e.preventDefault();
    if (!novoMotorista.nome || !novoMotorista.cpf) return;
    setMotoristas([...motoristas, { id: Date.now(), ...novoMotorista }]);
    setNovoMotorista({ nome: '', cpf: '', cnh: '', endereco: '' });
  };

  const handleExcluirMotorista = (id) => {
    if (confirm('Tem certeza que deseja excluir este motorista?')) {
      setMotoristas(motoristas.filter(m => m.id !== id));
    }
  };

  const handleCopiarLink = (url) => {
    navigator.clipboard.writeText(url);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const viagensDoMes = viagens.filter(v => v.dataIda.startsWith(mesRelatorio));
  const valorTotalDoMes = viagensDoMes.reduce((acc, v) => acc + v.valor, 0);

  const handleImprimir = () => {
    window.print();
  };

  const getPassageirosViagem = (viagemId) => {
    const salvos = localStorage.getItem(`passageiros_${viagemId}`);
    return salvos ? JSON.parse(salvos) : [];
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-100 font-sans text-slate-800">
      
      {/* ESTILOS DE IMPRESSÃO */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #area-print, #area-print * { visibility: visible; }
          #area-print { position: absolute; left: 0; top: 0; width: 100%; background: #fff; padding: 20px; }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* BARRA SUPERIOR MOBILE */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center sticky top-0 z-40 shadow-md no-print">
        <div className="flex items-center gap-2.5">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white">
            <Bus className="w-5 h-5" />
          </div>
          <span className="font-bold text-sm">ExpressTour</span>
        </div>
        <button onClick={() => setMenuAberto(!menuAberto)} className="p-2 rounded-xl bg-slate-800 text-slate-200">
          {menuAberto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {menuAberto && <div onClick={() => setMenuAberto(false)} className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 md:hidden no-print" />}

      {/* SIDEBAR DE NAVEGAÇÃO DA CONTA */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-72 md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 shadow-2xl md:shadow-none transition-transform duration-300 z-50 no-print ${menuAberto ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white">
              <Bus className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-white text-base">ExpressTour</h1>
              <p className="text-[10px] text-blue-400 font-mono truncate max-w-[130px]">{userEmail}</p>
            </div>
          </div>
          <button onClick={() => setMenuAberto(false)} className="md:hidden text-slate-400 p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <button onClick={() => navegarPara('gerar-link')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${abaAtiva === 'gerar-link' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}>
            <QrCode className="w-5 h-5" /> Novo Link / QR Code
          </button>

          <button onClick={() => navegarPara('viagens')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${abaAtiva === 'viagens' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}>
            <Calendar className="w-5 h-5" /> Viagens & Financeiro
          </button>

          <button onClick={() => navegarPara('notas')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${abaAtiva === 'notas' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}>
            <FileText className="w-5 h-5" /> Notas / Manifesto ANTT
          </button>

          <button onClick={() => navegarPara('veiculos')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${abaAtiva === 'veiculos' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}>
            <Car className="w-5 h-5" /> Veículos / Frota
          </button>

          <button onClick={() => navegarPara('motoristas')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${abaAtiva === 'motoristas' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}>
            <Users className="w-5 h-5" /> Motoristas
          </button>
        </nav>

        {/* BOTÃO DE LOGOUT / SAIR */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full bg-slate-800 hover:bg-red-600/20 hover:text-red-400 text-slate-400 p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Sair da Conta
          </button>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL DA CONTA LOGADA */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto w-full min-h-screen">
        
        {/* GERAR LINK / QR CODE */}
        {abaAtiva === 'gerar-link' && (
          <div className="max-w-4xl mx-auto space-y-6 no-print">
            <header className="border-b border-slate-200 pb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Gerar Link & QR Code de Viagem</h2>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <form onSubmit={handleCriarViagem} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-blue-600" /> Nova Viagem
                </h3>
                <input type="text" required placeholder="Responsável pela Viagem *" value={novaViagem.nomeResponsavel} onChange={(e) => setNovaViagem({ ...novaViagem, nomeResponsavel: e.target.value })} className="w-full bg-slate-50 border p-2.5 rounded-xl text-sm" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" required placeholder="CPF Responsável *" value={novaViagem.cpfResponsavel} onChange={(e) => setNovaViagem({ ...novaViagem, cpfResponsavel: e.target.value })} className="w-full bg-slate-50 border p-2.5 rounded-xl text-sm" />
                  <input type="number" required placeholder="Valor (R$) *" value={novaViagem.valor} onChange={(e) => setNovaViagem({ ...novaViagem, valor: e.target.value })} className="w-full bg-slate-50 border p-2.5 rounded-xl text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select required value={novaViagem.motoristaId} onChange={(e) => setNovaViagem({ ...novaViagem, motoristaId: e.target.value })} className="w-full bg-slate-50 border p-2.5 rounded-xl text-sm">
                    <option value="">Motorista...</option>
                    {motoristas.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
                  </select>
                  <select required value={novaViagem.veiculoId} onChange={(e) => setNovaViagem({ ...novaViagem, veiculoId: e.target.value })} className="w-full bg-slate-50 border p-2.5 rounded-xl text-sm">
                    <option value="">Veículo...</option>
                    {veiculos.map(v => <option key={v.id} value={v.id}>{v.marca} {v.modelo}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" required value={novaViagem.dataIda} onChange={(e) => setNovaViagem({ ...novaViagem, dataIda: e.target.value })} className="w-full bg-slate-50 border p-2.5 rounded-xl text-sm" />
                  <input type="date" required value={novaViagem.dataVolta} onChange={(e) => setNovaViagem({ ...novaViagem, dataVolta: e.target.value })} className="w-full bg-slate-50 border p-2.5 rounded-xl text-sm" />
                </div>
                <input type="text" required placeholder="Destino / Local *" value={novaViagem.local} onChange={(e) => setNovaViagem({ ...novaViagem, local: e.target.value })} className="w-full bg-slate-50 border p-2.5 rounded-xl text-sm" />
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl text-sm">Gerar Viagem e QR Code</button>
              </form>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-center">
                {qrCodeGerado ? (
                  <div className="space-y-4 w-full max-w-xs">
                    <img src={qrCodeGerado.qrImageUrl} alt="QR Code" className="w-48 h-48 mx-auto" />
                    <button onClick={() => handleCopiarLink(qrCodeGerado.url)} className="w-full bg-slate-900 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2">
                      {copiado ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      {copiado ? 'Copiado!' : 'Copiar Link'}
                    </button>
                  </div>
                ) : (
                  <div className="text-slate-400 py-8">Nenhum QR Code gerado ainda</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIAGENS & FINANCEIRO */}
        {abaAtiva === 'viagens' && (
          <div className="space-y-6">
            <header className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Relatórios Financeiros & Agenda</h2>
              </div>
              <div className="flex items-center gap-3">
                <input type="month" value={mesRelatorio} onChange={(e) => setMesRelatorio(e.target.value)} className="bg-white border rounded-xl px-3 py-2 text-sm font-bold" />
                <button onClick={handleImprimir} className="bg-emerald-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm">
                  <Printer className="w-4 h-4 inline mr-1" /> Imprimir Mês
                </button>
              </div>
            </header>

            <div id="area-print" className="bg-white p-4 sm:p-8 rounded-2xl border border-slate-200 space-y-6">
              <div className="border-b pb-4 flex justify-between items-start">
                <div>
                  <h1 className="text-base sm:text-xl font-bold text-slate-900 uppercase">Relatório Financeiro Mensal de Viagens</h1>
                  <p className="text-xs text-slate-500">Período de Referência: <strong>{mesRelatorio}</strong></p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-slate-100 border-b text-slate-700 uppercase font-bold">
                      <th className="p-3">Destino / Viagem</th>
                      <th className="p-3">Período</th>
                      <th className="p-3">Contratante</th>
                      <th className="p-3">Motorista</th>
                      <th className="p-3">Veículo</th>
                      <th className="p-3 text-right">Valor (R$)</th>
                      <th className="p-3 text-center no-print">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {viagensDoMes.length > 0 ? (
                      viagensDoMes.map((v) => (
                        <tr key={v.id} className="hover:bg-slate-50 transition">
                          <td className="p-3 font-bold text-slate-900">{v.local}</td>
                          <td className="p-3 text-slate-600">{v.dataIda} até {v.dataVolta}</td>
                          <td className="p-3 text-slate-800 font-medium">{v.nomeResponsavel}</td>
                          <td className="p-3 text-slate-800">{v.motoristaNome}</td>
                          <td className="p-3 text-slate-600">{v.veiculoModelo}</td>
                          <td className="p-3 text-right font-bold text-slate-900">R$ {v.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                          <td className="p-3 text-center no-print">
                            <button onClick={() => handleExcluirViagem(v.id)} className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="7" className="p-6 text-center text-slate-400">Nenhuma viagem cadastrada no mês {mesRelatorio}.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="border-t-2 border-slate-900 pt-4 flex justify-between items-center bg-slate-50 p-4 rounded-xl">
                <span className="text-xs font-semibold text-slate-500 uppercase">Faturamento Total do Mês</span>
                <p className="text-2xl font-black text-emerald-700">R$ {valorTotalDoMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
          </div>
        )}

        {/* NOTAS / MANIFESTO ANTT */}
        {abaAtiva === 'notas' && (
          <div className="space-y-6">
            <header className="border-b border-slate-200 pb-4 flex justify-between items-center no-print">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Notas & Manifestos de Viagem (ANTT / DER)</h2>
              </div>
              {viagemSelecionadaNota && (
                <button onClick={handleImprimir} className="bg-blue-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm">
                  <Printer className="w-4 h-4 inline mr-1" /> Imprimir Manifesto
                </button>
              )}
            </header>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 no-print space-y-2">
              <label className="block text-xs font-bold text-slate-700">Escolha a Viagem para Emitir a Nota:</label>
              <select
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm font-semibold"
                value={viagemSelecionadaNota ? viagemSelecionadaNota.id : ''}
                onChange={(e) => setViagemSelecionadaNota(viagens.find(v => v.id === e.target.value) || null)}
              >
                <option value="">Selecione uma viagem...</option>
                {viagens.map(v => (
                  <option key={v.id} value={v.id}>{v.local} ({v.dataIda} até {v.dataVolta}) - Contratante: {v.nomeResponsavel}</option>
                ))}
              </select>
            </div>

            {viagemSelecionadaNota ? (
              <div id="area-print" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-300 space-y-6">
                <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
                  <h1 className="text-lg font-black uppercase">MANIFESTO DE PASSAGEIROS - FRETAMENTO MUNICIPAL / INTERESTADUAL</h1>
                  <p className="text-xs font-bold uppercase text-slate-600">Documento de Porte Obrigatório ANTT / DER</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <p><strong>CONTRATANTE:</strong> {viagemSelecionadaNota.nomeResponsavel}</p>
                    <p><strong>CPF CONTRATANTE:</strong> {viagemSelecionadaNota.cpfResponsavel}</p>
                    <p><strong>DESTINO:</strong> {viagemSelecionadaNota.local}</p>
                    <p><strong>PERÍODO:</strong> {viagemSelecionadaNota.dataIda} até {viagemSelecionadaNota.dataVolta}</p>
                  </div>
                  <div>
                    <p><strong>MOTORISTA:</strong> {viagemSelecionadaNota.motoristaNome}</p>
                    <p><strong>VEÍCULO:</strong> {viagemSelecionadaNota.veiculoModelo}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase">Relação Oficial de Passageiros Cadastrados:</h3>
                  <table className="w-full text-left text-xs border-collapse border border-slate-300">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-300 font-bold">
                        <th className="p-2 border-r w-12 text-center">Pol.</th>
                        <th className="p-2 border-r">Nome do Passageiro</th>
                        <th className="p-2 border-r">Data Nasc.</th>
                        <th className="p-2 border-r">Idade</th>
                        <th className="p-2 border-r">CPF</th>
                        <th className="p-2">RG</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getPassageirosViagem(viagemSelecionadaNota.id).length > 0 ? (
                        getPassageirosViagem(viagemSelecionadaNota.id).map((p, idx) => (
                          <tr key={p.id || idx} className="border-b">
                            <td className="p-2 border-r text-center font-bold">{p.poltrona || idx + 1}</td>
                            <td className="p-2 border-r font-semibold">{p.nome}</td>
                            <td className="p-2 border-r">{p.dataNascimento}</td>
                            <td className="p-2 border-r">{p.idade} anos</td>
                            <td className="p-2 border-r font-mono">{p.cpf}</td>
                            <td className="p-2 font-mono uppercase">{p.rg}</td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan="6" className="p-4 text-center text-slate-400">Nenhum passageiro cadastrado ainda.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs">
                  <div className="border-t border-slate-400 pt-1">Assinatura do Responsável</div>
                  <div className="border-t border-slate-400 pt-1">Assinatura do Motorista</div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-12 text-center rounded-2xl border text-slate-400 text-sm">Selecione uma viagem na caixa acima para ver a nota.</div>
            )}
          </div>
        )}

        {/* VEÍCULOS */}
        {abaAtiva === 'veiculos' && (
          <div className="space-y-6 no-print">
            <header className="border-b border-slate-200 pb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Gestão de Veículos</h2>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <form onSubmit={handleAddVeiculo} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 h-fit">
                <h3 className="font-bold text-slate-900 text-base">Cadastrar Veículo</h3>
                <input type="text" required placeholder="Placa *" value={novoVeiculo.placa} onChange={(e) => setNovoVeiculo({ ...novoVeiculo, placa: e.target.value })} className="w-full bg-slate-50 border p-2 rounded-xl text-sm uppercase font-mono" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" required placeholder="Marca *" value={novoVeiculo.marca} onChange={(e) => setNovoVeiculo({ ...novoVeiculo, marca: e.target.value })} className="w-full bg-slate-50 border p-2 rounded-xl text-sm" />
                  <input type="text" required placeholder="Modelo *" value={novoVeiculo.modelo} onChange={(e) => setNovoVeiculo({ ...novoVeiculo, modelo: e.target.value })} className="w-full bg-slate-50 border p-2 rounded-xl text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" required placeholder="Ano *" value={novoVeiculo.ano} onChange={(e) => setNovoVeiculo({ ...novoVeiculo, ano: e.target.value })} className="w-full bg-slate-50 border p-2 rounded-xl text-sm" />
                  <input type="number" required placeholder="Capacidade Total *" value={novoVeiculo.capacidade} onChange={(e) => setNovoVeiculo({ ...novoVeiculo, capacidade: e.target.value })} className="w-full bg-slate-50 border p-2 rounded-xl text-sm" />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl text-sm">Salvar Veículo</button>
              </form>

              <div className="lg:col-span-2 space-y-4">
                {veiculos.map((v) => (
                  <div key={v.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-slate-900">{v.marca} {v.modelo}</h4>
                      <p className="text-xs text-slate-500">Placa: {v.placa} | Ano: {v.ano} | {v.capacidade} lugares</p>
                    </div>
                    <button onClick={() => handleExcluirVeiculo(v.id)} className="p-2 bg-red-50 text-red-600 rounded-xl">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MOTORISTAS */}
        {abaAtiva === 'motoristas' && (
          <div className="space-y-6 no-print">
            <header className="border-b border-slate-200 pb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Gestão de Motoristas</h2>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <form onSubmit={handleAddMotorista} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 h-fit">
                <h3 className="font-bold text-slate-900 text-base">Novo Motorista</h3>
                <input type="text" required placeholder="Nome Completo *" value={novoMotorista.nome} onChange={(e) => setNovoMotorista({ ...novoMotorista, nome: e.target.value })} className="w-full bg-slate-50 border p-2 rounded-xl text-sm" />
                <input type="text" required placeholder="CPF *" value={novoMotorista.cpf} onChange={(e) => setNovoMotorista({ ...novoMotorista, cpf: e.target.value })} className="w-full bg-slate-50 border p-2 rounded-xl text-sm" />
                <input type="text" required placeholder="CNH *" value={novoMotorista.cnh} onChange={(e) => setNovoMotorista({ ...novoMotorista, cnh: e.target.value })} className="w-full bg-slate-50 border p-2 rounded-xl text-sm" />
                <input type="text" required placeholder="Endereço *" value={novoMotorista.endereco} onChange={(e) => setNovoMotorista({ ...novoMotorista, endereco: e.target.value })} className="w-full bg-slate-50 border p-2 rounded-xl text-sm" />
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl text-sm">Salvar Motorista</button>
              </form>

              <div className="lg:col-span-2 space-y-4">
                {motoristas.map(m => (
                  <div key={m.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-slate-900">{m.nome}</h4>
                      <p className="text-xs text-slate-500">CPF: {m.cpf} | CNH: {m.cnh}</p>
                    </div>
                    <button onClick={() => handleExcluirMotorista(m.id)} className="p-2 bg-red-50 text-red-600 rounded-xl">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}