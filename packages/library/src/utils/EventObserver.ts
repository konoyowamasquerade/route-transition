export type SubscriberFunction = (...args: unknown[]) => unknown;

export interface IEventObserver {
  emit(type: string, data?: object): void;
  on(type: string, subscriber: SubscriberFunction): void;
  off(type: string, subscriber: SubscriberFunction): void;
}

export class EventObserver implements IEventObserver {
  // #subscribers: { [key: string]: Array<SubscriberFunction> }
  #subscribers: Record<string, Array<SubscriberFunction>>;

  constructor() {
    this.#subscribers = {};
  }

  // getSubscribers(type: string): Array<SubscriberFunction> {
  //   return this.#subscribers[type];
  // }

  emit(type: string, data?: object) {
    if (this.#subscribers[type]) {
      this.#subscribers[type].forEach((subscriber: SubscriberFunction) => {
        subscriber(data);
      });
    }
  }

  on(type: string, subscriber: SubscriberFunction): void {
    if (!this.#subscribers[type]) {
      this.#subscribers[type] = [];
    }
    this.#subscribers[type].push(subscriber);
  }

  off(type?: string, subscriber?: SubscriberFunction): void {
    if (!type) {
      this.#subscribers = {};
    } else if (!subscriber && this.#subscribers[type] !== undefined) {
      this.#subscribers[type] = [];
    } else if (this.#subscribers[type] !== undefined && subscriber instanceof Function) {
      const index = this.#subscribers[type].indexOf(subscriber);
      if (index > -1) {
        this.#subscribers[type].splice(index, 1);
      }
    }
  }
}
