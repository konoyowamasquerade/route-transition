import { getByText } from '@testing-library/dom';
import { RouteTransition } from '#rt/modules';
import {
  // RequestError,
  HrefNotFoundError,
  RequestError,
  ContentElementNotFoundError,
} from '#rt/modules/errors';

import { mockFirstPage } from './mock';

let rt: RouteTransition | null = null;

beforeEach(() => {
  document.body.innerHTML = mockFirstPage;
});

afterEach(() => {
  rt?.destroy();
});

test('href is empty', (done) => {
  rt = new RouteTransition();
  rt.run();
  rt.on('complete', () => {});
  rt.on('error', (err: HrefNotFoundError) => {
    expect(err).toBeInstanceOf(HrefNotFoundError);
    expect(err.selector).toBe(rt?.options.linkSelector);
    done();
  });

  getByText(document.body, 'Page without href').click();
});

test('page not found', (done) => {
  rt = new RouteTransition();
  rt.run();
  rt.on('complete', () => {});
  rt.on('error', (err: RequestError) => {
    expect(err).toBeInstanceOf(RequestError);
    expect(err.response?.status).toBe(404);
    done();
  });

  getByText(document.body, 'Page Not Exist').click();
});

test('page without content (rt)', (done) => {
  rt = new RouteTransition();
  rt.run();
  rt.on('complete', () => {});
  rt.on('error', (err: ContentElementNotFoundError) => {
    expect(err).toBeInstanceOf(ContentElementNotFoundError);
    done();
  });

  getByText(document.body, 'Page without content').click();
});
