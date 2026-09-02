import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose, isDarkMode }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '0 - 9', desc: 'Enter numbers' },
    { key: '.', desc: 'Decimal point' },
    { key: '+  -  *  /', desc: 'Basic arithmetic operators' },
    { key: 'Enter or =', desc: 'Calculate result' },
    { key: 'Esc', desc: 'Clear calculation (AC)' },
    { key: 'Backspace', desc: 'Delete last digit' },
    { key: '(  )', desc: 'Open and close parentheses' },
    { key: '%', desc: 'Percentage calculation' },
    { key: '^', desc: 'Power / Exponent (x^y)' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className={`relative z-10 w-full max-w-md p-6 rounded-2xl border shadow-2xl ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Keyboard className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bold text-base">Keyboard Shortcuts</h3>
            </div>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="py-4 space-y-2.5 max-h-[60vh] overflow-y-auto no-scrollbar">
            {shortcuts.map((s, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-xs ${
                  isDarkMode ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className="text-slate-400 font-medium">{s.desc}</span>
                <kbd className="px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono font-bold text-xs shadow-xs">
                  {s.key}
                </kbd>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 text-center">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-md shadow-indigo-600/20"
            >
              Got it, continue
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
