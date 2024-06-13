export type DeepRequired<T> = Required<{
  [K in keyof T]: T[K] extends Required<T[K]> ? T[K] : DeepRequired<T[K]>;
}>;

export type DeepPartial<T> = Partial<{
  [K in keyof T]: T[K] extends Partial<T[K]> ? T[K] : DeepPartial<T[K]>;
}>;

export interface Range {
  min: number;
  max: number;
}
