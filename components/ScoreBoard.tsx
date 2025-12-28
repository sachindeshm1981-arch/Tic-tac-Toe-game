import React from 'react';
import { PlayerProfile, Player } from '../types';

interface ScoreBoardProps {
  playerX: PlayerProfile;
  playerO: PlayerProfile;
  currentPlayer: Player;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ playerX, playerO, currentPlayer }) => {
  return (
    <div className="flex w-full justify-between gap-4 mb-8">
      {/* Player X Card */}
      <div className={`
        flex-1 relative overflow-hidden rounded-xl p-3 sm:p-4 transition-all duration-300 border
        ${currentPlayer === 'X' 
          ? 'bg-cyan-950/40 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.2)]' 
          : 'bg-slate-900/40 border-white/5'}
      `}>
        <div className="flex flex-col items-center relative z-10">
          <span className={`text-xs uppercase tracking-wider font-bold mb-1 ${currentPlayer === 'X' ? 'text-cyan-300' : 'text-slate-500'}`}>
            Player X
          </span>
          <span className="text-lg sm:text-xl font-bold truncate max-w-full text-white">
            {playerX.name}
          </span>
          <div className="mt-2 text-3xl font-black text-cyan-400 font-mono">
            {playerX.score}
          </div>
        </div>
        {currentPlayer === 'X' && (
          <div className="absolute inset-0 bg-cyan-500/5 animate-pulse" />
        )}
      </div>

      {/* VS Badge */}
      <div className="flex items-center justify-center">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-slate-500 font-bold text-xs sm:text-sm shadow-inner">
          VS
        </div>
      </div>

      {/* Player O Card */}
      <div className={`
        flex-1 relative overflow-hidden rounded-xl p-3 sm:p-4 transition-all duration-300 border
        ${currentPlayer === 'O' 
          ? 'bg-pink-950/40 border-pink-500/50 shadow-[0_0_20px_rgba(236,72,153,0.2)]' 
          : 'bg-slate-900/40 border-white/5'}
      `}>
        <div className="flex flex-col items-center relative z-10">
          <span className={`text-xs uppercase tracking-wider font-bold mb-1 ${currentPlayer === 'O' ? 'text-pink-300' : 'text-slate-500'}`}>
            Player O
          </span>
          <span className="text-lg sm:text-xl font-bold truncate max-w-full text-white">
            {playerO.name}
          </span>
          <div className="mt-2 text-3xl font-black text-pink-500 font-mono">
            {playerO.score}
          </div>
        </div>
        {currentPlayer === 'O' && (
          <div className="absolute inset-0 bg-pink-500/5 animate-pulse" />
        )}
      </div>
    </div>
  );
};

export default ScoreBoard;