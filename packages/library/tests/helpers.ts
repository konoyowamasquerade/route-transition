export function emitAnimationsFinish(selector: string) {
  const els = [...document.querySelectorAll(selector)];
  els.forEach((el) => {
    const animations = el.getAnimations();
    animations.forEach((animation) => {
      animation.dispatchEvent(new Event('finish'));
    });
  });
}
