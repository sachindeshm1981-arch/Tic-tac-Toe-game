import { GoogleGenAI, Type } from "@google/genai";
import { Player } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getGeminiMove = async (board: Player[]): Promise<{ move: number; thought?: string }> => {
  try {
    const boardState = board.map((cell, index) => (cell ? cell : index)).join(", ");
    
    // We want the AI to play as 'O' usually, or whatever the current turn player is.
    // Ideally, this function is called when it's the AI's turn.
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Efficient model for logic tasks
      contents: `You are playing a game of Tic-Tac-Toe. You are 'O'. 
      The board positions are indexed 0-8. 
      The current board state is: [${boardState}] where numbers represent empty spots.
      
      Your goal is to win. If you cannot win immediately, block the opponent from winning. 
      If neither, play optimally to force a draw or win later.
      
      Return a JSON object with your chosen move index (integer 0-8) and a very short, witty thought (max 5 words) about your move.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            move: {
              type: Type.INTEGER,
              description: "The index (0-8) of the move to make.",
            },
            thought: {
                type: Type.STRING,
                description: "A short witty comment about the move."
            }
          },
          required: ["move"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    const result = JSON.parse(text);
    return { move: result.move, thought: result.thought };

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback to random available move if API fails to keep game playable
    const availableMoves = board
      .map((val, idx) => (val === null ? idx : null))
      .filter((val) => val !== null) as number[];
    
    if (availableMoves.length === 0) return { move: -1 };
    
    const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    return { move: randomMove, thought: "Thinking... (Offline)" };
  }
};