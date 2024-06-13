export function linear(t: number) {
  return t;
}

export function quad(n: number) {
  return (t: number) => Math.pow(t, n);
}

export function easeInOut(t: number) {
  if (t < 0.5) return 2 * t * t;
  return 1 - Math.pow(-2 * t + 2, 2) / 2;
}

// export function easeInOut(t: number) {
//   return (t ^ 2) / (2 * ((t ^ 2) - t) + 1);
// }

export function easeIn(t: number) {
  return t ^ 2;
}

export function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 2);
}
