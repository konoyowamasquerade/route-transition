import { EventObserver } from '#rt/utils/EventObserver';
import { setDocumentTitle, isHtmlEl } from '#rt/utils/dom';

import { Animation } from './animation';
import { traverse as traverseProcess } from './animation/utils';
import type { AnimationProcess, AnimationElEvent } from './animation/types';

import { Router } from './router';
import { HrefNotFoundError } from './router/errors';
import type { RouterActionEvent } from './router/types';

import { ContentLoader } from './content-loader';
import { RequestError } from './content-loader/errors';

import { ContentElementNotFoundError } from './errors';
import {
  getOptionsFilledWithDefaults,
  formDefaultProcess,
  getFilledProcessWithDefault,
} from './defaults';
import type {
  IRouteTransition,
  RouteTransitionOptions,
  RouteTransitionOptionsWithDefaults,
  AnimationPhase,
  AnimationProcessOptions,
  ContentData,
} from './types';

console.log('%cDevelopment route-transition', 'color: burlywood;');

export class RouteTransition extends EventObserver implements IRouteTransition {
  options: RouteTransitionOptionsWithDefaults;

  #process: AnimationProcess | null;

  #router: Router;
  #contentLoader: ContentLoader;
  #animation: Animation;

  #phase: AnimationPhase;
  #contentEl: HTMLElement;
  #inProgress: boolean;

  constructor(options?: RouteTransitionOptions) {
    super();

    this.options = getOptionsFilledWithDefaults(options);

    this.#router = new Router({ linkSelector: this.options.linkSelector });
    this.#contentLoader = new ContentLoader({ selector: this.options.contentSelector });
    this.#animation = new Animation();
  }

  run() {
    this.#router.run();
    this.#router.on('action', this.#onRouteAction);
    this.#router.on('error', this.#onRouteError);

    this.#animation.on('animation-start', this.#onAnimationStart);
    // this.#animation.on('animation-end', this.#onAnimationEnd);
  }

  destroy() {
    this.#router.off();
    this.#router.destroy();
    this.#contentLoader.off();
    this.#animation.off();
  }

  setProcess(process?: AnimationProcessOptions) {
    if (!Array.isArray(process)) this.#process = null;
    else this.#process = getFilledProcessWithDefault(process, this.options.animation[this.#phase]);
  }

  getPhase() {
    return this.#phase;
  }

  #setContentEl() {
    this.#contentEl = document.querySelector(this.options.contentSelector) as HTMLElement;
  }

  #getAnimatedEls() {
    return [
      ...document.querySelectorAll(`${this.options.animation.elSelector}`),
    ] as Array<HTMLElement>;
  }

  #formDefaultProcess(els: Array<HTMLElement>) {
    return formDefaultProcess({
      els,
      options: this.options,
      phase: this.#phase,
    });
  }

  #addAnimationInElBeforeClass(el: HTMLElement) {
    el.classList.add(this.options.animation.in.beforeClass);
  }
  #removeAnimationInElBeforeClass(el: HTMLElement) {
    el.classList.remove(this.options.animation.in.beforeClass);
  }

  #onAnimationStart = (event: AnimationElEvent) => {
    // this.emit('animation-start', event);
    if (!isHtmlEl(event?.el)) return;
    this.#removeAnimationInElBeforeClass(event.el);
  };
  // #onAnimationEnd = (event: AnimationElEvent) => {
  //   // this.emit('animation-end', event);
  // };

  async #loadContent(routeEvent: RouterActionEvent) {
    if (this.#inProgress) this.#contentLoader.stop();
    return this.#contentLoader.load(routeEvent.toHref).then((data) => {
      if (!isHtmlEl(data.contentElement)) {
        throw new ContentElementNotFoundError(this.options.contentSelector, 'in');
      }
      this.emit('load', data);
      return data as ContentData;
    });
  }
  #replaceContent(newContent: ContentData) {
    this.#replaceContentByHtml(newContent.contentElement?.outerHTML);
    this.emit('insert', newContent);
    if (newContent.documentTitle != null) setDocumentTitle(newContent.documentTitle);
  }
  #replaceContentByHtml(newHtml: string) {
    this.#contentEl.outerHTML = newHtml;
  }

  #prepareEls() {
    this.#setContentEl();

    if (!this.#contentEl) {
      throw new ContentElementNotFoundError(this.options.contentSelector, 'out');
    }

    const animatedEls = this.#getAnimatedEls();

    return { contentEl: this.#contentEl, animatedEls };
  }

  #prepareAnimationProcess({ phase, els }: { phase: AnimationPhase; els: Array<HTMLElement> }) {
    if (Array.isArray(this.#process)) {
      this.#process = getFilledProcessWithDefault(this.#process, this.options.animation[phase]);
    } else {
      this.#process = this.#formDefaultProcess(els);
    }
    this.#animation.process = this.#process;
  }

  async #animate() {
    return this.#animation.animate();
  }
  async #animatePhase(phase: AnimationPhase) {
    this.#phase = phase;
    const { animatedEls } = this.#prepareEls();
    this.emit('process', { animatedEls, phase: this.#phase });
    if (phase === 'in') this.#addAnimationInElsBeforeClass();
    this.#prepareAnimationProcess({ phase, els: animatedEls });
    await this.#animate();
    this.#process = null;
  }

  async #animateInAndReset() {
    await this.#animatePhase('in');
    this.#animation.clearImmediate();
  }
  async #animateOut() {
    await this.#animatePhase('out');
  }

  #addAnimationInElsBeforeClass() {
    if (!this.#process) return;
    traverseProcess(this.#process, ({ animation }) => {
      if (!isHtmlEl(animation?.el)) return;
      this.#addAnimationInElBeforeClass(animation.el);
    });
  }

  async #animateOutAndLoadContent(routeEvent: RouterActionEvent) {
    const data = await Promise.allSettled([this.#loadContent(routeEvent), this.#animateOut()]);
    if (data[0].status === 'rejected') {
      throw data[0].reason;
    } else if (data[1].status === 'rejected') {
      throw data[1].reason;
    }
    const loadedData = data[0].value;
    return loadedData;
  }

  #emitError(error: Error) {
    this.emit('error', error);
  }

  #onRouteError = (error: HrefNotFoundError) => {
    if (!this.#inProgress) {
      this.#emitError(error);
      this.#inProgress = false;
    }
  };

  #handleError(error: Error) {
    this.#emitError(error);

    if (error instanceof RequestError && error.response?.status === 404) {
      this.#router.goBack();
    }

    location.reload();
  }

  #onRouteAction = async (routeEvent: RouterActionEvent) => {
    if (this.#inProgress) return;

    try {
      this.#inProgress = true;
      this.emit('action', routeEvent);
      const loadedData = await this.#animateOutAndLoadContent(routeEvent);
      this.#replaceContent(loadedData);
      await this.#animateInAndReset();
      this.emit('complete');
    } catch (error) {
      this.#handleError(error as Error);
    } finally {
      this.#inProgress = false;
    }
  };
}
