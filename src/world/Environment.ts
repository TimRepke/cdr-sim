import { ResourceKey, getFreshState, StateVariable } from './State';
import { ActorKey, Actor, loadScenario, ScenarioCompressed } from './Actor';
import { idx2ym } from './util';

// eslint-disable-next-line import/prefer-default-export
export class Environment {
  private stepIdx: number;

  public actors: Record<ActorKey, Actor>;

  private state: Record<ResourceKey, StateVariable>;

  constructor(scenario: ScenarioCompressed) {
    this.stepIdx = 0;
    this.state = getFreshState();
    this.actors = loadScenario(scenario);
  }

  get currentStepIdx(): number {
    return this.stepIdx;
  }

  get currentYearMonth(): [number, number] {
    return idx2ym(this.stepIdx);
  }

  get currentState(): Record<ResourceKey, StateVariable> {
    return this.state;
  }

  step() {
    Object.values(this.actors).forEach((actor) => {
      const { consumes, emits, occupies } = actor;
      let { factor } = actor;
      if (factor === undefined) factor = 1;
      if (emits) {
        Object.entries(emits).forEach((entry) => {
          const [key, amounts] = entry;
          this.state[key as ResourceKey].logEmission(this.stepIdx, amounts[this.stepIdx] * (factor as number));
        });
      }
      if (consumes) {
        Object.entries(consumes).forEach((entry) => {
          const [key, amounts] = entry;
          this.state[key as ResourceKey].logConsumption(this.stepIdx, amounts[this.stepIdx] * (factor as number));
        });
      }
      if (occupies) {
        Object.entries(occupies).forEach((entry) => {
          const [key, amounts] = entry;
          this.state[key as ResourceKey].logOccupation(this.stepIdx, amounts[this.stepIdx] * (factor as number));
        });
      }
    });

    this.stepIdx += 1;
  }

  logSpecial(event: SpecialEvent) {
    const { consumes, emits, occupies } = event;
    if (emits) {
      Object.entries(emits).forEach((entry) => {
        const [key, amount] = entry;
        this.state[key as ResourceKey].logEmission(this.stepIdx, amount);
      });
    }
    if (consumes) {
      Object.entries(consumes).forEach((entry) => {
        const [key, amount] = entry;
        this.state[key as ResourceKey].logEmission(this.stepIdx, amount);
      });
    }
    if (occupies) {
      Object.entries(occupies).forEach((entry) => {
        const [key, amount] = entry;
        this.state[key as ResourceKey].logOccupation(this.stepIdx, amount);
      });
    }
  }
}

export interface SpecialEvent {
  name: string;
  description: string;
  consumes?: Partial<Record<ResourceKey, number>>;
  emits?: Partial<Record<ResourceKey, number>>;
  occupies?: Partial<Record<ResourceKey, number>>;
}
