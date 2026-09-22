import React, { useState } from 'react';
import { IMaskInput } from 'react-imask';
import { UserCheck, CheckCircle2, AlertCircle, Bus } from 'lucide-react';
import { validarCPF } from '../utils/validations';

export default function FormularioPassageiro({ nomeViagem = "Viagem Exemplo", dataViagem = "20/10/2026" }) {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    rg: '',
    orgaoEmissor: '',
    telefone: ''
  });

  const [erros, setErros] = useState({});
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (erros[name]) {
      setErros((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleMaskChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (erros[name]) {
      setErros((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validarFormulario = () => {
    const novosErros = {};

    const nomeTrim = formData.nome.trim();
    if (!nomeTrim) {
      novosErros.nome = "Informe seu nome completo.";
    } else if (nomeTrim.split(' ').length < 2) {
      novosErros.nome = "Digite seu nome e sobrenome.";
    }

    if (!formData.cpf) {
      novosErros.cpf = "O CPF é obrigatório.";
    } else if (!validarCPF(formData.cpf)) {
      novosErros.cpf = "CPF inválido. Verifique os números digitados.";
    }

    if (!formData.rg || formData.rg.trim().length < 4) {
      novosErros.rg = "Informe o número do seu RG.";
    }

    if (!formData.orgaoEmissor.trim()) {
      novosErros.orgaoEmissor = "Ex: SSP/MG";
    }

    const telLimpo = formData.telefone.replace(/\D/g, '');
    if (!telLimpo || telLimpo.length < 10) {
      novosErros.telefone = "Informe um WhatsApp/Telefone válido.";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validarFormulario()) {
      console.log("Dados salvos:", formData);
      setEnviado(true);
    }
  };

  if (enviado) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-sm w-full border border-slate-100">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Check-in Concluído!</h2>
          <p className="text-slate-600 text-sm mb-6">
            Seus dados foram incluídos com sucesso no manifesto da viagem <strong>{nomeViagem}</strong>.
          </p>
          <button
            onClick={() => setEnviado(false)}
            className="w-full py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition text-sm"
          >
            Editar Meus Dados
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 max-w-md w-full border border-slate-200/60">
        
        {/* Cabeçalho da Viagem */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <div className="p-3 bg-blue-600 text-white rounded-xl">
            <Bus className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-base leading-tight">{nomeViagem}</h1>
            <p className="text-xs text-blue-600 font-medium mt-0.5">Data: {dataViagem}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-2 text-slate-800">
          <UserCheck className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold">Identificação do Passageiro</h2>
        </div>
        <p className="text-xs text-slate-500 mb-6">
          Preencha seus dados conforme o documento oficial que apresentará no embarque.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Nome */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Nome Completo *
            </label>
            <input
              type="text"
              name="nome"
              placeholder="Ex: Carlos Eduardo da Silva"
              value={formData.nome}
              onChange={handleChange}
              className={`w-full p-3.5 border rounded-xl outline-none text-sm transition ${
                erros.nome ? 'border-red-500 bg-red-50/30' : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
              }`}
            />
            {erros.nome && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {erros.nome}
              </p>
            )}
          </div>

          {/* CPF */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              CPF *
            </label>
            <IMaskInput
              mask="000.000.000-00"
              value={formData.cpf}
              onAccept={(value) => handleMaskChange('cpf', value)}
              placeholder="000.000.000-00"
              className={`w-full p-3.5 border rounded-xl outline-none text-sm transition ${
                erros.cpf ? 'border-red-500 bg-red-50/30' : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
              }`}
            />
            {erros.cpf && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {erros.cpf}
              </p>
            )}
          </div>

          {/* RG + Emissor */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                RG *
              </label>
              <input
                type="text"
                name="rg"
                placeholder="Ex: MG-12.345.678"
                value={formData.rg}
                onChange={handleChange}
                className={`w-full p-3.5 border rounded-xl outline-none text-sm transition ${
                  erros.rg ? 'border-red-500 bg-red-50/30' : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                }`}
              />
              {erros.rg && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {erros.rg}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Emissor *
              </label>
              <input
                type="text"
                name="orgaoEmissor"
                placeholder="SSP/MG"
                value={formData.orgaoEmissor}
                onChange={handleChange}
                className={`w-full p-3.5 border rounded-xl outline-none text-sm transition ${
                  erros.orgaoEmissor ? 'border-red-500 bg-red-50/30' : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                }`}
              />
              {erros.orgaoEmissor && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {erros.orgaoEmissor}
                </p>
              )}
            </div>
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              WhatsApp / Celular *
            </label>
            <IMaskInput
              mask="(00) 00000-0000"
              value={formData.telefone}
              onAccept={(value) => handleMaskChange('telefone', value)}
              placeholder="(00) 90000-0000"
              className={`w-full p-3.5 border rounded-xl outline-none text-sm transition ${
                erros.telefone ? 'border-red-500 bg-red-50/30' : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
              }`}
            />
            {erros.telefone && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {erros.telefone}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-4 rounded-xl hover:bg-blue-700 active:scale-[0.99] transition shadow-lg shadow-blue-600/20 text-sm mt-4"
          >
            Confirmar Presença no Manifesto
          </button>
        </form>
      </div>
    </div>
  );
}