import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HistoryItem } from '../types';
import { 
  X, 
  Trash2, 
  Search, 
  Copy, 
  Check, 
  Download, 
  Calculator,
  ArrowRight
} from 'lucide-react';

interface HistoryTapeProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onClearHistory: () => void;
  onSelectEntry: (item: HistoryItem, recallType: 'expression' | 'result') => void;
  isDarkMode: boolean;
}

export const HistoryTape: React.FC<HistoryTapeProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onSelectEntry,
  isDarkMode
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedAll, setCopiedAll] = useState(false);

  const filteredHistory = history.filter(
    (item) =>
      item.expression.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.result.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopyAll = () => {
    if (history.length === 0) return;
    const text = history.map((h) => `${h.expression} = ${h.result}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleExportCSV = () => {
    if (history.length === 0) return;
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Timestamp,Mode,Expression,Result']
        .concat(history.map((h) => `"${h.timestamp}","${h.mode}","${h.expression}","${h.result}"`))
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `calculator_history_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
        {/* Click outside backdrop to close */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        {/* Sliding History Drawer */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          className={`relative z-10 w-full max-w-md h-full shadow-2xl flex flex-col border-l ${
            isDarkMode 
              ? 'bg-slate-900 border-slate-800 text-slate-100' 
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Drawer Header */}
          <div className={`p-4 border-b flex items-center justify-between ${
            isDarkMode ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-slate-50'
          }`}>
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-500" />
              <h2 className="font-bold text-base">Calculation History</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-mono font-medium">
                {history.length}
              </span>
            </div>

            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-200 text-slate-600'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar & Actions */}
          <div className="p-3 border-b border-slate-800/60 flex flex-col gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search calculation history..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-9 pr-3 py-1.5 rounded-xl text-xs font-mono border focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${
                  isDarkMode 
                    ? 'bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-500' 
                    : 'bg-slate-100 border-slate-200 text-slate-800 placeholder-slate-400'
                }`}
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyAll}
                  disabled={history.length === 0}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-colors disabled:opacity-40 ${
                    isDarkMode 
                      ? 'border-slate-800 bg-slate-800/50 hover:bg-slate-800 text-slate-300' 
                      : 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAll ? 'Copied All' : 'Copy All'}</span>
                </button>

                <button
                  onClick={handleExportCSV}
                  disabled={history.length === 0}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-colors disabled:opacity-40 ${
                    isDarkMode 
                      ? 'border-slate-800 bg-slate-800/50 hover:bg-slate-800 text-slate-300' 
                      : 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>

              {history.length > 0 && (
                <button
                  onClick={onClearHistory}
                  className="flex items-center gap-1 text-rose-400 hover:text-rose-300 font-medium transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* History Item List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredHistory.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <Calculator className="w-12 h-12 mb-3 stroke-1 text-slate-600 opacity-60" />
                <p className="font-semibold text-sm">No calculations recorded yet</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Equations solved in Standard or Scientific mode will automatically log here.
                </p>
              </div>
            ) : (
              filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border transition-all duration-200 group ${
                    isDarkMode 
                      ? 'bg-slate-950/60 border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-950' 
                      : 'bg-slate-50 border-slate-200 hover:border-indigo-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-1">
                    <span className="uppercase tracking-wider font-semibold text-indigo-400">{item.mode}</span>
                    <span>{item.timestamp}</span>
                  </div>

                  {/* Clickable expression line */}
                  <button
                    onClick={() => onSelectEntry(item, 'expression')}
                    className="w-full text-right font-mono text-xs text-slate-400 hover:text-indigo-300 transition-colors truncate block mb-1"
                    title="Click to load expression"
                  >
                    {item.expression}
                  </button>

                  {/* Clickable result line */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/40">
                    <span className="text-[10px] text-slate-500 flex items-center gap-1 group-hover:text-indigo-400 transition-colors">
                      <ArrowRight className="w-3 h-3" /> Insert result
                    </span>
                    <button
                      onClick={() => onSelectEntry(item, 'result')}
                      className="font-mono text-base font-bold text-slate-100 hover:text-indigo-400 transition-colors"
                      title="Click to insert result into calculation"
                    >
                      = {item.result}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
