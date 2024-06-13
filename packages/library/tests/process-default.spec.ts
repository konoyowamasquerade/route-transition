// import type { AnimationProcess } from '#rt/modules/animation/types';
import { getFilledProcessWithDefault } from '#rt/modules/defaults';

test('correct fill process with default', () => {
  const el = document.createElement('div');

  const process = [
    { animation: { el } },
    {
      all: [{ el }, { el }],
    },
    { animation: { el } },
  ];
  const defaultOptions = {
    class: 'rt-el-animation-in',
    duration: { min: 50, max: 500 },
    delay: { min: 50, max: 500 },
  };
  const result = getFilledProcessWithDefault(process, defaultOptions);
  expect(result).toEqual([
    { animation: { el, ...defaultOptions } },
    {
      all: [
        { el, ...defaultOptions },
        { el, ...defaultOptions },
      ],
    },
    { animation: { el, ...defaultOptions } },
  ]);
});
