import React, { useState } from 'react';
import { X, Delete, RotateCcw, Calculator as CalcIcon } from 'lucide-react';

interface CalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CalculatorModal: React.FC<CalculatorModalProps> = ({ isOpen, onClose }) => {
  const [display, setDisplay] = useState<string>('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [resetNext, setResetNext] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDigit = (digit: string) => {
    if (resetNext || display === '0') {
      setDisplay(digit);
      setResetNext(false);
    } else {
      if (display.length < 12) {
        setDisplay(display + digit);
      }
    }
  };

  const handleDecimal = () => {
    if (resetNext) {
      setDisplay('0.');
      setResetNext(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperator = (op: string) => {
    const current = parseFloat(display);
    if (prevValue !== null && operation && !resetNext) {
      const result = compute(prevValue, current, operation);
      setDisplay(formatNumber(result));
      setPrevValue(result);
    } else {
      setPrevValue(current);
    }
    setOperation(op);
    setResetNext(true);
  };

  const compute = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const handleEquals = () => {
    if (prevValue === null || !operation) return;
    const current = parseFloat(display);
    const result = compute(prevValue, current, operation);
    setDisplay(formatNumber(result));
    setPrevValue(null);
    setOperation(null);
    setResetNext(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperation(null);
    setResetNext(false);
  };

  const handleBackspace = () => {
    if (resetNext) return;
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const formatNumber = (num: number): string => {
    if (isNaN(num) || !isFinite(num)) return 'Error';
    // Limit decimals to 6
    const rounded = Math.round(num * 1000000) / 1000000;
    const str = rounded.toString();
    return str.length > 12 ? rounded.toPrecision(8) : str;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        id="calc-modal-container"
        className="w-full max-w-xs bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-sky-900 text-white">
          <div className="flex items-center space-x-2">
            <CalcIcon className="w-5 h-5 text-sky-300" />
            <span className="font-semibold text-sm tracking-wide">NCLEX Clinical Calculator</span>
          </div>
          <button
            id="calc-close-button"
            onClick={onClose}
            className="p-1 text-sky-200 hover:text-white rounded-lg hover:bg-sky-800 transition-colors"
            aria-label="Close calculator"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Display */}
        <div className="p-4 bg-slate-100 border-b border-slate-200 text-right">
          <div className="text-xs text-slate-500 h-4 font-mono">
            {prevValue !== null && operation ? `${prevValue} ${operation}` : ''}
          </div>
          <div 
            id="calc-display-value"
            className="text-3xl font-bold font-mono text-slate-800 tracking-tight truncate select-all"
          >
            {display}
          </div>
        </div>

        {/* Keypad */}
        <div className="p-3 grid grid-cols-4 gap-2 bg-slate-50">
          <button
            id="calc-key-clear"
            onClick={handleClear}
            className="col-span-2 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-sm flex items-center justify-center space-x-1 transition-colors active:scale-95"
          >
            <RotateCcw className="w-4 h-4 mr-1 text-slate-600" />
            <span>Clear</span>
          </button>
          <button
            id="calc-key-backspace"
            onClick={handleBackspace}
            className="py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors active:scale-95"
          >
            <Delete className="w-4 h-4" />
          </button>
          <button
            id="calc-key-divide"
            onClick={() => handleOperator('÷')}
            className={`py-3 rounded-xl font-bold text-lg transition-colors active:scale-95 ${operation === '÷' ? 'bg-sky-600 text-white' : 'bg-sky-100 text-sky-800 hover:bg-sky-200'}`}
          >
            ÷
          </button>

          {['7', '8', '9'].map(d => (
            <button
              key={d}
              id={`calc-key-${d}`}
              onClick={() => handleDigit(d)}
              className="py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-semibold text-lg border border-slate-200 shadow-xs transition-colors active:scale-95"
            >
              {d}
            </button>
          ))}
          <button
            id="calc-key-multiply"
            onClick={() => handleOperator('×')}
            className={`py-3 rounded-xl font-bold text-lg transition-colors active:scale-95 ${operation === '×' ? 'bg-sky-600 text-white' : 'bg-sky-100 text-sky-800 hover:bg-sky-200'}`}
          >
            ×
          </button>

          {['4', '5', '6'].map(d => (
            <button
              key={d}
              id={`calc-key-${d}`}
              onClick={() => handleDigit(d)}
              className="py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-semibold text-lg border border-slate-200 shadow-xs transition-colors active:scale-95"
            >
              {d}
            </button>
          ))}
          <button
            id="calc-key-subtract"
            onClick={() => handleOperator('-')}
            className={`py-3 rounded-xl font-bold text-lg transition-colors active:scale-95 ${operation === '-' ? 'bg-sky-600 text-white' : 'bg-sky-100 text-sky-800 hover:bg-sky-200'}`}
          >
            -
          </button>

          {['1', '2', '3'].map(d => (
            <button
              key={d}
              id={`calc-key-${d}`}
              onClick={() => handleDigit(d)}
              className="py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-semibold text-lg border border-slate-200 shadow-xs transition-colors active:scale-95"
            >
              {d}
            </button>
          ))}
          <button
            id="calc-key-add"
            onClick={() => handleOperator('+')}
            className={`py-3 rounded-xl font-bold text-lg transition-colors active:scale-95 ${operation === '+' ? 'bg-sky-600 text-white' : 'bg-sky-100 text-sky-800 hover:bg-sky-200'}`}
          >
            +
          </button>

          <button
            id="calc-key-0"
            onClick={() => handleDigit('0')}
            className="col-span-2 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-semibold text-lg border border-slate-200 shadow-xs transition-colors active:scale-95"
          >
            0
          </button>
          <button
            id="calc-key-decimal"
            onClick={handleDecimal}
            className="py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-lg border border-slate-200 shadow-xs transition-colors active:scale-95"
          >
            .
          </button>
          <button
            id="calc-key-equals"
            onClick={handleEquals}
            className="py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-lg shadow-sm transition-colors active:scale-95"
          >
            =
          </button>
        </div>

        {/* Quick Conversions Helper Bar */}
        <div className="p-2.5 bg-sky-50 border-t border-sky-100 text-[11px] text-sky-800 space-y-0.5 text-center">
          <div className="font-semibold text-sky-900">Dosage Quick Conversions:</div>
          <div>1 kg = 2.2 lb • 1 mg = 1,000 mcg • 1 g = 1,000 mg</div>
        </div>
      </div>
    </div>
  );
};
