import React, { useState } from 'react';
import { 
  QrCode, 
  Calendar, 
  Users, 
  Plus, 
  Trash2, 
  DollarSign, 
  Bus,
  CheckCircle2,
  Copy,
  Check,
  Car,
  Printer,
  Menu,
  X,
  FileText
} from 'lucide-react';

export default function HubDashboard() {
  const [abaAtiva, setAbaAtiva] = useState('viagens'); // 'gerar-link', 'viagens', 'notas', 'veiculos', 'motoristas'
  const [mesRelatorio, setMesRelatorio] = useState('2026-09');
  const [menuAberto, setMenuAberto] = useState(false);
  const [viagemSelecionadaNota, setViagemSelecionadaNota] = useState(null);

  const navegarPara = (aba) => {
    setAbaAtiva(aba);
    setMenuAberto(false);
  };

  // ==========================================
  // ESTADOS DE VEÍCULOS
  // ==========================================
  const [veiculos, setVeiculos] = useState([
    {
      id: 1,
      placa: 'ABC1D23',
      marca: 'Marcopolo',
      modelo: 'Paradiso G7 1200',
      ano: '2021',
      capacidade: 18,
    },
    {
      id: 2,
      placa: 'XYZ9876',
      marca: 'Scania',
      modelo: 'K360',
      ano: '2020',
      capacidade: 46,
    }
  ]);

  const [novoVeiculo, setNovoVeiculo] = useState({ placa: '', marca: '', modelo: '', ano: '', capacidade: '' });

  // ==========================================
  // ESTADOS DE MOTORISTAS
  // ==========================================
  const [motoristas, setMotoristas] = useState([
    {
      id: 1,
      nome: 'Carlos Eduardo Silva',
      cpf: '123.456.789-00',
      cnh: '09876543210',
      endereco: 'Rua Halfeld, 500 - Juiz de Fora / MG',
    },
    {
      id: 2,
      nome: 'Roberto Alves Santos',
      cpf: '987.654.321-11',
      cnh: '12345678901',
      endereco: 'Av. Rio Branco, 1200 - Juiz de Fora / MG',
    }
  ]);

  const [novoMotorista, setNovoMotorista] = useState({ nome: '', cpf: '', cnh: '', endereco: '' });

  // ==========================================
  // ESTADOS DE VIAGENS
  // ==========================================
  const [viagens, setViagens] = useState([
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
    },
    {
      id: 'v2',
      nomeResponsavel: 'Ana Paula Souza',
      cpfResponsavel: '555.666.777-88',
      valor: 3200,
      motoristaId: 2,
      motoristaNome: 'Roberto Alves Santos',
      veiculoId: 2,
      veiculoModelo: 'Scania K360 (XYZ9876)',
      capacidadeTotal: 46,
      limitePassageiros: 45,
      dataIda: '2026-09-10',
      dataVolta: '2026-09-12',
      local: 'Ouro Preto - MG',
      status: 'concluida'
    }
  ]);

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

  // EXCLUIR VIAGEM DO FINANCEIRO
  const handleExcluirViagem = (id) => {
    if (confirm('Tem certeza que deseja excluir esta viagem do registro financeiro?')) {
      setViagens(viagens.filter(v => v.id !== id));
      localStorage.removeItem(`viagem_${id}`);
      localStorage.removeItem(`passageiros_${id}`);
    }
  };

  const handleAddVeiculo = (e) => {
    e.preventDefault();
    if (!novoVeiculo.placa || !novoVeiculo.marca || !novoVeiculo.modelo || !novoVeiculo.ano || !novoVeiculo.capacidade) return;
    const veiculoCriado = { id: Date.now(), placa: novoVeiculo.placa.toUpperCase(), marca: novoVeiculo.marca, modelo: novoVeiculo.modelo, ano: novoVeiculo.ano, capacidade: parseInt(novoVeiculo.capacidade) };
    setVeiculos([veiculoCriado, ...veiculos]);
    setNovoVeiculo({ placa: '', marca: '', modelo: '', ano: '', capacidade: '' });
  };

  const handleExcluirVeiculo = (id) => {
    if (confirm('Deseja remover este veículo da frota?')) setVeiculos(veiculos.filter(v => v.id !== id));
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
    if (confirm('Tem certeza que deseja excluir este motorista?')) setMotoristas(motoristas.filter(m => m.id !== id));
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

  // Carrega passageiros para a Nota ANTT
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

      {/* SIDEBAR */}
      <aside className={`fixed md:static top-0 left-0 h-full z-50 w-72 md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 transition-transform duration-300 no-print ${menuAberto ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white">
              <Bus className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-white text-base">ExpressTour</h1>
              <p className="text-xs text-slate-400">Painel de Gestão</p>
            </div>
          </div>
          <button onClick={() => setMenuAberto(false)} className="md:hidden text-slate-400 p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1.5">
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
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto w-full">
        
        {/* ========================================================= */}
        {/* ABA: GERAR LINK / QR CODE */}
        {/* ========================================================= */}
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
                <input type="text" required placeholder="Responsável pela Viagem" value={novaViagem.nomeResponsavel} onChange={(e) => setNovaViagem({ ...novaViagem, nomeResponsavel: e.target.value })} className="w-full bg-slate-50 border p-2.5 rounded-xl text-sm" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" required placeholder="CPF Responsável" value={novaViagem.cpfResponsavel} onChange={(e) => setNovaViagem({ ...novaViagem, cpfResponsavel: e.target.value })} className="w-full bg-slate-50 border p-2.5 rounded-xl text-sm" />
                  <input type="number" required placeholder="Valor (R$)" value={novaViagem.valor} onChange={(e) => setNovaViagem({ ...novaViagem, valor: e.target.value })} className="w-full bg-slate-50 border p-2.5 rounded-xl text-sm" />
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
                <input type="text" required placeholder="Destino / Local" value={novaViagem.local} onChange={(e) => setNovaViagem({ ...novaViagem, local: e.target.value })} className="w-full bg-slate-50 border p-2.5 rounded-xl text-sm" />
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl text-sm">Gerar QR Code</button>
              </form>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-center">
                {qrCodeGerado ? (
                  <div className="space-y-4 w-full max-w-xs">
                    <img src={qrCodeGerado.qrImageUrl} alt="QR Code" className="w-48 h-48 mx-auto" />
                    <button onClick={() => handleCopiarLink(qrCodeGerado.url)} className="w-full bg-slate-900 text-white text-xs font-bold py-2.5 rounded-xl">
                      {copiado ? 'Copiado!' : 'Copiar Link'}
                    </button>
                  </div>
                ) : (
                  <div className="text-slate-400 py-8">Preencha os dados ao lado para gerar o QR Code</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ABA: VIAGENS & FINANCEIRO (COM EXCLUSÃO) */}
        {/* ========================================================= */}
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
                            <button onClick={() => handleExcluirViagem(v.id)} className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100" title="Excluir Viagem">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="7" className="p-6 text-center text-slate-400">Nenhuma viagem no mês {mesRelatorio}.</td></tr>
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

        {/* ========================================================= */}
        {/* NOVA ABA: NOTAS / MANIFESTO OFICIAL ANTT */}
        {/* ========================================================= */}
        {abaAtiva === 'notas' && (
          <div className="space-y-6">
            <header className="border-b border-slate-200 pb-4 flex justify-between items-center no-print">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Notas & Manifestos de Viagem (ANTT / DER)</h2>
                <p className="text-xs sm:text-sm text-slate-500">Selecione a viagem concluída para gerar e imprimir a lista oficial de passageiros.</p>
              </div>

              {viagemSelecionadaNota && (
                <button onClick={handleImprimir} className="bg-blue-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-lg shadow-blue-600/20">
                  <Printer className="w-4 h-4 inline mr-1" /> Imprimir Manifesto ANTT
                </button>
              )}
            </header>

            {/* SELETOR DE VIAGEM */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 no-print space-y-2">
              <label className="block text-xs font-bold text-slate-700">Escolha a Viagem para Emitir a Nota:</label>
              <select
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm font-semibold outline-none"
                value={viagemSelecionadaNota ? viagemSelecionadaNota.id : ''}
                onChange={(e) => {
                  const v = viagens.find(item => item.id === e.target.value);
                  setViagemSelecionadaNota(v || null);
                }}
              >
                <option value="">Selecione uma viagem...</option>
                {viagens.map(v => (
                  <option key={v.id} value={v.id}>{v.local} ({v.dataIda} até {v.dataVolta}) - Contratante: {v.nomeResponsavel}</option>
                ))}
              </select>
            </div>

            {/* MANIFESTO IMPRESSO NO PADRÃO ANTT */}
            {viagemSelecionadaNota ? (
              <div id="area-print" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-300 space-y-6">
                
                {/* CABEÇALHO ANTT */}
                <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
                  <h1 className="text-lg font-black text-slate-900 uppercase">MANIFESTO DE PASSAGEIROS - FRETAMENTO MUNICIPAL / INTERESTADUAL</h1>
                  <p className="text-xs font-bold text-slate-600 uppercase">Documento de Porte Obrigatório conforme Regulamentação ANTT / DER</p>
                </div>

                {/* DADOS DA VIAGEM E FROTA */}
                <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <p><strong>CONTRATANTE / RESPONSÁVEL:</strong> {viagemSelecionadaNota.nomeResponsavel}</p>
                    <p><strong>CPF DO CONTRATANTE:</strong> {viagemSelecionadaNota.cpfResponsavel}</p>
                    <p><strong>ORIGEM / DESTINO:</strong> {viagemSelecionadaNota.local}</p>
                    <p><strong>PERÍODO:</strong> {viagemSelecionadaNota.dataIda} até {viagemSelecionadaNota.dataVolta}</p>
                  </div>
                  <div>
                    <p><strong>MOTORISTA:</strong> {viagemSelecionadaNota.motoristaNome}</p>
                    <p><strong>VEÍCULO:</strong> {viagemSelecionadaNota.veiculoModelo}</p>
                    <p><strong>TIPO DE SERVIÇO:</strong> Fretamento Turístico / Eventual</p>
                  </div>
                </div>

                {/* TABELA DE PASSAGEIROS CADASTRADOS */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase text-slate-700">Relação Oficial de Passageiros Cadastrados:</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse border border-slate-300">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-300 text-slate-800 uppercase font-bold">
                          <th className="p-2 border-r border-slate-300 w-12 text-center">Pol.</th>
                          <th className="p-2 border-r border-slate-300">Nome do Passageiro</th>
                          <th className="p-2 border-r border-slate-300">Data Nasc.</th>
                          <th className="p-2 border-r border-slate-300">Idade</th>
                          <th className="p-2 border-r border-slate-300">CPF</th>
                          <th className="p-2">RG / Doc Identidade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {getPassageirosViagem(viagemSelecionadaNota.id).length > 0 ? (
                          getPassageirosViagem(viagemSelecionadaNota.id).map((p, idx) => (
                            <tr key={p.id || idx}>
                              <td className="p-2 border-r border-slate-300 text-center font-bold">{p.poltrona || idx + 1}</td>
                              <td className="p-2 border-r border-slate-300 font-semibold">{p.nome}</td>
                              <td className="p-2 border-r border-slate-300">{p.dataNascimento}</td>
                              <td className="p-2 border-r border-slate-300">{p.idade} anos</td>
                              <td className="p-2 border-r border-slate-300 font-mono">{p.cpf}</td>
                              <td className="p-2 font-mono uppercase">{p.rg}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="p-4 text-center text-slate-400">Nenhum passageiro realizou o auto-cadastro via QR Code para esta viagem ainda.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ASSINATURA E IMPRESSÃO */}
                <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs">
                  <div>
                    <div className="border-t border-slate-400 pt-1">Assinatura do Responsável</div>
                  </div>
                  <div>
                    <div className="border-t border-slate-400 pt-1">Assinatura do Motorista</div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400 text-sm">
                Selecione uma viagem na caixa acima para visualizar e imprimir a nota do manifesto.
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* ABA: VEÍCULOS */}
        {/* ========================================================= */}
        {abaAtiva === 'veiculos' && (
          <div className="space-y-6 no-print">
            <header className="border-b border-slate-200 pb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Gestão de Veículos</h2>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <form onSubmit={handleAddVeiculo} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 h-fit">
                <h3 className="font-bold text-slate-900 text-base">Cadastrar Veículo</h3>
                <input type="text" required placeholder="Placa" value={novoVeiculo.placa} onChange={(e) => setNovoVeiculo({ ...novoVeiculo, placa: e.target.value })} className="w-full bg-slate-50 border p-2 rounded-xl text-sm uppercase font-mono" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" required placeholder="Marca" value={novoVeiculo.marca} onChange={(e) => setNovoVeiculo({ ...novoVeiculo, marca: e.target.value })} className="w-full bg-slate-50 border p-2 rounded-xl text-sm" />
                  <input type="text" required placeholder="Modelo" value={novoVeiculo.modelo} onChange={(e) => setNovoVeiculo({ ...novoVeiculo, modelo: e.target.value })} className="w-full bg-slate-50 border p-2 rounded-xl text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" required placeholder="Ano" value={novoVeiculo.ano} onChange={(e) => setNovoVeiculo({ ...novoVeiculo, ano: e.target.value })} className="w-full bg-slate-50 border p-2 rounded-xl text-sm" />
                  <input type="number" required placeholder="Capacidade Total" value={novoVeiculo.capacidade} onChange={(e) => setNovoVeiculo({ ...novoVeiculo, capacidade: e.target.value })} className="w-full bg-slate-50 border p-2 rounded-xl text-sm" />
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

        {/* ========================================================= */}
        {/* ABA: MOTORISTAS */}
        {/* ========================================================= */}
        {abaAtiva === 'motoristas' && (
          <div className="space-y-6 no-print">
            <header className="border-b border-slate-200 pb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Gestão de Motoristas</h2>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <form onSubmit={handleAddMotorista} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 h-fit">
                <h3 className="font-bold text-slate-900 text-base">Novo Motorista</h3>
                <input type="text" required placeholder="Nome Completo" value={novoMotorista.nome} onChange={(e) => setNovoMotorista({ ...novoMotorista, nome: e.target.value })} className="w-full bg-slate-50 border p-2 rounded-xl text-sm" />
                <input type="text" required placeholder="CPF" value={novoMotorista.cpf} onChange={(e) => setNovoMotorista({ ...novoMotorista, cpf: e.target.value })} className="w-full bg-slate-50 border p-2 rounded-xl text-sm" />
                <input type="text" required placeholder="CNH" value={novoMotorista.cnh} onChange={(e) => setNovoMotorista({ ...novoMotorista, cnh: e.target.value })} className="w-full bg-slate-50 border p-2 rounded-xl text-sm" />
                <input type="text" required placeholder="Endereço" value={novoMotorista.endereco} onChange={(e) => setNovoMotorista({ ...novoMotorista, endereco: e.target.value })} className="w-full bg-slate-50 border p-2 rounded-xl text-sm" />
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
