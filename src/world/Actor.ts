import { I18nString } from './types';
import { StateKey } from './State';

export type ActorKey =
  'HOUSING'
  | 'CO2_EMITTER' // This is "the rest"
  | 'FARMING'
  | 'FORESTRY'
  | 'EU_ETS';

export interface ActorScenario {
  name: I18nString;
  info?: I18nString;
  unit?: I18nString;
  factor?: number;
  consumes?: Partial<Record<StateKey, Record<string, Array<number> | number>>>;
  emits?: Partial<Record<StateKey, Record<string, Array<number> | number>>>;
  occupies?: Partial<Record<StateKey, Record<string, Array<number> | number>>>;
}

export class Actor {
  /**
   * An actor is a mechanism, industry, factory, or technology that is part of the simulated system.
   * It has a set of resources it "consumes" and "emits", for example a Biochar plant that consumes
   * electricity and biomass to produce heat and biomass.
   * These are scaled by the quantity (e.g. acres of land or number of DAC plants), which is attached to a growth rate.
   *
   */

    // Display name for this actor
  name: I18nString;
  info: I18nString;

  // The unit of measure (e.g. a forest is measured in acres)
  unit: I18nString;
  // How much/many we have of this actor (pretty much just a factor)
  factor: number;

  // How much of a resource this actor "consumes" per step (e.g. a forest takes CO2 from the air)
  consumes: Record<StateKey, Array<number> | number>;
  // How much of a resource this actor "emits" per step (e.g. a forest produces wood)
  emits: Record<StateKey, Array<number> | number>;
  // How much of a resource this actor "occupies" (e.g. a forest takes space)
  occupies: Record<StateKey, Array<number> | number>;

  constructor(scenario: ActorScenario) {
    this.factor = (!scenario.factor && scenario.factor !== 0) ? 1.0 : scenario.factor;
    this.unit = (!scenario.unit) ? {} : scenario.unit;
    this.name = (!scenario.name) ? {} : scenario.name;
  }
}

function interpolate(v1: number, v2: number, steps: number): Array<number> {
  const stepSize = (v2 - v1) / steps;
  return [...Array(steps)].map((v, i) => v1 + (stepSize * i));
}
