import type { IRouterHistory, RouterHistoryOptions } from './types';
import { MAX_HISTORY_LENGTH } from './constants';

export default class RouterHistory implements IRouterHistory {
  #hrefs: Array<string> = [];
  #index: number = -1;
  #maxLength: number;

  constructor(options?: RouterHistoryOptions) {
    this.#maxLength = options?.maxLength || MAX_HISTORY_LENGTH;
  }

  add(href: string) {
    this.#hrefs.push(href);
    this.#index++;
    if (this.#hrefs.length > this.#maxLength) {
      this.#hrefs.shift();
      this.#index--;
    }
  }

  get(index: number) {
    return this.#hrefs.at(index) ?? null;
  }

  get current() {
    return this.#hrefs[this.#index];
  }
  get length() {
    return this.#hrefs.length;
  }

  backward() {
    if (this.#index <= 0) return null;
    this.#index--;
    return this.#hrefs[this.#index];
  }
  forward() {
    if (this.#index >= this.#hrefs.length - 1) return null;
    this.#index++;
    return this.#hrefs[this.#index];
  }

  clear() {
    this.#hrefs = [];
    this.#index = -1;
  }
}
