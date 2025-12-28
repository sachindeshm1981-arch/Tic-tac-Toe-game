export type Player = 'X' | 'O' | null;

export enum GameMode {
  PvP = 'PvP',
  PvAI = 'PvAI',
}

export enum GameStatus {
  MENU = 'MENU',
  SETUP = 'SETUP',
  PLAYING = 'PLAYING',
}

export interface PlayerProfile {
  name: string;
  score: number;
}

export interface GameState {
  history: Player[][];
  stepNumber: number;
  xIsNext: boolean;
  winner: Player | 'Draw' | null;
  winningLine: number[] | null;
}

export interface AiMoveResponse {
  move: number;
  taunt?: string;
}