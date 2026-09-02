export type CalculatorMode = 'standard' | 'scientific' | 'financial' | 'converter';

export type AngleMode = 'RAD' | 'DEG';

export interface HistoryItem {
  id: string;
  timestamp: string; // ISO or formatted time
  expression: string;
  result: string;
  mode: CalculatorMode;
}

export type ButtonType = 'number' | 'operator' | 'action' | 'function' | 'accent' | 'memory';

export interface KeypadButton {
  label: string;
  action: string;
  type: ButtonType;
  value?: string;
  hotkey?: string;
  gridSpan?: number;
  rowSpan?: number;
  secondary?: string;
  tooltip?: string;
}

export type FinancialTool = 'loan' | 'compound' | 'tip' | 'roi';

export type ConverterCategory = 'length' | 'weight' | 'temperature' | 'area' | 'speed' | 'volume' | 'currency';

export interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  ratio: number; // relative to base unit in category
}

export interface LoanInput {
  amount: number;
  rate: number; // annual percentage
  years: number;
}

export interface CompoundInput {
  principal: number;
  monthlyContribution: number;
  rate: number; // annual rate %
  years: number;
  frequency: number; // compounds per year
}

export interface TipInput {
  billAmount: number;
  tipPercent: number;
  splitCount: number;
}

export interface RoiInput {
  initialInvestment: number;
  finalValue: number;
  years: number;
}
