import React from 'react';
import { motion } from 'motion/react';
import { CalculatorMode, AngleMode } from '../types';
import { 
  Calculator, 
  FlaskConical, 
  TrendingUp, 
  ArrowRightLeft, 
  Volume2, 
  VolumeX, 
  Keyboard, 
  History,
  Sun,
  Moon
} from 'lucide-react';

interface HeaderProps {
  mode: CalculatorMode;
  setMode: (mode: CalculatorMode) => void;
  angleMode: AngleMode;
  setAngleMode: (angleMode: AngleMode) => void;
  isSoundEnabled: boolean;
  setIsSoundEnabled: (enabled: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  isHistoryOpen: boolean;
  setIsHistoryOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  historyCount: number;
  memoryValue: number;
  onOpenShortcuts: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  setMode,
  angleMode,
  setAngleMode,
  isSoundEnabled,
  setIsSoundEnabled,
  isDarkMode,
  setIsDarkMode,
  isHistoryOpen,
  setIsHistoryOpen,
  historyCount,
  memoryValue,
  onOpenShortcuts
}) => {
  const modes: { id: CalculatorMode; label: string; icon: React.ReactNode }[] = [
    { id: 'standard', label: 'Standard', icon: <Calculator className="w-4 h-4" /> },
    { id: 'scientific', label: 'Scientific', icon: <FlaskConical className="w-4 h-4" /> },
    { id: 'financial', label: 'Financial', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'converter', label: 'Converter', icon: <ArrowRightLeft className="w-4 h-4" /> },
  ];

  return (
    <header className={`w-full px-4 py-3 border-b flex flex-col md:flex-row items-center justify-between gap-3 transition-colors duration-200 ${
      isDarkMode 
        ? 'bg-slate-900/80 border-slate-800/80 text-slate-100' 
        : 'bg-white/90 border-slate-200 text-slate-800 shadow-xs'
    }`}>
      {/* Brand logo & title */}
      <div className="flex items-center justify-between w-full md:w-auto">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/20">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold tracking-tight text-base leading-none">Calculator</h1>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Precision SaaS Engine</p>
          </div>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-1.5 md:hidden">
          <button
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200' : 'hover:bg-slate-100 text-slate-600'
            }`}
            title={isSoundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
          >
            {isSoundEnabled ? <Volume2 className="w-4 h-4 text-indigo-400" /> : <VolumeX className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => setIsHistoryOpen((prev) => !prev)}
            className={`p-2 rounded-lg relative transition-colors ${
              isHistoryOpen ? 'bg-indigo-500/15 text-indigo-400' : isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
            }`}
            title="Calculation History"
          >
            <History className="w-4 h-4" />
            {historyCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {historyCount > 9 ? '9+' : historyCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Navigation Mode Tabs */}
      <div className={`flex items-center p-1 rounded-xl w-full md:w-auto overflow-x-auto no-scrollbar border ${
        isDarkMode ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-100/80 border-slate-200/80'
      }`}>
        {modes.map((tab) => {
          const isActive = mode === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setMode(tab.id)}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap flex-1 md:flex-none justify-center ${
                isActive
                  ? isDarkMode
                    ? 'text-white'
                    : 'text-slate-900 font-semibold'
                  : isDarkMode
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className={`absolute inset-0 rounded-lg shadow-xs ${
                    isDarkMode 
                      ? 'bg-slate-800 border border-slate-700/60' 
                      : 'bg-white border border-slate-200/90'
                  }`}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                {tab.icon}
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right Controls & Tools */}
      <div className="hidden md:flex items-center gap-2">
        {/* Memory Indicator */}
        {memoryValue !== 0 && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-semibold">
            <span>M =</span>
            <span>{memoryValue}</span>
          </div>
        )}

        {/* Rad / Deg Toggle for Scientific */}
        {mode === 'scientific' && (
          <button
            onClick={() => setAngleMode(angleMode === 'RAD' ? 'DEG' : 'RAD')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all border ${
              angleMode === 'DEG'
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                : 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400'
            }`}
            title="Toggle Radians / Degrees mode"
          >
            {angleMode}
          </button>
        )}

        {/* Sound Toggle */}
        <button
          onClick={() => setIsSoundEnabled(!isSoundEnabled)}
          className={`p-2 rounded-lg transition-colors border ${
            isDarkMode 
              ? 'border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200' 
              : 'border-slate-200 hover:bg-slate-100 text-slate-600'
          }`}
          title={isSoundEnabled ? 'Mute Audio Feedback' : 'Enable Audio Feedback'}
        >
          {isSoundEnabled ? <Volume2 className="w-4 h-4 text-indigo-400" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-2 rounded-lg transition-colors border ${
            isDarkMode 
              ? 'border-slate-800 hover:bg-slate-800 text-amber-400' 
              : 'border-slate-200 hover:bg-slate-100 text-indigo-600'
          }`}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Shortcuts Cheat Sheet */}
        <button
          onClick={onOpenShortcuts}
          className={`p-2 rounded-lg transition-colors border ${
            isDarkMode 
              ? 'border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200' 
              : 'border-slate-200 hover:bg-slate-100 text-slate-600'
          }`}
          title="Keyboard Shortcuts"
        >
          <Keyboard className="w-4 h-4" />
        </button>

        {/* History Tape Drawer Button */}
        <button
          onClick={() => setIsHistoryOpen((prev) => !prev)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors relative ${
            isHistoryOpen
              ? 'bg-indigo-600 text-white border-indigo-500'
              : isDarkMode
              ? 'border-slate-800 hover:bg-slate-800 text-slate-300'
              : 'border-slate-200 hover:bg-slate-100 text-slate-700'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>History</span>
          {historyCount > 0 && (
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              isHistoryOpen ? 'bg-indigo-800 text-white' : 'bg-indigo-500/20 text-indigo-400'
            }`}>
              {historyCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
