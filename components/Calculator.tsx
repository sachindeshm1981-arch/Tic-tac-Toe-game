import React, { useState } from 'react';

interface CalculatorProps {
  onClose: () => void;
}

const Calculator: React.FC<CalculatorProps> = ({ onClose }) => {
  const [display, setDisplay] = useState<string>('0');
  const [prev, setPrev] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [awaitingNext, setAwaitingNext] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const inputDigit = (digit: string) => {
    if (error) return; // require clear
    if (awaitingNext) {
      setDisplay(digit);
      setAwaitingNext(false);
    } else {
      setDisplay((d) => (d === '0' ? digit : d + digit));
    }
  };

  const inputDot = () => {
    if (error) return;
    if (awaitingNext) {
      setDisplay('0.');
      setAwaitingNext(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay((d) => d + '.');
    }
  };

  const clearAll = () => {
    setDisplay('0');
    setPrev(null);
    setOperator(null);
    setAwaitingNext(false);
    setError(false);
  };

  const performOperation = (nextOperator: string) => {
    if (error) return;
    const inputValue = parseFloat(display);

    if (prev == null) {
      setPrev(String(inputValue));
    } else if (operator) {
      const prevValue = parseFloat(prev);
      let result: number | string = 0;
      switch (operator) {
        case '+':
          result = prevValue + inputValue;
          break;
        case '-':
          result = prevValue - inputValue;
          break;
        case '*':
          result = prevValue * inputValue;
          break;
        case '/':
          if (inputValue === 0) {
            setDisplay('Error');
            setPrev(null);
            setOperator(null);
            setError(true);
            return;
          }
          result = prevValue / inputValue;
          break;
        default:
          result = inputValue;
      }

      // Normalize result to avoid long floats
      const normalized = typeof result === 'number' ? String(Number(result.toFixed(10)).toString()) : String(result);
      setPrev(normalized);
      setDisplay(normalized);
    }

    setAwaitingNext(true);
    setOperator(nextOperator);
  };

  const handleEquals = () => {
    if (error) return;
    if (operator && prev != null) {
      const inputValue = parseFloat(display);
      const prevValue = parseFloat(prev);
      let result: number | string = 0;
      switch (operator) {
        case '+':
          result = prevValue + inputValue;
          break;
        case '-':
          result = prevValue - inputValue;
          break;
        case '*':
          result = prevValue * inputValue;
          break;
        case '/':
          if (inputValue === 0) {
            setDisplay('Error');
            setPrev(null);
            setOperator(null);
            setError(true);
            return;
          }
          result = prevValue / inputValue;
          break;
        default:
          result = inputValue;
      }
      const normalized = typeof result === 'number' ? String(Number(result.toFixed(10)).toString()) : String(result);
      setDisplay(normalized);
      setPrev(null);
      setOperator(null);
      setAwaitingNext(true);
    }
  };

  const handleButton = (value: string) => {
    if (value >= '0' && value <= '9') {
      inputDigit(value);
    } else if (value === '.') {
      inputDot();
    } else if (['+', '-', '*', '/'].includes(value)) {
      performOperation(value);
    } else if (value === 'C') {
      clearAll();
    } else if (value === '=') {
      handleEquals();
    }
  };

  const buttons = [
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['0', '.', 'C', '+'],
  ];

  return (
    <div className="w-full max-w-md glass-panel p-6 rounded-2xl animate-in fade-in zoom-in duration-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Calculator</h2>
        <button onClick={onClose} className="px-3 py-1 bg-slate-800/50 rounded-md text-sm text-slate-300 hover:bg-slate-700/50" aria-label="Close calculator">Close</button>
      </div>

      <div className="bg-slate-900/70 border border-slate-700 rounded-lg p-4 mb-4">
        <div className="text-right text-3xl font-mono text-white break-words" aria-live="polite">{display}</div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {buttons.flat().map((b) => {
          const isOp = ['+', '-', '*', '/'].includes(b);
          const label = b === '*' ? '×' : b === '/' ? '÷' : b;
          return (
            <button
              key={b}
              onClick={() => handleButton(b)}
              aria-label={`Calculator button ${label}`}
              className={`py-3 rounded-lg font-bold ${isOp ? 'bg-gradient-to-br from-yellow-500 to-yellow-400 text-slate-900' : 'bg-slate-800/60 text-white'} hover:opacity-90`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calculator;
