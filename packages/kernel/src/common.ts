export type Result<T, E> = { tag: "Ok"; value: T } | { tag: "Err"; error: E };

export function Ok<E>(): Result<void, E>;
export function Ok<T, E>(value: T): Result<T, E>;
export function Ok<T, E>(value?: T): Result<T, E> {
  return { tag: "Ok", value };
}

export function Err<T, E>(error: E): Result<T, E> {
  return { tag: "Err", error };
}

// FIXME: Hacky
export function deepEqual(x: object, y: object): boolean {
  return JSON.stringify(x) === JSON.stringify(y);
}
