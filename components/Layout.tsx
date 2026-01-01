
import React from 'react';
import { GameState } from '../types';
import { formatCurrency } from '../utils/helpers';

interface LayoutProps {
  gameState: GameState;
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ gameState, children, activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'strategy', label: 'Strategy' },
    { id: 'dashboard', label: 'Performance' },
    { id: 'ai', label: 'NexusOracle' },
    { id: 'logs', label: 'Audit Logs' }
  ];

  const company = gameState.playerCompany;

  return (
    <div class="min-h-screen flex flex-col">
      {/* Top Global Nav */}
      <header class="bg-slate-900 text-white px-6 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
        <div class="flex items-center space-x-4">
          <div class="bg-blue-600 p-2 rounded-lg font-bold text-xl tracking-tight">ESW</div>
          <div>
            <h1 class="text-lg font-bold">Emergent Strategy Wargamer</h1>
            <p class="text-xs text-slate-400">Strategic Sandbox v3.1</p>
          </div>
        </div>
        
        <div class="flex items-center space-x-8 text-sm">
          <div class="text-right">
            <span class="block text-slate-400 uppercase text-[10px] font-bold">Current Period</span>
            <span class="font-mono text-blue-400 tracking-wider">YEAR {gameState.currentYear}</span>
          </div>
          <div class="text-right">
            <span class="block text-slate-400 uppercase text-[10px] font-bold">Liquidity</span>
            <span class="font-bold">{formatCurrency(company.cash)}</span>
          </div>
          <div class="text-right">
            <span class="block text-slate-400 uppercase text-[10px] font-bold">Mkt Sentiment</span>
            <span class="flex items-center">
                <div class="w-12 h-2 bg-slate-700 rounded-full mr-2 overflow-hidden">
                    <div class="h-full bg-emerald-500" style={{ width: `${gameState.globalMarketSentiment}%` }}></div>
                </div>
                {gameState.globalMarketSentiment}%
            </span>
          </div>
        </div>
      </header>

      <div class="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Nav */}
        <nav class="bg-slate-100 w-full md:w-64 p-4 border-r border-slate-200">
          <div class="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                class={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div class="mt-8 pt-8 border-t border-slate-300">
            <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <h3 class="text-[10px] font-bold uppercase text-slate-500 mb-2">Market Position</h3>
                <div class="flex justify-between items-end">
                    <span class="text-2xl font-bold">{company.marketShare.toFixed(1)}%</span>
                    <span class="text-[10px] text-emerald-600 font-bold">+2.4%</span>
                </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main class="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-10">
          <div class="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
