import { Result, Ok, Err } from 'neverthrow';

export type DbGetQueryError = DbInternalError | DbNotFoundError;
export type DbSetQueryError =
  | DbInternalError
  | DbNotFoundError
  | DbDuplicateError;
export type DbDeleteQueryError = DbInternalError | DbNotFoundError;
export class DbInternalError {
  message: string;
  code: 'InternalError';
}
export class DbNotFoundError {
  message: string;
  code: 'NotFoundError';
}
export class DbDuplicateError {
  message: string;
  code: 'DuplicateError';
}

export async function fromThrowableGet<T>(
  fn: () => Promise<T>,
): Promise<Result<T, DbGetQueryError>> {
  try {
    const value: T = await fn();
    if (value) {
      return new Ok(value);
    }
    return new Err({
      message: 'prisma.service: Required value not found',
      code: 'NotFoundError',
    });
  } catch (error) {
    return new Err({ message: `Error: ${error}`, code: 'InternalError' });
  }
}

export async function fromThrowableSet<T>(
  mustExistFn: (() => Promise<any>)[],
  mustNotExistFn: (() => Promise<any>)[],
  setFn: () => Promise<T>,
): Promise<Result<T, DbSetQueryError>> {
  try {
    for (const fn of mustExistFn) {
      const value: any = await fn();
      if (!value) {
        return new Err({
          message: 'prisma.service: Required value not found',
          code: 'NotFoundError',
        });
      }
    }
    for (const fn of mustNotExistFn) {
      const value: any = await fn();
      if (value) {
        return new Err({
          message: 'prisma.service: Value already exists',
          code: 'DuplicateError',
        });
      }
    }
    const value: T = await setFn();
    return new Ok(value);
  } catch (error) {
    return new Err({ message: `Error: ${error}`, code: 'InternalError' });
  }
}

export async function fromThrowableDelete(
  mustExistFn: (() => Promise<any>)[],
  fn: () => Promise<any>,
): Promise<Result<void, DbDeleteQueryError>> {
  try {
    for (const fn of mustExistFn) {
      const value: any = await fn();
      if (!value) {
        return new Err({
          message: 'prisma.service: Required value not found',
          code: 'NotFoundError',
        });
      }
    }
    await fn();
    return new Ok(undefined);
  } catch (error) {
    return new Err({ message: `Error: ${error}`, code: 'InternalError' });
  }
}

export function combineError<T1, E1, T2, E2, T3, E3>(
  result1: Ok<T1, E1> | Err<T2, E2> | Err<T3, E3>,
): Result<T1, E2 | E3> {
  if (result1 instanceof Ok) {
    return new Ok(result1.value);
  } else {
    return new Err(result1.error);
  }
}
