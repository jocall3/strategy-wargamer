
import React from 'react';
import { GameState } from '../types';
import { formatCurrency } from '../utils/helpers';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const Dashboard: React.FC<{ gameState: GameState }> = ({ gameState }) => {
  const company = gameState.playerCompany;
  const reports = gameState.historicalReports;

  const chartData = reports.map(r => ({
    year: r.year,
    revenue: r.companyState.revenue,
    profit: r.companyState.profit,
    marketShare: r.kpis.marketShareGrowth
  }));

  return (
    <div class="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
      <h2 class="text-3xl font-bold tracking-tight">Performance Analytics</h2>

      {/* Hero Stats */}
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: formatCurrency(company.revenue), trend: '+12.5%', color: 'blue' },
          { label: 'Net Profit', value: formatCurrency(company.profit), trend: '+4.2%', color: 'emerald' },
          { label: 'Market Share', value: `${company.marketShare.toFixed(1)}%`, trend: '+0.8%', color: 'indigo' },
          { label: 'Cust. Sat', value: `${company.customerSatisfaction}%`, trend: '+5%', color: 'amber' }
        ].map(stat => (
          <div key={stat.label} class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <span class="block text-xs font-bold uppercase text-slate-400 mb-2">{stat.label}</span>
            <div class="flex items-baseline justify-between">
              <span class="text-2xl font-bold text-slate-800 tracking-tight">{stat.value}</span>
              <span class={`text-xs font-bold text-${stat.color}-600`}>{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Growth Chart */}
        <div class="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h3 class="text-lg font-bold mb-6 flex items-center">
             <span class="w-2 h-6 bg-blue-600 rounded mr-3"></span>
             Revenue trajectory
          </h3>
          <div class="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.length ? chartData : [{year: 2024, revenue: 2000000}]}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Competitor Overview */}
        <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
           <h3 class="text-lg font-bold mb-6 flex items-center">
             <span class="w-2 h-6 bg-rose-600 rounded mr-3"></span>
             Market Intelligence
          </h3>
          <div class="space-y-4">
            {gameState.competitors.map(c => (
              <div key={c.id} class="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div class="flex justify-between items-center mb-2">
                  <span class="font-bold text-sm">{c.name}</span>
                  <span class="text-xs font-mono bg-white px-2 py-1 rounded border border-slate-200">
                    {c.marketShare.toFixed(1)}%
                  </span>
                </div>
                <div class="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div class="h-full bg-rose-500" style={{ width: `${c.marketShare}%` }}></div>
                </div>
                <p class="mt-2 text-[10px] text-slate-500 uppercase font-bold tracking-tight">Strategy: {c.strategy.replace(/_/g, ' ')}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
