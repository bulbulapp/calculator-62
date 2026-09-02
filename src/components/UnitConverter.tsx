import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ConverterCategory } from '../types';
import { UNIT_CATEGORIES, convertUnits, formatResult } from '../utils/mathEngine';
import { 
  ArrowRightLeft, 
  Ruler, 
  Scale, 
  Thermometer, 
  Square, 
  Gauge, 
  Box, 
  Coins 
} from 'lucide-react';

interface UnitConverterProps {
  isDarkMode: boolean;
}

export const UnitConverter: React.FC<UnitConverterProps> = ({ isDarkMode }) => {
  const [category, setCategory] = useState<ConverterCategory>('length');
  const [inputValue, setInputValue] = useState<number>(10);

  const categoryDef = UNIT_CATEGORIES[category];
  const defaultFrom = categoryDef.units[0]?.id || '';
  const defaultTo = categoryDef.units[1]?.id || categoryDef.units[0]?.id || '';

  const [fromUnit, setFromUnit] = useState<string>(defaultFrom);
  const [toUnit, setToUnit] = useState<string>(defaultTo);

  // Handle category change -> reset units
  const handleCategoryChange = (newCat: ConverterCategory) => {
    setCategory(newCat);
    const newDef = UNIT_CATEGORIES[newCat];
    setFromUnit(newDef.units[0]?.id || '');
    setToUnit(newDef.units[1]?.id || newDef.units[0]?.id || '');
  };

  const handleSwap = () => {
    const prevFrom = fromUnit;
    setFromUnit(toUnit);
    setToUnit(prevFrom);
  };

  const categories: { id: ConverterCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'length', label: 'Length', icon: <Ruler className="w-4 h-4" /> },
    { id: 'weight', label: 'Weight', icon: <Scale className="w-4 h-4" /> },
    { id: 'temperature', label: 'Temp', icon: <Thermometer className="w-4 h-4" /> },
    { id: 'area', label: 'Area', icon: <Square className="w-4 h-4" /> },
    { id: 'speed', label: 'Speed', icon: <Gauge className="w-4 h-4" /> },
    { id: 'volume', label: 'Volume', icon: <Box className="w-4 h-4" /> },
    { id: 'currency', label: 'Currency', icon: <Coins className="w-4 h-4" /> },
  ];

  const convertedResult = convertUnits(inputValue, category, fromUnit, toUnit);

  const fromUnitObj = categoryDef.units.find((u) => u.id === fromUnit);
  const toUnitObj = categoryDef.units.find((u) => u.id === toUnit);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Category Selection Tabs */}
      <div className={`flex items-center p-1.5 rounded-2xl border overflow-x-auto no-scrollbar ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
      }`}>
        {categories.map((cat) => {
          const isActive = category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all flex-1 justify-center whitespace-nowrap ${
                isActive
                  ? 'text-white shadow-md'
                  : isDarkMode
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeConverterCat"
                  className="absolute inset-0 bg-indigo-600 rounded-xl"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                {cat.icon}
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Converter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
        {/* FROM Card */}
        <div className={`md:col-span-5 p-5 rounded-2xl border ${
          isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">Convert From</label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(Number(e.target.value))}
            className={`w-full text-2xl font-mono font-bold py-2 px-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500/40 mb-3 ${
              isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          />
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className={`w-full py-2 px-3 rounded-xl border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${
              isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            {categoryDef.units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.symbol})
              </option>
            ))}
          </select>
        </div>

        {/* SWAP BUTTON */}
        <div className="md:col-span-1 flex justify-center">
          <button
            onClick={handleSwap}
            className={`p-3 rounded-2xl border transition-all hover:scale-105 active:scale-95 shadow-md ${
              isDarkMode
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-400/40 shadow-indigo-600/20'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-500 shadow-indigo-500/20'
            }`}
            title="Swap Units"
          >
            <ArrowRightLeft className="w-5 h-5" />
          </button>
        </div>

        {/* TO Card */}
        <div className={`md:col-span-5 p-5 rounded-2xl border ${
          isDarkMode 
            ? 'bg-gradient-to-br from-indigo-950/60 to-slate-900 border-indigo-900/40' 
            : 'bg-gradient-to-br from-indigo-50 to-white border-indigo-200 shadow-md'
        }`}>
          <label className="text-xs font-bold uppercase tracking-wider text-indigo-400 block mb-2">Converted Result</label>
          <div className="text-2xl font-mono font-extrabold text-slate-100 py-2 px-3 rounded-xl bg-slate-950/40 border border-slate-800/40 mb-3 truncate">
            {formatResult(convertedResult)} {toUnitObj?.symbol}
          </div>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className={`w-full py-2 px-3 rounded-xl border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${
              isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            {categoryDef.units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.symbol})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Conversion Rate Summary Footer */}
      <div className={`p-4 rounded-xl border text-xs font-mono flex items-center justify-between ${
        isDarkMode ? 'bg-slate-900/60 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
      }`}>
        <span>Rate Equation</span>
        <span className="font-bold text-indigo-400">
          1 {fromUnitObj?.symbol} = {formatResult(convertUnits(1, category, fromUnit, toUnit))} {toUnitObj?.symbol}
        </span>
      </div>
    </div>
  );
};
