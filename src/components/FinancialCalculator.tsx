import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FinancialTool } from '../types';
import { 
  calculateLoanEMI, 
  calculateCompoundInterest, 
  calculateTip, 
  calculateROI,
  formatResult
} from '../utils/mathEngine';
import { 
  Building2, 
  PiggyBank, 
  Receipt, 
  TrendingUp, 
  DollarSign, 
  Percent, 
  Calendar, 
  Users 
} from 'lucide-react';

interface FinancialCalculatorProps {
  isDarkMode: boolean;
}

export const FinancialCalculator: React.FC<FinancialCalculatorProps> = ({ isDarkMode }) => {
  const [activeTool, setActiveTool] = useState<FinancialTool>('loan');

  // 1. Loan State
  const [loanAmount, setLoanAmount] = useState(250000);
  const [loanRate, setLoanRate] = useState(6.5);
  const [loanYears, setLoanYears] = useState(30);

  // 2. Compound Interest State
  const [principal, setPrincipal] = useState(10000);
  const [monthlyDeposit, setMonthlyDeposit] = useState(300);
  const [compoundRate, setCompoundRate] = useState(8.0);
  const [compoundYears, setCompoundYears] = useState(10);
  const [compoundingFreq, setCompoundingFreq] = useState(12);

  // 3. Tip State
  const [billAmount, setBillAmount] = useState(120);
  const [tipPercent, setTipPercent] = useState(18);
  const [splitCount, setSplitCount] = useState(3);

  // 4. ROI State
  const [roiInitial, setRoiInitial] = useState(5000);
  const [roiFinal, setRoiFinal] = useState(12500);
  const [roiYears, setRoiYears] = useState(5);

  const tools: { id: FinancialTool; label: string; icon: React.ReactNode }[] = [
    { id: 'loan', label: 'Loan EMI', icon: <Building2 className="w-4 h-4" /> },
    { id: 'compound', label: 'Compound Interest', icon: <PiggyBank className="w-4 h-4" /> },
    { id: 'tip', label: 'Tip Splitter', icon: <Receipt className="w-4 h-4" /> },
    { id: 'roi', label: 'ROI Growth', icon: <TrendingUp className="w-4 h-4" /> },
  ];

  // Derived Calculations
  const loanResults = calculateLoanEMI(loanAmount, loanRate, loanYears);
  const compoundResults = calculateCompoundInterest(principal, monthlyDeposit, compoundRate, compoundYears, compoundingFreq);
  const tipResults = calculateTip(billAmount, tipPercent, splitCount);
  const roiResults = calculateROI(roiInitial, roiFinal, roiYears);

  return (
    <div className="w-full flex flex-col gap-5">
      {/* Tool selector pills */}
      <div className={`flex items-center p-1.5 rounded-2xl border overflow-x-auto no-scrollbar ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
      }`}>
        {tools.map((tool) => {
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all flex-1 justify-center whitespace-nowrap ${
                isActive
                  ? 'text-white shadow-md'
                  : isDarkMode
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeFinTool"
                  className="absolute inset-0 bg-indigo-600 rounded-xl"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {tool.icon}
                {tool.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* 1. LOAN EMI CALCULATOR */}
      {activeTool === 'loan' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className={`p-5 rounded-2xl border space-y-4 ${
            isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <h3 className="font-bold text-sm text-slate-300 uppercase tracking-wider mb-2">Loan Parameters</h3>

            {/* Amount */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <label className="text-slate-400">Loan Amount</label>
                <span className="font-mono text-indigo-400">${formatResult(loanAmount)}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="1000000"
                step="5000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <div className="relative mt-1">
                <DollarSign className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Math.max(0, Number(e.target.value)))}
                  className={`w-full pl-8 pr-3 py-1.5 text-xs font-mono rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                    isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>
            </div>

            {/* Rate */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <label className="text-slate-400">Annual Interest Rate</label>
                <span className="font-mono text-indigo-400">{loanRate}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="25"
                step="0.1"
                value={loanRate}
                onChange={(e) => setLoanRate(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Tenure */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <label className="text-slate-400">Tenure (Years)</label>
                <span className="font-mono text-indigo-400">{loanYears} Years</span>
              </div>
              <input
                type="range"
                min="1"
                max="40"
                step="1"
                value={loanYears}
                onChange={(e) => setLoanYears(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Results Summary Card */}
          <div className={`p-6 rounded-2xl border flex flex-col justify-between ${
            isDarkMode 
              ? 'bg-gradient-to-br from-indigo-950/60 to-slate-900 border-indigo-900/40' 
              : 'bg-gradient-to-br from-indigo-50 to-white border-indigo-200 shadow-md'
          }`}>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Monthly Payment</span>
              <div className="text-4xl font-mono font-extrabold text-slate-100 my-2">
                ${formatResult(loanResults.emi)}
                <span className="text-xs text-slate-400 font-sans font-normal ml-1">/ mo</span>
              </div>
            </div>

            <div className="space-y-3 my-4">
              <div className="flex justify-between text-xs py-2 border-b border-indigo-500/10">
                <span className="text-slate-400">Principal Amount</span>
                <span className="font-mono font-semibold">${formatResult(loanAmount)}</span>
              </div>
              <div className="flex justify-between text-xs py-2 border-b border-indigo-500/10">
                <span className="text-slate-400">Total Interest</span>
                <span className="font-mono font-semibold text-rose-400">${formatResult(loanResults.totalInterest)}</span>
              </div>
              <div className="flex justify-between text-xs py-2">
                <span className="text-slate-400">Total Payment</span>
                <span className="font-mono font-bold text-emerald-400">${formatResult(loanResults.totalPayment)}</span>
              </div>
            </div>

            {/* Visual ratio bar */}
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden flex">
              <div 
                style={{ width: `${(loanAmount / Math.max(1, loanResults.totalPayment)) * 100}%` }} 
                className="bg-indigo-500 h-full" 
                title="Principal ratio" 
              />
              <div 
                style={{ width: `${(loanResults.totalInterest / Math.max(1, loanResults.totalPayment)) * 100}%` }} 
                className="bg-rose-500 h-full" 
                title="Interest ratio" 
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500" /> Principal</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> Interest</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. COMPOUND INTEREST CALCULATOR */}
      {activeTool === 'compound' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-5 rounded-2xl border space-y-4 ${
            isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <h3 className="font-bold text-sm text-slate-300 uppercase tracking-wider mb-2">Growth Parameters</h3>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Initial Deposit ($)</label>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(Math.max(0, Number(e.target.value)))}
                className={`w-full px-3 py-1.5 text-xs font-mono rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                  isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Monthly Contribution ($)</label>
              <input
                type="number"
                value={monthlyDeposit}
                onChange={(e) => setMonthlyDeposit(Math.max(0, Number(e.target.value)))}
                className={`w-full px-3 py-1.5 text-xs font-mono rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                  isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Annual Return (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={compoundRate}
                  onChange={(e) => setCompoundRate(Math.max(0, Number(e.target.value)))}
                  className={`w-full px-3 py-1.5 text-xs font-mono rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                    isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Time (Years)</label>
                <input
                  type="number"
                  value={compoundYears}
                  onChange={(e) => setCompoundYears(Math.max(1, Number(e.target.value)))}
                  className={`w-full px-3 py-1.5 text-xs font-mono rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                    isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-2xl border flex flex-col justify-between ${
            isDarkMode 
              ? 'bg-gradient-to-br from-emerald-950/60 to-slate-900 border-emerald-900/40' 
              : 'bg-gradient-to-br from-emerald-50 to-white border-emerald-200 shadow-md'
          }`}>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Future Portfolio Value</span>
              <div className="text-4xl font-mono font-extrabold text-slate-100 my-2">
                ${formatResult(compoundResults.futureValue)}
              </div>
            </div>

            <div className="space-y-3 my-4">
              <div className="flex justify-between text-xs py-2 border-b border-emerald-500/10">
                <span className="text-slate-400">Total Invested</span>
                <span className="font-mono font-semibold">${formatResult(compoundResults.totalInvested)}</span>
              </div>
              <div className="flex justify-between text-xs py-2">
                <span className="text-slate-400">Interest Earned</span>
                <span className="font-mono font-bold text-emerald-400">+${formatResult(compoundResults.totalInterest)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. TIP & SPLITTER CALCULATOR */}
      {activeTool === 'tip' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-5 rounded-2xl border space-y-4 ${
            isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <h3 className="font-bold text-sm text-slate-300 uppercase tracking-wider mb-2">Bill & Tip Setup</h3>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Bill Amount ($)</label>
              <input
                type="number"
                value={billAmount}
                onChange={(e) => setBillAmount(Math.max(0, Number(e.target.value)))}
                className={`w-full px-3 py-1.5 text-xs font-mono rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                  isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Tip Percentage ({tipPercent}%)</label>
              <div className="flex gap-2 my-2">
                {[10, 15, 18, 20, 25].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setTipPercent(pct)}
                    className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-lg border transition-all ${
                      tipPercent === pct
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : isDarkMode
                        ? 'bg-slate-800 border-slate-700 text-slate-300'
                        : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Split Between People ({splitCount})</label>
              <input
                type="range"
                min="1"
                max="20"
                value={splitCount}
                onChange={(e) => setSplitCount(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
          </div>

          <div className={`p-6 rounded-2xl border flex flex-col justify-between ${
            isDarkMode 
              ? 'bg-gradient-to-br from-indigo-950/60 to-slate-900 border-indigo-900/40' 
              : 'bg-gradient-to-br from-indigo-50 to-white border-indigo-200 shadow-md'
          }`}>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Total Per Person</span>
              <div className="text-4xl font-mono font-extrabold text-slate-100 my-2">
                ${formatResult(tipResults.perPerson)}
              </div>
            </div>

            <div className="space-y-3 my-4">
              <div className="flex justify-between text-xs py-2 border-b border-indigo-500/10">
                <span className="text-slate-400">Tip Per Person</span>
                <span className="font-mono font-semibold">${formatResult(tipResults.tipPerPerson)}</span>
              </div>
              <div className="flex justify-between text-xs py-2 border-b border-indigo-500/10">
                <span className="text-slate-400">Total Tip Amount</span>
                <span className="font-mono font-semibold text-indigo-400">${formatResult(tipResults.tipAmount)}</span>
              </div>
              <div className="flex justify-between text-xs py-2">
                <span className="text-slate-400">Grand Total</span>
                <span className="font-mono font-bold text-slate-100">${formatResult(tipResults.totalBill)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. ROI CALCULATOR */}
      {activeTool === 'roi' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-5 rounded-2xl border space-y-4 ${
            isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <h3 className="font-bold text-sm text-slate-300 uppercase tracking-wider mb-2">Investment Metrics</h3>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Initial Investment ($)</label>
              <input
                type="number"
                value={roiInitial}
                onChange={(e) => setRoiInitial(Math.max(0, Number(e.target.value)))}
                className={`w-full px-3 py-1.5 text-xs font-mono rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                  isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Final Value ($)</label>
              <input
                type="number"
                value={roiFinal}
                onChange={(e) => setRoiFinal(Math.max(0, Number(e.target.value)))}
                className={`w-full px-3 py-1.5 text-xs font-mono rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                  isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Investment Horizon (Years)</label>
              <input
                type="number"
                value={roiYears}
                onChange={(e) => setRoiYears(Math.max(1, Number(e.target.value)))}
                className={`w-full px-3 py-1.5 text-xs font-mono rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                  isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>
          </div>

          <div className={`p-6 rounded-2xl border flex flex-col justify-between ${
            isDarkMode 
              ? 'bg-gradient-to-br from-indigo-950/60 to-slate-900 border-indigo-900/40' 
              : 'bg-gradient-to-br from-indigo-50 to-white border-indigo-200 shadow-md'
          }`}>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Total Return (ROI)</span>
              <div className={`text-4xl font-mono font-extrabold my-2 ${
                roiResults.totalRoi >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {roiResults.totalRoi >= 0 ? '+' : ''}{formatResult(roiResults.totalRoi)}%
              </div>
            </div>

            <div className="space-y-3 my-4">
              <div className="flex justify-between text-xs py-2 border-b border-indigo-500/10">
                <span className="text-slate-400">Net Profit</span>
                <span className={`font-mono font-semibold ${roiResults.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ${formatResult(roiResults.netProfit)}
                </span>
              </div>
              <div className="flex justify-between text-xs py-2">
                <span className="text-slate-400">Annualized ROI (CAGR)</span>
                <span className="font-mono font-bold text-slate-100">{formatResult(roiResults.annualizedRoi)}% / yr</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
