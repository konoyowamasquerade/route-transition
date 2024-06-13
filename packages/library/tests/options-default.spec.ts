import type { RouteTransitionOptions } from '#rt/modules/types';
import { RouteTransition } from '#rt/modules';
import { DEFAULT_OPTIONS } from '#rt/modules/constants';

test('empty object', () => {
  const dcr = new RouteTransition({});
  expect(dcr.options).toEqual(DEFAULT_OPTIONS);
});

test('none arguments', () => {
  const dcr = new RouteTransition();
  expect(dcr.options).toEqual(DEFAULT_OPTIONS);
});

test('all options', () => {
  const optionsWithCss: RouteTransitionOptions = {
    linkSelector: '.my-link',
    contentSelector: '#rt-content',
    animation: {
      elSelector: '.my-el-animation',
      in: {
        beforeClass: 'rt-el-animation-before-in',
        class: 'my-el-animation-in',
        duration: { min: 11, max: 22 },
        delay: { min: 33, max: 44 },
      },
      out: {
        class: 'my-el-animation-out',
        duration: { min: 55, max: 66 },
        delay: { min: 77, max: 88 },
      },
    },
  };

  const dcr = new RouteTransition(optionsWithCss);
  expect(dcr.options).toEqual(optionsWithCss);
});
