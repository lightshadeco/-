
export enum CurtainType {
  TRIPLE_PLEAT = '三折簾',
  S_FOLD = '無接縫蛇行簾',
  SQUARE_FEET = '才數類'
}

export interface CalculationResult {
  fabricWidthChi: number;
  fabricWidthFu: number;
  fabricWidthYards?: number;
  totalPrice: number;
  details: {
    label: string;
    value: number;
  }[];
}

export interface TriplePleatState {
  unitPrice: number;
  width: number;
  height: number;
  multiplier: number;
  isSeamless: boolean;
  hasShaping: boolean;
  hasHooks: boolean;
  hasTieBack: boolean;
  hasLeadWeight: boolean;
}

export interface SFoldState {
  unitPrice: number;
  width: number;
  height: number;
  multiplier: number;
  hookDistance: number;
  isDouble: boolean;
  hasShaping: boolean;
  hasHooks: boolean;
  hasTieBack: boolean;
  hasLeadWeight: boolean;
}

export interface SquareFeetState {
  unitPrice: number;
  width: number;
  height: number;
}
