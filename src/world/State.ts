import { I18nString } from './types';
import { YEAR_FIRST, YEAR_LAST } from './util';

export type ResourceKey =
  'CO2_ATMOSPHERE'
  | 'BUDGET';

export interface LedgerEntry {
  net: number;
  consumed: number;
  emitted: number;
  occupied: number;
}

export interface StateVariable {
  name: I18nString,
  ledger: Array<LedgerEntry>,
  offset: number,
  isConstant?: boolean,
}

const StateStart: Record<ResourceKey, StateVariable> = {
  CO2_ATMOSPHERE: {
    name: {
      EN: 'CO2 in the atmosphere',
    },
    offset: 41340000000, // ~41Gt emitted by 2000 https://github.com/owid/co2-data
    ledger: [],
  },
  BUDGET: {
    name: {
      EN: 'Budget from CO2 pricing',
    },
    offset: 0,
    ledger: [],
  },
};

export function getFreshState(): Record<ResourceKey, StateVariable> {
  return Object.fromEntries(
    Object.entries(StateStart).map((entry) => {
      const [key, variable] = entry;
      variable.ledger = [...Array(((YEAR_LAST - YEAR_FIRST) + 1) * 12)]
        .map(() => ({ net: 0, consumed: 0, emitted: 0, occupied: 0 }));
      return [key as ResourceKey, variable];
    }),
  ) as Record<ResourceKey, StateVariable>;
}
