import assert from "assert";
import { Formula, Ident, Judgement, Rule, Term, TopCmd } from "./ast.ts";
import { Err, Ok, Result } from "./common.ts";

export type Location = {
  line: number;
  column: number;
};

export function isBefore(loc1: Location, loc2: Location): boolean {
  return loc1.line < loc2.line || (loc1.line === loc2.line && loc1.column < loc2.column);
}

export function isAfter(loc1: Location, loc2: Location): boolean {
  return loc1.line > loc2.line || (loc1.line === loc2.line && loc1.column > loc2.column);
}


export type Range = {
  start: Location;
  end: Location;
};

export type CmdWithLoc = {
  cmd: TopCmd;
  loc: Range;
};

const keywords = ["Theorem", "apply", "use", "qed"] as const;

type KeywordsUnion = (typeof keywords)[number];

export type Token =
  | { tag: "Ident"; ident: Ident; loc: Range }
  | { tag: "Int"; value: number; loc: Range }
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
  | { tag: "Colon"; loc: Range }
  | { tag: "Semicolon"; loc: Range }
  | { tag: "Keyword"; name: KeywordsUnion; loc: Range }
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

export function isKeyword(ident: string): ident is KeywordsUnion {
  return (keywords as readonly string[]).includes(ident);
}

class Tokenizer {
  #pos = 0;
  #str: string;
  #loc: Location = { line: 0, column: 0 };

  constructor(str: string) {
    this.#str = str;
  }

  advance() {
    if (this.#pos >= this.#str.length) {
      return;
    }

    if (this.#str[this.#pos] === "\n") {
      this.#loc = nextLine(this.#loc);
    } else {
      this.#loc = nextColumn(this.#loc);
    }

    this.#pos++;
  }

