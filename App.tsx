import React, { useState, useEffect, useCallback } from 'react';
import Board from './components/Board';
import ScoreBoard from './components/ScoreBoard';
import GameMenu from './components/GameMenu';
import { Player, GameMode, GameStatus, PlayerProfile } from './types';
import { getGeminiMove } from './services/geminiService';
import { RefreshIcon, HomeIcon, TrophyIcon } from './components/Icons';

// Calculate winner helper
function calculateWinner(squares: Player[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return null;
}

const App: React.FC = () => {
  // Game Flow State
  const [status, setStatus] = useState<GameStatus>(GameStatus.MENU);
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.PvAI);
  
  // Player Data State
  const [playerX, setPlayerX] = useState<PlayerProfile>({ name: 'You', score: 0 });
  const [playerO, setPlayerO] = useState<PlayerProfile>({ name: 'Gemini', score: 0 });

  // Board State
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  
  // AI State
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [aiThought, setAiThought] = useState<string>("");

  // Derived State
  const winInfo = calculateWinner(board);
  const winner = winInfo?.winner;
  const winningLine = winInfo?.line || null;
  const isDraw = !winner && board.every(Boolean);

  // Initialize Game
  const startGame = (mode: GameMode, names?: { x: string; o: string }) => {
    setGameMode(mode);
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setAiThought("");
    
    if (mode === GameMode.PvAI) {
      setPlayerX({ name: 'You', score: 0 });
      setPlayerO({ name: 'Gemini AI', score: 0 });
    } else {
      setPlayerX({ name: names?.x || 'Player 1', score: 0 });
      setPlayerO({ name: names?.o || 'Player 2', score: 0 });
    }
    
    setStatus(GameStatus.PLAYING);
  };

  const handleReset = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setAiThought("");
    // Don't reset scores
  };

  const returnToMenu = () => {
    setStatus(GameStatus.MENU);
    setBoard(Array(9).fill(null));
  };

  // Handle move click
  const handleClick = useCallback((i: number) => {
    if (winner || isDraw || board[i] || (gameMode === GameMode.PvAI && !xIsNext && !winner)) {
      return;
    }

    const newBoard = [...board];
    newBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
    setAiThought(""); // Clear thought
  }, [board, xIsNext, winner, isDraw, gameMode]);

  // Update scores when game ends
  useEffect(() => {
    if (winner) {
      if (winner === 'X') {
        setPlayerX(prev => ({ ...prev, score: prev.score + 1 }));
      } else {
        setPlayerO(prev => ({ ...prev, score: prev.score + 1 }));
      }
    }
  }, [winner]); // Only run when winner changes

  // AI Logic
  useEffect(() => {
    if (status === GameStatus.PLAYING && gameMode === GameMode.PvAI && !xIsNext && !winner && !isDraw) {
      const makeAiMove = async () => {
        setIsAiThinking(true);
        try {
          const { move, thought } = await getGeminiMove(board);
          if (thought) setAiThought(thought);
          
          if (move !== -1 && move >= 0 && move < 9) {
             // Safe update
             setBoard(prevBoard => {
               if(prevBoard[move]) return prevBoard;
               const newBoard = [...prevBoard];
               newBoard[move] = 'O';
               setXIsNext(true);
               return newBoard;
             });
          }
        } catch (e) {
          console.error("AI Move Failed", e);
        } finally {
          setIsAiThinking(false);
        }
      };
      makeAiMove();
    }
  }, [xIsNext, gameMode, winner, isDraw, board, status]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#050b14] text-white relative font-body selection:bg-cyan-500/30">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
        
        {/* Header */}
        <header className="mb-8 text-center animate-float">
          <h1 className="text-5xl sm:text-6xl font-black italic tracking-tighter mb-2">
            <span className="neon-text-cyan block sm:inline">TIC</span>
            <span className="text-white/20 mx-2">-</span>
            <span className="neon-text-pink block sm:inline">TAC</span>
            <span className="text-white/20 mx-2">-</span>
            <span className="neon-text-cyan block sm:inline">TOE</span>
          </h1>
          <p className="text-slate-400 font-medium tracking-widest text-xs uppercase mt-4">
            Powered by Gemini AI
          </p>
        </header>

        {status === GameStatus.MENU ? (
          <GameMenu onStartGame={startGame} />
        ) : (
          <div className="w-full animate-in zoom-in-95 duration-500">
            
            <ScoreBoard 
              playerX={playerX} 
              playerO={playerO} 
              currentPlayer={xIsNext ? 'X' : 'O'} 
            />

            <div className="relative mb-6">
              <Board
                squares={board}
                onClick={handleClick}
                winningLine={winningLine}
                isAiThinking={isAiThinking}
                gameActive={!winner && !isDraw}
              />
              
              {/* AI Thought Toast */}
              {!isAiThinking && aiThought && gameMode === GameMode.PvAI && !winner && !isDraw && (
                 <div className="absolute -bottom-16 left-0 right-0 flex justify-center animate-in slide-in-from-top-2 fade-in">
                    <div className="bg-slate-900/80 border border-purple-500/30 backdrop-blur-md text-purple-200 text-sm py-2 px-6 rounded-full shadow-xl">
                      <span className="font-bold text-purple-400 mr-2">Gemini:</span> "{aiThought}"
                    </div>
                 </div>
              )}
              
               {/* Thinking Indicator */}
               {isAiThinking && (
                 <div className="absolute -bottom-12 left-0 right-0 flex justify-center gap-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}/>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}/>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}/>
                 </div>
               )}
            </div>

            {/* Game Controls & Status */}
            <div className="flex flex-col items-center gap-4">
               {winner || isDraw ? (
                  <div className="text-center animate-in zoom-in slide-in-from-bottom-4">
                    <h2 className="text-3xl font-black mb-4">
                      {winner ? (
                        <span className={winner === 'X' ? 'neon-text-cyan' : 'neon-text-pink'}>
                          {winner === 'X' ? playerX.name : playerO.name} WINS!
                        </span>
                      ) : (
                        <span className="text-yellow-400">DRAW GAME!</span>
                      )}
                    </h2>
                    <div className="flex gap-4">
                      <button 
                        onClick={handleReset}
                        className="px-8 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-2"
                      >
                        <RefreshIcon className="w-5 h-5" /> Play Again
                      </button>
                      <button 
                         onClick={returnToMenu}
                         className="px-4 py-3 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700 transition-colors"
                      >
                         <HomeIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
               ) : (
                 <div className="flex gap-4 mt-4">
                    <button 
                      onClick={handleReset}
                      className="p-3 rounded-full bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all border border-white/5"
                      title="Reset Board"
                    >
                      <RefreshIcon className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={returnToMenu}
                      className="p-3 rounded-full bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all border border-white/5"
                      title="Main Menu"
                    >
                      <HomeIcon className="w-5 h-5" />
                    </button>
                 </div>
               )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default App;