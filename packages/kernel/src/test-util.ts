import { assert } from "vitest";
import { Result } from "./common";

function dumpResult<T, E>(result: Result<T, E>): string {
  if (result.tag === "Ok") {
    return `Ok(${JSON.stringify(result.value)})`;
  } else {
    return `Err(${JSON.stringify(result.error)})`;
  }
}

export function expectOk<T, E>(
  result: Result<T, E>
): asserts result is { tag: "Ok"; value: T } {
  assert.equal(result.tag, "Ok", `expected Ok but got ${dumpResult(result)}`);
}

export function expectErr<T, E>(
  result: Result<T, E>
): asserts result is { tag: "Err"; error: E } {
  assert.equal(result.tag, "Err", `expected Err but got ${dumpResult(result)}`);
}
