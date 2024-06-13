export function isObject(obj: object) {
  return obj != null && obj?.constructor?.name === 'Object';
}

export function deepCopyObject<T>(obj: T) {
  if (Array.isArray(obj)) return [...obj] as T;
  if (!isObject(obj as object)) return obj;
  const objCopied = {} as T;
  Object.keys(obj as object).forEach((key) => {
    objCopied[key] = deepCopyObject(obj?.[key] as object);
  });
  return objCopied;
  // return JSON.parse(JSON.stringify(obj)) as T;
}

export function fillWithDefault<T>(obj: T, defaultObj: T) {
  if (!isObject(obj as object)) return;

  const keys = Object.keys(defaultObj as object);
  keys.forEach((key) => {
    if (!(key in (obj as object))) {
      obj[key] = defaultObj[key] as T;
      return;
    }

    if (isObject(defaultObj[key] as object)) {
      fillWithDefault(obj[key], defaultObj[key]);
    }
  });
}
