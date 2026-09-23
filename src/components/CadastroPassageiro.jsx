import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Bus, User, CreditCard, ShieldCheck, Calendar, Baby, Loader2 } from 'lucide-react';

// Função para Validação Matemática de CPF (Módulo 11)
function validarCPFMatematico(cpf) {
  const c = cpf.replace(/\D/g, '');
  if (c.length !== 11 || /^(\d)\1{10}$/.test(c)) return false;
  
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(c.charAt(i)) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(c.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(c.charAt(i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(c.charAt(10))) return false;

  return true;
}

export default function CadastroPassageiro() {
  const { viagemId } = useParams();
  
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
    rg: '',
    isCriancaColo: false
  });

  const [validandoApi, setValidandoApi] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState('');

  const passageirosAssento = passageiros.filter(p => !p.isCriancaColo);
  const criancasColo = passageiros.filter(p => p.isCriancaColo);

  const limitePassageiros = viagem.limitePassageiros || (viagem.capacidadeTotal ? viagem.capacidadeTotal - 1 : 17);
  const estaLotadoSemColo = passageirosAssento.length >= limitePassageiros;
  const limiteColoAtingido = criancasColo.length >= 4;

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

  const handleCpfChange = (e) => {
    const apenasNumeros = e.target.value.replace(/\D/g, '').slice(0, 11);
    setForm({ ...form, cpf: apenasNumeros });
  };

  const handleRgChange = (e) => {
    let valor = e.target.value.toUpperCase();
    const letras = valor.slice(0, 2).replace(/[^A-Z]/g, '');
    const numeros = valor.slice(2).replace(/\D/g, '').slice(0, 8);
    setForm({ ...form, rg: letras + numeros });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    // Validações básicas
    if (!form.isCriancaColo && estaLotadoSemColo) {
      setErro(`Os assentos desta viagem estão lotados (${limitePassageiros} passageiros).`);
      return;
    }

    if (form.isCriancaColo && limiteColoAtingido) {
      setErro('O limite máximo de 4 crianças de colo para este veículo foi atingido.');
      return;
    }

    if (form.isCriancaColo && (form.idade > 5 || form.idade === '')) {
      setErro('A opção de criança de colo é válida apenas para crianças de até 5 anos.');
      return;
    }

    if (!form.dataNascimento) {
      setErro('Informe a data de nascimento.');
      return;
    }

    // 1. Validação Matemática do CPF
    if (form.cpf.length !== 11 || !validarCPFMatematico(form.cpf)) {
      setErro('O número de CPF informado é inválido. Verifique se digitou os 11 números corretamente.');
      return;
    }

    const rgNumeros = form.rg.slice(2);
    if (form.rg.length < 3 || rgNumeros.length === 0) {
      setErro('O RG deve começar com 2 letras (UF) e conter os números.');
      return;
    }

    // 2. Validação via API do Hub do Desenvolvedor (Receita Federal)
    setValidandoApi(true);
    try {
      // Converte data de YYYY-MM-DD para DD/MM/YYYY
      const [ano, mes, dia] = form.dataNascimento.split('-');
      const dataFormatadaPT = `${dia}/${mes}/${ano}`;
      const token = '218247910uYaOfKScNs394039984';

      const urlApi = `https://ws.hubdodesenvolvedor.com.br/v2/cpf/?cpf=${form.cpf}&data=${dataFormatadaPT}&token=${token}`;

      const res = await fetch(urlApi);
      const data = await res.json();

      // Verifica resposta da API
      if (data && data.status === false) {
        setErro(data.erro || 'CPF não encontrado ou data de nascimento divergente na Receita Federal.');
        setValidandoApi(false);
        return;
      }

      if (data && data.result) {
        // Se a Receita retornar um nome, podemos até sincronizar/validar com o que o passageiro digitou
        if (data.result.status && data.result.status.toLowerCase().includes('cancelada')) {
          setErro('Este CPF está suspenso ou cancelado junto à Receita Federal.');
          setValidandoApi(false);
          return;
        }
      }
    } catch (err) {
      // Caso haja bloqueio de CORS ou falha de conexão na API externa, libera permitindo pela validação matemática
      console.warn('Falha na API externa de consulta de CPF, prosseguindo com a validação nativa:', err);
    } finally {
      setValidandoApi(false);
    }

    const assentoDesignado = form.isCriancaColo ? 'Colo' : passageirosAssento.length + 1;

    const novoPassageiro = {
      id: Date.now(),
      nome: form.nome,
      dataNascimento: form.dataNascimento,
      idade: form.idade,
      cpf: form.cpf,
      rg: form.rg,
      isCriancaColo: form.isCriancaColo,
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
        
        <div className="bg-blue-600 p-6 text-white text-center">
          <Bus className="w-10 h-10 mx-auto mb-2 opacity-90" />
          <h1 className="text-xl font-bold leading-tight">Lista de Embarque Oficial</h1>
          <p className="text-xs text-blue-100 mt-1">{viagem.local}</p>
        </div>

        {/* STATUS DAS VAGAS */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex justify-between items-center text-xs">
          <div>
            <span className="text-slate-500 font-medium">Assentos: </span>
            <span className="font-bold text-slate-800">{passageirosAssento.length}/{limitePassageiros}</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Crianças de Colo: </span>
            <span className="font-bold text-blue-600">{criancasColo.length}/4</span>
          </div>
        </div>

        {sucesso ? (
          <div className="p-8 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
            <h2 className="text-xl font-bold text-slate-900">Cadastro Confirmado!</h2>
            <p className="text-xs text-slate-500">Seu CPF foi validado e seu nome já consta na lista oficial da viagem.</p>
            
            <button
              onClick={() => { setSucesso(false); setForm({ nome: '', dataNascimento: '', idade: '', cpf: '', rg: '', isCriancaColo: false }); }}
              className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl text-xs"
            >
              Cadastrar Outro Passageiro
            </button>
          </div>
        ) : (
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
                  placeholder="Nome do passageiro"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Data de Nascimento *</label>
                <input
                  type="date"
                  required
                  value={form.dataNascimento}
                  onChange={handleDataNascimentoChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Idade</label>
                <input
                  type="text"
                  readOnly
                  placeholder="0 anos"
                  value={form.idade !== '' ? `${form.idade} anos` : ''}
                  className="w-full bg-slate-100 border rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 outline-none"
                />
              </div>
            </div>

            {/* CHECKBOX CRIANÇA DE COLO */}
            <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Baby className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-xs font-bold text-blue-900">Criança de colo</p>
                  <p className="text-[10px] text-blue-600">Até 5 anos (Não ocupa vaga de assento)</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={form.isCriancaColo}
                onChange={(e) => setForm({ ...form, isCriancaColo: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded outline-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">CPF (Validado na Receita Federal) *</label>
              <div className="relative">
                <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  maxLength={11}
                  placeholder="12345678901"
                  value={form.cpf}
                  onChange={handleCpfChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm font-mono outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">RG (2 letras e números) *</label>
              <div className="relative">
                <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="MG12345678"
                  value={form.rg}
                  onChange={handleRgChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm font-mono uppercase outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={validandoApi}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl text-sm font-bold shadow-lg flex items-center justify-center gap-2 transition"
            >
              {validandoApi ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Consultando Receita Federal...
                </>
              ) : (
                'Confirmar Presença na Viagem'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}