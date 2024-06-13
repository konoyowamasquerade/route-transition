import { deepCopyObject, fillWithDefault } from '#rt/utils/object';
import arrayOfVariousObjects from './array-of-various-objects';

test('fill empty Object with default', () => {
  const object = {};
  const OBJECT_DEFAULT = {
    a: 1,
    b: (t: number) => 2 * t,
    c: {
      g: 's',
      h: true,
    },
  };

  const copied = deepCopyObject(object);
  fillWithDefault(copied, OBJECT_DEFAULT);
  expect(copied).toEqual(OBJECT_DEFAULT);
});

test('fill Object with empty default', () => {
  const object = {
    a: 1,
    b: (t: number) => 2 * t,
    c: {
      g: 's',
      h: true,
    },
  };
  const OBJECT_DEFAULT = {};

  const copied = deepCopyObject(object);
  fillWithDefault(copied, OBJECT_DEFAULT);
  expect(copied).toEqual(object);
});

test('fill Object with wide default', () => {
  const object = { a: 1 };
  const OBJECT_DEFAULT = {
    a: 2,
    b: true,
    c: 'str',
  };

  const copied = deepCopyObject(object);
  fillWithDefault(copied, OBJECT_DEFAULT);
  expect(copied).toEqual({ ...OBJECT_DEFAULT, ...object });
});

test('fill Object with narrow default', () => {
  const object = {
    b: true,
    c: 'str',
  };
  const OBJECT_DEFAULT = { a: 1 };

  const copied = deepCopyObject(object);
  fillWithDefault(copied, OBJECT_DEFAULT as any);
  expect(copied).toEqual({ ...OBJECT_DEFAULT, ...object });
});

test('fill Array with wide default (shoud not change)', () => {
  const array = [1, 2]
  const ARRAY_DEFAULT = [1, 7, 9, 12];

  const copied = deepCopyObject(array);
  fillWithDefault(copied, ARRAY_DEFAULT as object);
  expect(copied).toEqual(array);
});

test('fill Array of Objects with default', () => {
  const ARRAY_OF_OBJECTS_DEFAULT = [
    75,
    'another str',
    { g: 6, h: 2 },
    { m: true },
  ];

  const copied = deepCopyObject(arrayOfVariousObjects);
  fillWithDefault(copied, ARRAY_OF_OBJECTS_DEFAULT as object);
  expect(copied).toEqual(arrayOfVariousObjects);
});

test('fill Object with various properties with default', () => {
  const array = [1, 3, 5];
  const h = (y: number) => y ^ 2;
  function v() {
    return true;
  }

  // type ObjectWithAnyProps = { [name: string]: ObjectWithAnyProps };

  const object = {
    t: 1,
    d: 's',
    h,
    k: {
      p: true,
      s: {
        o: 5,
        b: 2,
      },

      array,
      arrayOfVariousObjects,
    },
  };

  const OBJECT_DEFAULT = {
    t: 2,
    b: 'b str',
    k: {
      p: false,
    },
    l: {
      i: 5,
      n: false,
      v,
    },
  };

  const copied = deepCopyObject(object) as any;
  fillWithDefault(copied, OBJECT_DEFAULT as object);

  expect(copied.t).toBe(copied.t);
  expect(copied.d).toBe(copied.d);
  expect(copied.h).toBe(copied.h);
  expect(copied.t).toBe(copied.t);
  expect(copied.k.p).toBe(copied.k.p);

  expect(copied.b).toBe(OBJECT_DEFAULT.b);
  expect(copied.l).toBe(OBJECT_DEFAULT.l);
});
