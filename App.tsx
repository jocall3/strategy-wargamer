
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import StrategyView from './components/StrategyView';
import Dashboard from './components/Dashboard';
import NexusOracle from './components/NexusOracle';
import LogsView from './components/LogsView';
import { SimulationEngine, getInitialGameState } from './services/simulation';
import { GameState, PlayerStrategicDirective } from './types';

const App: React.FC = () => {
  const [engine, setEngine] = useState<SimulationEngine | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [activeTab, setActiveTab] = useState('strategy');
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    const initial = getInitialGameState();
    const simEngine = new SimulationEngine(initial);
    setEngine(simEngine);
    setGameState(simEngine.getGameState());
  }, []);

  const handleAdvance = useCallback(async (directive: PlayerStrategicDirective) => {
    if (!engine) return;
    setIsSimulating(true);
    
    // Slight artificial delay to feel like "simulation processing"
    await new Promise(r => setTimeout(r, 1200));
    
    try {
      engine.setPlayerDirective(directive);
      await engine.advanceYear();
      setGameState({ ...engine.getGameState() });
      setActiveTab('dashboard');
    } catch (err) {
      console.error(err);
      alert("Simulation Error: " + (err as Error).message);
    } finally {
      setIsSimulating(false);
    }
  }, [engine]);

  if (!gameState || !engine) {
    return (
      <div class="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div class="text-center">
            <div class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p class="font-bold tracking-widest uppercase text-xs">Booting Wargamer Core...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout gameState={gameState} activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'strategy' && (
        <StrategyView 
          gameState={gameState} 
          onAdvance={handleAdvance} 
          isSimulating={isSimulating}
        />
      )}
      {activeTab === 'dashboard' && <Dashboard gameState={gameState} />}
      {activeTab === 'ai' && <NexusOracle gameState={gameState} />}
      {activeTab === 'logs' && <LogsView gameState={gameState} />}
    </Layout>
  );
};

export default App;
