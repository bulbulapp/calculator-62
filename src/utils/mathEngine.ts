import { AngleMode, ConverterCategory, UnitDefinition } from '../types';

/**
 * Precision formatter for math results
 */
export function formatResult(num: number): string {
  if (isNaN(num)) return 'Error';
  if (!isFinite(num)) return num > 0 ? '∞' : '-∞';

  // Handle zero
  if (Math.abs(num) < 1e-12 && num !== 0) return '0';

  // For very large or very small numbers, use scientific notation
  const absVal = Math.abs(num);
  if ((absVal >= 1e12 || absVal < 1e-6) && absVal !== 0) {
    return num.toExponential(6).replace(/\.?0+e/, 'e');
  }

  // Format with standard commas for integer part, max 8 decimal places
  const fixedStr = parseFloat(num.toFixed(8)).toString();
  const parts = fixedStr.split('.');
  
  // Format integer part with commas
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  return parts.join('.');
}

/**
 * Calculates factorial n!
 */
export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n === 0 || n === 1) return 1;
  if (n > 170) return Infinity; // Prevent overflow
  let res = 1;
  for (let i = 2; i <= n; i++) {
    res *= i;
  }
  return res;
}

/**
 * Safe expression evaluator for Standard & Scientific modes
 */
export function evaluateExpression(expr: string, angleMode: AngleMode = 'RAD'): { result: number; formatted: string; error?: string } {
  try {
    if (!expr || expr.trim() === '') return { result: 0, formatted: '0' };

    // Clean expression string
    let sanitized = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, 'Math.PI')
      .replace(/e(?![a-zA-Z0-9_])/g, 'Math.E')
      .replace(/√\(([^)]+)\)/g, 'Math.sqrt($1)')
      .replace(/√(\d+(\.\d+)?)/g, 'Math.sqrt($1)');

    // Handle percent calculations (e.g. 50 + 10% -> 50 + 5)
    // Replace standalone % or number%
    sanitized = sanitized.replace(/(\d+(\.\d+)?)%/g, '($1/100)');

    // Handle Factorials x!
    sanitized = sanitized.replace(/(\d+)!/g, (_, n) => `factorial(${n})`);

    // Handle implicit multiplication like 2(3+4) or 5Math.PI
    sanitized = sanitized.replace(/(\d+)\s*\(/g, '$1*(');
    sanitized = sanitized.replace(/\)\s*(\d+)/g, ')*$1');
    sanitized = sanitized.replace(/(\d+)\s*Math\./g, '$1*Math.');

    // Trigonometric functions according to Radian / Degree mode
    const isDeg = angleMode === 'DEG';
    const toRad = isDeg ? '(Math.PI/180)*' : '';
    const fromRad = isDeg ? '*(180/Math.PI)' : '';

    sanitized = sanitized
      .replace(/asin\(/g, `((${fromRad}Math.asin(`)
      .replace(/acos\(/g, `((${fromRad}Math.acos(`)
      .replace(/atan\(/g, `((${fromRad}Math.atan(`)
      .replace(/sin\(/g, `Math.sin(${toRad}`)
      .replace(/cos\(/g, `Math.cos(${toRad}`)
      .replace(/tan\(/g, `Math.tan(${toRad}`)
      .replace(/log10\(/g, 'Math.log10(')
      .replace(/ln\(/g, 'Math.log(')
      .replace(/abs\(/g, 'Math.abs(');

    // Replace exponent operator ^ with Math.pow
    // Simple power replacement: a^b -> Math.pow(a, b)
    while (sanitized.includes('^')) {
      sanitized = sanitized.replace(/([a-zA-Z0-9_.]+|\([^\(\)]+\))\^([a-zA-Z0-9_.]+|\([^\(\)]+\))/, 'Math.pow($1,$2)');
    }

    // Context execution
    const evalFunc = new Function('factorial', `
      "use strict";
      return (${sanitized});
    `);

    const rawResult = evalFunc(factorial);

    if (typeof rawResult !== 'number' || isNaN(rawResult)) {
      return { result: NaN, formatted: 'Error', error: 'Invalid operation' };
    }

    return {
      result: rawResult,
      formatted: formatResult(rawResult)
    };
  } catch (err) {
    return {
      result: NaN,
      formatted: 'Error',
      error: (err as Error)?.message || 'Syntax Error'
    };
  }
}

/**
 * Financial Calculators logic
 */

// Loan EMI
export function calculateLoanEMI(principal: number, annualRate: number, years: number) {
  if (principal <= 0 || annualRate <= 0 || years <= 0) {
    return { emi: 0, totalPayment: 0, totalInterest: 0 };
  }
  const monthlyRate = annualRate / 12 / 100;
  const totalMonths = years * 12;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  const totalPayment = emi * totalMonths;
  const totalInterest = totalPayment - principal;

  return { emi, totalPayment, totalInterest };
}

// Compound Interest
export function calculateCompoundInterest(principal: number, monthlyDeposit: number, annualRate: number, years: number, frequency: number = 12) {
  if (principal < 0 || years <= 0) return { futureValue: 0, totalInvested: 0, totalInterest: 0 };
  
  const r = annualRate / 100;
  const n = frequency;
  const t = years;

  // Principal growth
  const compoundPrincipal = principal * Math.pow(1 + r / n, n * t);

  // Future value of monthly contributions
  let compoundDeposits = 0;
  const totalMonths = years * 12;
  const monthlyRate = annualRate / 12 / 100;

  if (monthlyDeposit > 0 && monthlyRate > 0) {
    compoundDeposits = monthlyDeposit * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
  } else if (monthlyDeposit > 0) {
    compoundDeposits = monthlyDeposit * totalMonths;
  }

  const futureValue = compoundPrincipal + compoundDeposits;
  const totalInvested = principal + (monthlyDeposit * totalMonths);
  const totalInterest = futureValue - totalInvested;

  return { futureValue, totalInvested, totalInterest };
}

// Tip & Splitter
export function calculateTip(bill: number, tipPct: number, people: number) {
  const count = Math.max(1, people);
  const tipAmount = bill * (tipPct / 100);
  const totalBill = bill + tipAmount;
  const perPerson = totalBill / count;
  const tipPerPerson = tipAmount / count;

  return { tipAmount, totalBill, perPerson, tipPerPerson };
}

// ROI Calculator
export function calculateROI(initial: number, finalVal: number, years: number) {
  if (initial <= 0) return { totalRoi: 0, annualizedRoi: 0, netProfit: 0 };

  const netProfit = finalVal - initial;
  const totalRoi = (netProfit / initial) * 100;
  const annualizedRoi = years > 0 ? (Math.pow(finalVal / initial, 1 / years) - 1) * 100 : 0;

  return { totalRoi, annualizedRoi, netProfit };
}

/**
 * Unit & Currency Units Map
 */
export const UNIT_CATEGORIES: Record<ConverterCategory, { label: string; units: UnitDefinition[] }> = {
  length: {
    label: 'Length',
    units: [
      { id: 'm', name: 'Meters', symbol: 'm', ratio: 1 },
      { id: 'km', name: 'Kilometers', symbol: 'km', ratio: 1000 },
      { id: 'cm', name: 'Centimeters', symbol: 'cm', ratio: 0.01 },
      { id: 'mm', name: 'Millimeters', symbol: 'mm', ratio: 0.001 },
      { id: 'mile', name: 'Miles', symbol: 'mi', ratio: 1609.344 },
      { id: 'yard', name: 'Yards', symbol: 'yd', ratio: 0.9144 },
      { id: 'foot', name: 'Feet', symbol: 'ft', ratio: 0.3048 },
      { id: 'inch', name: 'Inches', symbol: 'in', ratio: 0.0254 },
    ]
  },
  weight: {
    label: 'Weight',
    units: [
      { id: 'kg', name: 'Kilograms', symbol: 'kg', ratio: 1 },
      { id: 'g', name: 'Grams', symbol: 'g', ratio: 0.001 },
      { id: 'mg', name: 'Milligrams', symbol: 'mg', ratio: 0.000001 },
      { id: 'lb', name: 'Pounds', symbol: 'lbs', ratio: 0.45359237 },
      { id: 'oz', name: 'Ounces', symbol: 'oz', ratio: 0.028349523125 },
      { id: 'ton', name: 'Metric Tons', symbol: 't', ratio: 1000 },
    ]
  },
  temperature: {
    label: 'Temperature',
    units: [
      { id: 'c', name: 'Celsius', symbol: '°C', ratio: 1 },
      { id: 'f', name: 'Fahrenheit', symbol: '°F', ratio: 1 },
      { id: 'k', name: 'Kelvin', symbol: 'K', ratio: 1 },
    ]
  },
  area: {
    label: 'Area',
    units: [
      { id: 'sqm', name: 'Square Meters', symbol: 'm²', ratio: 1 },
      { id: 'sqkm', name: 'Square Kilometers', symbol: 'km²', ratio: 1000000 },
      { id: 'sqft', name: 'Square Feet', symbol: 'ft²', ratio: 0.09290304 },
      { id: 'acre', name: 'Acres', symbol: 'ac', ratio: 4046.8564224 },
      { id: 'hectare', name: 'Hectares', symbol: 'ha', ratio: 10000 },
    ]
  },
  speed: {
    label: 'Speed',
    units: [
      { id: 'kmh', name: 'Km / Hour', symbol: 'km/h', ratio: 1 },
      { id: 'mph', name: 'Miles / Hour', symbol: 'mph', ratio: 1.609344 },
      { id: 'ms', name: 'Meters / Second', symbol: 'm/s', ratio: 3.6 },
      { id: 'knot', name: 'Knots', symbol: 'kn', ratio: 1.852 },
    ]
  },
  volume: {
    label: 'Volume',
    units: [
      { id: 'l', name: 'Liters', symbol: 'L', ratio: 1 },
      { id: 'ml', name: 'Milliliters', symbol: 'mL', ratio: 0.001 },
      { id: 'gal', name: 'US Gallons', symbol: 'gal', ratio: 3.78541 },
      { id: 'cup', name: 'US Cups', symbol: 'cup', ratio: 0.236588 },
      { id: 'floz', name: 'US Fluid Ounces', symbol: 'fl oz', ratio: 0.0295735 },
    ]
  },
  currency: {
    label: 'Currency',
    units: [
      { id: 'USD', name: 'US Dollar', symbol: '$', ratio: 1 },
      { id: 'EUR', name: 'Euro', symbol: '€', ratio: 1.08 },
      { id: 'GBP', name: 'British Pound', symbol: '£', ratio: 1.27 },
      { id: 'JPY', name: 'Japanese Yen', symbol: '¥', ratio: 0.0067 },
      { id: 'CAD', name: 'Canadian Dollar', symbol: 'C$', ratio: 0.74 },
      { id: 'AUD', name: 'Australian Dollar', symbol: 'A$', ratio: 0.65 },
      { id: 'CHF', name: 'Swiss Franc', symbol: 'CHF', ratio: 1.13 },
      { id: 'INR', name: 'Indian Rupee', symbol: '₹', ratio: 0.012 },
    ]
  }
};

export function convertUnits(val: number, category: ConverterCategory, fromId: string, toId: string): number {
  if (isNaN(val)) return 0;
  if (fromId === toId) return val;

  // Temperature special cases
  if (category === 'temperature') {
    let celsius = val;
    if (fromId === 'f') celsius = (val - 32) * (5 / 9);
    if (fromId === 'k') celsius = val - 273.15;

    if (toId === 'c') return celsius;
    if (toId === 'f') return celsius * (9 / 5) + 32;
    if (toId === 'k') return celsius + 273.15;
    return celsius;
  }

  const categoryDef = UNIT_CATEGORIES[category];
  if (!categoryDef) return 0;

  const fromUnit = categoryDef.units.find(u => u.id === fromId);
  const toUnit = categoryDef.units.find(u => u.id === toId);

  if (!fromUnit || !toUnit) return 0;

  // Convert to base unit then to target unit
  const baseVal = val * fromUnit.ratio;
  return baseVal / toUnit.ratio;
}
