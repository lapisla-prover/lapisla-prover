import { describe, expect, test } from "vitest";
import { Formula, Judgement, Rule, Term, ProofCmd, TopCmd } from "./ast";
import { judgeMany, judgeOne, proofLoop, topLoop } from "./checker";
import { expectErr, expectOk } from "./test-util";
import { ProofHistory, TopHistory } from "./history";
import { Result } from "./common";

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

describe("rules", () => {
  test("I", () => {
    const assms: Formula[] = [{ tag: "Pred", ident: "P", args: [] }];
    const concls: Formula[] = [{ tag: "Pred", ident: "P", args: [] }];
    const result = judgeOne({ tag: "I" }, [{ assms, concls }]);
    expectOk(result);
    expect(result.value).toHaveLength(0);
  });
  test("Cut", () => {
    const assms: Formula[] = [{ tag: "Pred", ident: "P", args: [] }];
    const concls: Formula[] = [{ tag: "Pred", ident: "Q", args: [] }];
    const result = judgeOne(
      { tag: "Cut", formula: { tag: "Pred", ident: "A", args: [] } },
      [{ assms, concls }]
    );
    expectOk(result);
    expect(result.value).toHaveLength(2);
    expect(result.value[0].assms).toEqual(assms);
    expect(result.value[0].concls).toEqual([
      { tag: "Pred", ident: "A", args: [] },
      { tag: "Pred", ident: "Q", args: [] },
    ]);
    expect(result.value[1].assms).toEqual([
      { tag: "Pred", ident: "A", args: [] },
      { tag: "Pred", ident: "P", args: [] },
    ]);
    expect(result.value[1].concls).toEqual(concls);
  });
  test("AndL1", () => {
    const assms: Formula[] = [
      {
        tag: "And",
        left: { tag: "Pred", ident: "P", args: [] },
        right: { tag: "Pred", ident: "Q", args: [] },
      },
      { tag: "Pred", ident: "R", args: [] },
    ];
    const concls: Formula[] = [
      { tag: "Pred", ident: "P", args: [] },
      { tag: "Pred", ident: "R", args: [] },
    ];
    const result = judgeOne({ tag: "AndL1" }, [{ assms, concls }]);
    expectOk(result);
    expect(result.value).toHaveLength(1);
    expect(result.value[0].assms).toEqual([
      { tag: "Pred", ident: "P", args: [] },
      { tag: "Pred", ident: "R", args: [] },
    ]);
    expect(result.value[0].concls).toEqual(concls);
  });
  test("AndL2", () => {
    const assms: Formula[] = [
      {
        tag: "And",
        left: { tag: "Pred", ident: "P", args: [] },
        right: { tag: "Pred", ident: "Q", args: [] },
      },
      { tag: "Pred", ident: "R", args: [] },
    ];
    const concls: Formula[] = [
      { tag: "Pred", ident: "P", args: [] },
      { tag: "Pred", ident: "R", args: [] },
    ];
    const result = judgeOne({ tag: "AndL2" }, [{ assms, concls }]);
    expectOk(result);
    expect(result.value).toHaveLength(1);
    expect(result.value[0].assms).toEqual([
      { tag: "Pred", ident: "Q", args: [] },
      { tag: "Pred", ident: "R", args: [] },
    ]);
    expect(result.value[0].concls).toEqual(concls);
  });
  test("AndR", () => {
    const assms: Formula[] = [
      { tag: "Pred", ident: "P", args: [] },
      { tag: "Pred", ident: "Q", args: [] },
    ];
    const concls: Formula[] = [
      {
        tag: "And",
        left: { tag: "Pred", ident: "P", args: [] },
        right: { tag: "Pred", ident: "Q", args: [] },
      },
    ];
    const result = judgeOne({ tag: "AndR" }, [{ assms, concls }]);
    expectOk(result);
    expect(result.value).toHaveLength(2);
    expect(result.value[0].assms).toEqual(assms);
    expect(result.value[0].concls).toEqual([
      { tag: "Pred", ident: "P", args: [] },
    ]);
    expect(result.value[1].assms).toEqual(assms);
    expect(result.value[1].concls).toEqual([
      { tag: "Pred", ident: "Q", args: [] },
    ]);
  });
  test("OrL", () => {
    const assms: Formula[] = [
      {
        tag: "Or",
        left: { tag: "Pred", ident: "P", args: [] },
        right: { tag: "Pred", ident: "Q", args: [] },
      },
    ];
    const concls: Formula[] = [
      { tag: "Pred", ident: "P", args: [] },
      { tag: "Pred", ident: "Q", args: [] },
    ];
    const result = judgeOne({ tag: "OrL" }, [{ assms, concls }]);
    expectOk(result);
    expect(result.value).toHaveLength(2);
    expect(result.value[0].assms).toEqual([
      { tag: "Pred", ident: "P", args: [] },
    ]);
    expect(result.value[0].concls).toEqual(concls);
    expect(result.value[1].assms).toEqual([
      { tag: "Pred", ident: "Q", args: [] },
    ]);
    expect(result.value[1].concls).toEqual(concls);
  });
  test("OrR1", () => {
    const assms: Formula[] = [{ tag: "Pred", ident: "P", args: [] }];
    const concls: Formula[] = [
      {
        tag: "Or",
        left: { tag: "Pred", ident: "P", args: [] },
        right: { tag: "Pred", ident: "Q", args: [] },
      },
    ];
    const result = judgeOne({ tag: "OrR1" }, [{ assms, concls }]);
    expectOk(result);
    expect(result.value).toHaveLength(1);
    expect(result.value[0].assms).toEqual(assms);
    expect(result.value[0].concls).toEqual([
      { tag: "Pred", ident: "P", args: [] },
    ]);
  });
  test("OrR2", () => {
    const assms: Formula[] = [{ tag: "Pred", ident: "P", args: [] }];
    const concls: Formula[] = [
      {
        tag: "Or",
        left: { tag: "Pred", ident: "P", args: [] },
        right: { tag: "Pred", ident: "Q", args: [] },
      },
    ];
    const result = judgeOne({ tag: "OrR2" }, [{ assms, concls }]);
    expectOk(result);
    expect(result.value).toHaveLength(1);
    expect(result.value[0].assms).toEqual(assms);
    expect(result.value[0].concls).toEqual([
      { tag: "Pred", ident: "Q", args: [] },
    ]);
  });
  test("ImpL", () => {
    const assms: Formula[] = [
      {
        tag: "Imply",
        left: { tag: "Pred", ident: "A", args: [] },
        right: { tag: "Pred", ident: "B", args: [] },
      },
      { tag: "Pred", ident: "P", args: [] },
    ];
    const concls: Formula[] = [{ tag: "Pred", ident: "Q", args: [] }];
    const result = judgeOne({ tag: "ImpL" }, [{ assms, concls }]);
    expectOk(result);
    expect(result.value).toHaveLength(2);
    expect(result.value[0].assms).toEqual([
      { tag: "Pred", ident: "P", args: [] },
    ]);
    expect(result.value[0].concls).toEqual([
      { tag: "Pred", ident: "A", args: [] },
      { tag: "Pred", ident: "Q", args: [] },
    ]);
    expect(result.value[1].assms).toEqual([
      { tag: "Pred", ident: "B", args: [] },
      { tag: "Pred", ident: "P", args: [] },
    ]);
    expect(result.value[1].concls).toEqual([
      { tag: "Pred", ident: "Q", args: [] },
    ]);
  });
  test("ImpR", () => {
    const assms: Formula[] = [{ tag: "Pred", ident: "P", args: [] }];
    const concls: Formula[] = [
      {
        tag: "Imply",
        left: { tag: "Pred", ident: "A", args: [] },
        right: { tag: "Pred", ident: "B", args: [] },
      },
      { tag: "Pred", ident: "Q", args: [] },
    ];
    const result = judgeOne({ tag: "ImpR" }, [{ assms, concls }]);
    expectOk(result);
    expect(result.value).toHaveLength(1);
    expect(result.value[0].assms).toEqual([
      { tag: "Pred", ident: "A", args: [] },
      { tag: "Pred", ident: "P", args: [] },
    ]);
    expect(result.value[0].concls).toEqual([
      { tag: "Pred", ident: "B", args: [] },
      { tag: "Pred", ident: "Q", args: [] },
    ]);
  });
  test("BottomL", () => {
    const assms: Formula[] = [
      { tag: "Bottom" },
      { tag: "Pred", ident: "P", args: [] },
    ];
    const concls: Formula[] = [{ tag: "Pred", ident: "Q", args: [] }];
    const result = judgeOne({ tag: "BottomL" }, [{ assms, concls }]);
    expectOk(result);
    expect(result.value).toHaveLength(0);
  });
  test("TopR", () => {
    const assms: Formula[] = [{ tag: "Pred", ident: "P", args: [] }];
    const concls: Formula[] = [
      { tag: "Top" },
      { tag: "Pred", ident: "Q", args: [] },
    ];
    const result = judgeOne({ tag: "TopR" }, [{ assms, concls }]);
    expectOk(result);
    expect(result.value).toHaveLength(0);
  });
  test("ForallL", () => {
    const assms: Formula[] = [
      {
        tag: "Forall",
        ident: "x",
        body: { tag: "Pred", ident: "P", args: [{ tag: "Var", ident: "x" }] },
      },
    ];
    const concls: Formula[] = [{ tag: "Pred", ident: "Q", args: [] }];
    const term: Term = {
      tag: "App",
      func: { tag: "Var", ident: "f" },
      args: [{ tag: "Var", ident: "y" }],
    };
    const result = judgeOne({ tag: "ForallL", term }, [{ assms, concls }]);
    expectOk(result);
    expect(result.value).toHaveLength(1);
    expect(result.value[0].assms).toEqual([
      { tag: "Pred", ident: "P", args: [term] },
    ]);
    expect(result.value[0].concls).toEqual(concls);
  });
  describe("ForallR", () => {
    test("ok with fresh variable", () => {
      const assms: Formula[] = [{ tag: "Pred", ident: "Q", args: [] }];
      const concls: Formula[] = [
        {
          tag: "Forall",
          ident: "x",
          body: {
            tag: "Pred",
            ident: "P",
            args: [
              {
                tag: "App",
                func: { tag: "Var", ident: "f" },
                args: [{ tag: "Var", ident: "x" }],
              },
            ],
          },
        },
      ];
      const result = judgeOne({ tag: "ForallR", ident: "y" }, [
        { assms, concls },
      ]);
      expectOk(result);
      expect(result.value).toHaveLength(1);
      expect(result.value[0].assms).toEqual(assms);
      expect(result.value[0].concls).toEqual([
        {
          tag: "Pred",
          ident: "P",
          args: [
            {
              tag: "App",
              func: { tag: "Var", ident: "f" },
              args: [{ tag: "Var", ident: "y" }],
            },
          ],
        },
      ]);
    });
    test("error with freely occuring variable", () => {
      const assms: Formula[] = [
        { tag: "Pred", ident: "P", args: [{ tag: "Var", ident: "z" }] },
      ];
      const concls: Formula[] = [
        {
          tag: "Forall",
          ident: "x",
          body: { tag: "Pred", ident: "Q", args: [{ tag: "Var", ident: "x" }] },
        },
      ];
      const result = judgeOne({ tag: "ForallR", ident: "z" }, [
        { assms, concls },
      ]);
      expectErr(result);
      expect(result.error).toEqual(
        "The variable must not appear free in the conclusion"
      );
    });
  });
  describe("ExistsL", () => {
    test("ok with fresh variable", () => {
      const assms: Formula[] = [
        {
          tag: "Exist",
          ident: "x",
          body: { tag: "Pred", ident: "P", args: [{ tag: "Var", ident: "x" }] },
        },
      ];
      const concls: Formula[] = [{ tag: "Pred", ident: "Q", args: [] }];
      const result = judgeOne({ tag: "ExistL", ident: "y" }, [
        { assms, concls },
      ]);
      expectOk(result);
      expect(result.value).toHaveLength(1);
      expect(result.value[0].assms).toEqual([
        { tag: "Pred", ident: "P", args: [{ tag: "Var", ident: "y" }] },
      ]);
      expect(result.value[0].concls).toEqual(concls);
    });
    test("error with freely occuring variable", () => {
      const assms: Formula[] = [
        {
          tag: "Exist",
          ident: "x",
          body: { tag: "Pred", ident: "P", args: [{ tag: "Var", ident: "x" }] },
        },
      ];
      const concls: Formula[] = [
        { tag: "Pred", ident: "Q", args: [{ tag: "Var", ident: "z" }] },
      ];
      const result = judgeOne({ tag: "ExistL", ident: "z" }, [
        { assms, concls },
      ]);
      expectErr(result);
      expect(result.error).toEqual(
        "The variable must not appear free in the conclusion"
      );
    });
  });
  test("ExistsR", () => {
    const assms: Formula[] = [
      { tag: "Pred", ident: "P", args: [{ tag: "Var", ident: "x" }] },
    ];
    const concls: Formula[] = [
      {
        tag: "Exist",
        ident: "x",
        body: { tag: "Pred", ident: "Q", args: [{ tag: "Var", ident: "x" }] },
      },
    ];
    const term: Term = { tag: "Var", ident: "y" };
    const result = judgeOne({ tag: "ExistR", term }, [{ assms, concls }]);
    expectOk(result);
    expect(result.value).toHaveLength(1);
    expect(result.value[0].assms).toEqual(assms);
    expect(result.value[0].concls).toEqual([
      { tag: "Pred", ident: "Q", args: [term] },
    ]);
  });
  test("WL", () => {
    const assms: Formula[] = [
      { tag: "Pred", ident: "P", args: [] },
      { tag: "Pred", ident: "Q", args: [] },
    ];
    const concls: Formula[] = [{ tag: "Pred", ident: "Q", args: [] }];
    const result = judgeOne({ tag: "WL" }, [{ assms, concls }]);
    expectOk(result);
    expect(result.value).toHaveLength(1);
    expect(result.value[0].assms).toEqual([
      { tag: "Pred", ident: "Q", args: [] },
    ]);
    expect(result.value[0].concls).toEqual(concls);
  });
  test("WR", () => {
    const assms: Formula[] = [{ tag: "Pred", ident: "Q", args: [] }];
    const concls: Formula[] = [
      { tag: "Pred", ident: "P", args: [] },
      { tag: "Pred", ident: "Q", args: [] },
    ];
    const result = judgeOne({ tag: "WR" }, [{ assms, concls }]);
    expectOk(result);
    expect(result.value).toHaveLength(1);
    expect(result.value[0].assms).toEqual(assms);
    expect(result.value[0].concls).toEqual([
      { tag: "Pred", ident: "Q", args: [] },
    ]);
  });
  test("CL", () => {
    const assms: Formula[] = [
      { tag: "Pred", ident: "P", args: [] },
      { tag: "Pred", ident: "Q", args: [] },
    ];
    const concls: Formula[] = [
      { tag: "Pred", ident: "P", args: [] },
      { tag: "Pred", ident: "Q", args: [] },
    ];
    const result = judgeOne({ tag: "CL" }, [{ assms, concls }]);
    expectOk(result);
    expect(result.value).toHaveLength(1);
    expect(result.value[0].assms).toEqual([
      { tag: "Pred", ident: "P", args: [] },
      { tag: "Pred", ident: "P", args: [] },
      { tag: "Pred", ident: "Q", args: [] },
    ]);
    expect(result.value[0].concls).toEqual(concls);
  });
  test("CR", () => {
    const assms: Formula[] = [
      { tag: "Pred", ident: "P", args: [] },
      { tag: "Pred", ident: "Q", args: [] },
    ];
    const concls: Formula[] = [
      { tag: "Pred", ident: "P", args: [] },
      { tag: "Pred", ident: "Q", args: [] },
    ];
    const result = judgeOne({ tag: "CR" }, [{ assms, concls }]);
    expectOk(result);
    expect(result.value).toHaveLength(1);
    expect(result.value[0].assms).toEqual(assms);
    expect(result.value[0].concls).toEqual([
      { tag: "Pred", ident: "P", args: [] },
      { tag: "Pred", ident: "P", args: [] },
      { tag: "Pred", ident: "Q", args: [] },
    ]);
  });
  test("PL", () => {
    const assms: Formula[] = [
      { tag: "Pred", ident: "P0", args: [] },
      { tag: "Pred", ident: "P1", args: [] },
      { tag: "Pred", ident: "P2", args: [] },
      { tag: "Pred", ident: "P3", args: [] },
    ];
    const concls: Formula[] = [{ tag: "Pred", ident: "P", args: [] }];
    const result = judgeOne({ tag: "PL", index: 2 }, [{ assms, concls }]);
    expectOk(result);
    expect(result.value).toHaveLength(1);
    expect(result.value[0].assms).toEqual([
      { tag: "Pred", ident: "P2", args: [] },
      { tag: "Pred", ident: "P0", args: [] },
      { tag: "Pred", ident: "P1", args: [] },
      { tag: "Pred", ident: "P3", args: [] },
    ]);
    expect(result.value[0].concls).toEqual(concls);
  });
  test("PR", () => {
    const assms: Formula[] = [{ tag: "Pred", ident: "P", args: [] }];
    const concls: Formula[] = [
      { tag: "Pred", ident: "P0", args: [] },
      { tag: "Pred", ident: "P1", args: [] },
      { tag: "Pred", ident: "P2", args: [] },
      { tag: "Pred", ident: "P3", args: [] },
    ];
    const result = judgeOne({ tag: "PR", index: 1 }, [{ assms, concls }]);
    expectOk(result);
    expect(result.value).toHaveLength(1);
    expect(result.value[0].assms).toEqual(assms);
    expect(result.value[0].concls).toEqual([
      { tag: "Pred", ident: "P1", args: [] },
      { tag: "Pred", ident: "P0", args: [] },
      { tag: "Pred", ident: "P2", args: [] },
      { tag: "Pred", ident: "P3", args: [] },
    ]);
  });

  test("proofLoop", () => {
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
    const cmds: ProofCmd[] = [
      { tag: "Apply", rule: { tag: "CR" } },
      { tag: "Apply", rule: { tag: "OrR2" } },
      { tag: "Apply", rule: { tag: "PR", index: 1 } },
      { tag: "Apply", rule: { tag: "OrR1" } },
      { tag: "Apply", rule: { tag: "ForallR", ident: "y" } },
      {
        tag: "Apply",
        rule: { tag: "ForallL", term: { tag: "Var", ident: "y" } },
      },
      { tag: "Apply", rule: { tag: "OrL" } },
      { tag: "Apply", rule: { tag: "PR", index: 1 } },
      { tag: "Apply", rule: { tag: "WR" } },
      { tag: "Apply", rule: { tag: "I" } },
      { tag: "Apply", rule: { tag: "WR" } },
      { tag: "Apply", rule: { tag: "I" } },
      { tag: "Qed" },
    ];
    const history = new ProofHistory([initialJudgement]);

    const loop = proofLoop(history);
    loop.next(); // 初回のnextは最初のyieldまで進めるため
    for (const cmd of cmds) {
      const res = loop.next(cmd);
      expectOk(res.value);
    }
  });

  test("Undo in proof mode", () => {
    // a ==> a
    const sampleFormula: Formula = {
      tag: "Imply",
      left: { tag: "Pred", ident: "a", args: [] },
      right: { tag: "Pred", ident: "a", args: [] },
    };
    const initialJudgement: Judgement = { assms: [], concls: [sampleFormula] };
    const history = new ProofHistory([initialJudgement]);
    const ploop = proofLoop(history);
    ploop.next(); // 初回のnextは最初のyieldまで進めるため
    ploop.next({ tag: "Apply", rule: { tag: "ImpR" } });
    ploop.next({ tag: "Undo" });
    expect(history.top()).toEqual([initialJudgement]);
  });

  test("topLoop", () => {
    // a ==> a
    const sampleFormula: Formula = {
      tag: "Imply",
      left: { tag: "Pred", ident: "a", args: [] },
      right: { tag: "Pred", ident: "a", args: [] },
    };
    const cmds: TopCmd[] = [
      { tag: "ThmD", name: "id", formula: sampleFormula },
      { tag: "Apply", rule: { tag: "ImpR" } },
      { tag: "Apply", rule: { tag: "I" } },
      { tag: "Qed" },
    ];

    const loop = topLoop(new TopHistory());
    loop.next(); // 初回のnextは最初のyieldまで進めるため
    for (const cmd of cmds) {
      const res = loop.next(cmd);
      expectOk(res.value);
    }
  });

  test("Sending ThmD returns Err when in proof mode", () => {
    // a ==> a
    const sampleFormula: Formula = {
      tag: "Imply",
      left: { tag: "Pred", ident: "a", args: [] },
      right: { tag: "Pred", ident: "a", args: [] },
    };

    const loop = topLoop(new TopHistory());
    loop.next(); // 初回のnextは最初のyieldまで進めるため
    loop.next({ tag: "ThmD", name: "id", formula: sampleFormula });
    loop.next({ tag: "Apply", rule: { tag: "ImpR" } });
    // proof mode中なので、ThmDを送ってもErrが返る
    const res = loop.next({ tag: "ThmD", name: "id", formula: sampleFormula });
    expectErr(res.value);
  });

  test("Sending Undo after Qed goes back to proof mode", () => {
    // a ==> a
    const sampleFormula: Formula = {
      tag: "Imply",
      left: { tag: "Pred", ident: "a", args: [] },
      right: { tag: "Pred", ident: "a", args: [] },
    };
    const loop = topLoop(new TopHistory());
    loop.next(); // 初回のnextは最初のyieldまで進めるため
    loop.next({ tag: "ThmD", name: "id", formula: sampleFormula });
    loop.next({ tag: "Apply", rule: { tag: "ImpR" } });
    loop.next({ tag: "Apply", rule: { tag: "I" } });
    loop.next({ tag: "Qed" });
    // Qed後にUndoを送ると、proof modeに戻る
    loop.next({ tag: "Undo" });
    // proof mode中なので、ThmDを送ってもErrが返る
    const res = loop.next({ tag: "ThmD", name: "id", formula: sampleFormula });
    expectErr(res.value);
  });

  test("Sending Undo right after ThmD goes back to top mode", () => {
    // a ==> a
    const sampleFormula: Formula = {
      tag: "Imply",
      left: { tag: "Pred", ident: "a", args: [] },
      right: { tag: "Pred", ident: "a", args: [] },
    };

    const loop = topLoop(new TopHistory());
    loop.next(); // 初回のnextは最初のyieldまで進めるため
    loop.next({ tag: "ThmD", name: "id", formula: sampleFormula });
    loop.next({ tag: "Undo" });
    // top mode中なので，Applyを送ってもErrが返る
    const res = loop.next({ tag: "Apply", rule: { tag: "ImpR" } });
    expectErr(res.value);
  });
});
