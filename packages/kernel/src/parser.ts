import assert from "assert";
import {
  TopCmd,
  Formula,
  Ident,
  Judgement,
  Term,
  Rule,
  Predicate,
  Type,
} from "./ast";
import { Err, Ok, Result } from "./common";

export type Location = {
  line: number;
  column: number;
};

export function isBefore(loc1: Location, loc2: Location): boolean {
  return (
    loc1.line < loc2.line ||
    (loc1.line === loc2.line && loc1.column < loc2.column)
  );
}

export function isAfter(loc1: Location, loc2: Location): boolean {
  return (
    loc1.line > loc2.line ||
    (loc1.line === loc2.line && loc1.column >= loc2.column)
  );
}

export type Range = {
  start: Location;
  end: Location;
};

export type CmdWithLoc = {
  cmd: TopCmd;
  loc: Range;
};

export type ParseError = {
  message: string;
  loc: Range;
};

export type PartialProgram = {
  error: ParseError;
  cmds: CmdWithLoc[];
};

const keywords = [
  "Theorem",
  "apply",
  "use",
  "qed",
  "import",
  "axiom",
  "constant",
  "prop",
] as const;

type KeywordsUnion = (typeof keywords)[number];

export type Token =
  | { tag: "Ident"; ident: Ident; loc: Range }
  | { tag: "Int"; value: number; loc: Range }
  | { tag: "String"; value: string; loc: Range }
  | { tag: "Lambda"; loc: Range }
  | { tag: "Dot"; loc: Range }
  | { tag: "Comma"; loc: Range }
  | { tag: "LParen"; loc: Range }
  | { tag: "RParen"; loc: Range }
  | { tag: "LBrace"; loc: Range }
  | { tag: "RBrace"; loc: Range }
  | { tag: "Top"; loc: Range }
  | { tag: "Bottom"; loc: Range }
  | { tag: "And"; loc: Range }
  | { tag: "Or"; loc: Range }
  | { tag: "Imply"; loc: Range }
  | { tag: "Forall"; loc: Range }
  | { tag: "Exist"; loc: Range }
  | { tag: "VDash"; loc: Range }
  | { tag: "Mapsto"; loc: Range }
  | { tag: "Colon"; loc: Range }
  | { tag: "Semicolon"; loc: Range }
  | { tag: "Keyword"; name: KeywordsUnion; loc: Range }
  | { tag: "TVar"; ident: Ident; loc: Range }
  | { tag: "ERROR"; message: string; loc: Range }
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

  peek(): string {
    return this.#str[this.#pos];
  }

  eof(): boolean {
    return this.#pos >= this.#str.length;
  }

  tokenize(): Token[] {
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
        case "{": {
          tokens.push({
            tag: "LBrace",
            loc: { start, end: this.#loc },
          });
          break;
        }
        case "}": {
          tokens.push({
            tag: "RBrace",
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
        case "↦": {
          tokens.push({
            tag: "Mapsto",
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
        case "'": {
          this.skipSpaces();

          if (this.eof()) {
            tokens.push({
              tag: "ERROR",
              message: `expected type variable but reached EOF`,
              loc: { start, end: this.#loc },
            });
            return tokens;
          }

          const c = this.read();

          if (!/[a-zA-Z_]/.test(c)) {
            tokens.push({
              tag: "ERROR",
              message: `expected type variable but got unexpected character '${c}'`,
              loc: { start, end: this.#loc },
            });
            return tokens;
          }

          let ident = c;

          while (!this.eof() && /[a-zA-Z0-9_]/.test(this.#str[this.#pos])) {
            ident += this.read();
          }

          tokens.push({
            tag: "TVar",
            ident,
            loc: { start, end: this.#loc },
          });

          break;
        }
        case '"': {
          let value = "";

          while (!this.eof() && this.peek() !== '"') {
            value += this.read();
          }

          if (this.eof()) {
            tokens.push({
              tag: "ERROR",
              message: `expected closing quote but reached EOF`,
              loc: { start, end: this.#loc },
            });
            return tokens;
          }

          this.read();

          tokens.push({
            tag: "String",
            value,
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
            tokens.push({
              tag: "ERROR",
              message: `unexpected character '${c}'`,
              loc: { start, end: this.#loc },
            });
            return tokens;
          }
        }
      }

      this.skipSpaces();
    }

    tokens.push({ tag: "EOF", loc: { start: this.#loc, end: this.#loc } });

    return tokens;
  }
}

export function tokenize(str: string): Token[] {
  const tokenizer = new Tokenizer(str);
  return tokenizer.tokenize();
}

export class Parser {
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

  expectEOF(): Result<void, ParseError> {
    if (this.eof()) {
      return Ok(undefined);
    }
    return Err({
      message: `expected EOF but got unexpected token ${dumpToken(this.peek())}`,
      loc: this.peek().loc,
    });
  }

  expect(tag: string, target: string = ""): Result<Token, ParseError> {
    if (this.eof()) {
      return Err({
        message:
          `expected ${tag} but got EOF` +
          (target ? ` (while parsing ${target})` : ""),
        loc: this.peek().loc,
      });
    }
    const token = this.next();
    if (token.tag.toLowerCase() !== tag.toLowerCase()) {
      return Err({
        message:
          `expected ${tag} but got unexpected token ${dumpToken(token)}` +
          (target ? ` (while parsing ${target})` : ""),
        loc: token.loc,
      });
    }
    return Ok(token);
  }

  expectKeyword(name: KeywordsUnion): Result<Token, ParseError> {
    const token = this.expect("Keyword");
    if (token.tag === "Err") {
      return token;
    }
    assert(token.value.tag === "Keyword");

    if (token.value.name !== name) {
      return Err({
        message: `expected keyword ${name} but got keyword ${token.value.name}`,
        loc: token.value.loc,
      });
    }

    return Ok(token.value);
  }

  match(tag: string): boolean {
    if (this.eof()) {
      return false;
    }
    return this.peek().tag.toLowerCase() === tag.toLowerCase();
  }

  parseTerm(): Result<Term, ParseError> {
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
        return Err({
          message: `expected term but got unexpected token ${dumpToken(next)}`,
          loc: next.loc,
        });
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

  parseAFormula(): Result<Formula, ParseError> {
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
        return Err({
          message: `expected formula but got unexpected token ${dumpToken(next)}`,
          loc: next.loc,
        });
    }
  }

  parseAndFormula(): Result<Formula, ParseError> {
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

  parseOrFormula(): Result<Formula, ParseError> {
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

  parseImplyFormula(): Result<Formula, ParseError> {
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

  parseFormula(): Result<Formula, ParseError> {
    return this.parseImplyFormula();
  }

  parseJudgement(): Result<Judgement, ParseError> {
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

  parseRule(): Result<Rule, ParseError> {
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
        return Err({
          message: `unknown rule ${name.value.ident}`,
          loc: name.value.loc,
        });
      }
    }
  }

  parsePredicate(): Result<[Ident, Predicate], ParseError> {
    const name = this.expect("Ident");
    if (name.tag === "Err") {
      return name;
    }
    assert(name.value.tag === "Ident");

    const args: Ident[] = [];

    if (this.match("LParen")) {
      this.next();

      if (!this.match("RParen")) {
        const ident = this.expect("Ident");
        if (ident.tag === "Err") {
          return ident;
        }
        assert(ident.value.tag === "Ident");

        args.push(ident.value.ident);

        while (this.match("Comma")) {
          this.next();

          const ident = this.expect("Ident");
          if (ident.tag === "Err") {
            return ident;
          }
          assert(ident.value.tag === "Ident");

          args.push(ident.value.ident);
        }
      }

      const rparen = this.expect("RParen");
      if (rparen.tag === "Err") {
        return rparen;
      }
    }

    const mapsto = this.expect("Mapsto");
    if (mapsto.tag === "Err") {
      return mapsto;
    }

    const formula = this.parseFormula();
    if (formula.tag === "Err") {
      return formula;
    }

    const pred: Predicate = {
      args,
      body: formula.value,
    };
    return Ok([name.value.ident, pred]);
  }

  parsePredicates(): Result<[Ident, Predicate][], ParseError> {
    const pairs: [Ident, Predicate][] = [];

    const lbrace = this.expect("LBrace");
    if (lbrace.tag === "Err") {
      return lbrace;
    }

    if (this.match("RBrace")) {
      this.next();
      return Ok(pairs);
    }

    const pred = this.parsePredicate();
    if (pred.tag === "Err") {
      return pred;
    }
    pairs.push(pred.value);

    while (this.match("Comma")) {
      this.next();

      const pred = this.parsePredicate();
      if (pred.tag === "Err") {
        return pred;
      }
      pairs.push(pred.value);
    }

    const rbrace = this.expect("RBrace");
    if (rbrace.tag === "Err") {
      return rbrace;
    }

    return Ok(pairs);
  }

  parseAType(ctx: Map<Ident, Type>): Result<Type, ParseError> {
    const next = this.next();
    switch (next.tag) {
      case "Ident": {
        if (this.match("LParen")) {
          this.next();

          if (this.match("RParen")) {
            this.next();
            return Ok({ tag: "Con", ident: next.ident, args: [] });
          }

          const ty = this.parseType(ctx);
          if (ty.tag === "Err") {
            return ty;
          }
          const args = [ty.value];

          while (this.match("Comma")) {
            this.next();
            const ty = this.parseType(ctx);
            if (ty.tag === "Err") {
              return ty;
            }
            args.push(ty.value);
          }

          const rparen = this.expect("RParen", "type constructor");
          if (rparen.tag === "Err") {
            return rparen;
          }

          return Ok({ tag: "Con", ident: next.ident, args });
        } else {
          return Ok({ tag: "Con", ident: next.ident, args: [] });
        }
      }
      case "LParen": {
        const type = this.parseType(ctx);
        if (type.tag === "Err") {
          return type;
        }
        const rparen = this.expect("RParen");
        if (rparen.tag === "Err") {
          return rparen;
        }
        return type;
      }
      case "TVar": {
        if (!ctx.has(next.ident)) {
          ctx.set(next.ident, { tag: "Var", ident: next.ident });
        }

        return Ok(ctx.get(next.ident));
      }
      case "Keyword": {
        switch (next.name) {
          case "prop":
            return Ok({ tag: "Prop" });
          default:
            return Err({
              message: `expected type but got unexpected keyword ${next.name}`,
              loc: next.loc,
            });
        }
      }
      default: {
        return Err({
          message: `expected type but got unexpected token ${dumpToken(next)}`,
          loc: next.loc,
        });
      }
    }
  }

  parseType(ctx: Map<Ident, Type>): Result<Type, ParseError> {
    const ty = this.parseAType(ctx);
    if (ty.tag === "Err") {
      return ty;
    }

    if (this.match("Imply")) {
      this.next();

      const right = this.parseType(ctx);
      if (right.tag === "Err") {
        return right;
      }

      return Ok({ tag: "Arr", left: ty.value, right: right.value });
    }

    return Ok(ty.value);
  }

  parseCommand(): Result<CmdWithLoc, ParseError> {
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
          cmd: {
            tag: "Theorem",
            name: ident.value.ident,
            formula: formula.value,
          },
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

        let predicates: [Ident, Predicate][] = [];

        if (this.match("LBrace")) {
          const preds = this.parsePredicates();
          if (preds.tag === "Err") {
            return preds;
          }

          predicates = preds.value;
        }

        const end = this.peekPrev().loc.end;

        return Ok({
          cmd: { tag: "Use", thm: name.value.ident, pairs: predicates },
          loc: { start, end },
        });
      }
      case "qed": {
        const end = this.peekPrev().loc.end;

        return Ok({ cmd: { tag: "Qed" }, loc: { start, end } });
      }
      case "axiom": {
        const name = this.expect("Ident");
        if (name.tag === "Err") {
          return name;
        }
        assert(name.value.tag === "Ident");

        const colon = this.expect("Colon");
        if (colon.tag === "Err") {
          return colon;
        }

        const formula = this.parseFormula();
        if (formula.tag === "Err") {
          return formula;
        }

        const end = this.peekPrev().loc.end;

        return Ok({
          cmd: { tag: "Axiom", name: name.value.ident, formula: formula.value },
          loc: { start, end },
        });
      }
      case "constant": {
        const name = this.expect("Ident");
        if (name.tag === "Err") {
          return name;
        }
        assert(name.value.tag === "Ident");

        const colon = this.expect("Colon");
        if (colon.tag === "Err") {
          return colon;
        }

        const ty = this.parseType(new Map());
        if (ty.tag === "Err") {
          return ty;
        }

        const end = this.peekPrev().loc.end;

        return Ok({
          cmd: { tag: "Constant", name: name.value.ident, ty: ty.value },
          loc: { start, end },
        });
      }
      case "import": {
        const name = this.expect("String");
        if (name.tag === "Err") {
          return name;
        }
        assert(name.value.tag === "String");

        const end = this.peekPrev().loc.end;

        return Ok({
          cmd: { tag: "Import", name: name.value.value },
          loc: { start, end },
        });
      }
      default: {
        const end = this.peekPrev().loc.end;

        return Err({
          message: `unknown command ${name.value.name}`,
          loc: { start, end },
        });
      }
    }
  }

  parseProgram(): Result<CmdWithLoc[], PartialProgram> {
    const cmds: CmdWithLoc[] = [];
    while (!this.eof()) {
      const cmd = this.parseCommand();
      if (cmd.tag === "Err") {
        return Err({
          error: cmd.error,
          cmds,
        });
      }
      cmds.push(cmd.value);
    }
    return Ok(cmds);
  }
}

export function parseTerm(str: string): Result<Term, ParseError> {
  const tokens = tokenize(str);
  const parser = new Parser(tokens);
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

export function parseFormula(str: string): Result<Formula, ParseError> {
  const tokens = tokenize(str);
  const parser = new Parser(tokens);
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

export function parseType(str: string): Result<Type, ParseError> {
  const tokens = tokenize(str);
  const parser = new Parser(tokens);
  const ty = parser.parseType(new Map());
  if (ty.tag === "Err") {
    return ty;
  }
  const eof = parser.expectEOF();
  if (eof.tag === "Err") {
    return eof;
  }
  return ty;
}

export function parseJudgement(str: string): Result<Judgement, ParseError> {
  const tokens = tokenize(str);
  const parser = new Parser(tokens);
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

export function parseProgram(
  str: string
): Result<CmdWithLoc[], PartialProgram> {
  const tokens = tokenize(str);
  const parser = new Parser(tokens);
  return parser.parseProgram();
}
