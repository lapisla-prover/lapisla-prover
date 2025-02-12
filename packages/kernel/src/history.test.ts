import { describe, expect, test } from "vitest";
import { Formula, Judgement, Rule, TopCmd } from "./ast";
import { judgeMany, topLoop } from "./checker";
import { ProofHistory, TopHistory } from "./history";
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

describe("TopHistory Tests", () => {
  test("Basic TopHistory Tests", () => {
    const sampleFormula: Formula = {
      tag: "Imply",
      left: { tag: "Pred", ident: "a", args: [] },
      right: { tag: "Pred", ident: "a", args: [] },
    };

    const sampleFormula2: Formula = {
      tag: "Imply",
      left: { tag: "Pred", ident: "b", args: [] },
      right: { tag: "Pred", ident: "b", args: [] },
    };

    const thm1: TopCmd[] = [
      { tag: "Theorem", name: "id", formula: sampleFormula },
      { tag: "Apply", rule: { tag: "ImpR" } },
      { tag: "Apply", rule: { tag: "I" } },
      { tag: "Qed" },
    ];

    const thm2: TopCmd[] = [
      { tag: "Theorem", name: "id2", formula: sampleFormula2 },
      { tag: "Apply", rule: { tag: "ImpR" } },
      { tag: "Apply", rule: { tag: "I" } },
      { tag: "Qed" },
    ];

    const loop = topLoop(new TopHistory());
    loop.next(); // initialize

    for (const cmd of thm1) {
      const res = loop.next(cmd);
      expectOk(res.value);
    }

    for (const cmd of thm2) {
      const res = loop.next(cmd);
      expectOk(res.value);
    }

    const history = new TopHistory();
    const loop2 = topLoop(history);
    loop2.next(); // initialize

    // proof "id"
    for (const cmd of thm1) {
      const res = loop2.next(cmd);
      expectOk(res.value);
    }

    expect(history.top().tag).toEqual("Theorem");
    const thms: Array<string> = Array.from(history.top().env.thms.keys());
    expect(thms).toEqual(["id"]);

    // undo
    loop2.next({ tag: "Undo" });
    expect(history.top().tag).toEqual("Other");
    const thms2: Array<string> = Array.from(history.top().env.thms.keys());
    expect(thms2).toEqual([]);

    // redo qed
    loop2.next({ tag: "Qed" });
    expect(history.top().tag).toEqual("Theorem");

    // proof "id2"
    for (const cmd of thm2) {
      const res = loop2.next(cmd);
      expectOk(res.value);
    }

    expect(history.top().tag).toEqual("Theorem");
    const thms3: Array<string> = Array.from(history.top().env.thms.keys());
    expect(thms3).toEqual(["id", "id2"]);

    // undo all command.
    for (let i = 0; i < thm1.length + thm2.length; i++) {
      loop2.next({ tag: "Undo" });
    }

    expect(history.top().tag).toEqual("Other");
    const thms4: Array<string> = Array.from(history.top().env.thms.keys());
    expect(thms4).toEqual([]);
  });
});
