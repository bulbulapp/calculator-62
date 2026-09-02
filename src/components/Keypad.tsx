import React from 'react';
import { motion } from 'motion/react';
import { CalculatorMode, KeypadButton } from '../types';

interface KeypadProps {
  mode: CalculatorMode;
  isDarkMode: boolean;
  onButtonClick: (button: KeypadButton) => void;
  activeHotkey?: string | null;
}

export const Keypad: React.FC<KeypadProps> = ({
  mode,
  isDarkMode,
  onButtonClick,
  activeHotkey
}) => {
  // Key definitions for Standard Mode
  const standardButtons: KeypadButton[] = [
    { label: 'MC', action: 'mc', type: 'memory', tooltip: 'Memory Clear' },
    { label: 'MR', action: 'mr', type: 'memory', tooltip: 'Memory Recall' },
    { label: 'M+', action: 'm+', type: 'memory', tooltip: 'Memory Add' },
    { label: 'M-', action: 'm-', type: 'memory', tooltip: 'Memory Subtract' },

    { label: 'C', action: 'clear', type: 'action', hotkey: 'Escape', tooltip: 'Clear All' },
    { label: '( )', action: 'parentheses', type: 'action', hotkey: '(', tooltip: 'Parentheses' },
    { label: '%', action: 'percent', type: 'action', hotkey: '%', tooltip: 'Percent' },
    { label: '÷', action: 'operator', value: '÷', type: 'operator', hotkey: '/', tooltip: 'Divide' },

    { label: '7', action: 'number', value: '7', type: 'number', hotkey: '7' },
    { label: '8', action: 'number', value: '8', type: 'number', hotkey: '8' },
    { label: '9', action: 'number', value: '9', type: 'number', hotkey: '9' },
    { label: '×', action: 'operator', value: '×', type: 'operator', hotkey: '*', tooltip: 'Multiply' },

    { label: '4', action: 'number', value: '4', type: 'number', hotkey: '4' },
    { label: '5', action: 'number', value: '5', type: 'number', hotkey: '5' },
    { label: '6', action: 'number', value: '6', type: 'number', hotkey: '6' },
    { label: '−', action: 'operator', value: '−', type: 'operator', hotkey: '-', tooltip: 'Subtract' },

    { label: '1', action: 'number', value: '1', type: 'number', hotkey: '1' },
    { label: '2', action: 'number', value: '2', type: 'number', hotkey: '2' },
    { label: '3', action: 'number', value: '3', type: 'number', hotkey: '3' },
    { label: '+', action: 'operator', value: '+', type: 'operator', hotkey: '+', tooltip: 'Add' },

    { label: '±', action: 'toggle_sign', type: 'action', tooltip: 'Positive / Negative' },
    { label: '0', action: 'number', value: '0', type: 'number', hotkey: '0' },
    { label: '.', action: 'decimal', value: '.', type: 'number', hotkey: '.', tooltip: 'Decimal Point' },
    { label: '=', action: 'equals', type: 'accent', hotkey: 'Enter', tooltip: 'Calculate Result' },
  ];

  // Key definitions for Scientific Mode (Includes extra functions grid)
  const scientificButtons: KeypadButton[] = [
    // Row 1: Memory & Power functions
    { label: '2nd', action: 'func_2nd', type: 'function', tooltip: 'Secondary functions' },
    { label: 'deg', action: 'toggle_angle', type: 'function', tooltip: 'Toggle RAD/DEG' },
    { label: 'sin', action: 'function', value: 'sin(', type: 'function' },
    { label: 'cos', action: 'function', value: 'cos(', type: 'function' },
    { label: 'tan', action: 'function', value: 'tan(', type: 'function' },

    // Row 2: Logs & Exponents
    { label: 'x²', action: 'function', value: '^2', type: 'function' },
    { label: 'x^y', action: 'operator', value: '^', type: 'function', hotkey: '^' },
    { label: '√x', action: 'function', value: '√(', type: 'function' },
    { label: 'log', action: 'function', value: 'log10(', type: 'function' },
    { label: 'ln', action: 'function', value: 'ln(', type: 'function' },

    // Row 3: Constants & Factorial
    { label: 'π', action: 'constant', value: 'π', type: 'function' },
    { label: 'e', action: 'constant', value: 'e', type: 'function' },
    { label: 'x!', action: 'function', value: '!', type: 'function' },
    { label: '1/x', action: 'function', value: '1/(', type: 'function' },
    { label: '|x|', action: 'function', value: 'abs(', type: 'function' },

    // Row 4: Standard keypad elements integrated seamlessly
    { label: 'C', action: 'clear', type: 'action', hotkey: 'Escape' },
    { label: '(', action: 'parentheses_open', value: '(', type: 'action', hotkey: '(' },
    { label: ')', action: 'parentheses_close', value: ')', type: 'action', hotkey: ')' },
    { label: '%', action: 'percent', type: 'action', hotkey: '%' },
    { label: '÷', action: 'operator', value: '÷', type: 'operator', hotkey: '/' },

    { label: '7', action: 'number', value: '7', type: 'number', hotkey: '7' },
    { label: '8', action: 'number', value: '8', type: 'number', hotkey: '8' },
    { label: '9', action: 'number', value: '9', type: 'number', hotkey: '9' },
    { label: '×', action: 'operator', value: '×', type: 'operator', hotkey: '*' },
    { label: '−', action: 'operator', value: '−', type: 'operator', hotkey: '-' },

    { label: '4', action: 'number', value: '4', type: 'number', hotkey: '4' },
    { label: '5', action: 'number', value: '5', type: 'number', hotkey: '5' },
    { label: '6', action: 'number', value: '6', type: 'number', hotkey: '6' },
    { label: '+', action: 'operator', value: '+', type: 'operator', hotkey: '+' },
    { label: '±', action: 'toggle_sign', type: 'action' },

    { label: '1', action: 'number', value: '1', type: 'number', hotkey: '1' },
    { label: '2', action: 'number', value: '2', type: 'number', hotkey: '2' },
    { label: '3', action: 'number', value: '3', type: 'number', hotkey: '3' },
    { label: '0', action: 'number', value: '0', type: 'number', hotkey: '0', gridSpan: 2 },
    { label: '.', action: 'decimal', value: '.', type: 'number', hotkey: '.' },
    { label: '=', action: 'equals', type: 'accent', hotkey: 'Enter', gridSpan: 2 },
  ];

  const buttons = mode === 'scientific' ? scientificButtons : standardButtons;

  // Determine button styling based on type and current theme
  const getButtonClass = (btn: KeypadButton) => {
    const isHot = activeHotkey && (btn.hotkey === activeHotkey || btn.value === activeHotkey || btn.label === activeHotkey);
    
    let base = "relative flex items-center justify-center font-bold rounded-2xl transition-all duration-150 select-none text-base md:text-lg focus:outline-none min-h-[56px] md:min-h-[64px] border ";

    if (btn.gridSpan) {
      base += ` col-span-${btn.gridSpan}`;
    }

    // Hotkey pressed ring effect
    if (isHot) {
      base += " ring-2 ring-indigo-400 scale-[0.96] ";
    }

    switch (btn.type) {
      case 'accent': // Equals key
        return base + " bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white border-indigo-400/40 shadow-lg shadow-indigo-500/30 text-xl font-extrabold";

      case 'operator': // +, -, *, /
        return base + (isDarkMode 
          ? " bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border-indigo-800/50 shadow-xs" 
          : " bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200 shadow-xs");

      case 'function': // sin, cos, tan, log, etc.
        return base + (isDarkMode 
          ? " bg-slate-900/80 hover:bg-slate-800 text-indigo-300 border-slate-800 text-sm md:text-base font-mono" 
          : " bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200/80 text-sm md:text-base font-mono");

      case 'action': // C, (), %, ±
        return base + (isDarkMode 
          ? " bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border-slate-700/60" 
          : " bg-slate-200/80 hover:bg-slate-300/80 text-slate-800 border-slate-300/80");

      case 'memory': // MC, MR, M+, M-
        return base + (isDarkMode 
          ? " bg-slate-900/50 hover:bg-slate-800/80 text-slate-400 hover:text-slate-200 border-slate-800/60 text-xs md:text-sm font-mono min-h-[44px]" 
          : " bg-slate-100/60 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 border-slate-200/60 text-xs md:text-sm font-mono min-h-[44px]");

      case 'number':
      default:
        return base + (isDarkMode 
          ? " bg-slate-800/40 hover:bg-slate-800/90 text-slate-100 border-slate-700/40 shadow-xs" 
          : " bg-white hover:bg-slate-50 text-slate-900 border-slate-200/90 shadow-xs");
    }
  };

  return (
    <div className={`grid gap-2.5 ${mode === 'scientific' ? 'grid-cols-5' : 'grid-cols-4'} w-full`}>
      {buttons.map((btn, idx) => (
        <motion.button
          key={`${btn.label}-${idx}`}
          whileTap={{ scale: 0.94 }}
          whileHover={{ y: -1 }}
          onClick={() => onButtonClick(btn)}
          className={getButtonClass(btn)}
          title={btn.tooltip || btn.label}
        >
          <span className="relative z-10">{btn.label}</span>
          
          {/* Subtle hotkey indicator tag */}
          {btn.hotkey && (
            <span className="absolute bottom-1 right-1.5 text-[9px] font-mono text-slate-400 opacity-30 group-hover:opacity-60 pointer-events-none">
              {btn.hotkey === 'Enter' ? '↵' : btn.hotkey === 'Escape' ? 'esc' : btn.hotkey}
            </span>
          )}
        </motion.button>
      ))}
    </div>
  );
};
