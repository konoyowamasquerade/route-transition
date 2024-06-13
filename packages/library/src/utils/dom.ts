export function getDocumentTitle(element: Document | HTMLElement) {
  const text = element.querySelector('title')?.textContent;
  if (text == null) return null;
  return text;
}

export function setDocumentTitle(title: string, _document?: Document) {
  (_document || document).title = title;
}

export function isHtmlEl(el: unknown) {
  return el instanceof HTMLElement;
}
