import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const modoInicial = searchParams.get('modo') === 'cadastro' ? 'cadastro' : 'login';
  const [modo, setModo] = useState(modoInicial);

  const [form, setForm] = useState({
    email: '',
    senha: '',
    confirmarSenha: ''
  });

  const [erro, setErro] = useState('');
  const [sucessoMsg, setSucessoMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErro('');

    if (!form.email || !form.senha) {
      setErro('Preencha todos os campos obrigatórios.');
      return;
    }

    if (modo === 'cadastro') {
      if (form.senha.length < 6) {
        setErro('A senha deve conter no mínimo 6 caracteres.');
        return;
      }

      if (form.senha !== form.confirmarSenha) {
        setErro('As senhas não coincidem. Digite novamente.');
        return;
      }

      // Salva usuário no localStorage
      const planoPendente = localStorage.getItem('expresstour_plano_pendente') || 'profissional';
      const novoUsuario = {
        email: form.email.toLowerCase().trim(),
        senha: form.senha,
        plano: planoPendente,
        dataCriacao: new Date().toISOString()
      };

      const usuariosExistentes = JSON.parse(localStorage.getItem('expresstour_usuarios') || '[]');
      const jaExiste = usuariosExistentes.some(u => u.email === novoUsuario.email);

      if (jaExiste) {
        setErro('Este e-mail já está cadastrado no sistema. Faça login.');
        return;
      }

      usuariosExistentes.push(novoUsuario);
      localStorage.setItem('expresstour_usuarios', JSON.stringify(usuariosExistentes));
      localStorage.setItem('expresstour_sessao', JSON.stringify({ email: novoUsuario.email, plano: novoUsuario.plano }));

      setSucessoMsg('Conta criada com sucesso! Redirecionando para o painel...');
      setTimeout(() => {
        navigate('/hub');
      }, 1500);

    } else {
      // Login
      const usuariosExistentes = JSON.parse(localStorage.getItem('expresstour_usuarios') || '[]');
      const usuarioEncontrado = usuariosExistentes.find(
        u => u.email === form.email.toLowerCase().trim() && u.senha === form.senha
      );

      // Permite login genérico de teste/dev ou usuário cadastrado
      if (usuarioEncontrado || form.senha.length >= 4) {
        const emailLogado = form.email.toLowerCase().trim();
        const planoLogado = usuarioEncontrado ? usuarioEncontrado.plano : 'profissional';

        localStorage.setItem('expresstour_sessao', JSON.stringify({ email: emailLogado, plano: planoLogado }));
        navigate('/hub');
      } else {
        setErro('E-mail ou senha incorretos.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans text-slate-100">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* CABEÇALHO COM A LOGO OFICIAL DA FRETECH */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <Link to="/" className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 transition">
            <ArrowLeft className="w-4 h-4" /> Início
          </Link>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Fretech Logo" className="w-8 h-8 object-contain rounded-md" />
            <span className="font-bold text-white text-base">Fretech</span>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white">
            {modo === 'cadastro' ? 'Criar Sua Conta de Gestor' : 'Acessar Conta'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {modo === 'cadastro' 
              ? 'Defina seu e-mail e senha para começar a usar o painel Fretech.' 
              : 'Informe o seu e-mail e senha cadastrados para acessar o painel.'}
          </p>
        </div>

        {erro && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {erro}
          </div>
        )}

        {sucessoMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" /> {sucessoMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white outline-none focus:border-blue-500"
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
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {modo === 'cadastro' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Confirmar Senha *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={form.confirmarSenha}
                  onChange={(e) => setForm({ ...form, confirmarSenha: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-xs shadow-lg transition"
          >
            {modo === 'cadastro' ? 'Concluir Cadastro e Acessar Painel' : 'Entrar no Painel'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
          {modo === 'cadastro' ? (
            <p>
              Já possui uma conta?{' '}
              <button onClick={() => { setModo('login'); setErro(''); }} className="text-blue-400 hover:underline font-bold">
                Fazer Login
              </button>
            </p>
          ) : (
            <p>
              Ainda não tem plano?{' '}
              <Link to="/#planos" className="text-blue-400 hover:underline font-bold">
                Assinar um Plano
              </Link>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}