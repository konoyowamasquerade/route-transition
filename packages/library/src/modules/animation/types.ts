import type { Range } from '#rt/utils/types';

export type AnimationTimeRandom = Range;

interface AnimationElBase {
  el: HTMLElement;
  duration?: AnimationTimeRandom | number;
  delay?: AnimationTimeRandom | number;
}

export interface AnimationEl extends AnimationElBase {
  class: string;
}

export type AnimationElDetermined = Omit<AnimationEl, 'duration' | 'delay'> & {
  duration?: number;
  delay?: number;
};

export type AnimationsParallel = Array<AnimationEl>;
export type AnimationStep = {
  animation?: AnimationEl;
  all?: AnimationsParallel;
};
export type AnimationProcess = Array<AnimationStep>;

export type AnimationOptions = {
  process?: AnimationProcess;
};

export type AnimationElEvent = {
  el: HTMLElement;
};

export interface IAnimation {
  animate(): Promise<void>;
  clearImmediate(): void;
}
