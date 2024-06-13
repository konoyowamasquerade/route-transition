import type { AnimationEl, AnimationElDetermined, AnimationProcess } from './types';

// export function parseCssTime(str: string) {
//   if (!str) return null;

//   let result: number;
//   if (str.includes('ms')) {
//     result = +str.replace('ms', '');
//     if (Number.isNaN(result)) return null;
//     return result;
//   }
//   if (str.includes('s')) {
//     result = +str.replace('s', '');
//     if (Number.isNaN(result)) return null;
//     return 1000 * result;
//   }

//   return null;
// }

// export function getAnimationTimes(el: HTMLElement) {
//   const computedStyle = window.getComputedStyle(el);
//   return {
//     duration: parseCssTime(computedStyle.animationDuration),
//     delay: parseCssTime(computedStyle.animationDelay),
//   };
// }

type TraverseCallbackArgs = {
  // index?: number;
  animation: AnimationEl;
};
type TraverseCallback = (args: TraverseCallbackArgs) => void;
export function traverse(process: AnimationProcess, callback: TraverseCallback) {
  if (!Array.isArray(process)) return;

  for (const step of process) {
    if (step?.animation) {
      callback({
        animation: step.animation,
      });
    } else if (Array.isArray(step?.all)) {
      for (const animation of step.all) {
        callback({
          animation,
        });
      }
    }
  }
}

function addAnimationPropsToEl(el: HTMLElement, anim: Omit<AnimationElDetermined, 'el'>) {
  el.classList.add(anim.class);
  if (anim.duration != null) {
    el.style.setProperty('animation-duration', `${anim.duration}ms`);
    el.style.setProperty('transition-duration', `${anim.duration}ms`);
  }
  if (anim.delay != null) {
    el.style.setProperty('animation-delay', `${anim.delay}ms`);
    el.style.setProperty('transition-delay', `${anim.delay}ms`);
  }
}

function removeAnimationPropsFromEl(el: HTMLElement, elClass: string) {
  el.classList.remove(elClass);
  el.style.setProperty('animation-duration', null);
  el.style.setProperty('animation-delay', null);
  el.style.setProperty('transition-duration', null);
  el.style.setProperty('transition-delay', null);
}

export function clearAnimation(anim: AnimationEl) {
  removeAnimationPropsFromEl(anim.el, anim.class);
}

async function animationFinishPromise(animation: Animation): Promise<void> {
  return new Promise((resolve) => {
    const onFinish = () => {
      resolve();
    };
    animation.addEventListener('finish', onFinish, { once: true });
  });
}

// const onAnimationend = (event: Event) => {
//   event.stopPropagation();
//   resolve();
// };
// el.addEventListener('animationend', onAnimationend, { once: true });

async function allElAnimationsFinishPromise(el: HTMLElement) {
  const animations = el.getAnimations();
  if (!animations.length) return Promise.resolve();
  const animationFinishPromises = animations.map((animation) => animationFinishPromise(animation));
  await Promise.all(animationFinishPromises);
  return Promise.resolve();
}

export async function animate(anim: AnimationElDetermined) {
  addAnimationPropsToEl(anim.el, anim);
  return allElAnimationsFinishPromise(anim.el);
}
