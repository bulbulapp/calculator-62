import React, { useState } from 'react';
import { 
  Keyboard, 
  History, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  Cpu, 
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { CalculatorMode, AngleMode } from '../types';

interface FooterBarProps {
  mode: CalculatorMode;
  angleMode: AngleMode;
  setAngleMode?: (angle: AngleMode) => void;
  displayValue: string;
  hasError: boolean;
  expression: string;
  memoryValue: number;
  historyCount: number;
  isHistoryOpen: boolean;
  setIsHistoryOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  onOpenShortcuts: () => void;
  onClear: () => void;
  isDarkMode: boolean;
  isSoundEnabled: boolean;
  setIsSoundEnabled: (enabled: boolean) => void;
}

export const FooterBar: React.FC<FooterBarProps> = ({
  mode,
  angleMode,
  setAngleMode,
  displayValue,
  hasError,
  expression,
  memoryValue,
  historyCount,
  isHistoryOpen,
  setIsHistoryOpen,
  onOpenShortcuts,
  onClear,
  isDarkMode,
  isSoundEnabled,
  setIsSoundEnabled
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (displayValue) {
      navigator.clipboard.writeText(displayValue.replace(/,/g, ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const getStatus = () => {
    if (hasError) return { text: 'Calculation Error', color: 'bg-rose-500', textColor: 'text-rose-400' };
    if (expression) return { text: 'Evaluating...', color: 'bg-amber-400 animate-pulse', textColor: 'text-amber-400' };
    return { text: 'Engine Ready', color: 'bg-emerald-500', textColor: 'text-emerald-400' };
  };

  const status = getStatus();

  return (
    <footer
      id="app-footer-bar"
      className={`w-full border-t transition-colors duration-200 z-20 backdrop-blur-md ${
        isDarkMode
          ? 'bg-slate-950/85 border-slate-800/80 text-slate-300'
          : 'bg-white/90 border-slate-200 text-slate-700 shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left Section: Status, Mode Badges & Engine Specs */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Engine Status Pill */}
          <div
            className={`flex items-center gap-2 px-2.5 py-1 rounded-lg border font-mono text-[11px] ${
              isDarkMode
                ? 'bg-slate-900/90 border-slate-800'
                : 'bg-slate-100/90 border-slate-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${status.color}`} />
            <span className={`font-medium ${status.textColor}`}>{status.text}</span>
          </div>

          {/* Active Mode Badge */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-medium text-[11px] capitalize ${
              isDarkMode
                ? 'bg-slate-900/60 border-slate-800 text-slate-400'
                : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}
          >
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>{mode} Mode</span>
          </div>

          {/* Scientific Angle Mode Quick Toggle */}
          {mode === 'scientific' && setAngleMode && (
            <button
              id="footer-angle-toggle"
              onClick={() => setAngleMode(angleMode === 'RAD' ? 'DEG' : 'RAD')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[11px] font-bold border transition-colors ${
                angleMode === 'DEG'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                  : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20'
              }`}
              title="Click to toggle Angle Mode"
            >
              <span>{angleMode}</span>
            </button>
          )}

          {/* Active Memory Indicator */}
          {memoryValue !== 0 && (
            <div
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md font-mono text-[11px] font-semibold border ${
                isDarkMode
                  ? 'bg-indigo-950/40 border-indigo-500/30 text-indigo-300'
                  : 'bg-indigo-50 border-indigo-200 text-indigo-700'
              }`}
            >
              <span>M = {memoryValue}</span>
            </div>
          )}

          {/* Engine Spec Info */}
          <div className="hidden lg:flex items-center gap-1.5 text-slate-400 text-[11px]">
            <Cpu className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono">IEEE 754 Float • 64-bit</span>
          </div>
        </div>

        {/* Center Section: Quick Keyboard Shortcuts Pill Guide */}
        <div className="hidden md:flex items-center gap-2">
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-lg border text-[11px] ${
              isDarkMode
                ? 'bg-slate-900/60 border-slate-800/80 text-slate-400'
                : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}
          >
            <span className="font-medium">Hotkeys:</span>
            <span className="inline-flex items-center gap-1">
              <kbd
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold border ${
                  isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-slate-300'
                    : 'bg-white border-slate-300 text-slate-700'
                }`}
              >
                Esc
              </kbd>
              <span>Reset</span>
            </span>
            <span className="text-slate-500">•</span>
            <span className="inline-flex items-center gap-1">
              <kbd
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold border ${
                  isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-slate-300'
                    : 'bg-white border-slate-300 text-slate-700'
                }`}
              >
                Enter
              </kbd>
              <span>Eval</span>
            </span>
            <span className="text-slate-500">•</span>
            <span className="inline-flex items-center gap-1">
              <kbd
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold border ${
                  isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-slate-300'
                    : 'bg-white border-slate-300 text-slate-700'
                }`}
              >
                ⌫
              </kbd>
              <span>Del</span>
            </span>
          </div>
        </div>

        {/* Right Section: Interactive Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Copy Result Button */}
          <button
            id="footer-copy-btn"
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all text-[11px] font-medium ${
              copied
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                : isDarkMode
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title="Copy current value to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Val</span>
              </>
            )}
          </button>

          {/* Quick Reset Button */}
          <button
            id="footer-reset-btn"
            onClick={onClear}
            className={`p-1.5 rounded-lg border transition-colors ${
              isDarkMode
                ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10'
                : 'bg-white border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50'
            }`}
            title="Reset Calculation (Esc)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Sound Toggle Button */}
          <button
            id="footer-sound-toggle"
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            className={`p-1.5 rounded-lg border transition-colors ${
              isDarkMode
                ? 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            title={isSoundEnabled ? 'Mute Sound FX' : 'Unmute Sound FX'}
          >
            {isSoundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {/* Shortcuts Modal Trigger */}
          <button
            id="footer-shortcuts-btn"
            onClick={onOpenShortcuts}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-colors text-[11px] font-medium ${
              isDarkMode
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title="Keyboard Shortcuts Cheat Sheet"
          >
            <Keyboard className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Shortcuts</span>
          </button>

          {/* History Drawer Toggle Button with Count */}
          <button
            id="footer-history-toggle"
            onClick={() => setIsHistoryOpen((prev) => !prev)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-colors text-[11px] font-medium relative ${
              isHistoryOpen
                ? 'bg-indigo-600 text-white border-indigo-500'
                : isDarkMode
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title="Toggle Calculation History"
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isHistoryOpen
                    ? 'bg-indigo-800 text-white'
                    : 'bg-indigo-500/20 text-indigo-400'
                }`}
              >
                {historyCount > 99 ? '99+' : historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </footer>
  );
};
