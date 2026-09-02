import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check, Delete, RotateCcw } from 'lucide-react';
import { AngleMode } from '../types';

interface DisplayProps {
  expression: string;
  displayValue: string;
  memoryValue: number;
  angleMode: AngleMode;
  isDarkMode: boolean;
  onClear: () => void;
  onBackspace: () => void;
  onCopy: () => void;
  hasError?: boolean;
}

export const Display: React.FC<DisplayProps> = ({
  expression,
  displayValue,
  memoryValue,
  angleMode,
  isDarkMode,
  onClear,
  onBackspace,
  onCopy,
  hasError
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Dynamic font scaling for main display number length
  const getFontSizeClass = (text: string) => {
    const len = text.length;
    if (len > 22) return 'text-xl md:text-2xl';
    if (len > 16) return 'text-2xl md:text-3xl';
    if (len > 12) return 'text-3xl md:text-4xl';
    if (len > 8) return 'text-4xl md:text-5xl';
    return 'text-5xl md:text-6xl';
  };

  return (
    <div className={`relative p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between min-h-[160px] md:min-h-[180px] overflow-hidden ${
      isDarkMode 
        ? 'bg-slate-950/90 border-slate-800/80 shadow-2xl shadow-indigo-950/20' 
        : 'bg-slate-900 text-white border-slate-800 shadow-xl'
    }`}>
      {/* Top Indicators & Formula Bar */}
      <div className="flex items-start justify-between gap-2 z-10">
        <div className="flex items-center gap-2">
          {memoryValue !== 0 && (
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              M
            </span>
          )}
          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/50">
            {angleMode}
          </span>
        </div>

        {/* Previous expression history line */}
        <div className="text-right font-mono text-sm md:text-base text-slate-400 truncate max-w-[70%] font-medium tracking-wide">
          {expression || '\u00A0'}
        </div>
      </div>

      {/* Main Display Value with smooth motion */}
      <div className="my-2 text-right z-10 overflow-x-auto no-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={displayValue}
            initial={{ opacity: 0.8, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className={`font-mono font-bold tracking-tight select-all transition-all duration-150 ${getFontSizeClass(displayValue)} ${
              hasError ? 'text-rose-400' : 'text-slate-100'
            }`}
          >
            {displayValue}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Action Quick Toolbar */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 z-10 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={onClear}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-rose-500/20 hover:text-rose-300 text-slate-400 transition-colors border border-slate-700/50 font-mono font-medium"
            title="Clear Current Calculation (Esc)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>AC</span>
          </button>
          
          <button
            onClick={onBackspace}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-amber-500/20 hover:text-amber-300 text-slate-400 transition-colors border border-slate-700/50 font-mono font-medium"
            title="Backspace (Backspace)"
          >
            <Delete className="w-3.5 h-3.5" />
            <span>DEL</span>
          </button>
        </div>

        {/* Copy Result button */}
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all border ${
            copied
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700/50'
          }`}
          title="Copy Result to Clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Decorative futuristic glow elements */}
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
    </div>
  );
};
