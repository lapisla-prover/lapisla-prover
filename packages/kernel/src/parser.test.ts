import { test, describe, expect } from "vitest";
import {
  CmdWithLoc,
  parseFormula,
  parseJudgement,
  parseProgram,
  parseTerm,
  tokenize,
} from "./parser.ts";
import { expectErr, expectOk } from "./test-util.ts";
import { formatJudgement, TopCmd } from "./ast.ts";

describe("tokenize", () => {
  test("head spaces", () => {
    const tokens = tokenize("   a");
    expectOk(tokens);
    expect(tokens.value).toEqual([
      {
        tag: "Ident",
        ident: "a",
        loc: { start: { line: 0, column: 3 }, end: { line: 0, column: 4 } },
      },
      {
        tag: "EOF",
        loc: { start: { line: 0, column: 4 }, end: { line: 0, column: 4 } },
      },
    ]);
  });

  test("skip comment", () => {
    const tokens = tokenize("a # comment\nb");
    expectOk(tokens);
    expect(tokens.value).toEqual([
      {
        tag: "Ident",
        ident: "a",
        loc: { start: { line: 0, column: 0 }, end: { line: 0, column: 1 } },
      },
      {
        tag: "Ident",
        ident: "b",
        loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 1 } },
      },
      {
        tag: "EOF",
        loc: { start: { line: 1, column: 1 }, end: { line: 1, column: 1 } },
      },
    ]);
  });

  test("∀x.((P(x) ∨ Q())) can be tokenized", () => {
    const tokens = tokenize("∀x.((P(x) ∨ Q()))");
    expectOk(tokens);
    expect(tokens.value).toEqual([
      {
        tag: "Forall",
        loc: { start: { line: 0, column: 0 }, end: { line: 0, column: 1 } },
      },
      {
        tag: "Ident",
        ident: "x",
        loc: { start: { line: 0, column: 1 }, end: { line: 0, column: 2 } },
      },
      {
        tag: "Dot",
        loc: { start: { line: 0, column: 2 }, end: { line: 0, column: 3 } },
      },
      {
        tag: "LParen",
        loc: { start: { line: 0, column: 3 }, end: { line: 0, column: 4 } },
      },
      {
        tag: "LParen",
        loc: { start: { line: 0, column: 4 }, end: { line: 0, column: 5 } },
      },
      {
        tag: "Ident",
        ident: "P",
        loc: { start: { line: 0, column: 5 }, end: { line: 0, column: 6 } },
      },
      {
        tag: "LParen",
        loc: { start: { line: 0, column: 6 }, end: { line: 0, column: 7 } },
      },
      {
        tag: "Ident",
        ident: "x",
        loc: { start: { line: 0, column: 7 }, end: { line: 0, column: 8 } },
      },
      {
        tag: "RParen",
        loc: { start: { line: 0, column: 8 }, end: { line: 0, column: 9 } },
      },
      {
        tag: "Or",
        loc: { start: { line: 0, column: 10 }, end: { line: 0, column: 11 } },
      },
      {
        tag: "Ident",
        ident: "Q",
        loc: { start: { line: 0, column: 12 }, end: { line: 0, column: 13 } },
      },
      {
        tag: "LParen",
        loc: { start: { line: 0, column: 13 }, end: { line: 0, column: 14 } },
      },
      {
        tag: "RParen",
        loc: { start: { line: 0, column: 14 }, end: { line: 0, column: 15 } },
      },
      {
        tag: "RParen",
        loc: { start: { line: 0, column: 15 }, end: { line: 0, column: 16 } },
      },
      {
        tag: "RParen",
        loc: { start: { line: 0, column: 16 }, end: { line: 0, column: 17 } },
      },
      {
        tag: "EOF",
        loc: { start: { line: 0, column: 17 }, end: { line: 0, column: 17 } },
      },
    ]);
  });
  test("all symbols can be tokenized", () => {
    const tokens = tokenize("∀∃λ.,⊤⊥∧∨→⊢:");
    expectOk(tokens);
    expect(tokens.value).toEqual([
      {
        tag: "Forall",
        loc: { start: { line: 0, column: 0 }, end: { line: 0, column: 1 } },
      },
      {
        tag: "Exist",
        loc: { start: { line: 0, column: 1 }, end: { line: 0, column: 2 } },
      },
      {
        tag: "Lambda",
        loc: { start: { line: 0, column: 2 }, end: { line: 0, column: 3 } },
      },
      {
        tag: "Dot",
        loc: { start: { line: 0, column: 3 }, end: { line: 0, column: 4 } },
      },
      {
        tag: "Comma",
        loc: { start: { line: 0, column: 4 }, end: { line: 0, column: 5 } },
      },
      {
        tag: "Top",
        loc: { start: { line: 0, column: 5 }, end: { line: 0, column: 6 } },
      },
      {
        tag: "Bottom",
        loc: { start: { line: 0, column: 6 }, end: { line: 0, column: 7 } },
      },
      {
        tag: "And",
        loc: { start: { line: 0, column: 7 }, end: { line: 0, column: 8 } },
      },
      {
        tag: "Or",
        loc: { start: { line: 0, column: 8 }, end: { line: 0, column: 9 } },
      },
      {
        tag: "Imply",
        loc: { start: { line: 0, column: 9 }, end: { line: 0, column: 10 } },
      },
      {
        tag: "VDash",
        loc: { start: { line: 0, column: 10 }, end: { line: 0, column: 11 } },
      },
      {
        tag: "Colon",
        loc: { start: { line: 0, column: 11 }, end: { line: 0, column: 12 } },
      },
      {
        tag: "EOF",
        loc: { start: { line: 0, column: 12 }, end: { line: 0, column: 12 } },
      },
    ]);
  });
  test("identifiers can be tokenized", () => {
    const tokens = tokenize("a20 b_2 lambda");
    expectOk(tokens);
    expect(tokens.value).toEqual([
      {
        tag: "Ident",
        ident: "a20",
        loc: { start: { line: 0, column: 0 }, end: { line: 0, column: 3 } },
      },
      {
        tag: "Ident",
        ident: "b_2",
        loc: { start: { line: 0, column: 4 }, end: { line: 0, column: 7 } },
      },
      {
        tag: "Ident",
        ident: "lambda",
        loc: { start: { line: 0, column: 8 }, end: { line: 0, column: 14 } },
      },
      {
        tag: "EOF",
        loc: { start: { line: 0, column: 14 }, end: { line: 0, column: 14 } },
      },
    ]);
  });

  test("keywords can be tokenized", () => {
    const tokens = tokenize("apply Theorem qed apply2 use");
    expectOk(tokens);
    expect(tokens.value).toEqual([
      {
        tag: "Keyword",
        name: "apply",
        loc: { start: { line: 0, column: 0 }, end: { line: 0, column: 5 } },
      },
      {
        tag: "Keyword",
        name: "Theorem",
        loc: { start: { line: 0, column: 6 }, end: { line: 0, column: 13 } },
      },
      {
        tag: "Keyword",
        name: "qed",
        loc: { start: { line: 0, column: 14 }, end: { line: 0, column: 17 } },
      },
      {
        tag: "Ident",
        ident: "apply2",
        loc: { start: { line: 0, column: 18 }, end: { line: 0, column: 24 } },
      },
      {
        tag: "Keyword",
        name: "use",
        loc: { start: { line: 0, column: 25 }, end: { line: 0, column: 28 } },
      },
      {
        tag: "EOF",
        loc: { start: { line: 0, column: 28 }, end: { line: 0, column: 28 } },
      },
    ]);
  });

  test("integers can be tokenized", () => {
    const tokens = tokenize("123abc123");
    expectOk(tokens);
    expect(tokens.value).toEqual([
      {
        tag: "Int",
        value: 123,
        loc: { start: { line: 0, column: 0 }, end: { line: 0, column: 3 } },
      },
      {
        tag: "Ident",
        ident: "abc123",
        loc: { start: { line: 0, column: 3 }, end: { line: 0, column: 9 } },
      },
      {
        tag: "EOF",
        loc: { start: { line: 0, column: 9 }, end: { line: 0, column: 9 } },
      },
    ]);
  });

  test("correct location", () => {
    const tokens = tokenize("aaa\n\n   bbb ccc\nppp");
    expectOk(tokens);
    expect(tokens.value).toEqual([
      {
        tag: "Ident",
        ident: "aaa",
        loc: { start: { line: 0, column: 0 }, end: { line: 0, column: 3 } },
      },
      {
        tag: "Ident",
        ident: "bbb",
        loc: { start: { line: 2, column: 3 }, end: { line: 2, column: 6 } },
      },
      {
        tag: "Ident",
        ident: "ccc",
        loc: { start: { line: 2, column: 7 }, end: { line: 2, column: 10 } },
      },
      {
        tag: "Ident",
        ident: "ppp",
        loc: { start: { line: 3, column: 0 }, end: { line: 3, column: 3 } },
      },
      {
        tag: "EOF",
        loc: { start: { line: 3, column: 3 }, end: { line: 3, column: 3 } },
      },
    ]);
  });
});

