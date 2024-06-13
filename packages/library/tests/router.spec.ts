import { getByText } from '@testing-library/dom';
import { Router } from '#rt/modules/router';
import { RouterActionEvent } from '#rt/modules/router/types';
import { HrefNotFoundError } from '#rt/modules/router/errors';

import { mockFirstPage } from './mock';

beforeAll(() => {
  document.body.innerHTML = mockFirstPage;
});

test('default correct behavior', (done) => {
  const router = new Router();
  router.run();
  router.on('action', (event: RouterActionEvent) => {
    expect(event.toHref).toContain('second-page.html');
    expect(event.type).toBe('link-click');
    router.destroy();
    done();
  });

  getByText(document.body, 'Second Page').click();
});

test('error behavior: link without href', (done) => {
  const router = new Router();
  router.run();
  router.on('error', (event: HrefNotFoundError) => {
    expect(event).toBeInstanceOf(HrefNotFoundError);
    expect(event.selector).toBe(router.linkSelector);
    router.destroy();
    done();
  });

  getByText(document.body, 'Page without href').click();
});
