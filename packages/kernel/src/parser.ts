import assert from "assert/strict";
import { Formula, Ident, Judgement, Term } from "./ast.ts";
import { Err, Ok, Result } from "./common.ts";

export type Location = {
  line: number;
  column: number;
};

export type Range = {
  start: Location;
  end: Location;
};

export type Token =
  | { tag: "Ident"; ident: Ident; loc: Range }
  | { tag: "Lambda"; loc: Range }
  | { tag: "Dot"; loc: Range }
  | { tag: "Comma"; loc: Range }
  | { tag: "LParen"; loc: Range }
  | { tag: "RParen"; loc: Range }
  | { tag: "Top"; loc: Range }
  | { tag: "Bottom"; loc: Range }
  | { tag: "And"; loc: Range }
  | { tag: "Or"; loc: Range }
  | { tag: "Imply"; loc: Range }
  | { tag: "Forall"; loc: Range }
  | { tag: "Exist"; loc: Range }
  | { tag: "VDash"; loc: Range }
  | { tag: "EOF"; loc: Range };

export function dumpToken(token: Token): string {
  switch (token.tag) {
    case "Ident":
      return `Ident(${token.ident})`;
    default:
      return token.tag;
  }
}

function nextColumn(loc: Location): Location {
  return { line: loc.line, column: loc.column + 1 };
}
function nextLine(loc: Location): Location {
  return { line: loc.line + 1, column: 0 };
}

export function formatLocation(loc: Location): string {
  return `${loc.line}:${loc.column}`;
}

export function tokenize(str: string): Result<Token[], string> {
  const tokens: Token[] = [];
  let pos = 0;
  let loc: Location = { line: 0, column: 0 };

  while (pos < str.length && /\s/.test(str[pos])) {
    if (str[pos] === "\n") {
      loc = nextLine(loc);
    } else {
      loc = nextColumn(loc);
    }
    pos++;
  }

  while (pos < str.length) {
    const c = str[pos];
    switch (c) {
      case "\\":
      case "λ": {
        tokens.push({
          tag: "Lambda",
          loc: { start: loc, end: nextColumn(loc) },
        });
        pos++;
        loc = nextColumn(loc);
        break;
      }
      case ".": {
        tokens.push({ tag: "Dot", loc: { start: loc, end: nextColumn(loc) } });
        pos++;
        loc = nextColumn(loc);
        break;
      }
      case ",": {
        tokens.push({
          tag: "Comma",
          loc: { start: loc, end: nextColumn(loc) },
        });
        pos++;
        loc = nextColumn(loc);
        break;
      }
      case "(": {
        tokens.push({
          tag: "LParen",
          loc: { start: loc, end: nextColumn(loc) },
        });
        pos++;
        loc = nextColumn(loc);
        break;
      }
      case ")": {
        tokens.push({
          tag: "RParen",
          loc: { start: loc, end: nextColumn(loc) },
        });
        pos++;
        loc = nextColumn(loc);
        break;
      }
      case "⊤": {
        tokens.push({ tag: "Top", loc: { start: loc, end: nextColumn(loc) } });
        pos++;
        loc = nextColumn(loc);
        break;
      }
      case "⊥": {
        tokens.push({
          tag: "Bottom",
          loc: { start: loc, end: nextColumn(loc) },
        });
        pos++;
        loc = nextColumn(loc);
        break;
      }
      case "∧": {
        tokens.push({ tag: "And", loc: { start: loc, end: nextColumn(loc) } });
        pos++;
        loc = nextColumn(loc);
        break;
      }
      case "∨": {
        tokens.push({ tag: "Or", loc: { start: loc, end: nextColumn(loc) } });
        pos++;
        loc = nextColumn(loc);
        break;
      }
      case "→": {
        tokens.push({
          tag: "Imply",
          loc: { start: loc, end: nextColumn(loc) },
        });
        pos++;
        loc = nextColumn(loc);
        break;
      }
      case "∀": {
        tokens.push({
          tag: "Forall",
          loc: { start: loc, end: nextColumn(loc) },
        });
        pos++;
        loc = nextColumn(loc);
        break;
      }
      case "∃": {
        tokens.push({
          tag: "Exist",
          loc: { start: loc, end: nextColumn(loc) },
        });
        pos++;
        loc = nextColumn(loc);
        break;
      }
      case "⊢": {
        tokens.push({
          tag: "VDash",
          loc: { start: loc, end: nextColumn(loc) },
        });
        pos++;
        loc = nextColumn(loc);
        break;
      }
      default: {
        const start = loc;
        if (/[a-zA-Z_]/.test(c)) {
          let ident = c;
          pos++;
          loc = nextColumn(loc);
          while (pos < str.length && /[a-zA-Z0-9_]/.test(str[pos])) {
            ident += str[pos];
            pos++;
            loc = nextColumn(loc);
          }
          if (ident === "lam") {
            tokens.push({ tag: "Lambda", loc: { start, end: loc } });
          } else {
            tokens.push({ tag: "Ident", loc: { start, end: loc }, ident });
          }
        } else {
          return Err(`unexpected character ${c} at ${pos}`);
        }
      }
    }

    while (pos < str.length && /\s/.test(str[pos])) {
      if (str[pos] === "\n") {
        loc = nextLine(loc);
      } else {
        loc = nextColumn(loc);
      }
      pos++;
    }
  }

  tokens.push({ tag: "EOF", loc: { start: loc, end: loc } });

  return Ok(tokens);
}

