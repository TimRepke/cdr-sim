import { I18nString } from './types';
import { YEAR_FIRST, YEAR_LAST } from './util';

export type ResourceKey =
  'CO2_ATMOSPHERE'
  | 'BUDGET';

export interface LedgerEntry {
  consumed: number;
  emitted: number;
  occupied: number;
  net: number;
}

export interface StateVariableStart {
  name: I18nString;
  offset: number;
  isConstant?: boolean;
}

export type StateType = Record<ResourceKey, StateVariable>;

const StateStart: Record<ResourceKey, StateVariableStart> = {
  CO2_ATMOSPHERE: {
    name: {
      EN: 'CO2 in the atmosphere',
    },
    offset: 41340000000, // ~41Gt emitted by 2000 https://github.com/owid/co2-data
  },
  BUDGET: {
    name: {
      EN: 'Budget from CO2 pricing',
    },
    offset: 0,
  },
};

export class StateVariable implements StateVariableStart {
  public name: I18nString;

  public offset: number;

  public isConstant: boolean;

  public ledger: Array<LedgerEntry>;

  constructor(startState: StateVariableStart) {
    this.name = startState.name;
    this.offset = startState.offset;
    this.isConstant = !!startState.isConstant;
    this.ledger = [...Array(((YEAR_LAST - YEAR_FIRST) + 1) * 12)].map(() => ({ net: 0, consumed: 0, emitted: 0, occupied: 0 }));
  }

  getNetAt(idx: number): number | undefined {
    if (idx >= this.ledger.length || idx < 0) return undefined;
    return this.ledger[idx].emitted - this.ledger[idx].consumed;
  }

  getCumAt(idx: number): number | undefined {
    if (idx >= this.ledger.length || idx < 0) return undefined;
    return this.offset + [...Array(idx)].map((i) => this.getNetAt(i) as number).reduce((acc, v) => acc + v);
  }

  logEmission(step: number, amount: number) {
    this.ledger[step].emitted += amount;
    this.ledger[step].net += amount;
  }

  logConsumption(step: number, amount: number) {
    this.ledger[step].consumed += amount;
    this.ledger[step].net -= amount;
  }

  logOccupation(step: number, amount: number) {
    this.ledger[step].occupied += amount;
  }
}

export function getFreshState(): Record<ResourceKey, StateVariable> {
  return Object.fromEntries(
    Object.entries(StateStart).map((entry) => {
      const [key, variable] = entry;
      return [key as ResourceKey, new StateVariable(variable)];
    }),
  ) as Record<ResourceKey, StateVariable>;
}
