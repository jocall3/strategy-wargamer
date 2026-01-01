
import React, { useState, useRef, useEffect } from 'react';
import { AIService } from '../services/ai';
import { GameState } from '../types';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

const NexusOracle: React.FC<{ gameState: GameState }> = ({ gameState }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: "CEO, the market data is flowing. I am NexusOracle. How can I guide your next multi-million dollar gamble?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    const response = await AIService.getStrategicAdvice(gameState, userMsg);
    setMessages(prev => [...prev, { role: 'ai', content: response }]);
    setLoading(false);
  };

  return (
    <div class="flex flex-col h-[calc(100vh-160px)] animate-in fade-in zoom-in-95 duration-500">
      <div class="bg-white border border-slate-200 rounded-t-2xl p-4 flex items-center justify-between shadow-sm">
        <div class="flex items-center">
            <div class="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold mr-3">Ω</div>
            <div>
                <h2 class="font-bold text-slate-800 leading-tight">NexusOracle AI</h2>
                <p class="text-[10px] text-indigo-600 font-bold uppercase tracking-widest">Strategic Intelligence Layer</p>
            </div>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto bg-white p-6 space-y-4 border-x border-slate-200">
        {messages.map((m, i) => (
          <div key={i} class={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div class={`max-w-[80%] px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div class="flex justify-start">
             <div class="bg-slate-100 px-5 py-3 rounded-2xl animate-pulse text-slate-400 text-xs font-bold uppercase tracking-widest">
                Oracle is thinking...
             </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div class="p-4 bg-slate-50 border border-slate-200 rounded-b-2xl shadow-inner">
        <div class="flex space-x-2">
          <input 
            type="text" 
            placeholder="Ask for strategic advice, competitor analysis, or market forecasts..." 
            class="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
          />
          <button 
            onClick={sendMessage}
            class="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md active:scale-90"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NexusOracle;
