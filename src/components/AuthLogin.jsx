import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Mail, User, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AuthLogin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [modo, setModo] = useState(() => searchParams.get('modo') || 'login');

  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });

  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  // Lógica do Login com Credencial Padrão Liberada no Código
  const handleLogin = (e) => {
    e.preventDefault();
    setErro('');

    const emailDigitado = form.email.toLowerCase().trim();
    const senhaDigitada = form.senha;

    // LOGIN PADRÃO LIBERADO DIRETAMENTE NO CÓDIGO
    if (emailDigitado === 'matheusnascimento.mat@gmail.com' && senhaDigitada === '12345678') {
      localStorage.setItem('expresstour_assinatura', JSON.stringify({
        status: 'ativo',
        plano: 'profissional',
        emailUsuario: emailDigitado
      }));

      localStorage.setItem('expresstour_sessao', JSON.stringify({
        email: emailDigitado,
        nome: 'Matheus Nascimento',
        plano: 'profissional'
      }));

      navigate('/dashboard');
      return;
    }

    // Busca no localStorage para contas criadas normalmente via pagamento
    const usuarioSalvo = localStorage.getItem(`user_${emailDigitado}`);
    
    if (!usuarioSalvo) {
      setErro('E-mail ou senha incorretos. Verifique os dados ou assine um plano.');
      return;
    }

    const dados = JSON.parse(usuarioSalvo);

    if (dados.senha !== senhaDigitada) {
      setErro('E-mail ou senha incorretos.');
      return;
    }

    // Salva a sessão ativa do usuário
    localStorage.setItem('expresstour_sessao', JSON.stringify({
      email: dados.email,
      nome: dados.nome,
      plano: dados.plano || 'profissional'
    }));

    navigate('/dashboard');
  };

  // Lógica do Cadastro pós-pagamento
  const handleCadastro = (e) => {
    e.preventDefault();
    setErro('');

    if (form.senha.length < 6) {
      setErro('A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    if (form.senha !== form.confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    const planoPendente = localStorage.getItem('expresstour_plano_pendente') || 'profissional';

    const novoUsuario = {
      nome: form.nome,
      email: form.email.toLowerCase().trim(),
      senha: form.senha,
      plano: planoPendente,
      status: 'ativo',
      criadoEm: new Date().toISOString()
    };

    localStorage.setItem(`user_${novoUsuario.email}`, JSON.stringify(novoUsuario));
    localStorage.setItem('expresstour_assinatura', JSON.stringify({
      status: 'ativo',
      plano: planoPendente,
      emailUsuario: novoUsuario.email
    }));
    localStorage.setItem('expresstour_sessao', JSON.stringify({
      email: novoUsuario.email,
      nome: novoUsuario.nome,
      plano: planoPendente
    }));

    setSucesso('Conta criada e assinatura vinculada com sucesso! Redirecionando...');

    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* CABEÇALHO */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <Link to="/" className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 transition">
            <ArrowLeft className="w-4 h-4" /> Início
          </Link>
          
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Fretech" className="w-7 h-7 rounded-lg object-contain" />
            <span className="font-bold text-white text-sm">Fretech</span>
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white">
            {modo === 'login' ? 'Acessar Conta' : 'Criar Conta do Gestor'}
          </h1>
          <p className="text-xs text-slate-400">
            {modo === 'login' 
              ? 'Informe o seu e-mail e senha cadastrados para aceder ao painel.' 
              : 'Defina o e-mail e a senha que utilizará para gerir as suas viagens.'}
          </p>
        </div>

        {erro && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {erro}
          </div>
        )}

        {sucesso && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" /> {sucesso}
          </div>
        )}

        {/* FORMULÁRIO DE LOGIN */}
        {modo === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">E-mail *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="seu@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Senha *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={form.senha}
                  onChange={(e) => setForm({ ...form, senha: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition shadow-xl shadow-blue-600/30 text-xs"
            >
              Entrar no Painel
            </button>

            <div className="text-center pt-2">
              <p className="text-xs text-slate-500">
                Ainda não tem plano?{' '}
                <Link to="/pagamento" className="text-blue-400 font-bold hover:underline">
                  Assinar um Plano
                </Link>
              </p>
            </div>
          </form>
        ) : (
          /* FORMULÁRIO DE CADASTRO */
          <form onSubmit={handleCadastro} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nome Completo do Gestor *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Seu nome"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">E-mail Corporativo *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="seu@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}