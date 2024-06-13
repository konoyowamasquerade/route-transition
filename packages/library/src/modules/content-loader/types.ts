export type Content = {
  contentElement?: HTMLElement;
  documentTitle: string | null;
};

export type ContentLoaderOptions = {
  selector: string;
};

export interface IContentLoader {
  stop(): void;
  load(url: string): Promise<Content>;
}
