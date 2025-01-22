import { describe, expect, test } from "vitest";
import { Formula, Judgement, Rule } from "./ast";
import { judgeMany } from "./checker";
import { ProofHistory } from "./history";
import { expectErr, expectOk } from "./test-util";

// Head case of `checker.test.ts`
describe("Basic History Tests", () => {
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

  test("successful application of a rule", () => {
    const history = new ProofHistory([initialJudgement]);

    for (const rule of rules) {
      expectOk(history.applyRule(rule));
    }
  });

  test("Equivalent to `judgeMany`", () => {
    const history = new ProofHistory([initialJudgement]);

    for (const rule of rules) {
      history.applyRule(rule);
    }

    const n = rules.length;

    for (let i = n; i >= 1; i--) {
      const result = judgeMany(rules.slice(0, i), [initialJudgement]);
      expectOk(result);
      const historyPop = history.pop();
      expectOk(historyPop);
      expect(result.value).toEqual(historyPop.value);
    }
  });

  test("Empty pop returns error", () => {
    const history = new ProofHistory([initialJudgement]);

    // empty
    expectErr(history.pop());
  });

  test("do and undo is identity", () => {
    const n = rules.length;

    for (let i = 1; i < n; i++) {
      const history = new ProofHistory([initialJudgement]);

      for (const rule of rules.slice(0, i)) {
        expectOk(history.applyRule(rule));
      }

      const historyTop = history.top();

      // undo
      expectOk(history.pop());
      // redo
      expectOk(history.applyRule(rules[i - 1]));

      expect(history.top()).toEqual(historyTop);
    }
  });

  test("failed to apply doesn't throw but returns error", () => {
    const history = new ProofHistory([initialJudgement]);

    expectErr(history.applyRule({ tag: "I" }));
  });
});
