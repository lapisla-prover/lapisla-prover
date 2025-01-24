export type Result<T, E> = { tag: "Ok"; value: T } | { tag: "Err"; error: E };

export function Ok<E>(): Result<void, E>;
export function Ok<T, E>(value: T): Result<T, E>;
export function Ok<T, E>(value?: T): Result<T, E> {
  return { tag: "Ok", value };
}

export function Err<T, E>(error: E): Result<T, E> {
  return { tag: "Err", error };
}

export function traverseResult<T, E>(results: Result<T, E>[]): Result<T[], E> {
  const values: T[] = [];
  for (const result of results) {
    if (result.tag === "Err") {
      return result;
    }
    values.push(result.value);
  }
  return Ok(values);
}

export function reduceResult<T, E, A>(
  f: (acc: A, value: T) => Result<A, E>,
  init: A,
  arr: T[]
): Result<A, E> {
  let acc = init;
  for (const value of arr) {
    const res = f(acc, value);
    if (res.tag === "Err") {
      return res;
    }
    acc = res.value;
  }
  return Ok(acc);
}

// FIXME: Hacky
export function deepEqual(x: object, y: object): boolean {
  return JSON.stringify(x) === JSON.stringify(y);
}
