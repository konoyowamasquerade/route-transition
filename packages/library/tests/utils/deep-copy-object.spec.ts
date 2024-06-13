import { deepCopyObject } from '#rt/utils/object';
import arrayOfVariousObjects from './array-of-various-objects';

test('copy primitives', () => {
  expect(deepCopyObject(1)).toEqual(1);
  expect(deepCopyObject(true)).toEqual(true);
  expect(deepCopyObject('')).toEqual('');
  expect(deepCopyObject('str')).toEqual('str');
  expect(deepCopyObject(null)).toEqual(null);
  expect(deepCopyObject(undefined)).toEqual(undefined);
});

test('copy Array', () => {
  const array = [1, 5, 7];
  const copiedArr = deepCopyObject(array);
  expect(array).toEqual(copiedArr);
});

test('copy empty Object', () => {
  const object = {};
  expect(deepCopyObject(object)).toEqual(object);
});

test('copy Object with Array', () => {
  const object = { array: [1, 5, 7] };
  const copied = deepCopyObject(object);
  expect(object).toEqual(copied);
});

test('copy Object with Function', () => {
  const fun = (n: number) => n ** 2;
  const object = { fun };
  const copied = deepCopyObject(object);
  expect(object).toEqual(copied);
});

test('copy Object with Array of Objects', () => {
  const object = { arrayOfVariousObjects };
  const copied = deepCopyObject(object);
  expect(object).toEqual(copied);
});

test('copy Date', () => {
  const object = new Date();
  expect(deepCopyObject(object)).toEqual(object);
});

test('copy Object with various properties', () => {
  const array = [1, 3, 2];

  const object = {
    x: 1,
    b: {
      u: 2,
      d: function () {
        const t = 1;
        return t;
      },
      r: (t1: number, t2: number) => t1 + t2,
      f: null,
      k: undefined,
      p: 1,
      e: {
        h: 'h str',
        x: 3,
      },
    },
    l: new Date(),
    m: 'String ...',
    array,
    arrayOfVariousObjects,
  };

  const copied = deepCopyObject(object);
  expect(object).toEqual(copied);
});
