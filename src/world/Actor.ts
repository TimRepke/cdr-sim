import { I18nString } from './types';
import { ResourceKey } from './State';
import { YEAR_FIRST, YEAR_LAST } from './util';

export type ScenarioCompressed = Record<ActorKey, ActorCompressed>;
export type Scenario = Record<ActorKey, Actor>;

export type ActorKey =
  'HOUSING'
  | 'CO2_EMITTER' // This is "the rest"
  | 'FARMING'
  | 'FORESTRY'
  | 'EU_ETS';

// Per resource (StateKey) a time series of that resource (one per month)
export type ActorTimeSeries = Partial<Record<ResourceKey, Array<number>>>;

// Per resource (StateKey), a set of fixpoints (year) with respective value -> for interpolation during runtime
export type ActorTimeSeriesCompressed = Partial<Record<ResourceKey, Record<string, number>>>;

interface ActorBase {
  // Display name for this actor
  name: I18nString;
  info?: I18nString;
  // The unit of measure (e.g. a forest is measured in acres)
  unit?: I18nString;
  // How much/many we have of this actor (pretty much just a factor)
  factor?: number;
}

export interface Actor extends ActorBase {
  /**
   * An actor is a mechanism, industry, factory, or technology that is part of the simulated system.
   * It has a set of resources it "consumes" and "emits", for example a Biochar plant that consumes
   * electricity and biomass to produce heat and biomass.
   * These are scaled by the quantity (e.g. acres of land or number of DAC plants), which is attached to a growth rate.
   *
   */

  // How much of a resource this actor "consumes" per step (e.g. a forest takes CO2 from the air)
  consumes?: ActorTimeSeries;
  // How much of a resource this actor "emits" per step (e.g. a forest produces wood)
  emits?: ActorTimeSeries;
  // How much of a resource this actor "occupies" (e.g. a forest takes space)
  occupies?: ActorTimeSeries;
}

export interface ActorCompressed extends ActorBase {
  // How much of a resource this actor "consumes" per step (e.g. a forest takes CO2 from the air)
  consumes?: ActorTimeSeriesCompressed;
  // How much of a resource this actor "emits" per step (e.g. a forest produces wood)
  emits?: ActorTimeSeriesCompressed;
  // How much of a resource this actor "occupies" (e.g. a forest takes space)
  occupies?: ActorTimeSeriesCompressed;
}

function interpolate(v1: number, v2: number, steps: number): Array<number> {
  const stepSize = (v2 - v1) / steps;
  // @ts-ignore
  return [...Array(steps)].map((v, i) => v1 + (stepSize * i));
}

function prepareTimeSeries(data: ActorTimeSeriesCompressed): ActorTimeSeries {
  /**
   * Uncompress a time series provided in the form of a few values for a few years into
   * a full array of length (2100-2000)*12 (monthly value for the 100 years in the observed timeframe)
   *
   * For example:
   * {
   *   "SOMETHING": {
   *     "2000": 10,
   *     "2002": 46
   *   }
   * }
   *
   * becomes
   * {
   *   "SOMETHING": [10,11,12,13,...46]
   * }
   *
   * If the first entry is > 2000, the value for 2000 will be assumed to be the same as for the first year in the series
   * If the last entry is < 2100, the value for 2100 will be assumed to be the same as for the last year in the series
   */
  return Object.fromEntries(
    Object.entries(data).map(
      (entry) => {
        const [resourceKey, fixpoints] = entry;
        const years = Object.keys(fixpoints).map((yr) => parseInt(yr, 10));
        years.sort((a, b) => a - b);
        if (years[0] > YEAR_FIRST) {
          fixpoints[YEAR_FIRST] = fixpoints[years[0]];
          years.unshift(YEAR_FIRST);
        }

        const lastIdx = years.length - 1;

        return [
          resourceKey,
          years.flatMap((year, idx) => {
            const nextYear = (idx < lastIdx) ? years[idx + 1] : YEAR_LAST + 1;
            const nextValue = (nextYear in fixpoints) ? fixpoints[nextYear] : fixpoints[years[lastIdx]];
            const numSteps = (nextValue - year) * 12;
            return interpolate(fixpoints[year], nextValue, numSteps);
          }),
        ];
      },
    ),
  );
}

export function loadActor(actor: ActorCompressed): Actor {
  const { consumes, emits, occupies } = actor;
  const retActor = actor as Actor;
  if (consumes) {
    retActor.consumes = prepareTimeSeries(consumes);
  }
  if (emits) {
    retActor.emits = prepareTimeSeries(emits);
  }
  if (occupies) {
    retActor.occupies = prepareTimeSeries(occupies);
  }
  return actor as Actor;
}

export function loadScenario(scenario: ScenarioCompressed): Scenario {
  return Object.fromEntries(
    Object.entries(scenario).map(
      (entry) => {
        const [actorKey, actor] = entry;
        return [actorKey, loadActor(actor)];
      },
    ),
  ) as Scenario;
}
