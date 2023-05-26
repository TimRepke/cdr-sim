import { I18nString } from './types';

export type StateKey =
  'CO2_ATMOSPHERE'
  | 'BUDGET';

export interface LedgerEntry {
  net: number;
  in: number;
  out: number;
}

export interface StateVariable {
  name: I18nString,
  ledger: Array<LedgerEntry>,
  isConstant?: boolean,
}

export const State: Record<StateKey, StateVariable> = {
  CO2_ATMOSPHERE: {
    name: {
      EN: 'CO2 in the atmosphere',
    },
    ledger: [{ net: 41340000000, in: 0, out: 0 }], // ~41Gt emitted by 2000 https://github.com/owid/co2-data
  },
  BUDGET: {
    name: {
      EN: 'Budget from CO2 pricing',
    },
    ledger: [{ net: 0, in: 0, out: 0 }],
  },
};
