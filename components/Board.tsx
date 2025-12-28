import React from 'react';
import Square from './Square';
import { Player } from '../types';

interface BoardProps {
  squares: Player[];
  onClick: (i: number) => void;
  winningLine: number[] | null;
  isAiThinking: boolean;
  gameActive: boolean;
}

const Board: React.FC<BoardProps> = ({ squares, onClick, winningLine, isAiThinking, gameActive }) => {
  return (
    <div className="relative p-1 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-pink-500/20 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
      <div className="absolute inset-0 rounded-3xl bg-slate-950/80 backdrop-blur-xl" />
      <div className="relative grid grid-cols-3 gap-3 sm:gap-4 p-4 sm:p-5">
        {squares.map((square, i) => {
          const isWinningSquare = winningLine?.includes(i) ?? false;
          // Disable if square is filled, or if AI is thinking, or if game is over
          const isDisabled = square !== null || isAiThinking || !gameActive;
          return (
            <Square
              key={i}
              value={square}
              onClick={() => onClick(i)}
              isWinningSquare={isWinningSquare}
              disabled={isDisabled}
            />
          );
        })}
      </div>
      
      {/* Decorative corners */}
      <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-cyan-400 rounded-tl-xl opacity-60" />
      <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-pink-500 rounded-tr-xl opacity-60" />
      <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-pink-500 rounded-bl-xl opacity-60" />
      <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-cyan-400 rounded-br-xl opacity-60" />
    </div>
  );
};

export default Board;