  skipSpaces() {
    while (this.#pos < this.#str.length) {
      if (/\s/.test(this.#str[this.#pos])) {
        this.advance();
      } else if (this.#str[this.#pos] === "#") {
        while (this.#pos < this.#str.length && this.#str[this.#pos] !== "\n") {
          this.advance();
        }
      } else {
        break;
      }
    }
  }

  read(): string {
    const c = this.#str[this.#pos];
    this.advance();
    return c;
  }

  tokenize(): Result<Token[], string> {
    const tokens: Token[] = [];

    this.skipSpaces();

    while (this.#pos < this.#str.length) {
      const start = this.#loc;
      const c = this.read();
      switch (c) {
        case "λ": {
          tokens.push({
            tag: "Lambda",
            loc: { start, end: this.#loc },
          });
          break;
        }
        case ".": {
          tokens.push({
            tag: "Dot",
            loc: { start, end: this.#loc },
          });
          break;
        }
        case ",": {
          tokens.push({
            tag: "Comma",
            loc: { start, end: this.#loc },
          });
          break;
        }
        case "(": {
          tokens.push({
            tag: "LParen",
            loc: { start, end: this.#loc },
          });
          break;
        }
        case ")": {
          tokens.push({
            tag: "RParen",
            loc: { start, end: this.#loc },
          });
          break;
        }
        case "⊤": {
          tokens.push({
            tag: "Top",
            loc: { start, end: this.#loc },
          });
          break;
        }
        case "⊥": {
          tokens.push({
            tag: "Bottom",
            loc: { start, end: this.#loc },
          });
          break;
        }
        case "∧": {
          tokens.push({
            tag: "And",
            loc: { start, end: this.#loc },
          });
          break;
        }
        case "∨": {
          tokens.push({
            tag: "Or",
            loc: { start, end: this.#loc },
          });
          break;
        }
        case "→": {
          tokens.push({
            tag: "Imply",
            loc: { start, end: this.#loc },
          });
          break;
        }
        case "∀": {
          tokens.push({
            tag: "Forall",
            loc: { start, end: this.#loc },
          });
          break;
        }
        case "∃": {
          tokens.push({
            tag: "Exist",
            loc: { start, end: this.#loc },
          });
          break;
        }
        case "⊢": {
          tokens.push({
            tag: "VDash",
            loc: { start, end: this.#loc },
          });
          break;
        }
        case ":": {
          tokens.push({
            tag: "Colon",
            loc: { start, end: this.#loc },
          });
          break;
        }
        case ";": {
          tokens.push({
            tag: "Semicolon",
            loc: { start, end: this.#loc },
          });
          break;
        }
        default: {
          if (/[a-zA-Z_]/.test(c)) {
            let ident = c;
            while (
              this.#pos < this.#str.length &&
              /[a-zA-Z0-9_]/.test(this.#str[this.#pos])
            ) {
              ident += this.read();
            }
            if (isKeyword(ident)) {
              tokens.push({
                tag: "Keyword",
                name: ident,
                loc: { start, end: this.#loc },
              });
            } else {
              tokens.push({
                tag: "Ident",
                ident,
                loc: { start, end: this.#loc },
              });
            }
          } else if (/[0-9]/.test(c)) {
            let num = c;
            while (
              this.#pos < this.#str.length &&
              /[0-9]/.test(this.#str[this.#pos])
            ) {
              num += this.read();
            }
            tokens.push({
              tag: "Int",
              loc: { start, end: this.#loc },
              value: parseInt(num),
            });
          } else {
            return Err(`unexpected character ${c} at ${formatLocation(start)}`);
          }
        }
      }

      this.skipSpaces();
    }

    tokens.push({ tag: "EOF", loc: { start: this.#loc, end: this.#loc } });

    return Ok(tokens);
  }
}

export function tokenize(str: string): Result<Token[], string> {
  const tokenizer = new Tokenizer(str);
  return tokenizer.tokenize();
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

  peekPrev(): Token {
    return this.#tokens[this.#pos - 1];
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

  parseRule(): Result<Rule, string> {
    const name = this.expect("Ident");
    if (name.tag === "Err") {
      return name;
    }
    assert(name.value.tag === "Ident");

    switch (name.value.ident) {
      case "Cut": {
        const formula = this.parseFormula();
        if (formula.tag === "Err") {
          return formula;
        }
        return Ok({ tag: "Cut", formula: formula.value });
      }
      case "PL": {
        const index = this.expect("Int", "rule PL");
        if (index.tag === "Err") {
          return index;
        }
        assert(index.value.tag === "Int");
        return Ok({ tag: "PL", index: index.value.value });
      }
      case "PR": {
        const index = this.expect("Int", "rule PR");
        if (index.tag === "Err") {
          return index;
        }
        assert(index.value.tag === "Int");
        return Ok({ tag: "PR", index: index.value.value });
      }
      case "ForallL": {
        const term = this.parseTerm();
        if (term.tag === "Err") {
          return term;
        }
        return Ok({ tag: "ForallL", term: term.value });
      }
      case "ForallR": {
        const ident = this.expect("Ident", "rule ForallR");
        if (ident.tag === "Err") {
          return ident;
        }
        assert(ident.value.tag === "Ident");
        return Ok({ tag: "ForallR", ident: ident.value.ident });
      }
      case "ExistL": {
        const ident = this.expect("Ident", "rule ExistL");
        if (ident.tag === "Err") {
          return ident;
        }
        assert(ident.value.tag === "Ident");
        return Ok({ tag: "ExistL", ident: ident.value.ident });
      }
      case "ExistR": {
        const term = this.parseTerm();
        if (term.tag === "Err") {
          return term;
        }
        return Ok({ tag: "ExistR", term: term.value });
      }
      case "I":
      case "AndL1":
      case "AndL2":
      case "AndR":
      case "OrL":
      case "OrR1":
      case "OrR2":
      case "ImpL":
      case "ImpR":
      case "BottomL":
      case "TopR":
      case "WL":
      case "WR":
      case "CL":
      case "CR": {
        return Ok({ tag: name.value.ident });
      }
      default: {
        return Err(`unknown rule name ${name.value.ident}`);
      }
    }
  }

  parseCommand(): Result<CmdWithLoc, string> {
    const name = this.expect("Keyword");
    if (name.tag === "Err") {
      return name;
    }
    assert(name.value.tag === "Keyword");

    const start = name.value.loc.start;

    switch (name.value.name) {
      case "Theorem": {
        const ident = this.expect("Ident");
        if (ident.tag === "Err") {
          return ident;
        }
        assert(ident.value.tag === "Ident");

        const formula = this.parseFormula();
        if (formula.tag === "Err") {
          return formula;
        }

        const end = this.peekPrev().loc.end;

        return Ok({
          cmd: { tag: "Theorem", name: ident.value.ident, formula: formula.value },
          loc: { start, end },
        });
      }
      case "apply": {
        const rule = this.parseRule();
        if (rule.tag === "Err") {
          return rule;
        }

        const end = this.peekPrev().loc.end;

        return Ok({
          cmd: { tag: "Apply", rule: rule.value },
          loc: { start, end },
        });
      }
      case "use": {
        const name = this.expect("Ident");
        if (name.tag === "Err") {
          return name;
        }
        assert(name.value.tag === "Ident");

        const end = this.peekPrev().loc.end;

        return Ok({
          cmd: { tag: "Use", thm: name.value.ident },
          loc: { start, end },
        });
      }
      case "qed": {
        const end = this.peekPrev().loc.end;

        return Ok({ cmd: { tag: "Qed" }, loc: { start, end } });
      }
      default: {
        name.value.name satisfies never;
        throw new Error("unreachable");
      }
    }
  }

  parseProgram(): Result<CmdWithLoc[], string> {
    const cmds: CmdWithLoc[] = [];
    while (!this.eof()) {
      const cmd = this.parseCommand();
      if (cmd.tag === "Err") {
        return cmd;
      }
      cmds.push(cmd.value);
    }
    return Ok(cmds);
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

export function parseProgram(str: string): Result<CmdWithLoc[], string> {
  const tokens = tokenize(str);
  if (tokens.tag === "Err") {
    return tokens;
  }
  const parser = new Parser(tokens.value);
  return parser.parseProgram();
}
