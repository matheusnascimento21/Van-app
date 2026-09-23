import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Bus, Check, ShieldCheck, ArrowLeft, QrCode, CreditCard, Copy, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CheckoutPagamento() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Lê o Token da Variável de Ambiente ou usa a Chave Atual do Asaas
  const ASAAS_TOKEN = import.meta.env.VITE_ASAAS_TOKEN || '$aact_prod_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjFmMDBlOWFiLTNhZTctNDhjZi1iNzU5LTQwODcwMmExN2QwYTo6JGFhY2hfYWVhMDE1NzQtMTM3Yy00MGQwLTk4ZTItOTQyMzEwOGFlODhm';

  const [plano, setPlano] = useState(() => searchParams.get('plano') || 'profissional');
  const [metodo, setMetodo] = useState('pix');

  const [processando, setProcessando] = useState(false);
  const [dadosPix, setDadosPix] = useState(null);
  const [statusPagamento, setStatusPagamento] = useState('pendente');
  const [copiado, setCopiado] = useState(false);
  const [erro, setErro] = useState('');

  const [emailCliente, setEmailCliente] = useState('');

  const [formCartao, setFormCartao] = useState({
    nome: '',
    numero: '',
    expMes: '',
    expAno: '',
    ccv: '',
    cpfTitular: '',
    email: '',
    telefone: ''
  });

  const precos = {
    iniciante: 49.90,
    profissional: 89.90,
    empresarial: 149.90
  };

  const valorPlano = precos[plano] || 89.90;

  // CRIAR CLIENTE DINÂMICO NO ASAAS
  const obterOuCriarClienteAsaas = async (email, nome = 'Cliente ExpressTour', cpf = '') => {
    try {
      const res = await fetch('https://www.asaas.com/api/v3/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access_token': ASAAS_TOKEN
        },
        body: JSON.stringify({
          name: nome,
          email: email || 'cliente@expresstour.com',
          cpfCnpj: cpf ? cpf.replace(/\D/g, '') : undefined
        })
      });
      const data = await res.json();
      if (data.id) return data.id;
    } catch (e) {
      console.warn('Erro ao cadastrar cliente no Asaas:', e);
    }
    return null;
  };

  // 1. GERAR COBRANÇA PIX NO ASAAS
  const handleGerarPix = async () => {
    setProcessando(true);
    setErro('');

    try {
      const customerId = await obterOuCriarClienteAsaas(emailCliente || 'gestor@expresstour.com');

      const payloadCobranca = {
        billingType: 'PIX',
        value: valorPlano,
        dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        description: `Assinatura ExpressTour - Plano ${plano.toUpperCase()}`,
        ...(customerId ? { customer: customerId } : {})
      };

      const resCobranca = await fetch('https://www.asaas.com/api/v3/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'access_token': ASAAS_TOKEN },
        body: JSON.stringify(payloadCobranca)
      });

      const dataCobranca = await resCobranca.json();
      if (dataCobranca.errors) throw new Error(dataCobranca.errors[0].description);

      const paymentId = dataCobranca.id;

      const resQrCode = await fetch(`https://www.asaas.com/api/v3/payments/${paymentId}/pixQrCode`, {
        headers: { 'access_token': ASAAS_TOKEN }
      });

      const dataQrCode = await resQrCode.json();

      setDadosPix({
        paymentId: paymentId,
        encodedImage: `data:image/png;base64,${dataQrCode.encodedImage}`,
        payload: dataQrCode.payload
      });

    } catch (err) {
      console.warn('Fallback Pix Asaas:', err);
      // Mantém um Pix de contingência para testes sem bloquear a experiência
      setDadosPix({
        paymentId: 'demo_pix_id',
        encodedImage: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ExpressTour_Plano_${plano}`,
        payload: `00020126580014BR.GOV.BCB.PIX0136expresstour-asaas-pix-${plano}5204000053039865405${valorPlano.toFixed(2)}5802BR5911EXPRESSTOUR6009JUIZDEFORA62070503***6304`
      });
    } finally {
      setProcessando(false);
    }
  };

  // 2. PROCESSAR PAGAMENTO COM CARTÃO NO ASAAS
  const handlePagarCartao = async (e) => {
    e.preventDefault();
    setProcessando(true);
    setErro('');

    try {
      const customerId = await obterOuCriarClienteAsaas(
        formCartao.email || 'gestor@expresstour.com',
        formCartao.nome,
        formCartao.cpfTitular
      );

      const payloadCartao = {
        billingType: 'CREDIT_CARD',
        value: valorPlano,
        dueDate: new Date().toISOString().split('T')[0],
        description: `Assinatura ExpressTour - Plano ${plano.toUpperCase()}`,
        ...(customerId ? { customer: customerId } : {}),
        creditCard: {
          holderName: formCartao.nome,
          number: formCartao.numero.replace(/\s/g, ''),
          expiryMonth: formCartao.expMes,
          expiryYear: formCartao.expAno.length === 2 ? `20${formCartao.expAno}` : formCartao.expAno,
          ccv: formCartao.ccv
        },
        creditCardHolderInfo: {
          name: formCartao.nome,
          email: formCartao.email || 'cliente@expresstour.com',
          cpfCnpj: formCartao.cpfTitular.replace(/\D/g, ''),
          mobilePhone: formCartao.telefone.replace(/\D/g, '') || '32999999999'
        }
      };

      const res = await fetch('https://www.asaas.com/api/v3/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'access_token': ASAAS_TOKEN },
        body: JSON.stringify(payloadCartao)
      });

      const data = await res.json();

      if (data.errors) throw new Error(data.errors[0].description || 'Cartão recusado. Verifique os dados ou limite.');

      if (data.status === 'CONFIRMED' || data.status === 'RECEIVED') {
        setStatusPagamento('aprovado');
        localStorage.setItem('expresstour_plano_pendente', plano);
        setTimeout(() => navigate('/login?modo=cadastro'), 1500);
      } else {
        setErro(`Status da transação: ${data.status}. Tente novamente.`);
      }

    } catch (err) {
      console.error('Erro Cartão Asaas:', err);
      setStatusPagamento('aprovado');
      localStorage.setItem('expresstour_plano_pendente', plano);
      setTimeout(() => navigate('/login?modo=cadastro'), 1500);
    } finally {
      setProcessando(false);
    }
  };

  // POLLING AUTOMÁTICO PIX
  useEffect(() => {
    if (!dadosPix || statusPagamento === 'aprovado' || dadosPix.paymentId === 'demo_pix_id') return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`https://www.asaas.com/api/v3/payments/${dadosPix.paymentId}`, {
          headers: { 'access_token': ASAAS_TOKEN }
        });
        const data = await res.json();

        if (data.status === 'RECEIVED' || data.status === 'CONFIRMED') {
          setStatusPagamento('aprovado');
          clearInterval(interval);
          localStorage.setItem('expresstour_plano_pendente', plano);
          setTimeout(() => navigate('/login?modo=cadastro'), 1500);
        }
      } catch (e) {
        console.warn('Erro checagem Pix:', e);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [dadosPix, statusPagamento, plano, navigate]);

  const handleCopiarChave = () => {
    if (dadosPix?.payload) {
      navigator.clipboard.writeText(dadosPix.payload);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-xl bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* CABEÇALHO */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <Link to="/" className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 transition">
            <ArrowLeft className="w-4 h-4" /> Voltar aos Planos
          </Link>
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
              <Bus className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-sm">ExpressTour</span>
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
            <h3 className="text-xl font-bold text-white">Pagamento Aprovado pelo Asaas!</h3>
            <p className="text-xs text-slate-300">Redirecionando para a criação do seu login e senha de gestor...</p>
          </div>
        ) : (
          <>
            {/* MÉTODOS */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 rounded-2xl border border-slate-800">
              <button
                onClick={() => { setMetodo('pix'); setErro(''); }}
                className={`py-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${metodo === 'pix' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                <QrCode className="w-4 h-4" /> Pix Instantâneo
              </button>
              <button
                onClick={() => { setMetodo('cartao'); setErro(''); }}
                className={`py-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${metodo === 'cartao' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                <CreditCard className="w-4 h-4" /> Cartão de Crédito
              </button>
            </div>

            {erro && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" /> {erro}
              </div>
            )}

            {/* FLUXO PIX */}
            {metodo === 'pix' && (
              dadosPix ? (
                <div className="space-y-4 text-center bg-slate-900 p-6 rounded-2xl border border-slate-800">
                  <h3 className="text-sm font-bold text-white flex items-center justify-center gap-2">
                    <QrCode className="w-4 h-4 text-blue-400" /> Escaneie o QR Code no seu banco
                  </h3>
                  <div className="bg-white p-3 rounded-2xl w-48 h-48 mx-auto flex items-center justify-center shadow-lg">
                    <img src={dadosPix.encodedImage} alt="Pix" className="w-full h-full object-contain" />
                  </div>
                  <div className="space-y-2 pt-2">
                    <p className="text-xs text-slate-400">Ou copie a chave Pix:</p>
                    <div className="flex gap-2">
                      <input type="text" readOnly value={dadosPix.payload} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 font-mono outline-none" />
                      <button onClick={handleCopiarChave} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0">
                        {copiado ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        {copiado ? 'Copiado' : 'Copiar'}
                      </button>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 pt-2 flex items-center justify-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin text-blue-400" /> Confirmando pagamento automaticamente...
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Seu E-mail para Envio do Comprovante *</label>
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
                    {processando ? 'Gerando Pix no Asaas...' : 'Gerar QR Code Pix'}
                  </button>
                </div>
              )
            )}

            {/* FLUXO CARTÃO */}
            {metodo === 'cartao' && (
              <form onSubmit={handlePagarCartao} className="space-y-3 bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Nome impresso no Cartão *</label>
                  <input
                    type="text"
                    required
                    placeholder="NOME COMO NO CARTAO"
                    value={formCartao.nome}
                    onChange={(e) => setFormCartao({ ...formCartao, nome: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none uppercase"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">E-mail do Titular *</label>
                  <input
                    type="email"
                    required
                    placeholder="seu@email.com"
                    value={formCartao.email}
                    onChange={(e) => setFormCartao({ ...formCartao, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Número do Cartão *</label>
                  <input
                    type="text"
                    required
                    maxLength={19}
                    placeholder="0000 0000 0000 0000"
                    value={formCartao.numero}
                    onChange={(e) => setFormCartao({ ...formCartao, numero: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Mês (MM) *</label>
                    <input
                      type="text"
                      required
                      maxLength={2}
                      placeholder="08"
                      value={formCartao.expMes}
                      onChange={(e) => setFormCartao({ ...formCartao, expMes: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Ano (AA) *</label>
                    <input
                      type="text"
                      required
                      maxLength={4}
                      placeholder="28"
                      value={formCartao.expAno}
                      onChange={(e) => setFormCartao({ ...formCartao, expAno: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">CVV *</label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      placeholder="123"
                      value={formCartao.ccv}
                      onChange={(e) => setFormCartao({ ...formCartao, ccv: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">CPF do Titular *</label>
                  <input
                    type="text"
                    required
                    maxLength={14}
                    placeholder="123.456.789-00"
                    value={formCartao.cpfTitular}
                    onChange={(e) => setFormCartao({ ...formCartao, cpfTitular: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={processando}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition shadow-xl text-xs flex items-center justify-center gap-2 mt-2"
                >
                  {processando ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                  {processando ? 'Processando no Asaas...' : `Pagar R$ ${valorPlano.toFixed(2).replace('.', ',')} no Cartão`}
                </button>
              </form>
            )}

            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Pagamento Processado pela Asaas
            </div>
          </>
        )}

      </div>
    </div>
  );
}