class Parser {
  #pos = 0;
  #tokens: Token[];

  constructor(tokens: Token[]) {
    this.#tokens = tokens;
  }

  eof(): boolean {
    return this.#tokens[this.#pos].tag === "EOF";
  }

  peek(): Token {
    return this.#tokens[this.#pos];
  }

  next(): Token {
    const token = this.#tokens[this.#pos];
    if (token.tag !== "EOF") {
      this.#pos++;
    }
    return token;
  }

  expectEOF(): Result<void, string> {
    if (this.eof()) {
      return Ok(undefined);
    }
    return Err(
      `expected EOF but got unexpected token ${dumpToken(this.peek())} at ${formatLocation(this.peek().loc.start)}`
    );
  }

  expect(tag: string, target: string = ""): Result<Token, string> {
    if (this.eof()) {
      return Err(
        `expected ${tag} but got EOF` +
          (target ? ` (while parsing ${target})` : "")
      );
    }
    const token = this.next();
    if (token.tag.toLowerCase() !== tag.toLowerCase()) {
      return Err(
        `expected ${tag} but got unexpected token ${dumpToken(token)} at ${formatLocation(token.loc.start)}` +
          (target ? ` (while parsing ${target})` : "")
      );
    }
    return Ok(token);
  }

  match(tag: string): boolean {
    if (this.eof()) {
      return false;
    }
    return this.peek().tag.toLowerCase() === tag.toLowerCase();
  }

  parseTerm(): Result<Term, string> {
    const next = this.next();
    let result: Term;
    switch (next.tag) {
      case "Ident": {
        result = { tag: "Var", ident: next.ident };
        break;
      }
      case "LParen": {
        const term = this.parseTerm();
        if (term.tag === "Err") {
          return term;
        }
        const rparen = this.expect("RParen");
        if (rparen.tag === "Err") {
          return rparen;
        }
        result = term.value;
        break;
      }
      case "Lambda": {
        const ident = this.expect("Ident");
        if (ident.tag === "Err") {
          return ident;
        }
        assert(ident.value.tag === "Ident");
        const idents = [ident.value.ident];

        while (this.match("Comma")) {
          this.next();
          const ident = this.expect("Ident");
          if (ident.tag === "Err") {
            return ident;
          }
          assert(ident.value.tag === "Ident");
          idents.push(ident.value.ident);
        }

        const dot = this.expect("Dot");
        if (dot.tag === "Err") {
          return dot;
        }

        const body = this.parseTerm();
        if (body.tag === "Err") {
          return body;
        }

        result = { tag: "Abs", idents, body: body.value };
        break;
      }
      default: {
        return Err(
          `expected term but got unexpected token ${dumpToken(next)} at ${formatLocation(next.loc.start)}`
        );
      }
    }

    while (this.match("LParen")) {
      this.next();

      if (this.match("RParen")) {
        this.next();
        result = { tag: "App", func: result, args: [] };
        continue;
      }

      const term = this.parseTerm();
      if (term.tag === "Err") {
        return term;
      }
      const args = [term.value];

      while (this.match("Comma")) {
        this.next();
        const term = this.parseTerm();
        if (term.tag === "Err") {
          return term;
        }
        args.push(term.value);
      }

      const rparen = this.expect("RParen", "function application");

      if (rparen.tag === "Err") {
        return rparen;
      }

      result = { tag: "App", func: result, args };
    }

    return Ok(result);
  }

