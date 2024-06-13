import { DEFAULT_CONTENT_SELECTOR } from '#rt/modules/constants';
import { ContentLoader } from '#rt/modules/content-loader';
import { RequestError } from '#rt/modules/content-loader/errors';

const secondPageUrl = 'http://localhost:3000/second-page.html';

test('default correct behavior', async () => {
  const cl = new ContentLoader({ selector: DEFAULT_CONTENT_SELECTOR });
  const result = await cl.load(secondPageUrl);
  expect(result.contentElement).toHaveTextContent('Second Page Content...');
});

test('error: page not found', async () => {
  const cl = new ContentLoader({ selector: '#my-content' });
  try {
    await cl.load('my-page.html');
  } catch (error) {
    expect(error).toBeInstanceOf(RequestError);
    expect((error as RequestError).response?.status).toBe(404);
  }
});
