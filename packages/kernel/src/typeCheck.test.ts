import { describe, expect, test } from "vitest";
import { Formula, Ident, Type } from "./ast";
import { checkFormula, normalizeType } from "./typeCheck";
import { expectOk } from "./test-util";
import { parseFormula } from "./parser";

test("Check P(a) ==> Q(x, y, z)", () => {
  const formula: Formula = {
    tag: "Imply",
    left: {
      tag: "Pred",
      ident: "P",
      args: [{ tag: "Var", ident: "a" }],
    },
    right: {
      tag: "Pred",
      ident: "Q",
      args: [
        { tag: "Var", ident: "x" },
        { tag: "Var", ident: "y" },
        { tag: "Var", ident: "z" },
      ],
    },
  };
  const ctx = new Map();
  const res = checkFormula(new Map(), ctx, formula);
  expectOk(res);
  // TODO: テストする
  console.dir(ctx, { depth: null });
});

test("foo", () => {
  const formula: Formula = {
    tag: "Imply",
    left: {
      tag: "Pred",
      ident: "eq",
      args: [
        { tag: "Var", ident: "r" },
        { tag: "Var", ident: "s" },
      ],
    },
    right: {
      tag: "Pred",
      ident: "eq",
      args: [
        { tag: "Var", ident: "s" },
        { tag: "Var", ident: "r" },
      ],
    },
  };
  const sig: Map<Ident, Type> = new Map([
    [
      "eq",
      {
        tag: "Arr",
        left: { tag: "Var", ident: "a" },
        right: {
          tag: "Arr",
          left: { tag: "Var", ident: "a" },
          right: { tag: "Prop" },
        },
      },
    ],
  ]);
  const ctx = new Map();
  const res = checkFormula(sig, ctx, formula);
  expectOk(res);
  // TODO: テストする
  console.dir(ctx, { depth: null });
});

test("nat induction", () => {
  const formula = parseFormula("P(zero) → ∀n. (P(n) → P(succ(n))) → P(n)");
  expectOk(formula);
  const sig: Map<Ident, Type> = new Map([
    ["zero", { tag: "Con", ident: "nat", args: [] }],
    [
      "succ",
      {
        tag: "Arr",
        left: { tag: "Con", ident: "nat", args: [] },
        right: { tag: "Con", ident: "nat", args: [] },
      },
    ],
  ]);
  const ctx = new Map();
  const res = checkFormula(sig, ctx, formula.value);
  expectOk(res);

  expect(ctx.size).toBe(2);

  expect.soft(normalizeType(ctx.get("P"))).toEqual<Type>({
    tag: "Arr",
    left: { tag: "Con", ident: "nat", args: [] },
    right: { tag: "Prop" },
  });

  expect.soft(normalizeType(ctx.get("n"))).toEqual<Type>({
    tag: "Con",
    ident: "nat",
    args: [],
  });
});
