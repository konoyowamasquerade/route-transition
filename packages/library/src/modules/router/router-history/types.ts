export interface IRouterHistory {
  get current(): string;
  get length(): number;
  get(index: number): null | string;
  backward(): null | string;
  forward(): null | string;
  // goTo(index: number): null | string;
  // removeByIndex(index: number): null | string;
  // removeByValue(href: string): null | string;
  clear(): void;
}

export type RouterHistoryOptions = {
  maxLength?: number;
};
