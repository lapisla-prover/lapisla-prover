import { expect } from "vitest";
import { Result } from "./common";

export function expectOk<T, E>(
  result: Result<T, E>
): asserts result is { tag: "Ok"; value: T } {
  expect(result.tag).toEqual("Ok");
}

export function expectErr<T, E>(
  result: Result<T, E>
): asserts result is { tag: "Err"; error: E } {
  expect(result.tag).toEqual("Err");
}