describe("parser", () => {
  describe("term", () => {
    test("application", () => {
      const str = "f(x, g(y))((h(z)))";
      const term = parseTerm(str);
      expectOk(term);
      expect(term.value).toEqual({
        tag: "App",
        func: {
          tag: "App",
          func: { tag: "Var", ident: "f" },
          args: [
            { tag: "Var", ident: "x" },
            {
              tag: "App",
              func: { tag: "Var", ident: "g" },
              args: [{ tag: "Var", ident: "y" }],
            },
          ],
        },
        args: [
          {
            tag: "App",
            func: { tag: "Var", ident: "h" },
            args: [{ tag: "Var", ident: "z" }],
          },
        ],
      });
    });

    test("lambda abstraction", () => {
      const str = "λx, y, z. x(y, z)()";
      const term = parseTerm(str);
      expectOk(term);
      expect(term.value).toEqual({
        tag: "Abs",
        idents: ["x", "y", "z"],
        body: {
          tag: "App",
          func: {
            tag: "App",
            func: { tag: "Var", ident: "x" },
            args: [
              { tag: "Var", ident: "y" },
              { tag: "Var", ident: "z" },
            ],
          },
          args: [],
        },
      });
    });

    test("lambda abstraction with application", () => {
      const str = "(λx. x)(y)";
      const term = parseTerm(str);
      expectOk(term);
      expect(term.value).toEqual({
        tag: "App",
        func: {
          tag: "Abs",
          idents: ["x"],
          body: { tag: "Var", ident: "x" },
        },
        args: [{ tag: "Var", ident: "y" }],
      });
    });

    test("unclosed paren", () => {
      const str = "f(x";
      const term = parseTerm(str);
      expectErr(term);
      expect(term.error).toEqual(
        "expected RParen but got EOF (while parsing function application)"
      );
    });

    test("misplaced comma", () => {
      const str = "λ x. f(x, g(y,))";
      const term = parseTerm(str);
      expectErr(term);
      expect(term.error).toEqual(
        "expected term but got unexpected token RParen at 0:14"
      );
    });
  });

  describe("formula", () => {
    test("∀x.(P(x) ∨ Q)", () => {
      const str = "∀x.(P(x) ∨ Q)";
      const formula = parseFormula(str);
      expectOk(formula);
      expect(formula.value).toEqual({
        tag: "Forall",
        ident: "x",
        body: {
          tag: "Or",
          left: {
            tag: "Pred",
            ident: "P",
            args: [{ tag: "Var", ident: "x" }],
          },
          right: { tag: "Pred", ident: "Q", args: [] },
        },
      });
    });

    test("∀x.P(x) ∨ Q", () => {
      const str = "∀x.P(x) ∨ Q";
      const formula = parseFormula(str);
      expectOk(formula);
      expect(formula.value).toEqual({
        tag: "Or",
        left: {
          tag: "Forall",
          ident: "x",
          body: {
            tag: "Pred",
            ident: "P",
            args: [{ tag: "Var", ident: "x" }],
          },
        },
        right: { tag: "Pred", ident: "Q", args: [] },
      });
    });

    test("precedence", () => {
      const str = "P ∨ Q ∧ R ∨ X → S ∨ T ∧ (U ∨ V)";
      const formula = parseFormula(str);
      expectOk(formula);
      expect(formula.value).toEqual({
        tag: "Imply",
        left: {
          tag: "Or",
          left: {
            tag: "Or",
            left: { tag: "Pred", ident: "P", args: [] },
            right: {
              tag: "And",
              left: { tag: "Pred", ident: "Q", args: [] },
              right: { tag: "Pred", ident: "R", args: [] },
            },
          },
          right: { tag: "Pred", ident: "X", args: [] },
        },
        right: {
          tag: "Or",
          left: { tag: "Pred", ident: "S", args: [] },
          right: {
            tag: "And",
            left: { tag: "Pred", ident: "T", args: [] },
            right: {
              tag: "Or",
              left: { tag: "Pred", ident: "U", args: [] },
              right: { tag: "Pred", ident: "V", args: [] },
            },
          },
        },
      });
    });
  });

  describe("judgement", () => {
    test("∀x.(P(x) ∨ Q) ⊢ ∀x. P(x) ∨ Q", () => {
      const str = "∀x.(P(x) ∨ Q) ⊢ ∀x. P(x) ∨ Q";
      const judgement = parseJudgement(str);
      expectOk(judgement);
      expect(judgement.value).toEqual({
        assms: [
          {
            tag: "Forall",
            ident: "x",
            body: {
              tag: "Or",
              left: {
                tag: "Pred",
                ident: "P",
                args: [{ tag: "Var", ident: "x" }],
              },
              right: { tag: "Pred", ident: "Q", args: [] },
            },
          },
        ],
        concls: [
          {
            tag: "Or",
            left: {
              tag: "Forall",
              ident: "x",
              body: {
                tag: "Pred",
                ident: "P",
                args: [{ tag: "Var", ident: "x" }],
              },
            },
            right: { tag: "Pred", ident: "Q", args: [] },
          },
        ],
      });
    });
  });

  test("format and parse", () => {
    const str = "∀x.(P(x) → Q), P(f(x)) ∧ P(u)  ⊢ Q";
    const judgement = parseJudgement(str);
    expectOk(judgement);
    expect(judgement.value).toEqual({
      assms: [
        {
          tag: "Forall",
          ident: "x",
          body: {
            tag: "Imply",
            left: {
              tag: "Pred",
              ident: "P",
              args: [{ tag: "Var", ident: "x" }],
            },
            right: { tag: "Pred", ident: "Q", args: [] },
          },
        },
        {
          tag: "And",
          left: {
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
          right: {
            tag: "Pred",
            ident: "P",
            args: [{ tag: "Var", ident: "u" }],
          },
        },
      ],
      concls: [{ tag: "Pred", ident: "Q", args: [] }],
    });

    const judgement2 = parseJudgement(formatJudgement(judgement.value));
    expectOk(judgement2);
    expect(judgement2.value).toEqual(judgement.value);
  });

  describe("top-level program", () => {
    test("theorem definition", () => {
      const program = `
Theorem id P → P
  apply ImpR
  apply I
qed

Theorem thm ∀x. P(x) → P(f(y))
  apply ImpR
  apply
    ForallL f(y)
  apply I
qed

Theorem thm1 ∀x. (P(x) ∨ Q) → ∀x. P(x) ∨ Q
  apply ImpR
  apply CR
  apply OrR2
  apply PR 1
  # 長いので省略
  # apply OrR1
  # apply ForallR y
  # apply ForallL y
  # apply OrL
  # apply PR 1
  # apply WR
  # apply I
  # apply WR
  # apply I
# qed
`;
      const result = parseProgram(program);
      expectOk(result);
      expect(result.value).toEqual<CmdWithLoc[]>([
        {
          cmd: {
            tag: "ThmD",
            name: "id",
            formula: {
              tag: "Imply",
              left: { tag: "Pred", ident: "P", args: [] },
              right: { tag: "Pred", ident: "P", args: [] },
            },
          },
          loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 16 } },
        },
        {
          cmd: { tag: "Apply", rule: { tag: "ImpR" } },
          loc: { start: { line: 2, column: 2 }, end: { line: 2, column: 12 } },
        },
        {
          cmd: { tag: "Apply", rule: { tag: "I" } },
          loc: { start: { line: 3, column: 2 }, end: { line: 3, column: 9 } },
        },
        {
          cmd: { tag: "Qed" },
          loc: { start: { line: 4, column: 0 }, end: { line: 4, column: 3 } },
        },
        {
          cmd: {
            tag: "ThmD",
            name: "thm",
            formula: {
              tag: "Imply",
              left: {
                tag: "Forall",
                ident: "x",
                body: {
                  tag: "Pred",
                  ident: "P",
                  args: [{ tag: "Var", ident: "x" }],
                },
              },
              right: {
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
            },
          },
          loc: { start: { line: 6, column: 0 }, end: { line: 6, column: 30 } },
        },
        {
          cmd: { tag: "Apply", rule: { tag: "ImpR" } },
          loc: { start: { line: 7, column: 2 }, end: { line: 7, column: 12 } },
        },
        {
          cmd: {
            tag: "Apply",
            rule: {
              tag: "ForallL",
              term: {
                tag: "App",
                func: { tag: "Var", ident: "f" },
                args: [{ tag: "Var", ident: "y" }],
              },
            },
          },
          loc: { start: { line: 8, column: 2 }, end: { line: 9, column: 16 } },
        },
        {
          cmd: { tag: "Apply", rule: { tag: "I" } },
          loc: { start: { line: 10, column: 2 }, end: { line: 10, column: 9 } },
        },
        {
          cmd: { tag: "Qed" },
          loc: { start: { line: 11, column: 0 }, end: { line: 11, column: 3 } },
        },
        {
          cmd: {
            tag: "ThmD",
            name: "thm1",
            formula: {
              tag: "Imply",
              left: {
                tag: "Forall",
                ident: "x",
                body: {
                  tag: "Or",
                  left: {
                    tag: "Pred",
                    ident: "P",
                    args: [{ tag: "Var", ident: "x" }],
                  },
                  right: { tag: "Pred", ident: "Q", args: [] },
                },
              },
              right: {
                tag: "Or",
                left: {
                  tag: "Forall",
                  ident: "x",
                  body: {
                    tag: "Pred",
                    ident: "P",
                    args: [{ tag: "Var", ident: "x" }],
                  },
                },
                right: { tag: "Pred", ident: "Q", args: [] },
              },
            },
          },
          loc: {
            start: { line: 13, column: 0 },
            end: { line: 13, column: 42 },
          },
        },
        {
          cmd: { tag: "Apply", rule: { tag: "ImpR" } },
          loc: {
            start: { line: 14, column: 2 },
            end: { line: 14, column: 12 },
          },
        },
        {
          cmd: { tag: "Apply", rule: { tag: "CR" } },
          loc: {
            start: { line: 15, column: 2 },
            end: { line: 15, column: 10 },
          },
        },
        {
          cmd: { tag: "Apply", rule: { tag: "OrR2" } },
          loc: {
            start: { line: 16, column: 2 },
            end: { line: 16, column: 12 },
          },
        },
        {
          cmd: { tag: "Apply", rule: { tag: "PR", index: 1 } },
          loc: {
            start: { line: 17, column: 2 },
            end: { line: 17, column: 12 },
          },
        },
      ]);
    });
  });
});
