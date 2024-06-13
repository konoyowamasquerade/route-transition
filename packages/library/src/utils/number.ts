export function round(x: number, afterComma = 0) {
  const acc = 10 ** afterComma;
  return Math.round(x * acc) / acc;
}
