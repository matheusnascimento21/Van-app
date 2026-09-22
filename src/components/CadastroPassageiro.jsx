import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Bus, User, CreditCard, ShieldCheck } from 'lucide-react';

export default function CadastroPassageiro() {
  const { viagemId } = useParams();
  
  // Recupera dados da viagem ou usa padrao (ex: 18 lugares = 17 passageiros maximo)
  const [viagem, setViagem] = useState(() => {
    const salva = localStorage.getItem(`viagem_${viagemId}`);
    return salva ? JSON.parse(salva) : {
      local: 'Viagem de Exemplo',
      dataIda: '2026-09-25',
      dataVolta: '2026-09-27',
      capacidadeTotal: 18,
      limitePassageiros: 17
    };
  });

  // Chave de passageiros cadastrados nesta viagem
  const storageKey = `passageiros_${viagemId || 'geral'}`;

  const [passageiros, setPassageiros] = useState(() => {
    const salvos = localStorage.getItem(storageKey);
    return salvos ? JSON.parse(salvos) : [];
  });

  const [form, setForm] = useState({ nome: '', cpf: '', rg: '' });
  const [sucesso, setSucesso] = useState(false);

  const limitePassageiros = viagem.limitePassageiros || (viagem.capacidadeTotal ? viagem.capacidadeTotal - 1 : 17);
  const estaLotado = passageiros.length >= limitePassageiros;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (estaLotado) {
      alert(`Esta viagem atingiu a capacidade máxima de ${limitePassageiros} passageiros (1 assento reservado ao motorista).`);
      return;
    }

    if (!form.nome || !form.cpf || !form.rg) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const novosPassageiros = [...passageiros, { ...form, id: Date.now() }];
    setPassageiros(novosPassageiros);
    localStorage.setItem(storageKey, JSON.stringify(novosPassageiros));

    setSucesso(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-800">
        
        {/* CABEÇALHO */}
        <div className="bg-blue-600 p-6 text-white text-center relative">
          <Bus className="w-10 h-10 mx-auto mb-2 opacity-90" />
          <h1 className="text-xl font-bold leading-tight">Lista de Embarque</h1>
          <p className="text-xs text-blue-100 mt-1">{viagem.local}</p>
          <div className="mt-2 inline-block bg-blue-700/60 text-blue-100 text-[11px] px-3 py-1 rounded-full font-semibold">
            {viagem.dataIda} até {viagem.dataVolta}
          </div>
        </div>

        {/* CONTADOR DE ASSENTOS */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex justify-between items-center text-xs">
          <span className="text-slate-500 font-medium">Vagas para Passageiros:</span>
          <span className={`font-bold px-2 py-0.5 rounded-full ${estaLotado ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
            {passageiros.length} / {limitePassageiros} ocupadas
          </span>
        </div>

        {/* ALERTA DE LOTAÇÃO */}
        {estaLotado && !sucesso && (
          <div className="p-4 bg-amber-50 border-b border-amber-200 text-amber-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
            <p><strong>Ônibus Lotado!</strong> Todos os {limitePassageiros} assentos de passageiros já foram preenchidos.</p>
          </div>
        )}

        {/* TELA DE SUCESSO */}
        {sucesso ? (
          <div className="p-8 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
            <h2 className="text-xl font-bold text-slate-900">Cadastro Confirmado!</h2>
            <p className="text-xs text-slate-500">Seu nome já consta na lista oficial de passageiros da viagem.</p>
            
            <button
              onClick={() => { setSucesso(false); setForm({ nome: '', cpf: '', rg: '' }); }}
              disabled={estaLotado}
              className={`w-full py-3 rounded-xl text-xs font-bold transition ${
                estaLotado ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              {estaLotado ? 'Ônibus Lotado' : 'Cadastrar Outro Passageiro'}
            </button>
          </div>
        ) : (
          /* FORMULÁRIO DE CADASTRO */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nome Completo *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  disabled={estaLotado}
                  placeholder="Digite seu nome completo"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">CPF *</label>
              <div className="relative">
                <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  disabled={estaLotado}
                  placeholder="000.000.000-00"
                  value={form.cpf}
                  onChange={(e) => setForm({ ...form, cpf: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">RG / Documento de Identidade *</label>
              <div className="relative">
                <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  disabled={estaLotado}
                  placeholder="Digite o número do seu RG"
                  value={form.rg}
                  onChange={(e) => setForm({ ...form, rg: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={estaLotado}
              className={`w-full py-3.5 rounded-xl text-sm font-bold shadow-lg transition ${
                estaLotado
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
              }`}
            >
              {estaLotado ? 'Capacidade Máxima Atingida' : 'Confirmar Presença na Viagem'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}