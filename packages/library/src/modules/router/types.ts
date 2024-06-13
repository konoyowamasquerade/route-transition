export type RouterOptions = {
  linkSelector?: string;
};

export type RouterActionEvent = {
  type: 'link-click' | 'popstate';
  nativeEvent?: Event;
  target?: HTMLElement;
  fromHref: string;
  toHref: string;
};
