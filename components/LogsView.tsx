
import React from 'react';
import { GameState } from '../types';

const LogsView: React.FC<{ gameState: GameState }> = ({ gameState }) => {
  return (
    <div class="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
      <div class="flex justify-between items-center">
        <h2 class="text-3xl font-bold tracking-tight">Immutable Audit Log</h2>
        <span class="text-xs font-mono bg-slate-200 px-3 py-1 rounded-full uppercase tracking-widest text-slate-600 font-bold">
            Chained Ledger: Active
        </span>
      </div>

      <div class="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
        <div class="bg-slate-800 px-6 py-3 border-b border-slate-700 flex justify-between">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transaction Records</span>
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Entry ID / Signature</span>
        </div>
        
        <div class="max-h-[600px] overflow-y-auto font-mono text-xs">
          {gameState.auditLog.length === 0 ? (
            <div class="p-12 text-center text-slate-500 italic">No entries in current session ledger.</div>
          ) : (
            gameState.auditLog.slice().reverse().map((log, i) => (
              <div key={log.id} class="px-6 py-4 border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                <div class="flex justify-between items-start mb-2">
                  <div class="flex items-center space-x-3">
                    <span class="text-emerald-500 font-bold">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                    <span class="text-blue-400">{log.agentName}</span>
                    <span class="text-slate-300 font-bold px-2 py-0.5 bg-slate-800 rounded">{log.action}</span>
                  </div>
                  <span class="text-[9px] text-slate-600 truncate max-w-[150px]">{log.signature}</span>
                </div>
                <div class="pl-6 border-l-2 border-slate-800 text-slate-400 overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(log.details, null, 2)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LogsView;
