import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CalculatorMode, 
  AngleMode, 
  HistoryItem, 
  KeypadButton 
} from './types';
import { evaluateExpression, formatResult } from './utils/mathEngine';
import { soundFx } from './utils/audio';

import { Header } from './components/Header';
import { Display } from './components/Display';
import { Keypad } from './components/Keypad';
import { HistoryTape } from './components/HistoryTape';
import { FinancialCalculator } from './components/FinancialCalculator';
import { UnitConverter } from './components/UnitConverter';
import { ShortcutsModal } from './components/ShortcutsModal';
import { FooterBar } from './components/FooterBar';

export default function App() {
  // App state
  const [mode, setMode] = useState<CalculatorMode>('standard');
  const [angleMode, setAngleMode] = useState<AngleMode>('RAD');
  const [expression, setExpression] = useState<string>('');
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [isNewNumber, setIsNewNumber] = useState<boolean>(true);
  const [memoryValue, setMemoryValue] = useState<number>(0);
  const [hasError, setHasError] = useState<boolean>(false);

  // Sound, Theme, UI Drawers
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [activeHotkey, setActiveHotkey] = useState<string | null>(null);

  // History state with LocalStorage persistence
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('calculator_pro_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save history on change
  useEffect(() => {
    try {
      localStorage.setItem('calculator_pro_history', JSON.stringify(history));
    } catch {
      // Ignore storage errors
    }
  }, [history]);

  // Sync sound setting
  useEffect(() => {
    soundFx.setEnabled(isSoundEnabled);
  }, [isSoundEnabled]);

  // Handle Clear / All Clear
  const handleClear = useCallback(() => {
    soundFx.playClick('clear');
    setExpression('');
    setDisplayValue('0');
    setIsNewNumber(true);
    setHasError(false);
  }, []);

  // Handle Backspace / Delete
  const handleBackspace = useCallback(() => {
    soundFx.playClick('action');
    if (hasError) {
      handleClear();
      return;
    }

    if (displayValue.length > 1 && !isNewNumber) {
      setDisplayValue((prev) => prev.slice(0, -1));
    } else {
      setDisplayValue('0');
      setIsNewNumber(true);
    }
  }, [displayValue, isNewNumber, hasError, handleClear]);

  // Handle Copy
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(displayValue.replace(/,/g, ''));
  }, [displayValue]);

  // Calculate Result (=)
  const handleCalculate = useCallback(() => {
    soundFx.playClick('accent');
    
    // Construct full target expression
    let fullExpr = expression;

    if (!fullExpr || isNewNumber) {
      fullExpr = expression ? expression + displayValue : displayValue;
    } else {
      fullExpr = expression + displayValue;
    }

    // Clean double operators
    fullExpr = fullExpr.trim();
    if (!fullExpr) return;

    const evalResult = evaluateExpression(fullExpr, angleMode);

    if (evalResult.error || isNaN(evalResult.result)) {
      setHasError(true);
      setDisplayValue(evalResult.formatted || 'Error');
    } else {
      setHasError(false);
      const resStr = evalResult.formatted;
      setDisplayValue(resStr);
      setExpression('');
      setIsNewNumber(true);

      // Add to history tape
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        expression: fullExpr,
        result: resStr,
        mode
      };

      setHistory((prev) => [newItem, ...prev.slice(0, 49)]); // Keep last 50 items
    }
  }, [expression, displayValue, isNewNumber, angleMode, mode]);

  // Handle Keypad Button Clicks
  const handleButtonClick = useCallback((btn: KeypadButton) => {
    if (hasError && btn.action !== 'clear') {
      handleClear();
    }

    switch (btn.action) {
      case 'number': {
        soundFx.playClick('number');
        const numVal = btn.value || btn.label;
        if (isNewNumber || displayValue === '0') {
          setDisplayValue(numVal);
          setIsNewNumber(false);
        } else {
          setDisplayValue((prev) => prev + numVal);
        }
        break;
      }

      case 'decimal': {
        soundFx.playClick('number');
        if (isNewNumber) {
          setDisplayValue('0.');
          setIsNewNumber(false);
        } else if (!displayValue.includes('.')) {
          setDisplayValue((prev) => prev + '.');
        }
        break;
      }

      case 'operator': {
        soundFx.playClick('operator');
        const opVal = btn.value || btn.label;
        const currentNum = displayValue.replace(/,/g, '');

        if (expression.endsWith(' ') && isNewNumber) {
          // Replace previous trailing operator
          setExpression((prev) => prev.replace(/[+−×÷^]\s*$/, `${opVal} `));
        } else {
          setExpression((prev) => prev + `${currentNum} ${opVal} `);
          setIsNewNumber(true);
        }
        break;
      }

      case 'function': {
        soundFx.playClick('action');
        const fnVal = btn.value || '';
        if (fnVal.endsWith('(')) {
          setExpression((prev) => prev + fnVal);
          setIsNewNumber(true);
        } else if (fnVal === '!') {
          setDisplayValue((prev) => prev + '!');
        } else if (fnVal === '^2') {
          setExpression((prev) => prev + `${displayValue.replace(/,/g, '')}^2`);
          setIsNewNumber(true);
        } else {
          setExpression((prev) => prev + `${fnVal}(${displayValue.replace(/,/g, '')})`);
          setIsNewNumber(true);
        }
        break;
      }

      case 'constant': {
        soundFx.playClick('number');
        const constVal = btn.value || btn.label;
        setDisplayValue(constVal);
        setIsNewNumber(true);
        break;
      }

      case 'toggle_sign': {
        soundFx.playClick('action');
        if (displayValue !== '0') {
          if (displayValue.startsWith('-')) {
            setDisplayValue((prev) => prev.slice(1));
          } else {
            setDisplayValue((prev) => '-' + prev);
          }
        }
        break;
      }

      case 'percent': {
        soundFx.playClick('action');
        const num = parseFloat(displayValue.replace(/,/g, ''));
        if (!isNaN(num)) {
          const res = num / 100;
          setDisplayValue(formatResult(res));
          setIsNewNumber(true);
        }
        break;
      }

      case 'parentheses': {
        soundFx.playClick('action');
        const openCount = (expression.match(/\(/g) || []).length;
        const closeCount = (expression.match(/\)/g) || []).length;
        if (openCount > closeCount && !expression.endsWith('(')) {
          setExpression((prev) => prev + `${displayValue} ) `);
          setIsNewNumber(true);
        } else {
          setExpression((prev) => prev + '( ');
          setIsNewNumber(true);
        }
        break;
      }

      case 'parentheses_open': {
        soundFx.playClick('action');
        setExpression((prev) => prev + '( ');
        setIsNewNumber(true);
        break;
      }

      case 'parentheses_close': {
        soundFx.playClick('action');
        setExpression((prev) => prev + `${displayValue.replace(/,/g, '')} ) `);
        setIsNewNumber(true);
        break;
      }

      case 'toggle_angle': {
        soundFx.playClick('action');
        setAngleMode((prev) => (prev === 'RAD' ? 'DEG' : 'RAD'));
        break;
      }

      // Memory Functions
      case 'mc': {
        soundFx.playClick('clear');
        setMemoryValue(0);
        break;
      }
      case 'mr': {
        soundFx.playClick('action');
        setDisplayValue(memoryValue.toString());
        setIsNewNumber(true);
        break;
      }
      case 'm+': {
        soundFx.playClick('accent');
        const val = parseFloat(displayValue.replace(/,/g, ''));
        if (!isNaN(val)) setMemoryValue((prev) => prev + val);
        break;
      }
      case 'm-': {
        soundFx.playClick('accent');
        const val = parseFloat(displayValue.replace(/,/g, ''));
        if (!isNaN(val)) setMemoryValue((prev) => prev - val);
        break;
      }

      case 'clear':
        handleClear();
        break;

      case 'equals':
        handleCalculate();
        break;

      default:
        break;
    }
  }, [displayValue, expression, isNewNumber, hasError, memoryValue, handleClear, handleCalculate]);

  // Attach physical keyboard shortcuts listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept typing when focus is inside text input or text area
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'SELECT')) {
        return;
      }

      const key = e.key;

      // Visual key feedback
      setActiveHotkey(key);
      setTimeout(() => setActiveHotkey(null), 150);

      if (key >= '0' && key <= '9') {
        handleButtonClick({ label: key, action: 'number', value: key, type: 'number' });
      } else if (key === '.') {
        handleButtonClick({ label: '.', action: 'decimal', value: '.', type: 'number' });
      } else if (key === '+') {
        handleButtonClick({ label: '+', action: 'operator', value: '+', type: 'operator' });
      } else if (key === '-') {
        handleButtonClick({ label: '−', action: 'operator', value: '−', type: 'operator' });
      } else if (key === '*') {
        handleButtonClick({ label: '×', action: 'operator', value: '×', type: 'operator' });
      } else if (key === '/') {
        e.preventDefault();
        handleButtonClick({ label: '÷', action: 'operator', value: '÷', type: 'operator' });
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleCalculate();
      } else if (key === 'Escape') {
        handleClear();
      } else if (key === 'Backspace') {
        handleBackspace();
      } else if (key === '(') {
        handleButtonClick({ label: '(', action: 'parentheses_open', value: '(', type: 'action' });
      } else if (key === ')') {
        handleButtonClick({ label: ')', action: 'parentheses_close', value: ')', type: 'action' });
      } else if (key === '%') {
        handleButtonClick({ label: '%', action: 'percent', type: 'action' });
      } else if (key === '^') {
        handleButtonClick({ label: 'x^y', action: 'operator', value: '^', type: 'function' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleButtonClick, handleCalculate, handleClear, handleBackspace]);

  // Handle entry selection from History tape
  const handleSelectHistoryEntry = (item: HistoryItem, recallType: 'expression' | 'result') => {
    if (recallType === 'expression') {
      setExpression(item.expression);
      setDisplayValue(item.result);
      setIsNewNumber(true);
    } else {
      setDisplayValue(item.result);
      setIsNewNumber(true);
    }
    setIsHistoryOpen(false);
  };

  return (
    <div className={`min-h-screen w-full transition-colors duration-300 flex flex-col justify-between ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      {/* Top Header Navigation */}
      <Header
        mode={mode}
        setMode={setMode}
        angleMode={angleMode}
        setAngleMode={setAngleMode}
        isSoundEnabled={isSoundEnabled}
        setIsSoundEnabled={setIsSoundEnabled}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        isHistoryOpen={isHistoryOpen}
        setIsHistoryOpen={setIsHistoryOpen}
        historyCount={history.length}
        memoryValue={memoryValue}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
      />

      {/* Main SaaS Canvas Container */}
      <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-6 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {mode === 'financial' ? (
            <motion.div
              key="financial-view"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <FinancialCalculator isDarkMode={isDarkMode} />
            </motion.div>
          ) : mode === 'converter' ? (
            <motion.div
              key="converter-view"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <UnitConverter isDarkMode={isDarkMode} />
            </motion.div>
          ) : (
            /* Standard & Scientific Calculator Chassis */
            <motion.div
              key="calc-chassis"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className={`w-full ${mode === 'scientific' ? 'max-w-3xl' : 'max-w-md'} p-5 md:p-6 rounded-3xl border shadow-2xl transition-all duration-300 space-y-5 ${
                isDarkMode 
                  ? 'bg-slate-900/90 border-slate-800/80 shadow-indigo-950/30' 
                  : 'bg-white border-slate-200 shadow-xl'
              }`}
            >
              {/* Display Window */}
              <Display
                expression={expression}
                displayValue={displayValue}
                memoryValue={memoryValue}
                angleMode={angleMode}
                isDarkMode={isDarkMode}
                onClear={handleClear}
                onBackspace={handleBackspace}
                onCopy={handleCopy}
                hasError={hasError}
              />

              {/* Keypad Grid */}
              <Keypad
                mode={mode}
                isDarkMode={isDarkMode}
                onButtonClick={handleButtonClick}
                activeHotkey={activeHotkey}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Bar */}
      <FooterBar
        mode={mode}
        angleMode={angleMode}
        setAngleMode={setAngleMode}
        displayValue={displayValue}
        hasError={hasError}
        expression={expression}
        memoryValue={memoryValue}
        historyCount={history.length}
        isHistoryOpen={isHistoryOpen}
        setIsHistoryOpen={setIsHistoryOpen}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onClear={handleClear}
        isDarkMode={isDarkMode}
        isSoundEnabled={isSoundEnabled}
        setIsSoundEnabled={setIsSoundEnabled}
      />

      {/* History Drawer */}
      <HistoryTape
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={() => setHistory([])}
        onSelectEntry={handleSelectHistoryEntry}
        isDarkMode={isDarkMode}
      />

      {/* Shortcuts Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
