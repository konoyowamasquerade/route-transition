import { EventObserver } from '#rt/utils/EventObserver';
import { getDocumentTitle } from '#rt/utils/dom';

import { IContentLoader, Content, ContentLoaderOptions } from './types';
import { RequestError } from './errors';

export class ContentLoader extends EventObserver implements IContentLoader {
  selector: string;

  #abortController: AbortController | null;

  constructor(options: ContentLoaderOptions) {
    super();
    this.selector = options.selector;
  }

  stop() {
    if (this.#abortController) {
      this.#abortController.abort();
    }
  }

  async #parseResponse(response: Response) {
    const htmlStr = await response.text();

    const html = document.createElement('html');
    html.innerHTML = htmlStr;

    const contentElement = html.querySelector(`${this.selector}`) as HTMLElement;

    const result: Content = {
      contentElement,
      documentTitle: getDocumentTitle(html),
    };
    return result;
  }

  async load(url: string): Promise<Content> {
    try {
      this.#abortController = new AbortController();
      const response = await fetch(url, {
        signal: this.#abortController.signal,
      });
      if (response.ok) {
        return this.#parseResponse(response);
      }

      throw new RequestError(response);
    } finally {
      this.#abortController = null;
    }
  }
}
