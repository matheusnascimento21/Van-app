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
  X
} from 'lucide-react';

export default function HubDashboard() {
  const [abaAtiva, setAbaAtiva] = useState('viagens');
  const [mesRelatorio, setMesRelatorio] = useState('2026-09');

  // Estado do Menu Mobile (Aberto / Fechado)
  const [menuAberto, setMenuAberto] = useState(false);

  // Função para trocar de aba e fechar o menu no celular automaticamente
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
      foto: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&q=80'
    },
    {
      id: 2,
      placa: 'XYZ9876',
      marca: 'Scania',
      modelo: 'K360',
      ano: '2020',
      capacidade: 46,
      foto: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=500&q=80'
    }
  ]);

  const [novoVeiculo, setNovoVeiculo] = useState({
    placa: '',
    marca: '',
    modelo: '',
    ano: '',
    capacidade: ''
  });

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

  // CADASTRAR VEÍCULO
  const handleAddVeiculo = (e) => {
    e.preventDefault();
    if (!novoVeiculo.placa || !novoVeiculo.marca || !novoVeiculo.modelo || !novoVeiculo.ano || !novoVeiculo.capacidade) {
      return alert('Preencha todos os campos do veículo.');
    }

    const capNum = parseInt(novoVeiculo.capacidade);
    const veiculoCriado = {
      id: Date.now(),
      placa: novoVeiculo.placa.toUpperCase(),
      marca: novoVeiculo.marca,
      modelo: novoVeiculo.modelo,
      ano: novoVeiculo.ano,
      capacidade: capNum,
      foto: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&q=80'
    };

    setVeiculos([veiculoCriado, ...veiculos]);
    setNovoVeiculo({ placa: '', marca: '', modelo: '', ano: '', capacidade: '' });
  };

  const handleExcluirVeiculo = (id) => {
    if (confirm('Deseja remover este veículo da frota?')) {
      setVeiculos(veiculos.filter(v => v.id !== id));
    }
  };

  // CRIAR VIAGEM
  const handleCriarViagem = (e) => {
    e.preventDefault();
    if (!novaViagem.motoristaId || !novaViagem.veiculoId) {
      return alert('Selecione o motorista e o veículo responsável.');
    }

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

  const handleImprimirRelatorio = () => {
    window.print();
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-100 font-sans text-slate-800">
      
      {/* ESTILOS DE IMPRESSÃO */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #relatorio-financeiro-print, #relatorio-financeiro-print * {
            visibility: visible;
          }
          #relatorio-financeiro-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: #fff;
            padding: 20px;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* BARRA SUPERIOR MOBILE COM O BOTÃO DE MENU (TRÊS PONTOS / MENU) */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center sticky top-0 z-40 shadow-md no-print">
        <div className="flex items-center gap-2.5">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white">
            <Bus className="w-5 h-5" />
          </div>
          <span className="font-bold text-sm tracking-tight">ExpressTour</span>
        </div>

        <button 
          onClick={() => setMenuAberto(!menuAberto)}
          className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white transition"
          aria-label="Abrir Menu"
        >
          {menuAberto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* MASCARA ESCURA DE FUNDO QUANDO O MENU TIVER ABERTO NO CELULAR */}
      {menuAberto && (
        <div 
          onClick={() => setMenuAberto(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 md:hidden no-print"
        />
      )}

      {/* SIDEBAR DE NAVEGAÇÃO RESPONSIVA */}
      <aside className={`
        fixed md:static top-0 left-0 h-full z-50 w-72 md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 shadow-2xl md:shadow-xl transition-transform duration-300 ease-in-out no-print
        ${menuAberto ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* CABEÇALHO DA SIDEBAR COM BOTÃO DE FECHAR (X) NO MOBILE */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white">
              <Bus className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-white text-base leading-tight">ExpressTour</h1>
              <p className="text-xs text-slate-400">Painel de Gestão</p>
            </div>
          </div>

          {/* BOTÃO X PARA FECHAR A ABA NO CELULAR */}
          <button 
            onClick={() => setMenuAberto(false)}
            className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1.5">
          <button
            onClick={() => navegarPara('gerar-link')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
              abaAtiva === 'gerar-link' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="w-5 h-5" /> Novo Link / QR Code
          </button>

          <button
            onClick={() => navegarPara('viagens')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
              abaAtiva === 'viagens' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-5 h-5" /> Viagens & Financeiro
          </button>

          <button
            onClick={() => navegarPara('veiculos')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
              abaAtiva === 'veiculos' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Car className="w-5 h-5" /> Veículos / Frota
          </button>

          <button
            onClick={() => navegarPara('motoristas')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
              abaAtiva === 'motoristas' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-5 h-5" /> Motoristas
          </button>
        </nav>
      </aside>

      {/* CONTEÚDO PRINCIPAL DA DIREITA */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto w-full">
        
        {/* ========================================================= */}
        {/* ABA: GERAR LINK / QR CODE */}
        {/* ========================================================= */}
        {abaAtiva === 'gerar-link' && (
          <div className="max-w-4xl mx-auto space-y-6 no-print">
            <header className="border-b border-slate-200 pb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Gerar Link & QR Code de Viagem</h2>
              <p className="text-xs sm:text-sm text-slate-500">Cadastre os detalhes da viagem para disponibilizar o formulário aos passageiros.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <form onSubmit={handleCriarViagem} className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-blue-600" /> Nova Viagem
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Responsável pela Viagem *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nome do contratante"
                    value={novaViagem.nomeResponsavel}
                    onChange={(e) => setNovaViagem({ ...novaViagem, nomeResponsavel: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">CPF Responsável *</label>
                    <input
                      type="text"
                      required
                      placeholder="000.000.000-00"
                      value={novaViagem.cpfResponsavel}
                      onChange={(e) => setNovaViagem({ ...novaViagem, cpfResponsavel: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Valor Total (R$) *</label>
                    <input
                      type="number"
                      required
                      placeholder="Ex: 4500"
                      value={novaViagem.valor}
                      onChange={(e) => setNovaViagem({ ...novaViagem, valor: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Motorista *</label>
                    <select
                      required
                      value={novaViagem.motoristaId}
                      onChange={(e) => setNovaViagem({ ...novaViagem, motoristaId: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="">Selecione...</option>
                      {motoristas.map(m => (
                        <option key={m.id} value={m.id}>{m.nome}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Carro / Ônibus *</label>
                    <select
                      required
                      value={novaViagem.veiculoId}
                      onChange={(e) => setNovaViagem({ ...novaViagem, veiculoId: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="">Selecione...</option>
                      {veiculos.map(v => (
                        <option key={v.id} value={v.id}>
                          {v.marca} {v.modelo} ({v.capacidade} lugares)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Data de Ida *</label>
                    <input
                      type="date"
                      required
                      value={novaViagem.dataIda}
                      onChange={(e) => setNovaViagem({ ...novaViagem, dataIda: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Data de Volta *</label>
                    <input
                      type="date"
                      required
                      value={novaViagem.dataVolta}
                      onChange={(e) => setNovaViagem({ ...novaViagem, dataVolta: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Destino / Local *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Cabo Frio - RJ"
                    value={novaViagem.local}
                    onChange={(e) => setNovaViagem({ ...novaViagem, local: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-600/20 text-sm flex items-center justify-center gap-2"
                >
                  <QrCode className="w-5 h-5" /> Criar Viagem e Gerar QR Code
                </button>
              </form>

              {/* Resultado do QR Code */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
                {qrCodeGerado ? (
                  <div className="space-y-4 w-full max-w-xs">
                    <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> QR Code Pronto
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 inline-block shadow-inner">
                      <img src={qrCodeGerado.qrImageUrl} alt="QR Code Viagem" className="w-48 h-48 mx-auto" />
                    </div>

                    <div className="text-left bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                      <p><span className="text-slate-500">Destino:</span> <strong>{qrCodeGerado.viagem.local}</strong></p>
                      <p><span className="text-slate-500">Período:</span> <strong>{qrCodeGerado.viagem.dataIda} até {qrCodeGerado.viagem.dataVolta}</strong></p>
                      <p><span className="text-slate-500">Veículo:</span> <strong>{qrCodeGerado.viagem.veiculoModelo}</strong></p>
                      <p><span className="text-slate-500">Motorista:</span> <strong>{qrCodeGerado.viagem.motoristaNome}</strong></p>
                    </div>

                    <button
                      onClick={() => handleCopiarLink(qrCodeGerado.url)}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5"
                    >
                      {copiado ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      {copiado ? 'Copiado!' : 'Copiar Link'}
                    </button>
                  </div>
                ) : (
                  <div className="text-slate-400 space-y-2 py-8">
                    <QrCode className="w-16 h-16 mx-auto stroke-1" />
                    <p className="text-sm font-semibold text-slate-600">Nenhum QR Code gerado ainda</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ABA: VIAGENS & RELATÓRIO FINANCEIRO */}
        {/* ========================================================= */}
        {abaAtiva === 'viagens' && (
          <div className="space-y-6">
            <header className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Relatórios Financeiros & Agenda</h2>
                <p className="text-xs sm:text-sm text-slate-500">Selecione o mês para emitir e imprimir o relatório mensal completo.</p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <input
                  type="month"
                  value={mesRelatorio}
                  onChange={(e) => setMesRelatorio(e.target.value)}
                  className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm flex-1 sm:flex-none"
                />

                <button
                  onClick={handleImprimirRelatorio}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-emerald-600/20 text-xs sm:text-sm flex items-center justify-center gap-2 shrink-0"
                >
                  <Printer className="w-4 h-4" /> Imprimir Mês
                </button>
              </div>
            </header>

            <div id="relatorio-financeiro-print" className="bg-white p-4 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="border-b pb-4 flex flex-col sm:flex-row justify-between items-start gap-2">
                <div>
                  <h1 className="text-base sm:text-xl font-bold text-slate-900 uppercase tracking-wide">Relatório Financeiro Mensal de Viagens</h1>
                  <p className="text-xs text-slate-500">Empresa: ExpressTour Transportes & Fretamento</p>
                  <p className="text-xs text-slate-500">Período de Referência: <strong className="text-slate-800">{mesRelatorio}</strong></p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs font-mono text-slate-400">Emissão: {new Date().toLocaleDateString('pt-BR')}</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 uppercase font-bold">
                      <th className="p-3">Destino / Viagem</th>
                      <th className="p-3">Período</th>
                      <th className="p-3">Contratante / Responsável</th>
                      <th className="p-3">Motorista</th>
                      <th className="p-3">Veículo</th>
                      <th className="p-3 text-right">Valor (R$)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {viagensDoMes.length > 0 ? (
                      viagensDoMes.map((v) => (
                        <tr key={v.id} className="hover:bg-slate-50 transition">
                          <td className="p-3 font-bold text-slate-900">{v.local}</td>
                          <td className="p-3 text-slate-600">{v.dataIda} até {v.dataVolta}</td>
                          <td className="p-3 text-slate-800 font-medium">{v.nomeResponsavel} <br/><span className="text-[10px] text-slate-400">CPF: {v.cpfResponsavel}</span></td>
                          <td className="p-3 text-slate-800">{v.motoristaNome}</td>
                          <td className="p-3 text-slate-600">{v.veiculoModelo}</td>
                          <td className="p-3 text-right font-bold text-slate-900">R$ {v.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="p-6 text-center text-slate-400">
                          Nenhuma viagem registrada para o mês selecionado ({mesRelatorio}).
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="border-t-2 border-slate-900 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-slate-50 p-4 rounded-xl">
                <div>
                  <p className="text-xs font-bold text-slate-700">Resumo da Receita Mensal</p>
                  <p className="text-[11px] text-slate-500">Total de {viagensDoMes.length} viagem(ns) executada(s) ou agendada(s) no período.</p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Faturamento Total do Mês</span>
                  <p className="text-2xl font-black text-emerald-700">
                    R$ {valorTotalDoMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ABA: VEÍCULOS / FROTA */}
        {/* ========================================================= */}
        {abaAtiva === 'veiculos' && (
          <div className="space-y-6 no-print">
            <header className="border-b border-slate-200 pb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Gestão de Veículos</h2>
              <p className="text-xs sm:text-sm text-slate-500">Cadastre os veículos da sua frota informando placa, marca, modelo, ano e capacidade de lugares.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <form onSubmit={handleAddVeiculo} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 h-fit">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Car className="w-5 h-5 text-blue-600" /> Cadastrar Veículo
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Placa *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: ABC1D23"
                    value={novoVeiculo.placa}
                    onChange={(e) => setNovoVeiculo({ ...novoVeiculo, placa: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none uppercase font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Marca *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Marcopolo"
                      value={novoVeiculo.marca}
                      onChange={(e) => setNovoVeiculo({ ...novoVeiculo, marca: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Modelo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Paradiso G7"
                      value={novoVeiculo.modelo}
                      onChange={(e) => setNovoVeiculo({ ...novoVeiculo, modelo: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Ano *</label>
                    <input
                      type="number"
                      required
                      placeholder="Ex: 2022"
                      value={novoVeiculo.ano}
                      onChange={(e) => setNovoVeiculo({ ...novoVeiculo, ano: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Capacidade Total *</label>
                    <input
                      type="number"
                      required
                      placeholder="Ex: 18"
                      value={novoVeiculo.capacidade}
                      onChange={(e) => setNovoVeiculo({ ...novoVeiculo, capacidade: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-600/20 text-sm flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Salvar Veículo na Frota
                </button>
              </form>

              <div className="lg:col-span-2 space-y-4">
                {veiculos.map((v) => (
                  <div key={v.id} className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 sm:gap-5">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                      <Bus className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            {v.marca}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">{v.modelo}</h4>
                        </div>
                        <button
                          onClick={() => handleExcluirVeiculo(v.id)}
                          className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                        <p><span className="text-slate-400">Placa:</span> <strong className="font-mono text-slate-800">{v.placa}</strong></p>
                        <p><span className="text-slate-400">Ano:</span> <strong>{v.ano}</strong></p>
                        <p><span className="text-slate-400">Capacidade:</span> <strong className="text-emerald-700">{v.capacidade} lugares ({v.capacidade - 1} pass.)</strong></p>
                      </div>
                    </div>
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
              <form onSubmit={handleAddMotorista} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 h-fit">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Plus className="w-5 h-5 text-blue-600" /> Novo Motorista
                </h3>
                <input
                  type="text"
                  required
                  placeholder="Nome Completo"
                  value={novoMotorista.nome}
                  onChange={(e) => setNovoMotorista({ ...novoMotorista, nome: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  required
                  placeholder="CPF"
                  value={novoMotorista.cpf}
                  onChange={(e) => setNovoMotorista({ ...novoMotorista, cpf: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  required
                  placeholder="CNH"
                  value={novoMotorista.cnh}
                  onChange={(e) => setNovoMotorista({ ...novoMotorista, cnh: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  required
                  placeholder="Endereço"
                  value={novoMotorista.endereco}
                  onChange={(e) => setNovoMotorista({ ...novoMotorista, endereco: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm"
                />
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl text-sm">
                  Salvar Motorista
                </button>
              </form>

              <div className="lg:col-span-2 space-y-4">
                {motoristas.map(m => (
                  <div key={m.id} className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">{m.nome}</h4>
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
