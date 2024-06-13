export class AnimationError extends Error {
  public element: HTMLElement;
  public animationClass: string;

  constructor(message: string, element: HTMLElement, animationClass: string) {
    super(`${message}\n  class: ${animationClass}`);

    this.name = this.constructor.name;

    this.element = element;
    this.animationClass = animationClass;
  }
}
