import { StateKey, State } from './State';
import type { StateVariable } from './State';
import { ActorKey, Actor } from './Actor.ts';

class Environment {
  private isLoopStopped: boolean;

  private stepIdx: number;

  public updateSpeed: number;

  private state: Record<StateKey, StateVariable>;

  private actors: Record<ActorKey, Actor>;

  private start: number = 2000;

  constructor(updateSpeed: number, scenarioData:) {
    this.isLoopStopped = false;
    this.updateSpeed = updateSpeed;
    this.state = State;
    this.actors = [new Actor({})];
  }

  get stepYearMonth(): [number, number] {
    const yearOffset = Math.floor(this.stepIdx / 12);
    const month = this.stepIdx % 12;
    return [this.start + yearOffset, month + 1];
  }

  step() {
    Object.values(this.actors).forEach((actor) => {
      Object.entries(actor.emits).forEach((entry) => {
        const [key, amounts] = entry;
        this.state[key]
      });
    });
  }

  startLoop() {

  }

  stopLoop() {
    this.isLoopStopped = true;
  }
}
