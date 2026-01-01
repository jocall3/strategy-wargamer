
import React, { useState, useMemo } from 'react';
import { PlayerStrategicDirective, StrategyFocus, ProductType, GameState } from '../types';

interface StrategyViewProps {
  gameState: GameState;
  onAdvance: (directive: PlayerStrategicDirective) => void;
  isSimulating: boolean;
}

const StrategyView: React.FC<StrategyViewProps> = ({ gameState, onAdvance, isSimulating }) => {
  const [focus, setFocus] = useState<StrategyFocus>(StrategyFocus.INNOVATION);
  // Fix: Explicitly type the allocation state to ensure Object.values returns number[] instead of unknown[]
  const [alloc, setAlloc] = useState<Record<string, number>>({
    rd: 25, marketing: 25, sales: 20, operations: 15, hr: 10, service: 5
  });

  const totalAlloc = useMemo(() => Object.values(alloc).reduce((a, b) => a + b, 0), [alloc]);

  const handleAllocChange = (key: string, val: number) => {
    setAlloc(prev => ({ ...prev, [key]: val }));
  };

  const handleAdvance = () => {
    if (totalAlloc !== 100) {
      alert("Allocation must total 100%");
      return;
    }
    
    const directive: PlayerStrategicDirective = {
      overallFocus: focus,
      resourceAllocation: {
        rd: alloc.rd,
        marketing: alloc.marketing,
        sales: alloc.sales,
        operations: alloc.operations,
        hr: alloc.hr,
        customerService: alloc.service,
        capitalInvestment: 0
      },
      newProductDevelopment: [],
      marketingCampaigns: [],
      pricingAdjustments: [],
      hrInitiatives: 'none',
      riskMitigation: [],
      targetAcquisitions: [],
      divestProductLines: [],
      tokenRailOptimization: {
        preferredRailType: 'internal',
        maxLatencyTolerance: 0.1,
        maxFeePercentage: 0.001
      }
    };
    onAdvance(directive);
  };

  return (
    <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-3xl font-bold tracking-tight">Year {gameState.currentYear + 1} Planning</h2>
          <p class="text-slate-500">Formulate strategic directives for the upcoming fiscal period.</p>
        </div>
        <button 
          onClick={handleAdvance}
          disabled={isSimulating}
          class="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all transform hover:-translate-y-1 active:scale-95"
        >
          {isSimulating ? 'Processing...' : 'Deploy Directives'}
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Focus Selector */}
        <section class="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h3 class="text-lg font-bold mb-6 flex items-center">
            <span class="w-2 h-6 bg-blue-600 rounded mr-3"></span>
            Strategic Priority
          </h3>
          <div class="grid grid-cols-2 gap-3">
            {Object.values(StrategyFocus).map(f => (
              <button
                key={f}
                onClick={() => setFocus(f)}
                class={`text-left p-4 rounded-xl border-2 transition-all ${
                  focus === f 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-slate-100 hover:border-slate-300'
                }`}
              >
                <span class="block text-xs font-bold uppercase text-slate-400 mb-1">{f.replace('_', ' ')}</span>
                <span class="text-sm font-semibold capitalize">{f.replace(/_/g, ' ')}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Allocation Sliders */}
        <section class="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-bold flex items-center">
                <span class="w-2 h-6 bg-emerald-600 rounded mr-3"></span>
                Resource Allocation
            </h3>
            <span class={`font-mono text-sm px-3 py-1 rounded-full ${totalAlloc === 100 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {totalAlloc}% / 100%
            </span>
          </div>
          
          <div class="space-y-6">
            {Object.entries(alloc).map(([key, val]) => (
              <div key={key}>
                <div class="flex justify-between text-xs font-bold uppercase text-slate-500 mb-2">
                  <span>{key}</span>
                  <span>{val}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={val}
                  onChange={(e) => handleAllocChange(key, parseInt(e.target.value))}
                  class="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default StrategyView;
