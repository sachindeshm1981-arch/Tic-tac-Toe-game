import React, { useState } from 'react';
import { GameMode } from '../types';
import { CpuIcon, UsersIcon } from './Icons';

interface GameMenuProps {
  onStartGame: (mode: GameMode, names?: { x: string; o: string }) => void;
}

const GameMenu: React.FC<GameMenuProps> = ({ onStartGame }) => {
  const [menuState, setMenuState] = useState<'MAIN' | 'PVP_SETUP'>('MAIN');
  const [p1Name, setP1Name] = useState('Player 1');
  const [p2Name, setP2Name] = useState('Player 2');

  if (menuState === 'PVP_SETUP') {
    return (
      <div className="w-full max-w-md glass-panel p-8 rounded-2xl animate-in fade-in zoom-in duration-300">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Enter Player Names</h2>
        
        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-cyan-400 text-sm font-bold mb-2 uppercase tracking-wide">Player X</label>
            <input 
              type="text" 
              value={p1Name} 
              onChange={(e) => setP1Name(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
              placeholder="Enter name..."
              maxLength={12}
            />
          </div>
          <div>
            <label className="block text-pink-500 text-sm font-bold mb-2 uppercase tracking-wide">Player O</label>
            <input 
              type="text" 
              value={p2Name} 
              onChange={(e) => setP2Name(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors"
              placeholder="Enter name..."
              maxLength={12}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => setMenuState('MAIN')}
            className="flex-1 py-3 rounded-xl border border-white/10 text-slate-400 hover:bg-white/5 hover:text-white transition-all font-semibold"
          >
            Back
          </button>
          <button 
            onClick={() => onStartGame(GameMode.PvP, { x: p1Name || 'Player 1', o: p2Name || 'Player 2' })}
            className="flex-[2] py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold shadow-lg shadow-cyan-900/30 transition-all transform hover:-translate-y-1"
          >
            Start Match
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <button 
        onClick={() => onStartGame(GameMode.PvAI)}
        className="group w-full relative overflow-hidden rounded-2xl glass-panel p-6 text-left transition-all hover:border-purple-500/50 hover:bg-white/5"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <CpuIcon className="w-24 h-24 text-purple-500" />
        </div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400">
            <CpuIcon className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">Vs Gemini AI</h3>
            <p className="text-sm text-slate-400">Challenge the smart AI engine</p>
          </div>
        </div>
      </button>

      <button 
        onClick={() => setMenuState('PVP_SETUP')}
        className="group w-full relative overflow-hidden rounded-2xl glass-panel p-6 text-left transition-all hover:border-cyan-500/50 hover:bg-white/5"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <UsersIcon className="w-24 h-24 text-cyan-500" />
        </div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 bg-cyan-500/20 rounded-lg text-cyan-400">
            <UsersIcon className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">Local Multiplayer</h3>
            <p className="text-sm text-slate-400">Play against a friend nearby</p>
          </div>
        </div>
      </button>
    </div>
  );
};

export default GameMenu;