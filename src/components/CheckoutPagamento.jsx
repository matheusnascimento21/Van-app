import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Check, ShieldCheck, ArrowLeft, QrCode, CreditCard, Copy, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CheckoutPagamento() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const MINHA_CHAVE_PIX_REAL = 'appfretech@gmail.com';

  const [plano, setPlano] = useState(() => searchParams.get('plano') || 'profissional');
  const [metodo, setMetodo] = useState('pix');

  const [processando, setProcessando] = useState(false);
  const [dadosPix, setDadosPix] = useState(null);
  const [statusPagamento, setStatusPagamento] = useState('pendente');
  const [copiado, setCopiado] = useState(false);
  const [erro, setErro] = useState('');
  const [emailCliente, setEmailCliente] = useState('');

  const precos = {
    iniciante: 49.90,
    profissional: 89.90,
    empresarial: 149.90
  };

  const valorPlano = precos[plano] || 89.90;

  const handleGerarPix = () => {
    setProcessando(true);
    setDadosPix({
      paymentId: 'pix_direto',
      encodedImage: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(MINHA_CHAVE_PIX_REAL)}`,
      payload: MINHA_CHAVE_PIX_REAL
    });
    setProcessando(false);
  };

  const handleCopiarChave = () => {
    if (dadosPix?.payload) {
      navigator.clipboard.writeText(dadosPix.payload);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  const handleConfirmarPagamentoPixManual = () => {
    setStatusPagamento('aprovado');
    localStorage.setItem('expresstour_plano_pendente', plano);
    setTimeout(() => {
      navigate('/login?modo=cadastro');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-xl bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* CABEÇALHO COM A LOGO FRETECH */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <Link to="/" className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 transition">
            <ArrowLeft className="w-4 h-4" /> Voltar aos Planos
          </Link>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Fretech Logo" className="w-7 h-7 object-contain rounded-md" />
            <span className="font-bold text-white text-sm">Fretech</span>
          </div>
        </div>

        {/* RESUMO DO PLANO */}
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Assinatura</p>
            <h2 className="text-lg font-bold text-white capitalize">Plano {plano}</h2>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-emerald-400">R$ {valorPlano.toFixed(2).replace('.', ',')}</p>
            <p className="text-[10px] text-slate-400">mensal</p>
          </div>
        </div>

        {statusPagamento === 'aprovado' ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-8 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-xl font-bold text-white">Pagamento Confirmado!</h3>
            <p className="text-xs text-slate-300">Redirecionando para a criação do seu login e senha de gestor...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 rounded-2xl border border-slate-800">
              <button
                onClick={() => setMetodo('pix')}
                className={`py-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${metodo === 'pix' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                <QrCode className="w-4 h-4" /> Pix Instantâneo
              </button>
              <button
                onClick={() => setMetodo('cartao')}
                className={`py-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${metodo === 'cartao' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                <CreditCard className="w-4 h-4" /> Cartão de Crédito
              </button>
            </div>

            {metodo === 'pix' && (
              dadosPix ? (
                <div className="space-y-4 text-center bg-slate-900 p-6 rounded-2xl border border-slate-800">
                  <h3 className="text-sm font-bold text-white flex items-center justify-center gap-2">
                    <QrCode className="w-4 h-4 text-blue-400" /> Escaneie o QR Code no app do seu banco
                  </h3>
                  
                  <div className="bg-white p-3 rounded-2xl w-48 h-48 mx-auto flex items-center justify-center shadow-lg">
                    <img src={dadosPix.encodedImage} alt="Pix QR Code" className="w-full h-full object-contain" />
                  </div>

                  <div className="space-y-2 pt-2">
                    <p className="text-xs text-slate-400">Ou copie a chave Pix abaixo:</p>
                    <div className="flex gap-2">
                      <input type="text" readOnly value={dadosPix.payload} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono outline-none" />
                      <button onClick={handleCopiarChave} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0">
                        {copiado ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        {copiado ? 'Copiado' : 'Copiar'}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleConfirmarPagamentoPixManual}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl text-xs shadow-lg transition mt-2"
                  >
                    Já fiz o Pix, criar minha conta agora
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Seu E-mail *</label>
                    <input
                      type="email"
                      required
                      placeholder="seu@email.com"
                      value={emailCliente}
                      onChange={(e) => setEmailCliente(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <button
                    onClick={handleGerarPix}
                    disabled={processando || !emailCliente}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition shadow-xl shadow-emerald-600/20 text-sm flex items-center justify-center gap-2"
                  >
                    {processando ? <Loader2 className="w-5 h-5 animate-spin" /> : <QrCode className="w-5 h-5" />}
                    {processando ? 'Gerando Chave Pix...' : 'Gerar Chave e QR Code Pix'}
                  </button>
                </div>
              )
            )}
          </>
        )}

      </div>
    </div>
  );
}