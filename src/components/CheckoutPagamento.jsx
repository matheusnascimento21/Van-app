import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  QrCode, 
  ShieldCheck, 
  CheckCircle2, 
  Bus, 
  ArrowLeft,
  Lock,
  Sparkles
} from 'lucide-react';

export default function CheckoutPagamento() {
  const navigate = useNavigate();

  // Estado do plano selecionado ('autonomo' ou 'profissional')
  const [plano, setPlano] = useState('profissional');
  // Método de pagamento ('pix', 'credito', 'debito')
  const [metodo, setMetodo] = useState('pix');
  const [processando, setProcessando] = useState(false);

  const valorPlano = plano === 'autonomo' ? '59,00' : '139,00';

  // Simulação de Integração com API da InfinitePay
  const handleConfirmarPagamento = (e) => {
    e.preventDefault();
    setProcessando(true);

    setTimeout(() => {
      // Salva o estado da assinatura como ATIVA no localStorage do navegador
      const dadosAssinatura = {
        status: 'ativo',
        plano,
        metodoPagamento: metodo,
        dataInicio: new Date().toISOString(),
        proximaCobranca: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };

      localStorage.setItem('expresstour_assinatura', JSON.stringify(dadosAssinatura));
      setProcessando(false);
      
      // Redireciona o utilizador diretamente para o Painel Administrativo
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-xl bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* CABEÇALHO */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <button 
            onClick={() => navigate('/')} 
            className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar à página inicial
          </button>
          
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
              <Bus className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-sm">ExpressTour</span>
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white">Assinatura do Plano</h1>
          <p className="text-xs text-slate-400">Processamento seguro de pagamento garantido via <strong>InfinitePay</strong>.</p>
        </div>

        <form onSubmit={handleConfirmarPagamento} className="space-y-6">
          
          {/* SELEÇÃO DO PLANO */}
          <div className="grid grid-cols-2 gap-3">
            <div 
              onClick={() => setPlano('autonomo')}
              className={`p-4 rounded-2xl border cursor-pointer transition select-none ${
                plano === 'autonomo' 
                  ? 'bg-blue-600/10 border-blue-600 text-white' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-slate-400">Plano Autônomo</span>
              <p className="font-bold text-base text-white mt-0.5">R$ 59<span className="text-xs font-normal">/mês</span></p>
              <p className="text-[11px] text-slate-400 mt-1">Até 10 viagens/mês</p>
            </div>

            <div 
              onClick={() => setPlano('profissional')}
              className={`p-4 rounded-2xl border cursor-pointer transition select-none relative ${
                plano === 'profissional' 
                  ? 'bg-blue-600/10 border-blue-600 text-white' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-blue-400">Plano Profissional</span>
              <p className="font-bold text-base text-white mt-0.5">R$ 139<span className="text-xs font-normal">/mês</span></p>
              <p className="text-[11px] text-slate-400 mt-1">Viagens e Frota Ilimitadas</p>
            </div>
          </div>

          {/* MÉTODOS DE PAGAMENTO INFINITEPAY */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-300">Escolha a Forma de Pagamento (InfinitePay):</label>

            <div className="grid grid-cols-3 gap-2">
              {/* PIX RECORRENTE */}
              <button
                type="button"
                onClick={() => setMetodo('pix')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-2 transition ${
                  metodo === 'pix' 
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <QrCode className="w-5 h-5" />
                <span>Pix Recorrente</span>
              </button>

              {/* CARTÃO DE CRÉDITO */}
              <button
                type="button"
                onClick={() => setMetodo('credito')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-2 transition ${
                  metodo === 'credito' 
                    ? 'bg-blue-500/10 border-blue-500 text-blue-400' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span>Cartão de Crédito</span>
              </button>

              {/* DÉBITO AUTOMÁTICO */}
              <button
                type="button"
                onClick={() => setMetodo('debito')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-2 transition ${
                  metodo === 'debito' 
                    ? 'bg-purple-500/10 border-purple-500 text-purple-400' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span>Débito Automático</span>
              </button>
            </div>
          </div>

          {/* CAMPOS DO FORMULÁRIO DE ACORDO COM O MÉTODO */}
          {metodo === 'pix' && (
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-xs space-y-2 text-slate-300">
              <p className="font-bold text-white flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-emerald-400" /> Cobrança Recorrente via Pix
              </p>
              <p className="text-slate-400">Ao confirmar, o QR Code de pagamento automático mensal da InfinitePay será gerado na ecrã.</p>
            </div>
          )}

          {(metodo === 'credito' || metodo === 'debito') && (
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Número do Cartão *</label>
                <input 
                  type="text" 
                  required
                  placeholder="0000 0000 0000 0000"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Validade *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="MM/AA"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">CVV *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="123"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* BOTÃO FINAL */}
          <button
            type="submit"
            disabled={processando}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition shadow-xl shadow-blue-600/30 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {processando ? (
              <span>A conectar à InfinitePay...</span>
            ) : (
              <>
                <Lock className="w-4 h-4" /> Confirmar e Assinar (R$ {valorPlano}/mês)
              </>
            )}
          </button>

          <p className="text-[10px] text-center text-slate-500 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Cancelamento simples e sem fidelidade a qualquer momento.
          </p>
        </form>
      </div>
    </div>
  );
}