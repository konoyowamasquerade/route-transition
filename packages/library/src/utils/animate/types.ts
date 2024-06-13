/**
 * n from 0 to 1
 */
export type Draw = (n: number) => void;

/**
 * n from 0 to 1
 * return value from 0 to 1
 */
export type Timing = (n: number) => number;

export type Duration = number;

export type Delay = number;

export type AnimateOptions = {
  timing: Timing;
  draw: Draw;
  duration: Duration;
  delay?: Delay;
};
