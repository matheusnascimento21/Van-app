// src/utils/storage.js

export function obterSessaoAtiva() {
  const sessaoSalva = localStorage.getItem('fretech_sessao') || localStorage.getItem('expresstour_sessao');
  if (!sessaoSalva) return null;
  try {
    return JSON.parse(sessaoSalva);
  } catch (e) {
    return null;
  }
}

// Retorna uma chave única para o usuário/sessão atual (ex: "viagens_visitante@fretech.com")
export function obterChaveIsolada(prefixo) {
  const sessao = obterSessaoAtiva();
  const identificador = sessao?.email || sessao?.id || 'padrao';
  return `${prefixo}_${identificador}`;
}