import { AnimationPhase } from './types';

export * from './animation/errors';
export * from './content-loader/errors';
export * from './router/errors';

export class ContentElementNotFoundError extends Error {
  public selector: string;
  public phase: AnimationPhase;

  constructor(selector: string, phase: AnimationPhase) {
    super(`Content not found by selector ${selector} in phase ${phase}`);

    this.name = this.constructor.name;

    this.selector = selector;
    this.phase = phase;
  }
}
