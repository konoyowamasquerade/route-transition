import { deepCopyObject, fillWithDefault } from '#rt/utils/object';

import type { AnimationEl, AnimationProcess, AnimationsParallel } from './animation/types';
import type {
  RouteTransitionOptions,
  RouteTransitionOptionsWithDefaults,
  AnimationProcessOptions,
  AnimationElOptions,
  AnimationOptions,
  AnimationPhase,
} from './types';
import { DEFAULT_OPTIONS } from './constants';

export function getOptionsFilledWithDefaults(options?: RouteTransitionOptions) {
  const _options: RouteTransitionOptions = deepCopyObject<RouteTransitionOptions>(
    options ?? ({} as RouteTransitionOptions),
  );

  fillWithDefault(_options, DEFAULT_OPTIONS);

  return _options as RouteTransitionOptionsWithDefaults;
}

function getFilledAnimationWithDefault(
  animation: AnimationElOptions,
  animationDefault: AnimationOptions,
) {
  return {
    el: animation.el,
    class: animation.class ?? animationDefault.class,
    duration: animation.duration ?? animationDefault.duration,
    delay: animation.delay ?? animationDefault.delay,
  } as AnimationEl;
}

export function getFilledProcessWithDefault(
  process: AnimationProcessOptions,
  animationDefault: AnimationOptions,
) {
  const newProcess: AnimationProcess = [];

  process.forEach((step) => {
    if (step?.animation) {
      const animationWithDefaults = getFilledAnimationWithDefault(step.animation, animationDefault);
      newProcess.push({ animation: animationWithDefaults });
    } else if (Array.isArray(step?.all)) {
      const all: AnimationsParallel = [];
      step.all.forEach((animation) => {
        const animationWithDefaults = getFilledAnimationWithDefault(animation, animationDefault);
        all.push(animationWithDefaults);
      });
      newProcess.push({ all });
    }
  });
  return newProcess;
}

export function formDefaultProcess({
  els,
  options,
  phase,
}: {
  els: Array<HTMLElement>;
  options: RouteTransitionOptionsWithDefaults;
  phase: AnimationPhase;
}) {
  const process: AnimationProcess = [];
  const all: AnimationsParallel = [];

  els.forEach((el) => {
    const animation = {
      el,
      class: options.animation[phase].class,
      duration: options.animation[phase].duration,
      delay: options.animation[phase].delay,
    };
    all.push(animation);
  });
  process.push({ all });
  return process;
}
