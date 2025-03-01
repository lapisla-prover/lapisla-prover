import { test, describe, expect, assert } from "vitest";
import {
  CmdWithLoc,
  parseFormula,
  parseJudgement,
  parseProgram,
  Parser,
  parseTerm,
  parseType,
  tokenize,
} from "./parser";
import { expectErr, expectOk } from "./test-util";
import { formatJudgement } from "./ast";

describe("tokenize", () => {
  test("head spaces", () => {
    const tokens = tokenize("   a");
    expect(tokens).toEqual([
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
    expect(tokens).toEqual([
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
    expect(tokens).toEqual([
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
    const tokens = tokenize("∀∃λ.,⊤⊥∧∨→⊢:↦{}");
    expect(tokens).toEqual([
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
        tag: "Mapsto",
        loc: { start: { line: 0, column: 12 }, end: { line: 0, column: 13 } },
      },
      {
        tag: "LBrace",
        loc: { start: { line: 0, column: 13 }, end: { line: 0, column: 14 } },
      },
      {
        tag: "RBrace",
        loc: { start: { line: 0, column: 14 }, end: { line: 0, column: 15 } },
      },
      {
        tag: "EOF",
        loc: { start: { line: 0, column: 15 }, end: { line: 0, column: 15 } },
      },
    ]);
  });
  test("identifiers can be tokenized", () => {
    const tokens = tokenize("a20 b_2 lambda 'a '    tvar x'prop'use");
    expect(tokens).toEqual([
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
        tag: "TVar",
        ident: "a",
        loc: { start: { line: 0, column: 15 }, end: { line: 0, column: 17 } },
      },
      {
        tag: "TVar",
        ident: "tvar",
        loc: { start: { line: 0, column: 18 }, end: { line: 0, column: 27 } },
      },
      {
        tag: "Ident",
        ident: "x",
        loc: { start: { line: 0, column: 28 }, end: { line: 0, column: 29 } },
      },
      {
        tag: "TVar",
        ident: "prop",
        loc: { start: { line: 0, column: 29 }, end: { line: 0, column: 34 } },
      },
      {
        tag: "TVar",
        ident: "use",
        loc: { start: { line: 0, column: 34 }, end: { line: 0, column: 38 } },
      },
      {
        tag: "EOF",
        loc: { start: { line: 0, column: 38 }, end: { line: 0, column: 38 } },
      },
    ]);
  });

  test("string literal can be tokenized", () => {
    const tokens = tokenize('aa "abc def/ghi@49" bb');
    expect(tokens).toEqual([
      {
        tag: "Ident",
        ident: "aa",
        loc: { start: { line: 0, column: 0 }, end: { line: 0, column: 2 } },
      },
      {
        tag: "String",
        value: "abc def/ghi@49",
        loc: { start: { line: 0, column: 3 }, end: { line: 0, column: 19 } },
      },
      {
        tag: "Ident",
        ident: "bb",
        loc: { start: { line: 0, column: 20 }, end: { line: 0, column: 22 } },
      },
      {
        tag: "EOF",
        loc: { start: { line: 0, column: 22 }, end: { line: 0, column: 22 } },
      },
    ]);
  });

  test("keywords can be tokenized", () => {
    const tokens = tokenize("apply Theorem qed apply2 use");
    expect(tokens).toEqual([
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
    expect(tokens).toEqual([
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
    expect(tokens).toEqual([
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
  test("error token", () => {
    const tokens = tokenize("a b c % d");

    expect(tokens).toEqual([
      {
        tag: "Ident",
        ident: "a",
        loc: { start: { line: 0, column: 0 }, end: { line: 0, column: 1 } },
      },
      {
        tag: "Ident",
        ident: "b",
        loc: { start: { line: 0, column: 2 }, end: { line: 0, column: 3 } },
      },
      {
        tag: "Ident",
        ident: "c",
        loc: { start: { line: 0, column: 4 }, end: { line: 0, column: 5 } },
      },
      {
        tag: "ERROR",
        message: "unexpected character '%'",
        loc: { start: { line: 0, column: 6 }, end: { line: 0, column: 7 } },
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
      expect(term.error).toEqual({
        message:
          "expected RParen but got EOF (while parsing function application)",
        loc: { start: { line: 0, column: 3 }, end: { line: 0, column: 3 } },
      });
    });

    test("misplaced comma", () => {
      const str = "λ x. f(x, g(y,))";
      const term = parseTerm(str);
      expectErr(term);
      expect(term.error).toEqual({
        message: "expected term but got unexpected token RParen",
        loc: { start: { line: 0, column: 14 }, end: { line: 0, column: 15 } },
      });
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
            tag: "Theorem",
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
            tag: "Theorem",
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
            tag: "Theorem",
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
    test("insert comment", () => {
      const program = `
Theorem id P → P
  apply # aaa
    ImpR
  # bbb
  apply I # ccc
qed
`;
      const result = parseProgram(program);
      expectOk(result);
      expect(result.value).toEqual<CmdWithLoc[]>([
        {
          cmd: {
            tag: "Theorem",
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
          loc: { start: { line: 2, column: 2 }, end: { line: 3, column: 8 } },
        },
        {
          cmd: { tag: "Apply", rule: { tag: "I" } },
          loc: { start: { line: 5, column: 2 }, end: { line: 5, column: 9 } },
        },
        {
          cmd: { tag: "Qed" },
          loc: { start: { line: 6, column: 0 }, end: { line: 6, column: 3 } },
        },
      ]);
    });
  });
  test("predicate", () => {
    const str = "P(x, y) ↦ Q(f(x, g(y), x)) ∧ R";
    const tokens = tokenize(str);
    const pred = new Parser(tokens).parsePredicate();
    expectOk(pred);
    expect(pred.value[0]).toEqual("P");
    expect(pred.value[1]).toEqual({
      args: ["x", "y"],
      body: {
        tag: "And",
        left: {
          tag: "Pred",
          ident: "Q",
          args: [
            {
              tag: "App",
              func: { tag: "Var", ident: "f" },
              args: [
                { tag: "Var", ident: "x" },
                {
                  tag: "App",
                  func: { tag: "Var", ident: "g" },
                  args: [
                    {
                      tag: "Var",
                      ident: "y",
                    },
                  ],
                },
                { tag: "Var", ident: "x" },
              ],
            },
          ],
        },
        right: { tag: "Pred", ident: "R", args: [] },
      },
    });
  });
  test("predicates", () => {
    const str = "{ P(x, y) ↦ A → B, Q(x) ↦ R }";

    const tokens = tokenize(str);

    const preds = new Parser(tokens).parsePredicates();

    expectOk(preds);
    expect(preds.value).toHaveLength(2);

    const [pred1, pred2] = preds.value;

    expect(pred1[0]).toEqual("P");
    expect(pred2[0]).toEqual("Q");

    expect(pred1[1]).toEqual({
      args: ["x", "y"],
      body: {
        tag: "Imply",
        left: { tag: "Pred", ident: "A", args: [] },
        right: { tag: "Pred", ident: "B", args: [] },
      },
    });

    expect(pred2[1]).toEqual({
      args: ["x"],
      body: { tag: "Pred", ident: "R", args: [] },
    });
  });

  test("use command", () => {
    const program = `
Theorem id P → P
  apply ImpR
  apply I
qed

Theorem thm ∀x.P(x) → ∀x.P(x)
  use id { P ↦ ∀x. P(x) }
  apply I
qed
`;
    const result = parseProgram(program);
    expectOk(result);

    // 関数をequalにするために実際のpredを取り出す
    // ここではパースできることだけがテストできればよいので
    const usecmd = result.value[5].cmd;
    assert(usecmd.tag === "Use");
    const pred = usecmd.pairs[0][1];

    expect(result.value).toEqual<CmdWithLoc[]>([
      {
        cmd: {
          tag: "Theorem",
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
          tag: "Theorem",
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
              tag: "Forall",
              ident: "x",
              body: {
                tag: "Pred",
                ident: "P",
                args: [{ tag: "Var", ident: "x" }],
              },
            },
          },
        },
        loc: { start: { line: 6, column: 0 }, end: { line: 6, column: 29 } },
      },
      {
        cmd: {
          tag: "Use",
          thm: "id",
          pairs: [["P", pred]],
        },
        loc: { start: { line: 7, column: 2 }, end: { line: 7, column: 25 } },
      },
      {
        cmd: { tag: "Apply", rule: { tag: "I" } },
        loc: { start: { line: 8, column: 2 }, end: { line: 8, column: 9 } },
      },
      {
        cmd: { tag: "Qed" },
        loc: { start: { line: 9, column: 0 }, end: { line: 9, column: 3 } },
      },
    ]);
  });

  describe("parse error", () => {
    test("unknown rule", () => {
      const program = `
Theorem id P → P
  apply ImpR
  apply ImR
  apply I
qed
`;
      const result = parseProgram(program);

      expectErr(result);
      expect(result.error.cmds).toEqual<CmdWithLoc[]>([
        {
          cmd: {
            tag: "Theorem",
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
      ]);
      expect(result.error.error).toEqual({
        message: "unknown rule ImR",
        loc: { start: { line: 3, column: 8 }, end: { line: 3, column: 11 } },
      });
    });

    test("unfinished program", () => {
      const program = `
Theorem thm P
  use thm2 { P(x, y
`;
      const result = parseProgram(program);

      expectErr(result);
      expect(result.error.cmds).toEqual<CmdWithLoc[]>([
        {
          cmd: {
            tag: "Theorem",
            name: "thm",
            formula: { tag: "Pred", ident: "P", args: [] },
          },
          loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 13 } },
        },
      ]);
      expect(result.error.error).toEqual({
        message: "expected RParen but got EOF",
        loc: { start: { line: 3, column: 0 }, end: { line: 3, column: 0 } },
      });
    });

    test("broken formula", () => {
      const program = `
Theorem thm P
  use thm2 { P(x, y) ↦ Q ∀x. R(x, y) }
  apply I
qed
`;
      const result = parseProgram(program);

      expectErr(result);
      expect(result.error.cmds).toEqual<CmdWithLoc[]>([
        {
          cmd: {
            tag: "Theorem",
            name: "thm",
            formula: { tag: "Pred", ident: "P", args: [] },
          },
          loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 13 } },
        },
      ]);
      expect(result.error.error).toEqual({
        message: "expected RBrace but got unexpected token Forall",
        loc: { start: { line: 2, column: 25 }, end: { line: 2, column: 26 } },
      });
    });
  });

  describe("types", () => {
    test("parse ident as constructor", () => {
      const str = "nat";
      const result = parseType(str);

      expectOk(result);
      expect(result.value).toEqual({ tag: "Con", ident: "nat", args: [] });
    });

    test("parse type application", () => {
      const str = "result(nat, 'a)";
      const result = parseType(str);

      expectOk(result);
      expect(result.value).toEqual({
        tag: "Con",
        ident: "result",
        args: [
          { tag: "Con", ident: "nat", args: [] },
          { tag: "Var", ident: "a" },
        ],
      });
    });

    test("parse function type", () => {
      const str = "('a → 'b → 'a) → 'a → list('b) → 'a";
      const result = parseType(str);

      expectOk(result);
      expect(result.value).toEqual({
        tag: "Arr",
        left: {
          tag: "Arr",
          left: { tag: "Var", ident: "a" },
          right: {
            tag: "Arr",
            left: { tag: "Var", ident: "b" },
            right: { tag: "Var", ident: "a" },
          },
        },
        right: {
          tag: "Arr",
          left: { tag: "Var", ident: "a" },
          right: {
            tag: "Arr",
            left: {
              tag: "Con",
              ident: "list",
              args: [{ tag: "Var", ident: "b" }],
            },
            right: { tag: "Var", ident: "a" },
          },
        },
      });
    });

    test("type variables with same name should be same object", () => {
      const str = "'a → 'a";
      const result = parseType(str);

      expectOk(result);
      assert(result.value.tag === "Arr");

      expect(result.value).toEqual({
        tag: "Arr",
        left: { tag: "Var", ident: "a" },
        right: { tag: "Var", ident: "a" },
      });

      // equal as object
      expect(result.value.left).toBe(result.value.right);
    });
  });

  test("import", () => {
    const program = `
import "zer0-star/fermat-last-theorem@2"
import "zer0-star/riemann-hypothesis@999"

Theorem thm P
qed
`;
    const result = parseProgram(program);

    expectOk(result);
    expect(result.value).toEqual<CmdWithLoc[]>([
      {
        cmd: {
          tag: "Import",
          name: "zer0-star/fermat-last-theorem@2",
        },
        loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 40 } },
      },
      {
        cmd: {
          tag: "Import",
          name: "zer0-star/riemann-hypothesis@999",
        },
        loc: { start: { line: 2, column: 0 }, end: { line: 2, column: 41 } },
      },
      {
        cmd: {
          tag: "Theorem",
          name: "thm",
          formula: { tag: "Pred", ident: "P", args: [] },
        },
        loc: { start: { line: 4, column: 0 }, end: { line: 4, column: 13 } },
      },
      {
        cmd: { tag: "Qed" },
        loc: { start: { line: 5, column: 0 }, end: { line: 5, column: 3 } },
      },
    ]);
  });

  test("constant", () => {
    const program = `
constant zero : nat
constant succ : nat → nat
constant iszero : nat → prop
constant fixed_point : (nat → nat) → nat
`;
    const result = parseProgram(program);

    expectOk(result);
    expect(result.value).toEqual<CmdWithLoc[]>([
      {
        cmd: {
          tag: "Constant",
          name: "zero",
          ty: { tag: "Con", ident: "nat", args: [] },
        },
        loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 19 } },
      },
      {
        cmd: {
          tag: "Constant",
          name: "succ",
          ty: {
            tag: "Arr",
            left: { tag: "Con", ident: "nat", args: [] },
            right: { tag: "Con", ident: "nat", args: [] },
          },
        },
        loc: { start: { line: 2, column: 0 }, end: { line: 2, column: 25 } },
      },
      {
        cmd: {
          tag: "Constant",
          name: "iszero",
          ty: {
            tag: "Arr",
            left: { tag: "Con", ident: "nat", args: [] },
            right: { tag: "Prop" },
          },
        },
        loc: { start: { line: 3, column: 0 }, end: { line: 3, column: 28 } },
      },
      {
        cmd: {
          tag: "Constant",
          name: "fixed_point",
          ty: {
            tag: "Arr",
            left: {
              tag: "Arr",
              left: { tag: "Con", ident: "nat", args: [] },
              right: { tag: "Con", ident: "nat", args: [] },
            },
            right: { tag: "Con", ident: "nat", args: [] },
          },
        },
        loc: { start: { line: 4, column: 0 }, end: { line: 4, column: 40 } },
      },
    ]);
  });

  test("axiom", () => {
    const program = `
constant eq : 'a → 'a → prop

constant zero : nat
constant succ : nat → nat
axiom nat_ind : P(zero) → ∀n. (P(n) → P(succ(n))) → ∀n. P(n)

constant fixed_point : (nat → nat) → nat
axiom fixed_point_def : ∀f. eq(fixed_point(f), f(fixed_point(f)))
`;
    const result = parseProgram(program);

    expectOk(result);
    expect(result.value).toEqual<CmdWithLoc[]>([
      {
        cmd: {
          tag: "Constant",
          name: "eq",
          ty: {
            tag: "Arr",
            left: { tag: "Var", ident: "a" },
            right: {
              tag: "Arr",
              left: { tag: "Var", ident: "a" },
              right: { tag: "Prop" },
            },
          },
        },
        loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 28 } },
      },
      {
        cmd: {
          tag: "Constant",
          name: "zero",
          ty: { tag: "Con", ident: "nat", args: [] },
        },
        loc: { start: { line: 3, column: 0 }, end: { line: 3, column: 19 } },
      },
      {
        cmd: {
          tag: "Constant",
          name: "succ",
          ty: {
            tag: "Arr",
            left: { tag: "Con", ident: "nat", args: [] },
            right: { tag: "Con", ident: "nat", args: [] },
          },
        },
        loc: { start: { line: 4, column: 0 }, end: { line: 4, column: 25 } },
      },
      {
        cmd: {
          tag: "Axiom",
          name: "nat_ind",
          formula: {
            tag: "Imply",
            left: {
              tag: "Pred",
              ident: "P",
              args: [{ tag: "Var", ident: "zero" }],
            },
            right: {
              tag: "Imply",
              left: {
                tag: "Forall",
                ident: "n",
                body: {
                  tag: "Imply",
                  left: {
                    tag: "Pred",
                    ident: "P",
                    args: [{ tag: "Var", ident: "n" }],
                  },
                  right: {
                    tag: "Pred",
                    ident: "P",
                    args: [
                      {
                        tag: "App",
                        func: { tag: "Var", ident: "succ" },
                        args: [{ tag: "Var", ident: "n" }],
                      },
                    ],
                  },
                },
              },
              right: {
                tag: "Forall",
                ident: "n",
                body: {
                  tag: "Pred",
                  ident: "P",
                  args: [{ tag: "Var", ident: "n" }],
                },
              },
            },
          },
        },
        loc: { start: { line: 5, column: 0 }, end: { line: 5, column: 60 } },
      },
      {
        cmd: {
          tag: "Constant",
          name: "fixed_point",
          ty: {
            tag: "Arr",
            left: {
              tag: "Arr",
              left: { tag: "Con", ident: "nat", args: [] },
              right: { tag: "Con", ident: "nat", args: [] },
            },
            right: { tag: "Con", ident: "nat", args: [] },
          },
        },
        loc: { start: { line: 7, column: 0 }, end: { line: 7, column: 40 } },
      },
      {
        cmd: {
          tag: "Axiom",
          name: "fixed_point_def",
          formula: {
            tag: "Forall",
            ident: "f",
            body: {
              tag: "Pred",
              ident: "eq",
              args: [
                {
                  tag: "App",
                  func: { tag: "Var", ident: "fixed_point" },
                  args: [{ tag: "Var", ident: "f" }],
                },
                {
                  tag: "App",
                  func: { tag: "Var", ident: "f" },
                  args: [
                    {
                      tag: "App",
                      func: { tag: "Var", ident: "fixed_point" },
                      args: [{ tag: "Var", ident: "f" }],
                    },
                  ],
                },
              ],
            },
          },
        },
        loc: { start: { line: 8, column: 0 }, end: { line: 8, column: 65 } },
      },
    ]);
  });
});
