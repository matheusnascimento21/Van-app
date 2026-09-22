import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Bus, User, CreditCard, ShieldCheck, Calendar } from 'lucide-react';

export default function CadastroPassageiro() {
  const { viagemId } = useParams();
  
  // Recupera dados da viagem
  const [viagem] = useState(() => {
    const salva = localStorage.getItem(`viagem_${viagemId}`);
    return salva ? JSON.parse(salva) : {
      local: 'Excursão Cabo Frio - RJ',
      dataIda: '2026-09-25',
      dataVolta: '2026-09-27',
      capacidadeTotal: 18,
      limitePassageiros: 17
    };
  });

  const storageKey = `passageiros_${viagemId || 'geral'}`;

  const [passageiros, setPassageiros] = useState(() => {
    const salvos = localStorage.getItem(storageKey);
    return salvos ? JSON.parse(salvos) : [];
  });

  const [form, setForm] = useState({
    nome: '',
    dataNascimento: '',
    idade: '',
    cpf: '',
    rg: ''
  });

  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState('');

  const limitePassageiros = viagem.limitePassageiros || (viagem.capacidadeTotal ? viagem.capacidadeTotal - 1 : 17);
  const estaLotado = passageiros.length >= limitePassageiros;

  // Cálculo automático da idade ao mudar a data de nascimento
  const handleDataNascimentoChange = (e) => {
    const dataNasc = e.target.value;
    let idadeCalculada = '';

    if (dataNasc) {
      const hoje = new Date();
      const nasc = new Date(dataNasc);
      let idade = hoje.getFullYear() - nasc.getFullYear();
      const m = hoje.getMonth() - nasc.getMonth();
      if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) {
        idade--;
      }
      idadeCalculada = idade >= 0 ? idade : 0;
    }

    setForm({ ...form, dataNascimento: dataNasc, idade: idadeCalculada });
  };

  // Tratamento e validação do CPF (Apenas Números - Máx 11)
  const handleCpfChange = (e) => {
    const apenasNumeros = e.target.value.replace(/\D/g, '').slice(0, 11);
    setForm({ ...form, cpf: apenasNumeros });
  };

  // Tratamento e validação do RG (2 Letras + Máx 8 Números, ex: MG12345678)
  const handleRgChange = (e) => {
    let valor = e.target.value.toUpperCase();
    const letras = valor.slice(0, 2).replace(/[^A-Z]/g, '');
    const numeros = valor.slice(2).replace(/\D/g, '').slice(0, 8);
    setForm({ ...form, rg: letras + numeros });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErro('');

    if (estaLotado) {
      setErro(`Esta viagem atingiu a capacidade máxima de ${limitePassageiros} passageiros.`);
      return;
    }

    // Validações Rígidas
    if (form.cpf.length !== 11) {
      setErro('O CPF deve ter exatamente 11 números.');
      return;
    }

    const rgNumeros = form.rg.slice(2);
    if (form.rg.length < 3 || rgNumeros.length === 0) {
      setErro('O RG deve começar com 2 letras (UF) e conter os números.');
      return;
    }

    if (!form.dataNascimento) {
      setErro('Informe a data de nascimento.');
      return;
    }

    const assentoDesignado = passageiros.length + 1;

    const novoPassageiro = {
      id: Date.now(),
      nome: form.nome,
      dataNascimento: form.dataNascimento,
      idade: form.idade,
      cpf: form.cpf,
      rg: form.rg,
      poltrona: assentoDesignado
    };

    const novosPassageiros = [...passageiros, novoPassageiro];
    setPassageiros(novosPassageiros);
    localStorage.setItem(storageKey, JSON.stringify(novosPassageiros));

    setSucesso(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-800">
        
        {/* CABEÇALHO */}
        <div className="bg-blue-600 p-6 text-white text-center">
          <Bus className="w-10 h-10 mx-auto mb-2 opacity-90" />
          <h1 className="text-xl font-bold leading-tight">Lista de Embarque Oficial</h1>
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

        {/* TELA DE SUCESSO */}
        {sucesso ? (
          <div className="p-8 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
            <h2 className="text-xl font-bold text-slate-900">Cadastro Confirmado!</h2>
            <p className="text-xs text-slate-500">Seu nome já consta na lista oficial de passageiros da viagem.</p>
            
            <button
              onClick={() => { setSucesso(false); setForm({ nome: '', dataNascimento: '', idade: '', cpf: '', rg: '' }); }}
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
            
            {erro && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {erro}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nome Completo *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  disabled={estaLotado}
                  placeholder="Nome idêntico ao documento"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Data de Nascimento *</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="date"
                    required
                    disabled={estaLotado}
                    value={form.dataNascimento}
                    onChange={handleDataNascimentoChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-2 py-2.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Idade Automática</label>
                <input
                  type="text"
                  readOnly
                  placeholder="0 anos"
                  value={form.idade !== '' ? `${form.idade} anos` : ''}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">CPF (Apenas números - Exatamente 11) *</label>
              <div className="relative">
                <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  disabled={estaLotado}
                  maxLength={11}
                  placeholder="12345678901"
                  value={form.cpf}
                  onChange={handleCpfChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">RG (2 letras e até 8 números, ex: MG12345678) *</label>
              <div className="relative">
                <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  disabled={estaLotado}
                  placeholder="MG12345678"
                  value={form.rg}
                  onChange={handleRgChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm font-mono uppercase focus:ring-2 focus:ring-blue-500 outline-none"
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