  parseAFormula(): Result<Formula, string> {
    const next = this.next();
    switch (next.tag) {
      case "Ident": {
        if (this.match("LParen")) {
          this.next();

          if (this.match("RParen")) {
            this.next();
            return Ok({ tag: "Pred", ident: next.ident, args: [] });
          }

          const term = this.parseTerm();
          if (term.tag === "Err") {
            return term;
          }
          const args = [term.value];

          while (this.match("Comma")) {
            this.next();
            const term = this.parseTerm();
            if (term.tag === "Err") {
              return term;
            }
            args.push(term.value);
          }

          const rparen = this.expect("RParen", "predicate application");
          if (rparen.tag === "Err") {
            return rparen;
          }

          return Ok({ tag: "Pred", ident: next.ident, args });
        } else {
          return Ok({ tag: "Pred", ident: next.ident, args: [] });
        }
      }
      case "LParen": {
        const formula = this.parseFormula();
        if (formula.tag === "Err") {
          return formula;
        }

        const rparen = this.expect("RParen");
        if (rparen.tag === "Err") {
          return rparen;
        }

        return formula;
      }
      case "Top":
        return Ok({ tag: "Top" });
      case "Bottom":
        return Ok({ tag: "Bottom" });
      case "Forall": {
        const ident = this.expect("Ident");
        if (ident.tag === "Err") {
          return ident;
        }
        assert(ident.value.tag === "Ident");

        const dot = this.expect("Dot");
        if (dot.tag === "Err") {
          return dot;
        }
        const body = this.parseAFormula();
        if (body.tag === "Err") {
          return body;
        }

        return Ok({
          tag: "Forall",
          ident: ident.value.ident,
          body: body.value,
        });
      }
      case "Exist": {
        const ident = this.expect("Ident");
        if (ident.tag === "Err") {
          return ident;
        }
        assert(ident.value.tag === "Ident");

        const dot = this.expect("Dot");
        if (dot.tag === "Err") {
          return dot;
        }

        const body = this.parseAFormula();
        if (body.tag === "Err") {
          return body;
        }

        return Ok({ tag: "Exist", ident: ident.value.ident, body: body.value });
      }
      default:
        return Err(
          `expected formula but got unexpected token ${dumpToken(next)} at ${formatLocation(next.loc.start)}`
        );
    }
  }

  parseAndFormula(): Result<Formula, string> {
    const formula = this.parseAFormula();
    if (formula.tag === "Err") {
      return formula;
    }

    let result = formula.value;

    while (this.match("And")) {
      this.next();

      const right = this.parseAFormula();
      if (right.tag === "Err") {
        return right;
      }

      result = { tag: "And", left: result, right: right.value };
    }

    return Ok(result);
  }

  parseOrFormula(): Result<Formula, string> {
    const formula = this.parseAndFormula();
    if (formula.tag === "Err") {
      return formula;
    }

    let result = formula.value;

    while (this.match("Or")) {
      this.next();

      const right = this.parseAndFormula();
      if (right.tag === "Err") {
        return right;
      }

      result = { tag: "Or", left: result, right: right.value };
    }

    return Ok(result);
  }

  parseImplyFormula(): Result<Formula, string> {
    const formula = this.parseOrFormula();
    if (formula.tag === "Err") {
      return formula;
    }

    if (this.match("Imply")) {
      this.next();

      const right = this.parseImplyFormula();
      if (right.tag === "Err") {
        return right;
      }

      return Ok({ tag: "Imply", left: formula.value, right: right.value });
    }

    return formula;
  }

  parseFormula(): Result<Formula, string> {
    return this.parseImplyFormula();
  }

  parseJudgement(): Result<Judgement, string> {
    const assms: Formula[] = [];
    const concls: Formula[] = [];

    if (!this.match("VDash")) {
      const formula = this.parseFormula();
      if (formula.tag === "Err") {
        return formula;
      }

      assms.push(formula.value);

      while (this.match("Comma")) {
        this.next();

        const formula = this.parseFormula();
        if (formula.tag === "Err") {
          return formula;
        }

        assms.push(formula.value);
      }
    }

    const vdash = this.expect("VDash");
    if (vdash.tag === "Err") {
      return vdash;
    }

    if (!this.eof()) {
      const formula = this.parseFormula();
      if (formula.tag === "Err") {
        return formula;
      }

      concls.push(formula.value);

      while (this.match("Comma")) {
        this.next();

        const formula = this.parseFormula();
        if (formula.tag === "Err") {
          return formula;
        }

        concls.push(formula.value);
      }
    }

    return Ok({ assms, concls });
  }
}

export function parseTerm(str: string): Result<Term, string> {
  const tokens = tokenize(str);
  if (tokens.tag === "Err") {
    return tokens;
  }
  const parser = new Parser(tokens.value);
  const term = parser.parseTerm();
  if (term.tag === "Err") {
    return term;
  }
  const eof = parser.expectEOF();
  if (eof.tag === "Err") {
    return eof;
  }
  return term;
}

export function parseFormula(str: string): Result<Formula, string> {
  const tokens = tokenize(str);
  if (tokens.tag === "Err") {
    return tokens;
  }
  const parser = new Parser(tokens.value);
  const formula = parser.parseFormula();
  if (formula.tag === "Err") {
    return formula;
  }
  const eof = parser.expectEOF();
  if (eof.tag === "Err") {
    return eof;
  }
  return formula;
}

export function parseJudgement(str: string): Result<Judgement, string> {
  const tokens = tokenize(str);
  if (tokens.tag === "Err") {
    return tokens;
  }
  const parser = new Parser(tokens.value);
  const judgement = parser.parseJudgement();
  if (judgement.tag === "Err") {
    return judgement;
  }
  const eof = parser.expectEOF();
  if (eof.tag === "Err") {
    return eof;
  }
  return judgement;
}
