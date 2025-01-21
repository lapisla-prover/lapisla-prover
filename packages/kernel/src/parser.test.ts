import { test, describe, expect } from "vitest";
import { parseFormula, parseJudgement, parseTerm, tokenize } from "./parser.ts";
import { expectErr, expectOk } from "./test-util.ts";
import { formatJudgement } from "./ast.ts";

describe("tokenize", () => {
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
  test("all tokens can be tokenized", () => {
    const tokens = tokenize("∀∃λlam\\.,⊤⊥∧∨→⊢");
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
        tag: "Lambda",
        loc: { start: { line: 0, column: 3 }, end: { line: 0, column: 6 } },
      },
      {
        tag: "Lambda",
        loc: { start: { line: 0, column: 6 }, end: { line: 0, column: 7 } },
      },
      {
        tag: "Dot",
        loc: { start: { line: 0, column: 7 }, end: { line: 0, column: 8 } },
      },
      {
        tag: "Comma",
        loc: { start: { line: 0, column: 8 }, end: { line: 0, column: 9 } },
      },
      {
        tag: "Top",
        loc: { start: { line: 0, column: 9 }, end: { line: 0, column: 10 } },
      },
      {
        tag: "Bottom",
        loc: { start: { line: 0, column: 10 }, end: { line: 0, column: 11 } },
      },
      {
        tag: "And",
        loc: { start: { line: 0, column: 11 }, end: { line: 0, column: 12 } },
      },
      {
        tag: "Or",
        loc: { start: { line: 0, column: 12 }, end: { line: 0, column: 13 } },
      },
      {
        tag: "Imply",
        loc: { start: { line: 0, column: 13 }, end: { line: 0, column: 14 } },
      },
      {
        tag: "VDash",
        loc: { start: { line: 0, column: 14 }, end: { line: 0, column: 15 } },
      },
      {
        tag: "EOF",
        loc: { start: { line: 0, column: 15 }, end: { line: 0, column: 15 } },
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
      const str = "\\x, y, z. x(y, z)()";
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
      const str = "(lam x. x)(y)";
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
      const str = "lam x. f(x, g(y,))";
      const term = parseTerm(str);
      expectErr(term);
      expect(term.error).toEqual(
        "expected term but got unexpected token RParen at 0:16"
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
});
