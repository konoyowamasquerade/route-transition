import RouterHistory from '#rt/modules/router/router-history';

function fillHistory(rh: RouterHistory, count: number) {
  for (let i = 0; i < count; i++) {
    rh.add(`${i}`);
  }
}

const MAX_LENGTH = 5;

test('fill history to the max', () => {
  const rh = new RouterHistory({ maxLength: MAX_LENGTH });
  fillHistory(rh, MAX_LENGTH);
  expect(rh.length).toBe(MAX_LENGTH);
  expect(rh.current).toBe(`${MAX_LENGTH - 1}`);
});

test('fill history over max', () => {
  const rh = new RouterHistory({ maxLength: MAX_LENGTH });
  fillHistory(rh, MAX_LENGTH + 5);
  expect(rh.length).toBe(MAX_LENGTH);
  expect(rh.current).toBe(`${MAX_LENGTH + 5 - 1}`);
});

test('go backward and forward', () => {
  const rh = new RouterHistory({ maxLength: MAX_LENGTH });
  fillHistory(rh, MAX_LENGTH);

  rh.backward();
  rh.backward();
  rh.backward();
  expect(rh.current).toBe(`${MAX_LENGTH - 4}`);

  rh.forward();
  rh.forward();
  expect(rh.current).toBe(`${MAX_LENGTH - 2}`);
});

test('go backward over min and forward over max', () => {
  const rh = new RouterHistory({ maxLength: MAX_LENGTH });
  fillHistory(rh, MAX_LENGTH);

  for (let i = 0; i < MAX_LENGTH - 1; i++) rh.backward();
  expect(rh.current).toBe('0');

  const href1 = rh.backward();
  expect(rh.current).toBe('0');
  expect(href1).toBe(null);

  for (let i = 0; i < MAX_LENGTH - 1; i++) rh.forward();
  expect(rh.current).toBe(`${MAX_LENGTH - 1}`);

  const href2 = rh.forward();
  expect(rh.current).toBe(`${MAX_LENGTH - 1}`);
  expect(href2).toBe(null);
});
