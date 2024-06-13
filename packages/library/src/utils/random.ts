import type { Range } from './types';

export function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function formRandomValue(value: Range | number) {
  let finalValue: number;
  if (typeof value !== 'number' && value?.min && value?.max) {
    const min = value.min;
    const max = value.max;
    finalValue = rand(min, max);
  } else if (typeof value === 'number') {
    finalValue = value;
  }
  return finalValue!;
}
