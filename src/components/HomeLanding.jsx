import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Bus, 
  QrCode, 
  FileText, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  ArrowRight,
  Sparkles,
  Check,
  Calendar,
  Car,
  Printer
} from 'lucide-react';

export default function HomeLanding() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* BARRA DE NAVEGAÇÃO SUPERIOR */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-600/30">
              <Bus className="w-5 h-5" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">ExpressTour</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-blue-600/20 flex items-center gap-1.5"
            >
              Acessar Painel <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION - APRESENTAÇÃO */}
      <section className="pt-20 pb-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5" /> Sistema Completo para Fretamento e Excursões
          </span>

          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight">
            Gestão de Viagens, Passageiros e Manifestos de Porte Obrigatório
          </h1>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Gere o manifesto formatado no padrão da fiscalização (ANTT / DER), disponibilize cadastro simplificado de passageiros via QR Code e controle todo o financeiro da sua frota em um só lugar.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3.5 rounded-xl transition shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2 text-sm"
            >
              Testar Painel Agora <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#recursos"
              className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-6 py-3.5 rounded-xl transition text-sm border border-slate-700/60"
            >
              Ver Recursos
            </a>
          </div>
        </div>
      </section>

      {/* RECURSOS EM DESTAQUE */}
      <section id="recursos" className="py-16 bg-slate-950 border-y border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 space-y-12">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-white">Tudo o que sua agência precisa</h2>
            <p className="text-slate-400 text-xs">Desenvolvido sob medida para motoristas autônomos, agências de turismo e empresas de fretamento.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 bg-blue-600/10 text-blue-400 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Manifesto PDF Oficial</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Emita o documento obrigatório de viagem pronto para apresentar aos agentes da ANTT ou DER diretamente no celular.
              </p>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 bg-emerald-600/10 text-emerald-400 rounded-xl flex items-center justify-center">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Check-in via QR Code</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Envie o link da viagem ou imprima o QR Code para que os passageiros façam o auto-cadastro e escolha de assento.
              </p>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 bg-purple-600/10 text-purple-400 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Relatório Financeiro Mensal</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Acompanhe os faturamentos por mês, gere relatórios para impressão com totalizadores e mantenha as contas organizadas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GALERIA DE TELAS REAIS DO SISTEMA */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white">Interface Real do Sistema</h2>
            <p className="text-slate-400 text-xs">Conheça os módulos integrados do painel ExpressTour.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* CARD 1: RELATÓRIO FINANCEIRO */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-3">
              <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md">
                Relatórios Financeiros & Agenda
              </span>
              <div className="bg-white rounded-xl p-4 text-slate-800 text-xs space-y-2 font-sans border border-slate-200">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-bold uppercase text-[10px] text-slate-500">Relatório Mensal</span>
                  <span className="text-emerald-700 font-black">R$ 7.700,00</span>
                </div>
                <div className="space-y-1 text-[11px]">
                  <p>• <strong>Cabo Frio - RJ:</strong> R$ 4.500,00 (Matheus Bastos)</p>
                  <p>• <strong>Ouro Preto - MG:</strong> R$ 3.200,00 (Ana Paula Souza)</p>
                </div>
              </div>
              <p className="text-xs text-slate-400">Geração de relatórios com total de faturamento do mês e atalho para impressão.</p>
            </div>

            {/* CARD 2: GERAR LINK E QR CODE */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-3">
              <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md">
                Gerar Link & QR Code
              </span>
              <div className="bg-white rounded-xl p-4 text-slate-800 text-xs space-y-2 font-sans border border-slate-200">
                <div className="flex items-center gap-2 border-b pb-2 text-blue-600 font-bold">
                  <QrCode className="w-4 h-4" /> Formulário da Viagem
                </div>
                <p className="text-[11px] text-slate-600">
                  Crie viagens atribuindo motorista, veículo, datas de ida/volta e valor contratado para gerar o link público.
                </p>
              </div>
              <p className="text-xs text-slate-400">Emissão rápida de QR Codes individuais para check-in de passageiros.</p>
            </div>

            {/* CARD 3: GESTÃO DE VEÍCULOS */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-3">
              <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md">
                Gestão de Veículos / Frota
              </span>
              <div className="bg-white rounded-xl p-4 text-slate-800 text-xs space-y-2 font-sans border border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">Marcopolo Paradiso G7 1200</span>
                  <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-mono">ABC1D23</span>
                </div>
                <p className="text-[11px] text-emerald-700 font-semibold">18 lugares (17 passageiros + 1 motorista)</p>
              </div>
              <p className="text-xs text-slate-400">Controle de frota com limite automático de assentos por ônibus/van.</p>
            </div>

            {/* CARD 4: GESTÃO DE MOTORISTAS */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-3">
              <span className="text-[10px] uppercase font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-md">
                Gestão de Motoristas
              </span>
              <div className="bg-white rounded-xl p-4 text-slate-800 text-xs space-y-1 font-sans border border-slate-200">
                <p className="font-bold text-slate-900">Carlos Eduardo Silva</p>
                <p className="text-[10px] text-slate-500">CPF: 123.456.789-00 | CNH: 09876543210</p>
              </div>
              <p className="text-xs text-slate-400">Cadastro centralizado de motoristas com registro de CNH e endereço.</p>
            </div>

          </div>
        </div>
      </section>

      {/* PLANOS & PREÇOS */}
      <section className="py-16 bg-slate-950 border-t border-slate-800/80 px-4">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white">Planos Transparentes</h2>
            <p className="text-slate-400 text-xs">Escolha o plano ideal para a sua estrutura de viagens.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* PLANO 1: AUTÔNOMO */}
            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Plano Autônomo</span>
                  <h3 className="text-2xl font-bold text-white mt-1">Motorista & Guia</h3>
                  <p className="text-slate-400 text-xs mt-1">Ideal para quem possui 1 ou 2 veículos e faz viagens próprias.</p>
                </div>

                <div className="flex items-baseline gap-1 pt-2 border-t border-slate-800">
                  <span className="text-3xl font-black text-white">R$ 59</span>
                  <span className="text-xs text-slate-400">/mês</span>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-300 pt-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Até 10 Viagens por Mês
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Cadastro de até 2 Veículos
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Emissão do Manifesto PDF Oficial
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Auto-cadastro via QR Code
                  </li>
                </ul>
              </div>

              <Link
                to="/dashboard"
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition text-center text-xs border border-slate-700/80"
              >
                Começar no Plano Autônomo
              </Link>
            </div>

            {/* PLANO 2: FROTA COMPLETA */}
            <div className="bg-gradient-to-b from-blue-900/30 to-slate-900 rounded-3xl p-6 border-2 border-blue-600 flex flex-col justify-between space-y-6 relative">
              <div className="absolute -top-3 right-6 bg-blue-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-lg">
                Recomendado
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Plano Profissional</span>
                  <h3 className="text-2xl font-bold text-white mt-1">Empresa & Frota</h3>
                  <p className="text-slate-400 text-xs mt-1">Para agências e empresas de fretamento com múltiplos motoristas.</p>
                </div>

                <div className="flex items-baseline gap-1 pt-2 border-t border-slate-800">
                  <span className="text-3xl font-black text-white">R$ 139</span>
                  <span className="text-xs text-slate-400">/mês</span>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-300 pt-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Viagens Ilimitadas
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Cadastro de Frota Ilimitada
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Cadastro e Estatísticas de Motoristas
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Impressão de Relatórios Financeiros Mensais
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Suporte Prioritário no WhatsApp
                  </li>
                </ul>
              </div>

              <Link
                to="/dashboard"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition text-center text-xs shadow-lg shadow-blue-600/30"
              >
                Assinar Plano Profissional
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* RODAPÉ */}
      <footer className="border-t border-slate-800/80 py-8 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} ExpressTour. Todos os direitos reservados.</p>
      </footer>

    </div>
  );
}