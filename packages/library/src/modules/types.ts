import type { DeepRequired } from '#rt/utils/types';
import type { AnimationEl, AnimationTimeRandom } from './animation/types';

type AnimationBaseOptions = Omit<AnimationEl, 'el' | 'duration' | 'delay'> & {
  duration?: AnimationTimeRandom | number;
  delay?: AnimationTimeRandom | number;
};

export type AnimationOptions = Partial<AnimationBaseOptions>;
export type AnimationInOptions = AnimationOptions & {
  beforeClass?: string;
};

type EntityAnimationOptions = {
  elSelector?: string;
  in?: AnimationInOptions;
  out?: AnimationOptions;
};

type RouteTransitionBaseOptions = {
  linkSelector?: string;
  contentSelector?: string;
};

export type RouteTransitionOptions = {
  animation?: EntityAnimationOptions;
} & RouteTransitionBaseOptions;

export type RouteTransitionOptionsWithDefaults = DeepRequired<RouteTransitionOptions>;

export type AnimationPhase = 'in' | 'out';

export type AnimationElOptions = Omit<Partial<AnimationEl>, 'el'> & {
  el: HTMLElement;
};
export type AnimationsParallelOptions = Array<AnimationElOptions>;
export type AnimationStepOptions = {
  animation?: AnimationElOptions;
  all?: AnimationsParallelOptions;
};
export type AnimationProcessOptions = Array<AnimationStepOptions>;

export type ProcessEvent = {
  animatedEls: Array<HTMLElement>;
  phase: AnimationPhase;
};

export type ContentData = {
  contentElement: HTMLElement;
  documentTitle: string | null;
};

export interface IRouteTransition {
  /**
   * attach all required listeners
   */
  run(): void;

  /**
   * detach all required listeners
   */
  destroy(): void;

  setProcess(process?: AnimationProcessOptions): void;

  getPhase(): void;
}
