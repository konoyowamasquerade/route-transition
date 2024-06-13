import { formRandomValue } from '#rt/utils/random';
import { round } from '#rt/utils/number';
import { isHtmlEl } from '#rt/utils/dom';
import { EventObserver } from '#rt/utils/EventObserver';

import { AnimationError } from './errors';
import type {
  IAnimation,
  AnimationOptions,
  AnimationEl,
  AnimationElDetermined,
  AnimationProcess,
} from './types';
import {
  traverse as traverseProcess,
  animate as animateOne,
  clearAnimation,
  // getAnimationTimes,
} from './utils';

function randomizeTimeAnim(anim: AnimationEl): AnimationElDetermined {
  const result: AnimationElDetermined = {
    class: anim.class,
    el: anim.el,
  };
  if (anim.duration) result.duration = round(formRandomValue(anim.duration), 3);
  if (anim.delay) result.delay = round(formRandomValue(anim.delay), 3);
  return result;
}

function randomizeAndAnimate(animation: AnimationEl) {
  return animateOne(randomizeTimeAnim(animation));
}

export class Animation extends EventObserver implements IAnimation {
  process?: AnimationProcess;

  constructor(options?: AnimationOptions) {
    super();

    this.process = options?.process;
  }

  async #animateOne(animation: AnimationEl) {
    const eventData = { el: animation.el };
    try {
      const promise = randomizeAndAnimate(animation);
      this.emit('animation-start', eventData);
      await promise;
      this.emit('animation-end', eventData);
    } catch (error) {
      const msg = (error as Error)?.message ?? error;
      throw new AnimationError(msg, animation.el, animation.class);
    }
  }

  async animate() {
    if (!Array.isArray(this.process)) return;

    for (const step of this.process) {
      if (step?.animation && isHtmlEl(step?.animation?.el)) {
        await this.#animateOne(step.animation);
      } else if (Array.isArray(step?.all)) {
        const parallel: Promise<void>[] = [];
        for (const animation of step.all) {
          if (isHtmlEl(animation?.el)) parallel.push(this.#animateOne(animation));
        }
        await Promise.all(parallel);
      }
    }

    // content.el.classList.add(content.class);
    // const times = getAnimationTimes(content.el);
    // content.el.classList.remove(content.class);
  }

  // resetToZeroImmediate() {}

  clearImmediate() {
    if (!this.process) return;

    traverseProcess(this.process, ({ animation }) => {
      if (!isHtmlEl(animation?.el)) return;
      clearAnimation(animation);
    });
  }
}
