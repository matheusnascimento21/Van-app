import React, { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { 
  CheckCircle2, 
  Circle, 
  Search, 
  UserPlus, 
  Users, 
  FileText, 
  Bus, 
  MapPin, 
  Calendar 
} from 'lucide-react';
import { DocumentoManifesto } from './ManifestoPDF.jsx';

export default function EmbarqueMotorista() {
  // Informações simuladas da viagem
  const [dadosViagem] = useState({
    nomeViagem: 'Excursão Cabo Frio - Fim de Semana',
    placa: 'ABC-1234',
    motorista: 'Carlos Eduardo Silva',
    dataViagem: '18/09/2026',
    origem: 'Juiz de Fora - MG',
    destino: 'Cabo Frio - RJ',
  });

  // Lista mock de passageiros
  const [passageiros, setPassageiros] = useState([
    { id: '1', nome: 'Ana Maria Souza', cpf: '123.456.789-00', poltrona: 1, presente: true },
    { id: '2', nome: 'Bruno Oliveira', cpf: '987.654.321-11', poltrona: 2, presente: false },
    { id: '3', nome: 'Carla Dias', cpf: '456.789.012-22', poltrona: 3, presente: true },
    { id: '4', nome: 'Daniel Ferreira', cpf: '321.654.987-33', poltrona: 4, presente: false },
    { id: '5', nome: 'Eduardo Costa', cpf: '654.987.321-44', poltrona: 5, presente: false },
  ]);

  // Estados de busca e novo passageiro avulso
  const [busca, setBusca] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [novoCpf, setNovoCpf] = useState('');

  // Alternar o status de presença do passageiro
  const togglePresenca = (id) => {
    setPassageiros((prev) =>
      prev.map((p) => (p.id === id ? { ...p, presente: !p.presente } : p))
    );
  };

  // Adicionar um novo passageiro de última hora
  const adicionarPassageiro = (e) => {
    e.preventDefault();
    if (!novoNome.trim()) return;

    const novo = {
      id: String(Date.now()),
      nome: novoNome.trim(),
      cpf: novoCpf.trim() || 'Não informado',
      poltrona: passageiros.length + 1,
      presente: true,
    };

    setPassageiros((prev) => [...prev, novo]);
    setNovoNome('');
    setNovoCpf('');
    setModalAberto(false);
  };

  // Filtro de passageiros na lista
  const passageirosFiltrados = passageiros.filter(
    (p) =>
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      p.cpf.includes(busca)
  );

  const totalPresentes = passageiros.filter((p) => p.presente).length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-28">
      {/* Cabeçalho Fixo do App */}
      <header className="bg-slate-900 text-white p-4 sticky top-0 z-10 shadow-md">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold bg-blue-600 px-2 py-0.5 rounded text-blue-100 flex items-center gap-1">
              <Bus className="w-3 h-3" /> Fretamento Ativo
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {dadosViagem.dataViagem}
            </span>
          </div>

          <h1 className="text-lg font-bold leading-tight mb-1">{dadosViagem.nomeViagem}</h1>

          <div className="flex items-center justify-between text-xs text-slate-300 border-t border-slate-800 pt-2 mt-2">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-red-400" /> {dadosViagem.origem} → {dadosViagem.destino}
            </span>
            <span className="font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              {dadosViagem.placa}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-4">
        {/* Card Resumo do Embarque */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Contagem do Embarque</p>
              <p className="text-xl font-bold text-slate-900">
                {totalPresentes} <span className="text-sm font-normal text-slate-500">/ {passageiros.length} a bordo</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setModalAberto(true)}
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 p-2.5 rounded-xl text-xs font-bold flex items-center gap-1 transition"
          >
            <UserPlus className="w-4 h-4" /> Encaixe
          </button>
        </section>

        {/* Campo de Busca */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou CPF..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        {/* Lista de Passageiros */}
        <section className="space-y-2">
          {passageirosFiltrados.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              Nenhum passageiro encontrado.
            </div>
          ) : (
            passageirosFiltrados.map((p) => (
              <div
                key={p.id}
                onClick={() => togglePresenca(p.id)}
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition select-none ${
                  p.presente
                    ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  {p.presente ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-300 shrink-0" />
                  )}
                  <div>
                    <p className={`text-sm font-bold ${p.presente ? 'text-emerald-900' : 'text-slate-800'}`}>
                      {p.nome}
                    </p>
                    <p className="text-xs text-slate-500">
                      CPF: {p.cpf} • Poltrona: <span className="font-semibold">{p.poltrona}</span>
                    </p>
                  </div>
                </div>

                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                    p.presente
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {p.presente ? 'A Bordo' : 'Ausente'}
                </span>
              </div>
            ))
          )}
        </section>
      </main>

      {/* Modal para Cadastro Rápido de Encaixe */}
      {modalAberto && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Cadastrar Passageiro de Última Hora</h3>
            
            <form onSubmit={adicionarPassageiro} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: João da Silva"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">CPF ou Documento</label>
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  value={novoCpf}
                  onChange={(e) => setNovoCpf(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="flex-1 bg-slate-100 text-slate-700 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-200 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 transition"
                >
                  Confirmar Encaixe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bar Rodapé Fixo - Ação Final de Download do PDF */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 shadow-lg z-20">
        <div className="max-w-md mx-auto">
          <PDFDownloadLink
            document={
              <DocumentoManifesto 
                dadosViagem={dadosViagem} 
                passageiros={passageiros.filter((p) => p.presente)} 
              />
            }
            fileName={`Manifesto_${dadosViagem.placa}_${dadosViagem.nomeViagem.replace(/\s+/g, '_')}.pdf`}
            className="w-full"
          >
            {({ loading }) => (
              <button
                disabled={loading}
                className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20 text-sm disabled:opacity-50"
              >
                <FileText className="w-5 h-5" /> 
                {loading ? 'Gerando PDF Oficial...' : `Baixar PDF do Manifesto (${totalPresentes})`}
              </button>
            )}
          </PDFDownloadLink>
        </div>
      </div>
    </div>
  );
}