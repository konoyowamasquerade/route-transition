export class HrefNotFoundError extends Error {
  public element: HTMLElement;
  public selector: string;

  constructor(element: HTMLElement, selector: string) {
    super('Href not found');

    this.name = this.constructor.name;

    this.element = element;
    this.selector = selector;
  }
}
