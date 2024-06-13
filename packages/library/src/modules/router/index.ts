import { EventObserver } from '#rt/utils/EventObserver';

import { DEFAULT_LINK_SELECTOR } from '../constants';

import type { RouterActionEvent, RouterOptions } from './types';
import { HrefNotFoundError } from './errors';
import RouterHistory from './router-history';

export interface IRouter {
  run(): void;
  destroy(): void;
  goBack(): void;
}

export class Router extends EventObserver implements IRouter {
  linkSelector: string;

  #history: RouterHistory;
  #clickHandlerBinded: (this: Document, ev: PointerEvent) => void;
  #popstateHandlerBinded: (this: Document, ev: PopStateEvent) => void;

  constructor(props?: RouterOptions) {
    super();

    this.linkSelector = props?.linkSelector || DEFAULT_LINK_SELECTOR;

    this.#clickHandlerBinded = <(event: PointerEvent) => boolean>this.#clickHandler.bind(this);
    this.#popstateHandlerBinded = <(event: PopStateEvent) => void>this.#popstateHandler.bind(this);

    this.#history = new RouterHistory();
    this.#history.add(window.location.href);
  }

  run() {
    this.#addListeners();
  }

  destroy() {
    this.#removeListeners();
  }

  goBack() {
    const prevHref = this.#history.backward();
    if (prevHref) {
      history.pushState({}, '', prevHref);
    }
  }

  #addListeners() {
    document.addEventListener('click', this.#clickHandlerBinded);
    window.addEventListener('popstate', this.#popstateHandlerBinded);
  }

  #removeListeners() {
    document.removeEventListener('click', this.#clickHandlerBinded);
    window.removeEventListener('popstate', this.#popstateHandlerBinded);
  }

  #isElementLink(element: HTMLElement) {
    if (!this.linkSelector) return false;
    if (!element) return false;
    return element.matches(this.linkSelector);
  }

  #popstateHandler(event: PopStateEvent) {
    this.#generateEvent({
      type: 'popstate',
      nativeEvent: event,

      toHref: window.location.href,
      fromHref: this.#history.current,
    });
  }

  #generateEvent(data: RouterActionEvent) {
    this.#history.add(data.toHref);

    this.emit('action', data);
  }

  #clickHandler(event: PointerEvent) {
    const target = event.target as HTMLElement;
    const linkEl = target.closest(this.linkSelector) as HTMLElement;

    if (!this.#isElementLink(linkEl)) return;

    event.preventDefault();

    const href = linkEl.getAttribute('href');
    if (!href) {
      const error = new HrefNotFoundError(linkEl, this.linkSelector);
      this.emit('error', error);
      return;
    }
    history.pushState({}, '', href);
    this.#generateEvent({
      type: 'link-click',
      nativeEvent: event,
      target: linkEl,

      toHref: href,
      fromHref: this.#history.current || window.location.href,
    });
  }
}
