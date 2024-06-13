export function fadeIn(el: HTMLElement, f: number) {
  el.style.setProperty('opacity', `${f}`);
}

export function fadeOut(el: HTMLElement, f: number) {
  el.style.setProperty('opacity', `${1 - f}`);
}

export function moveYIn(delta: number) {
  return (el: HTMLElement, f: number) => {
    el.style.setProperty('transform', `translateY(${(1 - f) * delta}px)`);
    el.style.setProperty('opacity', `${f}`);
  };
}

export function moveYOut(delta: number) {
  return (el: HTMLElement, f: number) => {
    el.style.setProperty('transform', `translateY(${f * delta}px)`);
    el.style.setProperty('opacity', `${1 - f}`);
  };
}

export function moveXIn(delta: number) {
  return (el: HTMLElement, f: number) => {
    el.style.setProperty('transform', `translateX(${(1 - f) * delta}px)`);
    el.style.setProperty('opacity', `${f}`);
  };
}

export function moveXOut(delta: number) {
  return (el: HTMLElement, f: number) => {
    el.style.setProperty('transform', `translateX(${f * delta}px)`);
    el.style.setProperty('opacity', `${1 - f}`);
  };
}

// TODO: add more
