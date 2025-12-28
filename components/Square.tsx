import React from 'react';
import { Player } from '../types';

interface SquareProps {
  value: Player;
  onClick: () => void;
  isWinningSquare: boolean;
  disabled: boolean;
}

const Square: React.FC<SquareProps> = ({ value, onClick, isWinningSquare, disabled }) => {
  return (
    <button
      className={`
        relative group
        h-24 w-24 sm:h-32 sm:w-32 
        rounded-2xl text-5xl sm:text-7xl font-extrabold flex items-center justify-center
        transition-all duration-300 transform
        border border-white/5
        ${!value && !disabled ? 'hover:bg-white/5 hover:scale-105 cursor-pointer hover:border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]' : ''}
        ${isWinningSquare ? 'bg-white/10 scale-105 z-10' : 'bg-slate-900/40 backdrop-blur-sm'}
        ${disabled && !isWinningSquare ? 'cursor-default' : ''}
        active:scale-95
        overflow-hidden
      `}
      onClick={onClick}
      disabled={disabled}
      aria-label={value ? `Square occupied by ${value}` : "Empty square"}
    >
      {/* Background glow for winning cells */}
      {isWinningSquare && (
         <div className={`absolute inset-0 opacity-40 blur-xl ${value === 'X' ? 'bg-cyan-500' : 'bg-pink-500'}`}></div>
      )}

      {/* Symbol */}
      <span className={`
        relative z-10 transform transition-all duration-500
        ${value === 'X' ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]' : ''}
        ${value === 'O' ? 'text-pink-500 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]' : ''}
        ${!value ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}
      `}>
        {value}
      </span>

      {/* Hover effect hint */}
      {!value && !disabled && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      )}
    </button>
  );
};

export default Square;