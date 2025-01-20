import { expect, expectTypeOf, test } from "vitest";
import { Formula, Judgement, Rule } from "./ast";
import { judgeMany } from "./checker";
import { expectOk } from "./test-util";

test("∀x.((P(x) ∨ Q())) ⊢ (∀x.(P(x)) ∨ Q()) can be proven", () => {
  const sampleAssms: Formula[] = [
    {
      tag: "Forall",
      ident: "x",
      body: {
        tag: "Or",
        left: { tag: "Pred", ident: "P", args: [{ tag: "Var", ident: "x" }] },
        right: { tag: "Pred", ident: "Q", args: [] },
      },
    },
  ];

  const sampleConcls: Formula[] = [
    {
      tag: "Or",
      left: {
        tag: "Forall",
        ident: "x",
        body: { tag: "Pred", ident: "P", args: [{ tag: "Var", ident: "x" }] },
      },
      right: { tag: "Pred", ident: "Q", args: [] },
    },
  ];

  const initialJudgement: Judgement = {
    assms: sampleAssms,
    concls: sampleConcls,
  };
  const rules: Rule[] = [
    { tag: "CR" },
    { tag: "OrR2" },
    { tag: "PR", index: 1 },
    { tag: "OrR1" },
    { tag: "ForallR", ident: "y" },
    { tag: "ForallL", term: { tag: "Var", ident: "y" } },
    { tag: "OrL" },
    { tag: "PR", index: 1 },
    { tag: "WR" },
    { tag: "I" },
    { tag: "WR" },
    { tag: "I" },
  ];

  const result = judgeMany(rules, [initialJudgement]);

  expectOk(result);
  expect(result.value).toHaveLength(0);
});
