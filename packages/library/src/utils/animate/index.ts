import { wait } from '../';
import type { AnimateOptions } from './types';

async function simpleAnimate({ timing, draw, duration }: AnimateOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const start = performance.now();

      requestAnimationFrame(function _animate(time) {
        let timeFraction = (time - start) / duration;
        if (timeFraction > 1) timeFraction = 1;

        const progress = timing(timeFraction);

        draw(progress);

        if (timeFraction < 1) {
          requestAnimationFrame(_animate);
        } else {
          resolve();
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

export async function animate({ timing, draw, duration, delay }: AnimateOptions): Promise<void> {
  if (delay) {
    return wait(delay).then(() => {
      return simpleAnimate({ timing, draw, duration });
    });
  }
  return simpleAnimate({ timing, draw, duration });
}
